# 🚀 Sistema Integrador Empresarial

Sistema completo de gestão empresarial para centralizar informações de vendas, financeiro, clientes, estoque e mais.

## 📋 Visão Geral do Projeto

O Sistema Integrador Empresarial é uma solução completa de ERP (Enterprise Resource Planning) desenvolvida para pequenas e médias empresas que precisam eliminar planilhas soltas, reduzir erros de comunicação entre setores e ter visão integrada do negócio.

## 🎯 Objetivos

- Centralizar dados de diferentes setores em um único sistema
- Eliminar planilhas soltas e retrabalho
- Automatizar processos operacionais
- Fornecer dashboards e relatórios em tempo real
- Controlar acesso por perfis e permissões
- Garantir rastreabilidade com logs de auditoria

## 🛠️ Tecnologias Utilizadas

### Back-end
- Python 3.11+
- Django 5.0
- Django Rest Framework (DRF)
- PostgreSQL 15
- SimpleJWT (autenticação)
- Django CORS Headers

### Front-end
- React 18
- React Router v6
- Tailwind CSS
- Axios
- Recharts
- React Hook Form

### DevOps & Deploy
- Git / GitHub
- Railway (back-end + banco)
- Vercel (front-end)
- GitHub Actions (CI/CD)

## 📦 Módulos do Sistema

### 1. Clientes (CRM)
- Cadastro completo de clientes PF/PJ
- Histórico de compras e interações
- Segmentação e análise de rentabilidade

### 2. Vendas
- Criação e gerenciamento de pedidos
- Acompanhamento de status
- Integração automática com estoque e financeiro
- Dashboard de vendas e metas

### 3. Estoque
- Controle de produtos e quantidades
- Movimentações de entrada/saída
- Alertas de estoque mínimo
- Relatórios de giro e ruptura

### 4. Financeiro
- Contas a pagar e receber
- Fluxo de caixa
- Relatórios financeiros (DRE, inadimplência)
- Previsões financeiras

### 5. Produtos
- Cadastro com categorias hierárquicas
- Controle de preços (custo, venda, margem)
- Gestão de fotos e descrições

### 6. Fornecedores
- Cadastro e avaliação
- Histórico de compras
- Controle de pagamentos

### 7. Usuários e Permissões
- Autenticação JWT
- Grupos por departamento
- Logs de auditoria

### 8. Relatórios e Dashboards
- KPIs executivos
- Gráficos interativos
- Exportação em PDF/Excel

## 📁 Estrutura do Projeto

```
Sistema_Integrador_Empresarial/
│
├── backend/                 # Aplicação Django
│   ├── config/             # Configurações do projeto
│   ├── apps/               # Apps do Django
│   │   ├── clientes/
│   │   ├── vendas/
│   │   ├── estoque/
│   │   ├── financeiro/
│   │   ├── produtos/
│   │   ├── fornecedores/
│   │   └── usuarios/
│   ├── requirements.txt
│   └── manage.py
│
├── frontend/               # Aplicação React
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── utils/
│   │   └── App.js
│   ├── package.json
│   └── tailwind.config.js
│
├── docs/                   # Documentação
│   ├── PLANEJAMENTO.md
│   ├── DIAGRAMA_ER.md
│   └── API_DOCS.md
│
└── README.md
```

## 🚀 Como Executar o Projeto

### Pré-requisitos
- Python 3.11+
- Node.js 18+
- PostgreSQL 15+
- Git

### Back-end

```powershell
# Clone o repositório
git clone https://github.com/MarcioGil/Sistema_Integrador_Empresarial.git
cd Sistema_Integrador_Empresarial/backend

# Crie o ambiente virtual
python -m venv venv
.\venv\Scripts\Activate.ps1

# Instale as dependências
pip install -r requirements.txt

# Configure o banco de dados no .env
# DATABASE_URL=postgresql://usuario:senha@localhost:5432/sistema_integrador

# Execute as migrações
python manage.py migrate

# Crie um superusuário
python manage.py createsuperuser

# Inicie o servidor
python manage.py runserver
```

### Front-end

```powershell
cd frontend

# Instale as dependências
npm install

# Configure a URL da API no .env
# REACT_APP_API_URL=http://localhost:8000/api

# Inicie o servidor de desenvolvimento
npm start
```

## 📚 Documentação

- [Planejamento Completo](docs/PLANEJAMENTO.md)
- [Diagrama ER](docs/DIAGRAMA_ER.md)
- [Documentação da API](docs/API_DOCS.md) *(em breve)*

## 🔐 Segurança

- Senhas hasheadas com PBKDF2
- Autenticação via JWT com refresh token
- Controle de acesso baseado em roles
- Logs de auditoria para todas operações críticas
- CORS configurado adequadamente
- Proteção contra SQL Injection e XSS

## 📊 Funcionalidades Bônus

- ✉️ Notificações por e-mail (SMTP)
- 🌙 Modo escuro no front-end
- 📈 Gráficos dinâmicos com filtros
- 📝 Sistema completo de logs de auditoria
- 🔄 Sincronização em tempo real
- 📱 Design responsivo (mobile-friendly)

## 🤝 Contribuindo

Este é um projeto de portfólio, mas sugestões e melhorias são bem-vindas!

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

## 👨‍💻 Autor

**Marcio Gil**
- GitHub: [@MarcioGil](https://github.com/MarcioGil)
- LinkedIn: [Seu LinkedIn]

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 📞 Contato

Para dúvidas ou sugestões, entre em contato:
- Email: seuemail@example.com
- LinkedIn: [Seu Perfil]

---

**Status do Projeto:** 🚧 Em Desenvolvimento

**Última atualização:** 01/11/2025
