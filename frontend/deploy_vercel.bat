@echo off
REM Script automatizado para deploy do frontend com Vercel
REM Execute este arquivo com duplo clique na pasta frontend

REM Navega para a pasta frontend
cd /d %~dp0
cd ..\frontend

REM Faz login no Vercel (irá abrir o navegador para autenticação)
vercel login

REM Faz deploy para produção
vercel --prod

pause
