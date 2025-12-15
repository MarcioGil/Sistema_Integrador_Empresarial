# Deploy rápido no Vercel

1. Suba o frontend para o GitHub.
2. Crie conta em https://vercel.com/ e clique em "New Project" > "Import Git Repository".
3. Vercel detecta Vite automaticamente.
4. Configure variável de ambiente:
	- VITE_API_URL=https://seu-backend.railway.app/api
5. Deploy automático a cada push.
6. Teste o frontend no domínio gerado.

Veja `.env.example` para configuração.
# Frontend - Sistema Integrador Empresarial

Pequeno scaffold em React + Vite + Tailwind para demonstrar a aplicação.

## Requisitos

- Node.js 18+ e npm/yarn
- Windows PowerShell (comandos abaixo)

## Instalação (PowerShell)

```powershell
cd frontend
npm install
npm run dev
```

O projeto espera a API backend em `http://127.0.0.1:8000` (configurada por proxy no `vite.config.js`).

## O que está pronto

- Login com JWT (formulário simples)
- Layout básico com sidebar
- Dashboard básico
- Axios configurado com interceptor para Authorization header

## Próximos passos

- Implementar CRUD de clientes/produtos
- Adicionar gráficos com Recharts
- Melhorar UI/UX e temas

## Capturas / GIFs

Coloque screenshots em `docs/screenshots/` e GIFs em `docs/gifs/` e adicione referências no `README.md` principal.
