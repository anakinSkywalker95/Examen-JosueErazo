# Examen 2 - CI/CD GitHub Actions
### Josue Erazo - Sistemas Operativos

[![CI - Lint y Tests](https://github.com/anakinSkywalker95/Examen-JosueErazo/actions/workflows/ci.yml/badge.svg)](https://github.com/anakinSkywalker95/Examen-JosueErazo/actions/workflows/ci.yml)
[![CD - Deploy Production](https://github.com/anakinSkywalker95/Examen-JosueErazo/actions/workflows/cd.yml/badge.svg)](https://github.com/anakinSkywalker95/Examen-JosueErazo/actions/workflows/cd.yml)

---

## Actividad 1 - Dockerfile y Docker Compose

### Errores corregidos en Dockerfile:
1. `FROM node:latest` → `FROM node:18-alpine` (versión específica y ligera)
2. `COPY . .` antes de instalar → copiar `package*.json` primero para caché
3. `npm install` sin `RUN` → `RUN npm install --production`
4. `EXPOSE 80` → `EXPOSE 3000` (puerto correcto de Node.js)

### Levantar con Docker Compose:
```bash
docker compose up --build
```

---

## Actividad 2 - Pipeline CI

- Triggers: push y pull_request a main
- 3 jobs: lint → test → coverage
- Matrix: Node.js 18.x y 20.x
- Caché de npm configurado

**Evidencia de run exitoso:** [CI - Lint y Tests #10 ✅](https://github.com/anakinSkywalker95/Examen-JosueErazo/actions/runs/23699611581)

![CI exitoso](https://github.com/user-attachments/assets/3da55d4f-a9a4-4aa0-8a30-0773ca25f85e)

---

## Actividad 3 - Pipeline CD

- Trigger: solo push a main (via workflow_run después de CI exitoso)
- Environment: production
- Secrets: DOCKER_USERNAME y DOCKER_TOKEN
- Deploy automático a Docker Hub

**Evidencia de deployment exitoso:** [CD - Deploy Production #8 ✅](https://github.com/anakinSkywalker95/Examen-JosueErazo/actions/runs/23699624360)

![CD exitoso](https://github.com/user-attachments/assets/4f0c8c12-363b-478a-b8de-ec552ab046a8)

**Deploy en Render:** https://examen-josueerazo.onrender.com

![Auto Deploy en Render](https://github.com/user-attachments/assets/a2f1585b-fbd8-4cf9-a048-9a0d07ca7843)

---

## Actividad 4 - Troubleshooting

**Snippet 1:** Faltaban `:` después de `push` y `pull_request`

**Snippet 2:** `secrets.VERCEL_TOKEN` debe ser `${{ secrets.VERCEL_TOKEN }}`

**Snippet 3:** `node-version: 18` debe ser `node-version: [18, 20]`

---

## Actividad 5 - Preguntas Conceptuales

**1. CI vs CD:**
CI automatiza verificación del código en cada push (lint + tests). CD automatiza el despliegue a producción cuando el CI pasa.

**2. Self-hosted runner:**
Servidor propio que ejecuta workflows. Se usa cuando se necesita hardware específico o acceso a recursos privados de la empresa.

**3. GitHub Environments:**
Permiten definir entornos como `production` con secrets propios y reglas de aprobación. Se usan con `environment: production` en el workflow.

**4. Rollback strategy:**
Plan para revertir a versión anterior si el deploy falla. Se implementa guardando tags por SHA en Docker Hub y redesplegar la imagen anterior si algo falla.