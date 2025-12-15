# Instalação e empacotamento do app com CapacitorJS
# Execute este script na pasta frontend no PowerShell

Set-Location "$PSScriptRoot"

npm install @capacitor/core @capacitor/cli
npm install @capacitor/android

npx cap init SistemaIntegrador com.seuapp.integrador
npx cap add android
npm run build
npx cap copy
npx cap sync
npx cap open android

pause
