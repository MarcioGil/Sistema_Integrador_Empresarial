<div align="center">


# 🏢 Sistema Integrador Empresarial

### Plataforma completa de gestão empresarial integrada

---

## 🚀 Valor Inegável para o Seu Negócio (Foco no Lucro e Controle)
O Sistema Integrador Empresarial não é apenas um software, é seu parceiro estratégico para acabar com a dependência de planilhas e achismos. Desenvolvemos esta plataforma focados nos problemas que mais roubam tempo e dinheiro dos pequenos e médios empresários:

| Área de Impacto         | Problema Atual                                                                 | O que o Sistema Resolve (Vantagem)                                                                                       |
|------------------------|-------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------|
| 💰 Fluxo de Caixa      | Incerteza sobre o que entra e sai, dependência do contador para relatórios.    | **Controle 100% em Tempo Real:** Visão clara do Contas a Pagar/Receber e alertas automáticos sobre faturas e compromissos.|
| 📦 Estoque e Vendas    | Perda de vendas por falta de produto ou prejuízo por excesso de estoque.       | **Automação e Prevenção de Perdas:** Alertas de estoque mínimo e atualização automática de preços e margens.             |
| 🛡️ Segurança/Auditoria| Falta de rastreamento sobre quem fez o quê, dificultando auditorias.           | **Rastreamento Total:** Log de todas as operações, com IP e usuário, garantindo integridade dos dados.                   |
| 👥 Tomada de Decisão   | Uso de dados antigos ou incompletos para definir estratégias.                  | **Dashboard Analítico:** Métricas e KPIs em tempo real para decisões rápidas e seguras.                                  |

### Sua Vantagem Competitiva
- **Menos Tempo:** Equipe livre do trabalho manual e repetitivo (Foco nos Módulos de Vendas e Cadastro).
- **Mais Dinheiro:** Otimização do Estoque e visibilidade das margens de lucro (Foco nos Módulos de Estoque e Produtos).
- **Mais Segurança:** Dados protegidos por Autenticação JWT e Auditoria Completa.

Este trecho usa uma linguagem direta, foca nos problemas (Dor) e vende o Benefício (Solução). Use-o para introduzir os Diferenciais e as Funcionalidades que vêm a seguir.

---

[![Django](https://img.shields.io/badge/Django-5.0.7-092E20?style=for-the-badge&logo=django&logoColor=white)](https://www.djangoproject.com/)
[![DRF](https://img.shields.io/badge/DRF-3.15.2-ff1709?style=for-the-badge&logo=django&logoColor=white)](https://www.django-rest-framework.org/)
[![React](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![Python](https://img.shields.io/badge/Python-3.13-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](LICENSE)

</div>

---


## 🔐 Credenciais de Teste

### Ambiente Online (Demo)
- URL: https://sistema-integrador.vercel.app
- Usuário: demo
- Senha: demo123

### Ambiente Local
Ao rodar localmente, crie seu próprio usuário com:
```bash
python manage.py createsuperuser
```
Ou, para ambiente pré-preenchido (testes rápidos):
- Usuário: admin
- Senha: admin123 *(configure em backend/populate_db.py)*

---

## 🖼️ Screenshots

Adicione imagens reais dos módulos principais em docs/screenshots/ e use links relativos. Exemplo:

#### Login
![Tela de Login](docs/screenshots/login.png)
Autenticação JWT com validação em tempo real

#### Dashboard
![Dashboard Analítico](docs/screenshots/dashboard.png)
*Métricas, gráficos e KPIs em tempo real*

#### Clientes
![Clientes](docs/screenshots/clientes.png)

#### Produtos
![Produtos](docs/screenshots/produtos.png)

> **Dica:** Veja docs/screenshots/README.md para checklist e instruções de captura.

---

## 🚀 Demonstração Online

> ⚠️ *Status*: Atualmente em deploy local. 
> A versão online em Vercel/Railway está sendo reconstruída.
> 
> *Enquanto isso, teste localmente em 3 minutos:*
> 
> ```bash
> git clone ...
> cd backend && python -m venv venv && source venv/bin/activate
> pip install -r requirements.txt
> python manage.py migrate
> python manage.py runserver
> ```
> 
> Acesse: http://localhost:8000/api/docs

Se encontrar dificuldades, consulte a documentação detalhada em [docs/FRONTEND_GUIDE.md](docs/FRONTEND_GUIDE.md) ou [docs/DEPLOY.md](docs/DEPLOY.md).



## 👨‍💻 Sobre o Desenvolvedor

<div align="center">

**Márcio Gil**  
*Embaixador da Turma 14 - DIO Campus Expert*  
*Estudante de Engenharia de Software*

Apaixonado por tecnologia, inovação e justiça social

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/in/márcio-gil-1b7669309)
[![Portfolio](https://img.shields.io/badge/Portfolio-000000?style=for-the-badge&logo=About.me&logoColor=white)](https://marciogil.github.io/curriculum-vitae/)
[![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/MarcioGil)
[![Email](https://img.shields.io/badge/Email-D14836?style=for-the-badge&logo=gmail&logoColor=white)](mailto:marciopaivagil@gmail.com)

</div>

---

## 📋 Índice

- [Sobre o Projeto](#-sobre-o-projeto)
- [Arquitetura](#-arquitetura)
- [Tecnologias](#-tecnologias)
- [Funcionalidades](#-funcionalidades)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Instalação](#-instalação)
- [Uso](#-uso)
- [API Endpoints](#-api-endpoints)
- [Documentação](#-documentação)
- [Testes](#-testes)
- [Deploy](#-deploy)
- [Roadmap](#-roadmap)
- [Contribuindo](#-contribuindo)
- [Licença](#-licença)

---


## ♿ Acessibilidade

O Sistema Integrador Empresarial foi projetado com foco em acessibilidade digital:
- **Contraste elevado** e fontes legíveis para facilitar a leitura.
- **Navegação por teclado** em todos os formulários e menus.
- **Compatibilidade com leitores de tela** (WAI-ARIA).
- **Mensagens de erro claras** e feedback visual para ações do usuário.
- **Responsividade total**: uso confortável em desktop, tablet e mobile.

Essas práticas garantem que pessoas com diferentes necessidades possam utilizar o sistema com autonomia e eficiência.

---

## 🛒 Módulo de Vendas: Controle e Lucro

O módulo de vendas é o coração do sistema para transformar oportunidades em receita:
- **Pedidos com múltiplos itens** e cálculo automático de totais.
- **Status detalhado** (pendente, confirmado, em separação, enviado, entregue, cancelado).
- **Formas de pagamento flexíveis** e previsão de entrega.
- **Ações rápidas**: confirmação/cancelamento de pedidos, histórico completo e integração com o financeiro.
- **Automação de estoque**: baixa automática ao vender, evitando rupturas e prejuízos.

Com isso, o gestor tem controle total do ciclo de vendas, reduz erros e aumenta a satisfação do cliente.

---

O **Sistema Integrador Empresarial** é uma solução completa e moderna para gestão empresarial, desenvolvido com as melhores práticas de engenharia de software. O sistema integra diferentes setores da empresa em uma única plataforma, proporcionando eficiência operacional, controle financeiro e tomada de decisões baseada em dados.

### 🌟 Diferenciais

- **🔐 Autenticação JWT** - Sistema seguro com tokens de acesso e refresh
- **📊 Dashboard Analítico** - Visualização de métricas e KPIs em tempo real
- **🔄 API RESTful Completa** - Documentação automática com Swagger/ReDoc
- **📱 Responsive Design** - Interface adaptável para desktop, tablet e mobile
- **🎨 UI/UX Moderna** - Design limpo e intuitivo com Tailwind CSS
- **⚡ Performance** - Otimizações de query com `select_related` e `prefetch_related`
- **🔍 Busca Avançada** - Filtros dinâmicos e busca full-text
- **📝 Auditoria Completa** - Rastreamento de todas as operações do sistema
- **🌐 Internacionalização** - Preparado para múltiplos idiomas (PT-BR)
- **🔧 Extensível** - Arquitetura modular e escalável

---

## 🏗️ Arquitetura

O projeto segue uma arquitetura moderna baseada em:


```mermaid
flowchart TD
  subgraph Frontend [FRONTEND (React)]
    Dashboard[Dashboard]
    Modulos[Módulos]
    Relatorios[Relatórios]
  end
  subgraph API [API REST (Django DRF)]
    JWT[JWT Auth]
    Serializers[Serializers]
    ViewSets[ViewSets]
    Permissions[Permissions]
  end
  subgraph DB [BANCO DE DADOS (SQLite)]
    Clientes[Clientes]
    Produtos[Produtos]
    Vendas[Vendas]
    Financeiro[Financeiro]
  end
  Frontend -->|HTTP/JSON| API
  API -->|ORM/SQL| DB
```

### Padrões Utilizados

- **MVC/MVT** - Model-View-Template (Django)
- **Repository Pattern** - Camada de acesso a dados
- **Service Layer** - Lógica de negócio isolada
- **DTOs** - Serializers para transferência de dados
- **Dependency Injection** - Injeção de dependências
- **SOLID Principles** - Código limpo e manutenível

---

## 🚀 Tecnologias

### Backend

| Tecnologia | Versão | Descrição |
|-----------|--------|-----------|
| ![Python](https://img.shields.io/badge/Python-3776AB?style=flat&logo=python&logoColor=white) | 3.13.3 | Linguagem principal |
| ![Django](https://img.shields.io/badge/Django-092E20?style=flat&logo=django&logoColor=white) | 5.0.7 | Framework web |
| ![DRF](https://img.shields.io/badge/DRF-ff1709?style=flat&logo=django&logoColor=white) | 3.15.2 | API REST framework |
| ![JWT](https://img.shields.io/badge/JWT-000000?style=flat&logo=JSON-web-tokens&logoColor=white) | 5.3.1 | Autenticação |
| ![SQLite](https://img.shields.io/badge/SQLite-003B57?style=flat&logo=sqlite&logoColor=white) | 3.x | Banco de dados |

### Frontend (Implementado - ETAPA 5)

| Tecnologia | Versão | Descrição |
|-----------|--------|-----------|
| ![React](https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=black) | 18.3 | Biblioteca UI |
| ![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white) | 5.x | Build tool |
| ![TailwindCSS](https://img.shields.io/badge/Tailwind-38B2AC?style=flat&logo=tailwind-css&logoColor=white) | 3.x | Framework CSS |
| ![Axios](https://img.shields.io/badge/Axios-5A29E4?style=flat&logo=axios&logoColor=white) | 1.x | HTTP client |
| ![React Router](https://img.shields.io/badge/React_Router-CA4245?style=flat&logo=react-router&logoColor=white) | 6.x | Roteamento |

### DevOps & Tools

- **Git** - Controle de versão
- **GitHub** - Repositório remoto
- **VS Code** - IDE
- **Postman** - Testes de API
- **Django Debug Toolbar** - Debug e profiling
- **drf-spectacular** - Documentação automática (Swagger/ReDoc)

---

## 📸 Screenshots

<div align="center">

### 🔐 Tela de Login
*Interface moderna com validação em tempo real*

![Login](docs/screenshots/login.png)

---

### 📊 Dashboard Analítico
*Visão geral com métricas, gráficos e estatísticas em tempo real*

![Dashboard](docs/screenshots/dashboard.png)

---

### 👥 Gestão de Clientes
*CRUD completo com busca, filtros e validação de CPF/CNPJ*

![Clientes](docs/screenshots/clientes.png)

---

### 📦 Controle de Produtos
*Gestão de produtos com categorias, preços e imagens*

![Produtos](docs/screenshots/produtos.png)

---

### 📊 Controle de Estoque
*Movimentações, alertas de estoque mínimo e histórico completo*

![Estoque](docs/screenshots/estoque.png)

---

### 🛒 Sistema de Vendas
*Carrinho interativo com cálculo automático de totais*

![Vendas](docs/screenshots/vendas.png)

---

### 💰 Gestão Financeira
*Contas a pagar/receber com controle de vencimentos e status*

![Financeiro](docs/screenshots/financeiro.png)

---

### 📚 API Documentation (Swagger)
*Documentação interativa automática com drf-spectacular*

![API Docs](docs/screenshots/api-swagger.png)

</div>

> **📝 Nota:** Para visualizar o sistema em ação localmente, siga as instruções de [Instalação](#-instalação) ou acesse a versão online em produção:
>
> **Frontend (Vercel):** https://sistema-integrador.vercel.app
> **Backend (Railway):** https://sistema-integrador-production.up.railway.app
>
> **Login de demonstração:**
> - Usuário: admin
> - Senha: Admin@123!
>
> Caso o link do Vercel retorne erro 404, aguarde alguns minutos e tente novamente. Se persistir, consulte o guia de deploy ou entre em contato com o autor.

---

## ✨ Funcionalidades

### 📦 Módulos Implementados

#### 1. 👥 Gestão de Clientes
- ✅ Cadastro de clientes Pessoa Física (CPF) e Jurídica (CNPJ)
- ✅ Validação automática de CPF/CNPJ
- ✅ Histórico completo de interações
- ✅ Busca avançada por múltiplos campos
- ✅ Status ativo/inativo

#### 2. 📦 Gestão de Produtos
- ✅ Categorias hierárquicas (pai/filho)
- ✅ Código SKU automático
- ✅ Preço de custo e venda
- ✅ Cálculo de margem de lucro
- ✅ Unidades de medida customizáveis
- ✅ Código de barras (EAN13)

#### 3. 📊 Controle de Estoque
- ✅ Movimentações de entrada/saída
- ✅ Estoque mínimo e máximo
- ✅ Alertas de reposição
- ✅ Rastreamento de localização
- ✅ Histórico completo de movimentações
- ✅ Status do estoque (adequado/baixo/crítico/excesso)

#### 4. 🛒 Vendas
- ✅ Pedidos com múltiplos itens
- ✅ Cálculo automático de totais
- ✅ Status do pedido (pendente/confirmado/em separação/enviado/entregue/cancelado)
- ✅ Formas de pagamento diversas
- ✅ Data de entrega prevista
- ✅ Ações customizadas (confirmar/cancelar pedido)

#### 5. 💰 Financeiro
- ✅ Faturas vinculadas a pedidos
- ✅ Contas a receber
- ✅ Contas a pagar
- ✅ Controle de juros, multas e descontos
- ✅ Identificação de contas atrasadas
- ✅ Múltiplas formas de pagamento
- ✅ Categorização de despesas

#### 6. 🏭 Fornecedores
- ✅ Cadastro completo com CNPJ
- ✅ Dados bancários
- ✅ Sistema de avaliação (0-5)
- ✅ Categorização por tipo
- ✅ Histórico de compras

#### 7. 👨‍💼 Usuários e Departamentos
- ✅ Gestão de usuários (admin/gerente/vendedor/operador)
- ✅ Departamentos com hierarquia
- ✅ Controle de permissões granular
- ✅ Alteração de senha segura
- ✅ Endpoint `/me` para dados do usuário logado

#### 8. 📝 Auditoria
- ✅ Logs de todas as operações (CREATE/UPDATE/DELETE)
- ✅ Rastreamento de IP e User Agent
- ✅ Versionamento de dados (antes/depois)
- ✅ Apenas leitura para administradores

---

## 📁 Estrutura do Projeto

```
Sistema_Integrador_Empresarial/
├── 📂 backend/
│   ├── 📂 config/               # Configurações do Django
│   │   ├── settings.py          # Settings principal
│   │   ├── urls.py              # URLs raiz + Swagger
│   │   └── wsgi.py
│   ├── 📂 clientes/             # App de Clientes
│   │   ├── models.py            # Model Cliente
│   │   ├── serializers.py       # Serializers DRF
│   │   ├── views.py             # ViewSets
│   │   ├── urls.py              # Rotas
│   │   └── admin.py             # Admin Django
│   ├── 📂 produtos/             # App de Produtos
│   ├── 📂 estoque/              # App de Estoque
│   ├── 📂 vendas/               # App de Vendas
│   ├── 📂 financeiro/           # App Financeiro
│   ├── 📂 fornecedores/         # App de Fornecedores
│   ├── 📂 usuarios/             # App de Usuários
│   ├── 📂 auditoria/            # App de Auditoria
│   ├── 📂 logs/                 # Logs do sistema
│   ├── 📂 media/                # Uploads de arquivos
│   ├── 📂 staticfiles/          # Arquivos estáticos
│   ├── 📄 manage.py             # CLI do Django
│   ├── 📄 db.sqlite3            # Banco de dados
│   ├── 📄 requirements.txt      # Dependências Python
│   ├── 📄 API_TESTS.http        # Testes HTTP (47 exemplos)
│   └── 📄 populate_db.py        # Script de seed
├── 📂 frontend/                 # React App (ETAPA 5)
│   ├── 📂 src/                  # Código fonte
│   ├── 📂 public/               # Assets
│   └── 📄 package.json          # Dependências JS
├── 📂 docs/                     # Documentação
│   ├── PLANEJAMENTO.md          # Planejamento geral
│   ├── DIAGRAMA_ER.md           # Diagrama ER
│   ├── ETAPA_2_CONCLUIDA.md     # Conclusão ETAPA 2
│   ├── ETAPA_3_CONCLUIDA.md     # Conclusão ETAPA 3
│   ├── ETAPA_5_CONCLUIDA.md     # Conclusão ETAPA 5 (Frontend Completo)
│   └── TAREFAS.md               # Lista de tarefas
├── 📄 README.md                 # Este arquivo
├── 📄 .gitignore                # Arquivos ignorados
└── 📄 LICENSE                   # Licença MIT
```

---

## 🔧 Instalação

### Pré-requisitos

- Python 3.13+
- pip (gerenciador de pacotes Python)
- Git
- Virtualenv (recomendado)

### Passo a Passo

1. **Clone o repositório**

```bash
git clone https://github.com/MarcioGil/Sistema_Integrador_Empresarial.git
cd Sistema_Integrador_Empresarial
```

2. **Crie e ative o ambiente virtual**

```bash
# Windows
cd backend
python -m venv venv
.\venv\Scripts\activate

# Linux/Mac
cd backend
python3 -m venv venv
source venv/bin/activate
```

3. **Instale as dependências**

```bash
pip install -r requirements.txt
```

4. **Configure as variáveis de ambiente**

Crie um arquivo `.env` na pasta `backend/`:

```env
SECRET_KEY=sua-chave-secreta-aqui
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
DATABASE_URL=sqlite:///db.sqlite3
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
JWT_ACCESS_TOKEN_LIFETIME=60
JWT_REFRESH_TOKEN_LIFETIME=10080
```

5. **Execute as migrações**

```bash
python manage.py makemigrations
python manage.py migrate
```

6. **Crie um superusuário**

```bash
python manage.py createsuperuser
# Username: admin
# Email: admin@admin.com
# Password: admin123
```

7. **Execute o servidor**

```bash
python manage.py runserver
```

8. **Acesse a aplicação**

- **API**: http://127.0.0.1:8000/api/
- **Admin**: http://127.0.0.1:8000/admin/
- **Swagger**: http://127.0.0.1:8000/api/docs/
- **ReDoc**: http://127.0.0.1:8000/api/redoc/

---

## 💻 Uso


### POST /api/token/ - Autenticação

**Request:**
```bash
curl -X POST http://127.0.0.1:8000/api/token/ \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

**Response (200):**
```json
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiIsInR5cCI...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiIsInR5cCI...",
  "user": {
    "id": 1,
    "username": "admin",
    "email": "admin@admin.com",
    "role": "admin"
  }
}
```

**Response (401):**
```json
{
  "detail": "Invalid credentials"
}
```

### 2. Usar o token nas requisições

```bash
GET http://127.0.0.1:8000/api/clientes/
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGc...
```

### 3. Exemplos Práticos

**Criar Cliente:**
```bash
POST http://127.0.0.1:8000/api/clientes/
Authorization: Bearer {seu-token}
Content-Type: application/json

{
  "tipo": "PF",
  "nome_completo": "João Silva",
  "cpf": "12345678901",
  "email": "joao@email.com",
  "telefone": "(11) 98765-4321",
  "endereco": "Rua A, 123",
  "cidade": "São Paulo",
  "estado": "SP",
  "cep": "01000-000",
  "ativo": true
}
```

**Criar Pedido com Itens:**
```bash
POST http://127.0.0.1:8000/api/pedidos/
Authorization: Bearer {seu-token}
Content-Type: application/json

{
  "cliente": 1,
  "forma_pagamento": "cartao_credito",
  "itens": [
    {
      "produto": 1,
      "quantidade": 2,
      "preco_unitario": 3500.00
    }
  ]
}
```

---

## 📚 API Endpoints

### 🔐 Autenticação

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/api/token/` | Obter access e refresh token |
| POST | `/api/token/refresh/` | Renovar access token |
| POST | `/api/token/verify/` | Verificar validade do token |

### 👥 Clientes

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/clientes/` | Listar clientes |
| POST | `/api/clientes/` | Criar cliente |
| GET | `/api/clientes/{id}/` | Detalhes do cliente |
| PUT | `/api/clientes/{id}/` | Atualizar cliente |
| PATCH | `/api/clientes/{id}/` | Atualizar parcialmente |
| DELETE | `/api/clientes/{id}/` | Deletar cliente |

### 📦 Produtos

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/categorias/` | Listar categorias |
| POST | `/api/categorias/` | Criar categoria |
| GET | `/api/produtos/` | Listar produtos |
| POST | `/api/produtos/` | Criar produto |
| GET | `/api/produtos/{id}/` | Detalhes do produto |
| PUT/PATCH | `/api/produtos/{id}/` | Atualizar produto |
| DELETE | `/api/produtos/{id}/` | Deletar produto |

### 📊 Estoque

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/estoques/` | Listar estoque |
| POST | `/api/estoques/` | Criar registro de estoque |
| GET | `/api/estoques/necessita_reposicao/` | Produtos com estoque baixo |
| POST | `/api/movimentacoes/` | Criar movimentação |
| GET | `/api/movimentacoes/` | Histórico de movimentações |

### 🛒 Vendas

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/pedidos/` | Listar pedidos |
| POST | `/api/pedidos/` | Criar pedido com itens |
| GET | `/api/pedidos/{id}/` | Detalhes do pedido |
| POST | `/api/pedidos/{id}/confirmar/` | Confirmar pedido |
| POST | `/api/pedidos/{id}/cancelar/` | Cancelar pedido |

### 💰 Financeiro

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/faturas/` | Listar faturas |
| GET | `/api/faturas/atrasadas/` | Faturas atrasadas |
| GET | `/api/contas-receber/` | Contas a receber |
| POST | `/api/contas-receber/` | Criar conta a receber |
| POST | `/api/contas-receber/{id}/receber/` | Marcar como recebida |
| GET | `/api/contas-pagar/` | Contas a pagar |
| POST | `/api/contas-pagar/` | Criar conta a pagar |
| POST | `/api/contas-pagar/{id}/pagar/` | Marcar como paga |

### 🏭 Fornecedores

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/fornecedores/` | Listar fornecedores |
| POST | `/api/fornecedores/` | Criar fornecedor |
| GET/PUT/DELETE | `/api/fornecedores/{id}/` | Operações CRUD |

### 👨‍💼 Usuários

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/usuarios/` | Listar usuários |
| POST | `/api/usuarios/` | Criar usuário (admin) |
| GET | `/api/usuarios/me/` | Dados do usuário logado |
| POST | `/api/usuarios/{id}/alterar_senha/` | Alterar senha |
| GET | `/api/departamentos/` | Listar departamentos |

### 📝 Auditoria

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/logs/` | Logs de auditoria (admin) |
| GET | `/api/logs/{id}/` | Detalhes do log |

> 💡 **Dica**: Consulte o arquivo [`backend/API_TESTS.http`](backend/API_TESTS.http) para 47 exemplos completos de requisições!

---


## 📖 Documentação Interativa

### 🔹 Swagger UI (Recomendado para testes)
- *URL Local*: [http://localhost:8000/api/docs/](http://localhost:8000/api/docs/)
- *Versão Online*: [https://sistema-integrador-production.up.railway.app/api/docs/](https://sistema-integrador-production.up.railway.app/api/docs/)
- *Use para*: Testar endpoints interativamente, ver exemplos

### 🔹 ReDoc (Recomendado para leitura)
- *URL Local*: [http://localhost:8000/api/redoc/](http://localhost:8000/api/redoc/)
- *Use para*: Ler documentação detalhada offline

*Nota:* Ambas são geradas automaticamente de drf-spectacular ([Documentação drf-spectacular](https://drf-spectacular.readthedocs.io/))

![Swagger UI](https://img.shields.io/badge/Swagger-85EA2D?style=for-the-badge&logo=swagger&logoColor=black)
![ReDoc](https://img.shields.io/badge/ReDoc-339933?style=for-the-badge&logo=redoc&logoColor=white)

### Django Admin

Acesse **http://127.0.0.1:8000/admin/** para gerenciar dados via interface administrativa.

---

## 🧪 Testes

### Testes Automatizados (Em breve)

```bash
python manage.py test
```

### Testes de API com arquivo HTTP

Use a extensão **REST Client** do VS Code com o arquivo `API_TESTS.http`:

1. Instale a extensão REST Client no VS Code
2. Abra `backend/API_TESTS.http`
3. Clique em "Send Request" acima de cada requisição
4. Substitua `{{token}}` pelo seu access token

### Coverage (Em breve)

```bash
coverage run --source='.' manage.py test
coverage report
coverage html
```

---

## 🚀 Deploy

### Heroku

```bash
# Instalar Heroku CLI
heroku login
heroku create sistema-integrador-empresarial
git push heroku main
heroku run python manage.py migrate
heroku run python manage.py createsuperuser
```

### Docker (Em breve)

```bash
docker-compose up --build
```

### Variáveis de Ambiente para Produção

```env
SECRET_KEY=chave-super-secreta-em-producao
DEBUG=False
ALLOWED_HOSTS=seudominio.com,www.seudominio.com
DATABASE_URL=postgresql://user:pass@host:5432/dbname
CORS_ALLOWED_ORIGINS=https://seudominio.com
```

---

## 🗺️ Roadmap

### ✅ Fase 1 - Planejamento (Concluída)
- [x] Definição de escopo e módulos
- [x] Modelagem do banco de dados
- [x] Diagrama ER completo
- [x] Documentação técnica

### ✅ Fase 2 - Setup do Ambiente (Concluída)
- [x] Configuração Django
- [x] Criação de 8 apps
- [x] Configuração de CORS e JWT
- [x] Django Admin customizado

### ✅ Fase 3 - Models e Database (Concluída)
- [x] 14 models criados
- [x] Migrações aplicadas
- [x] Validações de negócio
- [x] Properties calculadas

### ✅ Fase 4 - API REST (Concluída)
- [x] Serializers com validações
- [x] ViewSets com CRUD completo
- [x] Filtros, busca e ordenação
- [x] Documentação Swagger/ReDoc
- [x] Autenticação JWT
- [x] Actions customizadas

### 🔄 Fase 5 - Frontend React (Em Progresso)
- [ ] Setup Vite + React
- [ ] Configuração Tailwind CSS
- [ ] Sistema de autenticação
- [ ] Dashboard com gráficos
- [ ] CRUD de todos os módulos
- [ ] Relatórios em PDF
- [ ] Componentes reutilizáveis

### 📅 Fase 6 - Features Avançadas (Planejado)
- [ ] WebSockets para notificações em tempo real
- [ ] Exportação de relatórios (PDF, Excel)
- [ ] Integração com APIs externas (CEP, nota fiscal)
- [ ] Sistema de permissões granulares
- [ ] Multi-tenancy (suporte a múltiplas empresas)
- [ ] Internacionalização (i18n)

### 📅 Fase 7 - Testes e Qualidade (Planejado)
- [ ] Testes unitários (>80% coverage)
- [ ] Testes de integração
- [ ] Testes E2E com Cypress
- [ ] CI/CD com GitHub Actions
- [ ] Code quality com SonarQube

### 📅 Fase 8 - Deploy e Produção (Planejado)
- [ ] Dockerfile e docker-compose
- [ ] Deploy em cloud (AWS/Heroku/DigitalOcean)
- [ ] Monitoramento com Sentry
- [ ] Logs centralizados
- [ ] Backup automatizado

---

## 🤝 Contribuindo

Contribuições são sempre bem-vindas! Siga os passos abaixo:

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

### Guidelines

- Siga o padrão de código PEP 8 (Python)
- Adicione testes para novas funcionalidades
- Atualize a documentação conforme necessário
- Commit messages em português ou inglês
- Use commits semânticos (feat:, fix:, docs:, etc.)

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

## 🙏 Agradecimentos

- **[DIO - Digital Innovation One](https://www.dio.me/)** - Pela formação em tecnologia
- **[Django](https://www.djangoproject.com/)** - Framework web robusto
- **[Django REST Framework](https://www.django-rest-framework.org/)** - Toolkit para APIs
- **[React](https://reactjs.org/)** - Biblioteca UI moderna
- **Comunidade Open Source** - Por todo o suporte e inspiração

---

## 📞 Contato

Márcio Gil - [marciopaivagil@gmail.com](mailto:marciopaivagil@gmail.com)

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/in/márcio-gil-1b7669309)
[![Portfolio](https://img.shields.io/badge/Portfolio-000000?style=for-the-badge&logo=About.me&logoColor=white)](https://marciogil.github.io/curriculum-vitae/)
[![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/MarcioGil)

Project Link: [https://github.com/MarcioGil/Sistema_Integrador_Empresarial](https://github.com/MarcioGil/Sistema_Integrador_Empresarial)

---

<div align="center">

**⭐ Se este projeto foi útil para você, considere dar uma estrela!**

**Desenvolvido com ❤️ por [Márcio Gil](https://github.com/MarcioGil)**

*Embaixador DIO Campus Expert - Turma 14*

</div>
