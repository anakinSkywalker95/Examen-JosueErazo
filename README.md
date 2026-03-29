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

**Snippet 1 — Error de sintaxis en triggers:**

Faltaban `:` después de `push` y `pull_request`, y faltaba `:` después de `branches` en el segundo trigger.

```yaml
# CORREGIDO
on:
  push:
    branches: [main]
  pull_request:
    branches: [main, develop]
```

**Snippet 2 — Referencia incorrecta a secrets:**

`secrets.VERCEL_TOKEN` no es válido en un campo `env`. Debe usar la sintaxis de expresión `${{ secrets.VERCEL_TOKEN }}`.

```yaml
# CORREGIDO
env:
  VERCEL_TOKEN: ${{ secrets.VERCEL_TOKEN }}
```

**Snippet 3 — Matrix y cache inválidos:**

Dos errores: `node-version: 18` debe ser un array, y `cache: npm` requiere comillas.

```yaml
# CORREGIDO
strategy:
  matrix:
    node-version: [18, 20]
steps:
  - uses: actions/setup-node@v4
    with:
      node-version: ${{ matrix.node-version }}
      cache: 'npm'
```

---

## Actividad 5 - Preguntas Conceptuales

**1. ¿Cuál es la diferencia fundamental entre CI y CD?**

La Integración Continua (CI) automatiza la verificación del código cada vez que se hace un push: ejecuta linting, pruebas unitarias y genera reportes de cobertura. Su objetivo es detectar errores lo antes posible. La Entrega Continua (CD) toma el código que ya pasó el CI y automatiza su despliegue a un entorno de producción o staging, garantizando que siempre haya una versión lista para ser entregada.

**2. ¿Qué es un GitHub self-hosted runner y cuándo sería necesario usarlo?**

Un self-hosted runner es un servidor propio registrado en GitHub para ejecutar los workflows en lugar de usar los runners de GitHub. Se necesita cuando el proyecto requiere hardware específico (GPU, más RAM), acceso a recursos internos de la red corporativa (bases de datos privadas, servidores on-premise), o cuando los costos de los runners de GitHub son elevados por el volumen de ejecuciones.

**3. ¿Cuál es el propósito de los GitHub Environments?**

Los GitHub Environments permiten definir entornos de despliegue (como `production` o `staging`) con sus propios secrets, variables y reglas de protección. Por ejemplo, se puede requerir aprobación manual antes de desplegar a producción. En un workflow se usan con la propiedad `environment: production` en el job, lo que activa las reglas y secrets específicos de ese entorno.

**4. ¿Qué es una rollback strategy y cómo se implementaría?**

Una rollback strategy es el plan para revertir un sistema a una versión anterior estable cuando un despliegue falla o causa problemas en producción. Se implementa en un pipeline de CD etiquetando cada imagen Docker con el SHA del commit (`imagen:${{ github.sha }}`), de modo que si el deploy actual falla, se puede redesplegar la imagen del commit anterior ejecutando `docker pull imagen:SHA_ANTERIOR` sin necesidad de reconstruir nada.