@echo off
setlocal
echo ================================
echo Iniciando Puente Challenge...
echo ================================

REM Paso 1: Verificar si Docker está corriendo
echo Verificando Docker...
docker info >nul 2>&1
IF ERRORLEVEL 1 (
    echo [ERROR] Docker no está corriendo. Por favor, iniciá Docker Desktop y volvé a intentar.
    pause
    exit /b
)

REM Paso 2: Levantar infraestructura con Docker Compose
echo Levantando PostgreSQL y Redis
docker-compose up -d

REM Esperar unos segundos para que los servicios se levanten
echo Esperando a que los servicios arranquen...
timeout /t 10 >nul

REM Paso 3: Iniciar backend (Spring Boot)
echo Iniciando backend Spring Boot...
start "Backend" cmd /k "cd backend && call mvnw spring-boot:run"

REM Paso 4: Iniciar frontend (Vite, React, etc.)
echo Iniciando frontend...
start "Frontend" cmd /k "cd frontend && npm run dev"

echo ================================
echo Aplicacion finalizada o detenida.
echo ================================
pause
