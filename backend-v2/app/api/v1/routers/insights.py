import os
from datetime import date, datetime
from decimal import Decimal

import anthropic
from fastapi import APIRouter, Depends
from pydantic import BaseModel, ConfigDict
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.api.v1.routers.auth import require_roles
from app.db.session import get_db
from app.models.models import Customer, Invoice

router = APIRouter()


class BusinessMetrics(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    month_revenue: Decimal
    paid_this_month: int
    overdue_count: int
    overdue_amount: Decimal
    at_risk_clients: list[str]
    draft_invoices: int
    total_clients: int


class InsightOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    metrics: BusinessMetrics
    narrative: str
    generated_at: datetime


@router.get(
    "/dashboard",
    response_model=InsightOut,
    operation_id="v1_insights_dashboard",
    dependencies=[Depends(require_roles("admin", "staff"))],
)
def get_dashboard_insights(db: Session = Depends(get_db)):
    today = date.today()
    month_start = today.replace(day=1)

    month_revenue = (
        db.query(func.coalesce(func.sum(Invoice.total), 0))
        .filter(Invoice.status == "paid", Invoice.issued_date >= month_start)
        .scalar()
    )

    paid_this_month = (
        db.query(func.count(Invoice.invoice_id))
        .filter(Invoice.status == "paid", Invoice.issued_date >= month_start)
        .scalar()
    )

    overdue_invoices = (
        db.query(Invoice)
        .filter(Invoice.status == "sent", Invoice.due_date < today)
        .all()
    )
    overdue_count = len(overdue_invoices)
    overdue_amount = sum((inv.total for inv in overdue_invoices), Decimal("0.00"))

    # 2+ overdue invoices flags a client as at-risk
    overdue_by_customer: dict[int, int] = {}
    for inv in overdue_invoices:
        overdue_by_customer[inv.customer_id] = overdue_by_customer.get(inv.customer_id, 0) + 1

    at_risk_names: list[str] = []
    for customer_id, count in overdue_by_customer.items():
        if count >= 2:
            customer = db.query(Customer).filter(Customer.customer_id == customer_id).first()
            if customer:
                at_risk_names.append(f"{customer.first_name} {customer.last_name}")

    draft_count = (
        db.query(func.count(Invoice.invoice_id))
        .filter(Invoice.status == "draft")
        .scalar()
    )

    total_clients = db.query(func.count(Customer.customer_id)).scalar()

    metrics = BusinessMetrics(
        month_revenue=Decimal(str(month_revenue)),
        paid_this_month=paid_this_month,
        overdue_count=overdue_count,
        overdue_amount=Decimal(str(overdue_amount)),
        at_risk_clients=at_risk_names,
        draft_invoices=draft_count,
        total_clients=total_clients,
    )

    return InsightOut(
        metrics=metrics,
        narrative=_generate_narrative(metrics, today),
        generated_at=datetime.utcnow(),
    )


def _generate_narrative(metrics: BusinessMetrics, today: date) -> str:
    api_key = os.getenv("ANTHROPIC_API_KEY")
    if not api_key:
        return "AI insights unavailable — set ANTHROPIC_API_KEY in your .env file."

    client = anthropic.Anthropic(api_key=api_key)

    at_risk_text = ", ".join(metrics.at_risk_clients) if metrics.at_risk_clients else "none"

    prompt = f"""You are a business analyst for a pool maintenance company.
Given these business metrics for {today.strftime('%B %d, %Y')}, write a concise 3-sentence executive summary.
Be direct, actionable, and mention specific numbers. Do not use headers or bullet points.

Metrics:
- Revenue this month: ${metrics.month_revenue:,.2f} ({metrics.paid_this_month} invoices paid)
- Overdue invoices: {metrics.overdue_count} totaling ${metrics.overdue_amount:,.2f}
- Clients with 2+ overdue invoices (at risk): {at_risk_text}
- Draft invoices pending to be sent: {metrics.draft_invoices}
- Total active clients: {metrics.total_clients}"""

    # claude-haiku-4-5 is cheaper ($1/M vs $5/M) for high-frequency dashboard calls
    message = client.messages.create(
        model="claude-opus-4-6",
        max_tokens=256,
        messages=[{"role": "user", "content": prompt}],
    )

    return message.content[0].text
