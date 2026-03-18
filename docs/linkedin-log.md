# LinkedIn Post Log — Ektor Pool Services

Registro de posts para documentar el progreso público del proyecto.
Úsalo como bitácora: cada vez que hagas algo significativo, escríbelo aquí
y luego publica en LinkedIn.

---

## Post #1 — CI/CD Pipeline implementado
**Fecha:** Marzo 2026
**Estado:** Listo para publicar

---

🚀 Actualizando mi proyecto de portafolio — Ektor Pool Services

Llevo semanas construyendo una aplicación full-stack de gestión para un
negocio real de mantenimiento de piscinas. Esta semana di un paso importante
hacia DevOps:

✅ Implementé un pipeline completo de CI/CD con GitHub Actions:
→ Job de backend: levanta MySQL como servicio, corre el schema SQL,
  ejecuta pytest con reporte de cobertura
→ Job de frontend: instala dependencias y valida el build con Node 20
→ Job de deploy: SSH automático a AWS EC2 después de que todos los
  tests pasen — cero intervención manual

🔐 También limpié la seguridad del repositorio:
→ .env nunca commiteado, protegido con .gitignore
→ .env.example como referencia segura para colaboradores
→ Secrets manejados con GitHub Secrets (no más credenciales en el código)

El stack: FastAPI + MySQL + React + Docker + AWS EC2 + GitHub Actions

Siguiente paso: implementar IA dentro del dashboard — análisis automático
de datos del negocio con un LLM + detección de anomalías en pagos.

Soy estudiante de Tecnología y Redes en la Universidad Interamericana de PR,
enfocado en DevOps. Cada commit es un paso más hacia mi primer internship.

#DevOps #GitHub Actions #CICD #FastAPI #React #AWS #Python #Puerto Rico
#StudentDeveloper #Portfolio #OpenToWork

---

## Post #2 — IA en el dashboard (PENDIENTE)
**Fecha:** Por definir
**Estado:** Borrador — completar cuando esté implementado

---

🤖 Integré inteligencia artificial en mi proyecto de portafolio

[Describir qué se construyó]

→ Endpoint de análisis en FastAPI que procesa datos reales de la BD
→ El dashboard ahora genera insights automáticos en lenguaje natural
→ Detección de anomalías en pagos y comportamiento de clientes
→ Job en GitHub Actions que corre análisis automatizado semanalmente

Lo interesante no es solo la IA — es cómo se despliega:
pipeline CI/CD → tests → deploy → modelo en producción.
Eso es MLOps.

Stack: FastAPI + React + MySQL + Claude/OpenAI API + GitHub Actions + AWS EC2

#MLOps #AI #DevOps #FastAPI #Python #StudentDeveloper #Portfolio #PuertoRico

---

## Plantilla para futuros posts

**Estructura que funciona:**
1. Qué construiste (1 línea)
2. Por qué importa / qué aprendiste (2-3 bullets)
3. Próximo paso
4. Identidad: estudiante, enfocado en DevOps, Universidad Interamericana PR
5. Hashtags relevantes

**Hashtags fijos a incluir siempre:**
#DevOps #Python #Puerto Rico #StudentDeveloper #Portfolio
