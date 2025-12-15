@echo off
REM Instalação e empacotamento do app com CapacitorJS
REM Execute este script na pasta frontend

cd /d "%~dp0"

REM Instalar Capacitor
npm install @capacitor/core @capacitor/cli
npm install @capacitor/android

REM Inicializar Capacitor
npx cap init SistemaIntegrador com.seuapp.integrador

REM Adicionar Android
npx cap add android

REM Build do React
npm run build
npx cap copy
npx cap sync

REM Abrir no Android Studio
npx cap open android

pause
