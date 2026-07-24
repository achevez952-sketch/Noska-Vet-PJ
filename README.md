# Proyecto 2 - Noska-Vet

Este repositorio contiene la aplicación **Proyecto 2 (Noska-Vet)** configurada con Express, MongoDB y contenedores Docker para un despliegue directo.

## 🚀 Despliegue en Rocky Linux (o cualquier entorno Docker)

Para desplegar este proyecto directamente en tu máquina virtual:

1. **Clonar el repositorio**:
   ```bash
   git clone <URL_DE_TU_REPOSITORIO>
   cd myapp
   ```

2. **Iniciar con Docker Compose**:
   ```bash
   docker compose -f "Proyecto 2/docker-compose.yml" up -d --build
   ```
   *O alternativamente, si prefieres usar el Dockerfile raíz:*
   ```bash
   docker compose up -d --build
   ```

3. **Acceder a la aplicación**:
   Abre el navegador en `http://<IP-DE-TU-VM>:3000`

---
## 📁 Estructura del Proyecto

- `Proyecto 2/app.js`: Servidor Express principal que conecta a MongoDB e inicia la app en el puerto 3000.
- `Proyecto 2/Dockerfile` & `docker-compose.yml`: Archivos Docker listos para levantar la aplicación y el contenedor de MongoDB.
- `models/`: Esquemas de Mongoose (`Appointment.js`, `Adoption.js`).
- `routes/`: Endpoints API REST (`appointments.js`, `adoptions.js`, `scores.js`).
- `Proyecto 2/Noska-Vet/`: Archivos estáticos del frontend (`index.html`, `styles.css`, `app.js`).
