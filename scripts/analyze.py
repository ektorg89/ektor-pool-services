#!/usr/bin/env python3
import json
import os
import sys
from datetime import date, datetime, timedelta
from pathlib import Path

import pymysql
import pymysql.cursors


def get_connection() -> pymysql.Connection:
    return pymysql.connect(
        host=os.getenv("DB_HOST", "127.0.0.1"),
        port=int(os.getenv("DB_PORT", 3306)),
        user=os.getenv("DB_USER"),
        password=os.getenv("DB_PASSWORD"),
        database=os.getenv("DB_NAME"),
        cursorclass=pymysql.cursors.DictCursor,
    )


def run_analysis() -> dict:
    today = date.today()
    month_start = today.replace(day=1)
    thirty_days_ago = today - timedelta(days=30)

    report = {
        "generated_at": datetime.utcnow().isoformat() + "Z",
        "period": str(today),
        "critical_alerts": [],
        "warnings": [],
        "metrics": {},
    }

    conn = get_connection()
    try:
        with conn.cursor() as cur:
            cur.execute(
                """
                SELECT COALESCE(SUM(total), 0) AS revenue, COUNT(*) AS count
                FROM invoices
                WHERE status = 'paid' AND issued_date >= %s
                """,
                (month_start,),
            )
            row = cur.fetchone()
            report["metrics"]["month_revenue"] = float(row["revenue"])
            report["metrics"]["paid_invoices_month"] = row["count"]

            # status='sent' + due_date < today = overdue
            cur.execute(
                """
                SELECT COUNT(*) AS count, COALESCE(SUM(total), 0) AS amount
                FROM invoices
                WHERE status = 'sent' AND due_date < %s
                """,
                (today,),
            )
            row = cur.fetchone()
            overdue_count = row["count"]
            overdue_amount = float(row["amount"])
            report["metrics"]["overdue_count"] = overdue_count
            report["metrics"]["overdue_amount"] = overdue_amount

            if overdue_count >= 5:
                report["critical_alerts"].append(
                    f"CRITICAL: {overdue_count} overdue invoices totaling ${overdue_amount:,.2f}"
                )
            elif overdue_count >= 3:
                report["warnings"].append(
                    f"WARNING: {overdue_count} overdue invoices totaling ${overdue_amount:,.2f}"
                )

            cur.execute("SELECT COUNT(*) AS count FROM invoices WHERE status = 'draft'")
            row = cur.fetchone()
            draft_count = row["count"]
            report["metrics"]["draft_invoices"] = draft_count

            if draft_count >= 10:
                report["warnings"].append(
                    f"WARNING: {draft_count} draft invoices have not been sent to clients"
                )

            # clients with no invoice in the last 30 days
            cur.execute(
                """
                SELECT COUNT(DISTINCT c.customer_id) AS count
                FROM customers c
                LEFT JOIN invoices i
                    ON c.customer_id = i.customer_id AND i.issued_date >= %s
                WHERE i.invoice_id IS NULL
                """,
                (thirty_days_ago,),
            )
            row = cur.fetchone()
            inactive_count = row["count"]
            report["metrics"]["inactive_clients_30d"] = inactive_count

            if inactive_count >= 5:
                report["warnings"].append(
                    f"WARNING: {inactive_count} clients with no activity in the last 30 days"
                )

            # 2+ overdue invoices flags a client as at-risk
            cur.execute(
                """
                SELECT c.customer_id,
                       CONCAT(c.first_name, ' ', c.last_name) AS name,
                       COUNT(i.invoice_id) AS overdue_count,
                       SUM(i.total) AS overdue_total
                FROM invoices i
                JOIN customers c ON i.customer_id = c.customer_id
                WHERE i.status = 'sent' AND i.due_date < %s
                GROUP BY c.customer_id
                HAVING COUNT(i.invoice_id) >= 2
                ORDER BY overdue_count DESC
                """,
                (today,),
            )
            at_risk = cur.fetchall()
            report["metrics"]["at_risk_clients"] = [
                {
                    "name": r["name"],
                    "overdue_count": r["overdue_count"],
                    "overdue_total": float(r["overdue_total"]),
                }
                for r in at_risk
            ]

            if at_risk:
                names = ", ".join(r["name"] for r in at_risk)
                report["critical_alerts"].append(
                    f"CRITICAL: Clients with 2+ overdue invoices: {names}"
                )

            cur.execute("SELECT COUNT(*) AS count FROM customers")
            row = cur.fetchone()
            report["metrics"]["total_clients"] = row["count"]

    finally:
        conn.close()

    return report


def generate_markdown(report: dict) -> str:
    m = report["metrics"]
    at_risk = m.get("at_risk_clients", [])

    lines = [
        "# Business Analysis Report — Ektor Pool Services",
        "",
        f"**Generated:** {report['generated_at']}  ",
        f"**Period:** {report['period']}",
        "",
        "## Summary Metrics",
        "",
        "| Metric | Value |",
        "|--------|-------|",
        f"| Monthly Revenue | ${m.get('month_revenue', 0):,.2f} |",
        f"| Paid Invoices (month) | {m.get('paid_invoices_month', 0)} |",
        f"| Overdue Invoices | {m.get('overdue_count', 0)} |",
        f"| Overdue Amount | ${m.get('overdue_amount', 0):,.2f} |",
        f"| Draft Invoices | {m.get('draft_invoices', 0)} |",
        f"| Inactive Clients (30d) | {m.get('inactive_clients_30d', 0)} |",
        f"| Total Clients | {m.get('total_clients', 0)} |",
    ]

    if report["critical_alerts"]:
        lines += ["", "## Critical Alerts", ""]
        for alert in report["critical_alerts"]:
            lines.append(f"- {alert}")

    if report["warnings"]:
        lines += ["", "## Warnings", ""]
        for warning in report["warnings"]:
            lines.append(f"- {warning}")

    if not report["critical_alerts"] and not report["warnings"]:
        lines += ["", "## No Alerts", "", "Business is operating normally."]

    if at_risk:
        lines += [
            "",
            "## At-Risk Clients",
            "",
            "| Client | Overdue Invoices | Overdue Total |",
            "|--------|-----------------|---------------|",
        ]
        for r in at_risk:
            lines.append(f"| {r['name']} | {r['overdue_count']} | ${r['overdue_total']:,.2f} |")

    return "\n".join(lines)


if __name__ == "__main__":
    print("Running business analysis...", flush=True)

    report = run_analysis()

    output_dir = Path(__file__).parent.parent / "backend"
    output_dir.mkdir(exist_ok=True)

    json_path = output_dir / "analysis-report.json"
    md_path = output_dir / "analysis-report.md"

    with open(json_path, "w") as f:
        json.dump(report, f, indent=2)

    markdown = generate_markdown(report)
    with open(md_path, "w") as f:
        f.write(markdown)

    print(markdown)
    print(f"\nReports saved to {json_path} and {md_path}", flush=True)

    if report["critical_alerts"]:
        print("\nCritical alerts detected — exiting with error.", file=sys.stderr)
        sys.exit(1)

    sys.exit(0)
