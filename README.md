# puenteChallenge

Aplicación fullstack para seguimiento de mercados financieros y gestión de portafolios.

## Estructura del Proyecto

- `backend/`: API desarrollada en Java con Spring Boot, conectada a PostgreSQL y Redis.
- `frontend/`: Aplicación web en React con Tailwind CSS.
- `docker-compose.yml`: Orquesta los servicios de base de datos y caché.
- `run_all.bat`: Script para iniciar todos los servicios en Windows.

## Tecnologías

- **Backend:** Java 17, Spring Boot, PostgreSQL, Redis, Maven, Lombok
- **Frontend:** React, Tailwind CSS, Vite, TypeScript
- **Infraestructura:** Docker, Docker Compose

## Primeros Pasos

1. Clona el repositorio:
   ```bash
   git clone <url-del-repo>
   cd puenteChallenge
   ```
2. Inicia los servicios de base de datos y caché:
   ```bash
   docker-compose up
   ```
3. Configura y ejecuta el backend:
   ```bash
   cd backend
   ./mvnw spring-boot:run
   ```
4. Configura y ejecuta el frontend:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

## Notas

- Asegúrate de tener Docker y Java 17 instalados.
- Las variables de entorno para la base de datos y Redis están definidas en `docker-compose.yml` y archivos `.env`.

## Créditos

Desarrollado por Flavio de Benedetti.