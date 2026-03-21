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

## Post #2 — AI layer implemented in the dashboard
**Fecha:** Marzo 2026
**Estado:** Listo para publicar

---

I added an AI layer to my pool services management app — and it taught me more about system design than I expected.

Here is what the architecture looks like:

The React dashboard calls a FastAPI endpoint. That endpoint queries MySQL directly using SQLAlchemy — monthly revenue, overdue invoices, at-risk clients, draft invoice counts. Python computes the metrics. Then those metrics get passed to the Claude API, which generates a plain-English narrative summarizing the business state. The dashboard renders the narrative alongside four metric tiles with conditional coloring (overdue in red, drafts in yellow).

No hallucinations, no guessing. The LLM only writes prose — every number it mentions came from a real database query.

A few design decisions I want to document:

The endpoint degrades gracefully. If ANTHROPIC_API_KEY is missing, it returns the metrics without the narrative instead of crashing. That matters for CI — the pipeline runs without secrets in the test environment and still passes.

I also added a separate scheduled analysis script (scripts/analyze.py) that runs weekly via GitHub Actions. It connects directly to MySQL, computes the same metrics, writes a JSON + Markdown report, and exits with code 1 if it finds critical alerts — overdue amounts above a threshold, clients inactive for 30+ days. An exit code of 1 makes the GitHub Actions job show as failed, which triggers a notification. That is the MLOps piece: automated monitoring without building a dashboard for the monitoring tool.

The model I used is claude-opus-4-6. There is a comment in the code noting that claude-haiku-4-5 would be significantly cheaper for high-frequency production calls. Making that tradeoff explicit in code is something I picked up from reading about production ML systems.

Full stack: FastAPI + SQLAlchemy + MySQL + Anthropic SDK + React + Tailwind CSS + Docker + GitHub Actions

I am a Technology & Networks student (Minor in Computer Science) at Universidad Interamericana de Puerto Rico, targeting a DevOps internship. This project is my main portfolio piece — every feature I add is something I can explain in an interview at the system level.

#DevOps #MLOps #AI #FastAPI #Python #React #Anthropic #StudentDeveloper #Portfolio #PuertoRico #OpenToWork

---

## Post #3 — Claude Code certification + AI tooling philosophy
**Fecha:** Marzo 18, 2026
**Estado:** Listo para publicar
**Nota:** Attach certificate image when posting

---

I earned Anthropic's Claude Code in Action certificate today.

Here is what that actually looked like on my project:

I used Claude Code (Anthropic's agentic coding CLI) and Cowork (their desktop automation tool) throughout the build of Ektor Pool Services — a full-stack pool maintenance management app I am building as my DevOps portfolio piece. Claude Code helped me scaffold endpoints, run tests, and enforce my own coding style guide. Cowork handled project analysis, documentation, roadmaps, and identifying technical debt across the codebase. When the tools made mistakes — wrong file locations, wrong assumptions — I diagnosed them, understood why, and fixed them. That is intentional. That is the workflow.

My approach to AI in development: these tools exist to optimize processes, accelerate documentation, and compress the feedback loop between learning a concept and having a working implementation to study. Not to skip the learning. Not to do less. The standard I hold myself to is that I can explain every decision at the system level — architecture, tradeoffs, failure modes.

You have to understand the craft before you can direct the tool.

Verify: https://verify.skilljar.com/c/ghti2apufjbf

Technology & Networks student (Minor in Computer Science) at Universidad Interamericana de Puerto Rico. Targeting a DevOps internship.

#ClaudeCode #Anthropic #DevOps #AI #Python #StudentDeveloper #Portfolio #PuertoRico #OpenToWork

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
