# Checklist de publicação Google Play

1. Criar conta de desenvolvedor Google ($25 USD)
2. Gerar Keystore de assinatura (Android Studio > Build > Generate Signed Bundle)
3. Gerar Android App Bundle (AAB)
4. Criar página do app:
   - Nome
   - Descrição
   - Print mobile
   - Ícone
   - Política de privacidade
   - URL oficial (GitHub Pages, Netlify, etc)
5. Submeter para análise
6. Aguardar aprovação (1–3 dias)

# Checklist SaaS

- Configurar cobrança Stripe/Mercado Pago
- Criar página “Assine agora”
- Criar painel do usuário mostrando plano e vencimento
- Criar webhooks para renovar automaticamente assinatura

# Checklist suporte e marketing

- Criar landing page profissional
- Criar onboarding dentro do app
- Criar documentação rápida (como usar)
- Criar e-mail profissional (ex: suporte@seuapp.com)
- Criar canal no Telegram/WhatsApp para suporte

# Checklist de atualização

- Sempre que atualizar o React:
  npm run build
  npx cap copy
  npx cap sync
- Publicar nova versão do AAB na Play Store
