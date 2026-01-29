USE Ektor_Pool_Services;

SELECT 
  c.customer_id,
  CONCAT(c.first_name,' ',c.last_name) AS customer,
  COUNT(DISTINCT p.property_id) AS properties,
  COUNT(DISTINCT po.pool_id) AS pools
FROM customers c
LEFT JOIN properties p ON p.customer_id=c.customer_id
LEFT JOIN pools po ON po.property_id=p.property_id
GROUP BY c.customer_id, customer
ORDER BY pools DESC, properties DESC;

SELECT 
  i.invoice_id,
  CONCAT(c.first_name,' ',c.last_name) AS customer,
  p.label AS property,
  i.period_start,
  i.period_end,
  i.total,
  i.status
FROM invoices i
JOIN customers c ON c.customer_id=i.customer_id
JOIN properties p ON p.property_id=i.property_id
ORDER BY i.invoice_id DESC;

SELECT 
  CONCAT(c.first_name,' ',c.last_name) AS customer,
  SUM(i.total) AS total_billed
FROM invoices i
JOIN customers c ON c.customer_id=i.customer_id
GROUP BY customer
ORDER BY total_billed DESC;

SELECT 
  sc.service_name,
  SUM(vs.quantity) AS total_units,
  SUM(vs.quantity*vs.fee) AS revenue
FROM visit_services vs
JOIN service_catalog sc ON sc.service_id=vs.service_id
GROUP BY sc.service_name
ORDER BY revenue DESC;

SELECT 
  i.invoice_id,
  CONCAT(c.first_name,' ',c.last_name) AS customer,
  i.total,
  IFNULL(SUM(pay.amount),0) AS paid,
  (i.total - IFNULL(SUM(pay.amount),0)) AS balance
FROM invoices i
JOIN customers c ON c.customer_id=i.customer_id
LEFT JOIN payments pay ON pay.invoice_id=i.invoice_id
GROUP BY i.invoice_id, customer, i.total
HAVING balance > 0
ORDER BY balance DESC;

SELECT 
  p.label AS property,
  COUNT(v.visit_id) AS visits_in_period
FROM visits v
JOIN properties p ON p.property_id=v.property_id
WHERE v.visit_date BETWEEN '2026-01-05' AND '2026-01-11'
GROUP BY p.label
ORDER BY visits_in_period DESC;
