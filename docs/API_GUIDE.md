# 🚀 Guia Completo da API REST

**Sistema Integrador Empresarial**  
**Versão:** 1.0.0  
**Base URL:** `http://127.0.0.1:8000/api/`  
**Autor:** Márcio Gil

---

## 📑 Índice

- [1. Introdução](#1-introdução)
- [2. Autenticação](#2-autenticação)
- [3. Estrutura de Resposta](#3-estrutura-de-resposta)
- [4. Paginação](#4-paginação)
- [5. Filtros e Busca](#5-filtros-e-busca)
- [6. Endpoints por Módulo](#6-endpoints-por-módulo)
- [7. Códigos de Status HTTP](#7-códigos-de-status-http)
- [8. Tratamento de Erros](#8-tratamento-de-erros)
- [9. Rate Limiting](#9-rate-limiting)
- [10. Exemplos Práticos](#10-exemplos-práticos)

---

## 1. Introdução

### 1.1 Visão Geral

A API REST do Sistema Integrador Empresarial fornece acesso programático a todas as funcionalidades do sistema, permitindo:

✅ Gestão completa de clientes (PF/PJ)  
✅ Catálogo de produtos com categorias hierárquicas  
✅ Controle de estoque com movimentações  
✅ Processamento de pedidos e vendas  
✅ Gestão financeira (contas a receber/pagar)  
✅ Cadastro de fornecedores  
✅ Administração de usuários e departamentos  
✅ Auditoria completa de operações  

### 1.2 Características

- **RESTful**: Segue convenções REST com recursos e verbos HTTP
- **JSON**: Todas requisições e respostas em JSON
- **Stateless**: Cada requisição contém todas informações necessárias
- **HATEOAS**: Links de navegação nas respostas
- **Versionada**: Suporte a múltiplas versões (futuro)
- **Documentada**: Swagger UI e ReDoc integrados

### 1.3 URLs Base

| Ambiente | URL Base | Swagger |
|----------|----------|---------|
| **Desenvolvimento** | `http://127.0.0.1:8000/api/` | [/api/docs/](http://127.0.0.1:8000/api/docs/) |
| **Produção** | `https://api.seudominio.com/api/` | [/api/docs/](https://api.seudominio.com/api/docs/) |

---

## 2. Autenticação

### 2.1 JWT (JSON Web Token)

A API usa **JWT Bearer Token** para autenticação. O fluxo é:

```
1. Login → Recebe access_token + refresh_token
2. Requisições → Envia access_token no header Authorization
3. Token expira (60 min) → Renova com refresh_token
4. Refresh expira (7 dias) → Faz login novamente
```

### 2.2 Obter Token (Login)

**Endpoint:** `POST /api/token/`

**Request:**
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Response (200 OK):**
```json
{
  "access": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Exemplo com cURL:**
```bash
curl -X POST http://127.0.0.1:8000/api/token/ \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "admin123"}'
```

### 2.3 Usar Token nas Requisições

**Header obrigatório:**
```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Exemplo com cURL:**
```bash
curl -X GET http://127.0.0.1:8000/api/clientes/ \
  -H "Authorization: Bearer SEU_ACCESS_TOKEN"
```

**Exemplo com JavaScript (Axios):**
```javascript
import axios from 'axios';

// Configurar interceptor para adicionar token em todas requisições
axios.interceptors.request.use(config => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Fazer requisição
const response = await axios.get('http://127.0.0.1:8000/api/clientes/');
```

### 2.4 Renovar Token

**Endpoint:** `POST /api/token/refresh/`

**Request:**
```json
{
  "refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (200 OK):**
```json
{
  "access": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 2.5 Verificar Token

**Endpoint:** `POST /api/token/verify/`

**Request:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (200 OK):**
```json
{}
```

**Response (401 Unauthorized):**
```json
{
  "detail": "Token is invalid or expired",
  "code": "token_not_valid"
}
```

### 2.6 Configuração JWT

| Parâmetro | Valor | Descrição |
|-----------|-------|-----------|
| **Access Token Lifetime** | 60 minutos | Validade do token de acesso |
| **Refresh Token Lifetime** | 7 dias | Validade do token de refresh |
| **Algorithm** | HS256 | Algoritmo de assinatura |
| **Token Type** | Bearer | Tipo do header |
| **Rotate Refresh Tokens** | True | Gera novo refresh a cada renovação |
| **Blacklist After Rotation** | True | Invalida tokens antigos |

---

## 3. Estrutura de Resposta

### 3.1 Resposta de Sucesso (Lista)

```json
{
  "count": 150,
  "next": "http://127.0.0.1:8000/api/clientes/?page=2",
  "previous": null,
  "results": [
    {
      "id": 1,
      "nome": "João Silva",
      "tipo_pessoa": "PF",
      "cpf_cnpj": "12345678901",
      "email": "joao@email.com",
      "telefone": "(11) 98765-4321",
      "ativo": true
    },
    // ... mais 19 registros (20 por página)
  ]
}
```

**Campos de Paginação:**
- `count`: Total de registros
- `next`: URL da próxima página (null se última)
- `previous`: URL da página anterior (null se primeira)
- `results`: Array com os dados

### 3.2 Resposta de Sucesso (Detalhe)

```json
{
  "id": 1,
  "nome": "João Silva",
  "tipo_pessoa": "PF",
  "cpf_cnpj": "12345678901",
  "email": "joao@email.com",
  "telefone": "(11) 98765-4321",
  "celular": "(11) 91234-5678",
  "data_nascimento": "1985-05-15",
  "endereco": {
    "logradouro": "Rua das Flores",
    "numero": "123",
    "complemento": "Apt 45",
    "bairro": "Centro",
    "cidade": "São Paulo",
    "estado": "SP",
    "cep": "01234-567"
  },
  "ativo": true,
  "data_cadastro": "2025-01-15T10:30:00Z",
  "data_atualizacao": "2025-10-20T15:45:00Z"
}
```

### 3.3 Resposta de Criação

**Status:** `201 Created`

**Headers:**
```http
Location: http://127.0.0.1:8000/api/clientes/123/
```

**Body:**
```json
{
  "id": 123,
  "nome": "Maria Souza",
  // ... outros campos
}
```

### 3.4 Resposta de Atualização

**Status:** `200 OK`

**Body:** Objeto completo atualizado

### 3.5 Resposta de Deleção

**Status:** `204 No Content`

**Body:** Vazio

---

## 4. Paginação

### 4.1 Parâmetros de Paginação

| Parâmetro | Tipo | Padrão | Descrição |
|-----------|------|--------|-----------|
| `page` | integer | 1 | Número da página |
| `page_size` | integer | 20 | Itens por página (máx: 100) |

### 4.2 Exemplos

**Página 1 (padrão):**
```
GET /api/produtos/
```

**Página 2:**
```
GET /api/produtos/?page=2
```

**50 itens por página:**
```
GET /api/produtos/?page_size=50
```

**Navegação:**
```json
{
  "count": 1000,
  "next": "http://127.0.0.1:8000/api/produtos/?page=3",
  "previous": "http://127.0.0.1:8000/api/produtos/?page=1",
  "results": [...]
}
```

---

## 5. Filtros e Busca

### 5.1 Filtros Exatos

**Sintaxe:** `?campo=valor`

**Exemplos:**

```bash
# Clientes ativos
GET /api/clientes/?ativo=true

# Produtos de uma categoria
GET /api/produtos/?categoria=5

# Pedidos confirmados
GET /api/pedidos/?status=confirmado

# Múltiplos filtros
GET /api/produtos/?categoria=5&ativo=true
```

### 5.2 Busca Full-Text

**Sintaxe:** `?search=termo`

**Campos pesquisados por endpoint:**

| Endpoint | Campos de Busca |
|----------|----------------|
| `/api/clientes/` | nome, cpf_cnpj, email, telefone |
| `/api/produtos/` | nome, descricao, codigo_sku |
| `/api/fornecedores/` | razao_social, cnpj, contato_nome, email |
| `/api/usuarios/` | username, nome_completo, email |

**Exemplos:**

```bash
# Buscar cliente por nome ou CPF
GET /api/clientes/?search=João

# Buscar produto por nome ou SKU
GET /api/produtos/?search=notebook

# Buscar em qualquer campo
GET /api/fornecedores/?search=tech
```

### 5.3 Ordenação

**Sintaxe:** `?ordering=campo` ou `?ordering=-campo` (descendente)

**Exemplos:**

```bash
# Produtos mais caros primeiro
GET /api/produtos/?ordering=-preco_venda

# Clientes por nome (A-Z)
GET /api/clientes/?ordering=nome

# Pedidos mais recentes
GET /api/pedidos/?ordering=-data_pedido

# Múltiplos campos
GET /api/produtos/?ordering=categoria,nome
```

### 5.4 Filtros Avançados (por endpoint)

#### Clientes
```bash
?tipo_pessoa=PF           # Pessoa Física ou Jurídica
?ativo=true               # Ativos ou inativos
?cidade=São Paulo         # Por cidade
?estado=SP                # Por estado
```

#### Produtos
```bash
?categoria=5              # Por categoria
?ativo=true               # Ativos
?preco_venda__gte=100     # Preço >= 100
?preco_venda__lte=500     # Preço <= 500
```

#### Estoque
```bash
?produto=10               # Por produto
?quantidade__lt=10        # Estoque baixo
```

#### Pedidos
```bash
?status=confirmado        # Por status
?cliente=5                # Por cliente
?vendedor=2               # Por vendedor
?data_pedido__gte=2025-01-01  # Após data
?data_pedido__lte=2025-12-31  # Antes de data
```

#### Contas a Receber
```bash
?status=pendente          # Por status
?cliente=5                # Por cliente
?vencimento__lt=2025-11-01  # Vencidas
```

#### Contas a Pagar
```bash
?status=pendente          # Por status
?fornecedor=3             # Por fornecedor
?categoria_despesa=compras  # Por categoria
```

### 5.5 Combinação de Filtros

```bash
# Produtos ativos, categoria Notebooks, preço entre 2000-5000, ordenados por preço
GET /api/produtos/?ativo=true&categoria=5&preco_venda__gte=2000&preco_venda__lte=5000&ordering=preco_venda

# Pedidos confirmados de um cliente, últimos 30 dias
GET /api/pedidos/?status=confirmado&cliente=10&data_pedido__gte=2025-10-01

# Contas a receber vencidas de um cliente específico
GET /api/contas-receber/?status=pendente&cliente=5&vencimento__lt=2025-11-01
```

---

## 6. Endpoints por Módulo

### 6.1 Clientes

**Base:** `/api/clientes/`

| Método | Endpoint | Descrição | Permissão |
|--------|----------|-----------|-----------|
| GET | `/clientes/` | Listar clientes | Autenticado |
| POST | `/clientes/` | Criar cliente | Autenticado |
| GET | `/clientes/{id}/` | Detalhar cliente | Autenticado |
| PUT | `/clientes/{id}/` | Atualizar cliente (completo) | Autenticado |
| PATCH | `/clientes/{id}/` | Atualizar cliente (parcial) | Autenticado |
| DELETE | `/clientes/{id}/` | Deletar cliente | Admin/Gerente |

**Exemplo de Criação (PF):**
```json
POST /api/clientes/
{
  "nome": "João Silva",
  "tipo_pessoa": "PF",
  "cpf_cnpj": "12345678901",
  "email": "joao@email.com",
  "telefone": "(11) 98765-4321",
  "data_nascimento": "1985-05-15",
  "logradouro": "Rua das Flores",
  "numero": "123",
  "bairro": "Centro",
  "cidade": "São Paulo",
  "estado": "SP",
  "cep": "01234567"
}
```

**Exemplo de Criação (PJ):**
```json
POST /api/clientes/
{
  "razao_social": "Tech Solutions LTDA",
  "nome_fantasia": "TechSol",
  "tipo_pessoa": "PJ",
  "cpf_cnpj": "12345678000190",
  "inscricao_estadual": "123456789",
  "email": "contato@techsol.com.br",
  "telefone": "(11) 3456-7890",
  "logradouro": "Av. Paulista",
  "numero": "1000",
  "bairro": "Bela Vista",
  "cidade": "São Paulo",
  "estado": "SP",
  "cep": "01310100"
}
```

### 6.2 Produtos

**Base:** `/api/produtos/`, `/api/categorias/`

| Método | Endpoint | Descrição | Permissão |
|--------|----------|-----------|-----------|
| GET | `/categorias/` | Listar categorias | Autenticado |
| POST | `/categorias/` | Criar categoria | Autenticado |
| GET | `/produtos/` | Listar produtos | Autenticado |
| POST | `/produtos/` | Criar produto | Autenticado |
| GET | `/produtos/{id}/` | Detalhar produto | Autenticado |
| PUT/PATCH | `/produtos/{id}/` | Atualizar produto | Autenticado |
| DELETE | `/produtos/{id}/` | Deletar produto | Admin/Gerente |

**Exemplo - Criar Categoria:**
```json
POST /api/categorias/
{
  "nome": "Eletrônicos",
  "descricao": "Produtos eletrônicos em geral",
  "pai": null
}
```

**Exemplo - Criar Subcategoria:**
```json
POST /api/categorias/
{
  "nome": "Notebooks",
  "descricao": "Notebooks e laptops",
  "pai": 1
}
```

**Exemplo - Criar Produto:**
```json
POST /api/produtos/
{
  "codigo_sku": "NB-001",
  "nome": "Notebook Dell Inspiron 15",
  "descricao": "Notebook Dell com Intel i5, 8GB RAM, 256GB SSD",
  "categoria": 2,
  "preco_custo": 2500.00,
  "preco_venda": 3500.00,
  "codigo_barras": "7891234567890",
  "unidade_medida": "UN",
  "peso": 1.8,
  "ativo": true
}
```

### 6.3 Estoque

**Base:** `/api/estoques/`, `/api/movimentacoes/`

| Método | Endpoint | Descrição | Permissão |
|--------|----------|-----------|-----------|
| GET | `/estoques/` | Listar estoque | Autenticado |
| POST | `/estoques/` | Criar registro estoque | Autenticado |
| GET | `/estoques/necessita_reposicao/` | Produtos com estoque baixo | Autenticado |
| GET | `/movimentacoes/` | Listar movimentações | Autenticado |
| POST | `/movimentacoes/` | Criar movimentação | Autenticado |

**Exemplo - Criar Estoque:**
```json
POST /api/estoques/
{
  "produto": 1,
  "quantidade": 50,
  "quantidade_minima": 10,
  "quantidade_maxima": 100,
  "localizacao": "A-01-05"
}
```

**Exemplo - Movimentação Entrada:**
```json
POST /api/movimentacoes/
{
  "produto": 1,
  "tipo_movimentacao": "entrada",
  "quantidade": 20,
  "motivo": "Compra de fornecedor",
  "observacao": "Nota fiscal 12345"
}
```

**Exemplo - Movimentação Saída:**
```json
POST /api/movimentacoes/
{
  "produto": 1,
  "tipo_movimentacao": "saida",
  "quantidade": 5,
  "motivo": "Venda",
  "observacao": "Pedido #789"
}
```

**Resposta - Produtos com Estoque Baixo:**
```json
GET /api/estoques/necessita_reposicao/
{
  "count": 5,
  "results": [
    {
      "id": 1,
      "produto": {
        "id": 1,
        "codigo_sku": "NB-001",
        "nome": "Notebook Dell Inspiron 15"
      },
      "quantidade": 8,
      "quantidade_minima": 10,
      "status": "baixo",
      "alerta": "Estoque abaixo do mínimo"
    }
  ]
}
```

### 6.4 Pedidos e Vendas

**Base:** `/api/pedidos/`, `/api/itens-pedido/`

| Método | Endpoint | Descrição | Permissão |
|--------|----------|-----------|-----------|
| GET | `/pedidos/` | Listar pedidos | Autenticado |
| POST | `/pedidos/` | Criar pedido | Autenticado |
| GET | `/pedidos/{id}/` | Detalhar pedido | Autenticado |
| PUT/PATCH | `/pedidos/{id}/` | Atualizar pedido | Autenticado |
| POST | `/pedidos/{id}/confirmar/` | Confirmar pedido | Autenticado |
| POST | `/pedidos/{id}/cancelar/` | Cancelar pedido | Admin/Gerente |
| GET | `/itens-pedido/` | Listar itens | Autenticado |

**Exemplo - Criar Pedido com Itens:**
```json
POST /api/pedidos/
{
  "cliente": 1,
  "forma_pagamento": "cartao_credito",
  "observacao": "Entrega urgente",
  "endereco_entrega": {
    "logradouro": "Rua das Flores",
    "numero": "123",
    "bairro": "Centro",
    "cidade": "São Paulo",
    "estado": "SP",
    "cep": "01234567"
  },
  "itens": [
    {
      "produto": 1,
      "quantidade": 2,
      "preco_unitario": 3500.00,
      "desconto": 100.00
    },
    {
      "produto": 5,
      "quantidade": 1,
      "preco_unitario": 1500.00,
      "desconto": 0.00
    }
  ]
}
```

**Resposta:**
```json
{
  "id": 10,
  "numero_pedido": "PED-000010",
  "cliente": {
    "id": 1,
    "nome": "João Silva"
  },
  "vendedor": {
    "id": 2,
    "nome_completo": "Maria Vendedora"
  },
  "status": "pendente",
  "data_pedido": "2025-11-01T14:30:00Z",
  "subtotal": 8400.00,
  "desconto": 100.00,
  "frete": 50.00,
  "total": 8350.00,
  "forma_pagamento": "cartao_credito",
  "itens": [
    {
      "id": 15,
      "produto": {
        "id": 1,
        "codigo_sku": "NB-001",
        "nome": "Notebook Dell Inspiron 15"
      },
      "quantidade": 2,
      "preco_unitario": 3500.00,
      "desconto": 100.00,
      "subtotal": 6900.00
    },
    {
      "id": 16,
      "produto": {
        "id": 5,
        "codigo_sku": "MS-010",
        "nome": "Mouse Logitech MX Master"
      },
      "quantidade": 1,
      "preco_unitario": 1500.00,
      "desconto": 0.00,
      "subtotal": 1500.00
    }
  ]
}
```

**Exemplo - Confirmar Pedido:**
```json
POST /api/pedidos/10/confirmar/
{}

# Resposta:
{
  "status": "Pedido confirmado",
  "pedido": {
    "id": 10,
    "numero_pedido": "PED-000010",
    "status": "confirmado",
    "data_confirmacao": "2025-11-01T15:00:00Z"
  }
}
```

### 6.5 Financeiro

**Base:** `/api/faturas/`, `/api/contas-receber/`, `/api/contas-pagar/`

| Método | Endpoint | Descrição | Permissão |
|--------|----------|-----------|-----------|
| GET | `/faturas/` | Listar faturas | Autenticado |
| GET | `/faturas/atrasadas/` | Faturas atrasadas | Autenticado |
| GET | `/contas-receber/` | Listar contas a receber | Autenticado |
| POST | `/contas-receber/` | Criar conta a receber | Autenticado |
| POST | `/contas-receber/{id}/receber/` | Receber conta | Admin/Gerente |
| GET | `/contas-pagar/` | Listar contas a pagar | Autenticado |
| POST | `/contas-pagar/` | Criar conta a pagar | Autenticado |
| POST | `/contas-pagar/{id}/pagar/` | Pagar conta | Admin/Gerente |

**Exemplo - Criar Conta a Receber:**
```json
POST /api/contas-receber/
{
  "cliente": 1,
  "fatura": 5,
  "numero_documento": "DUP-12345",
  "valor": 3500.00,
  "vencimento": "2025-12-01",
  "descricao": "Pagamento pedido #10 - 1ª parcela"
}
```

**Exemplo - Receber Conta:**
```json
POST /api/contas-receber/15/receber/
{
  "valor_pago": 3500.00,
  "data_pagamento": "2025-11-28",
  "forma_pagamento": "pix",
  "observacao": "Pagamento via PIX"
}

# Resposta:
{
  "status": "Conta recebida com sucesso",
  "conta": {
    "id": 15,
    "numero_documento": "DUP-12345",
    "valor": 3500.00,
    "valor_pago": 3500.00,
    "data_pagamento": "2025-11-28",
    "status": "recebido"
  }
}
```

**Exemplo - Criar Conta a Pagar:**
```json
POST /api/contas-pagar/
{
  "fornecedor": 3,
  "numero_documento": "NF-67890",
  "valor": 15000.00,
  "vencimento": "2025-12-15",
  "categoria_despesa": "compras",
  "descricao": "Compra de mercadorias"
}
```

### 6.6 Fornecedores

**Base:** `/api/fornecedores/`

| Método | Endpoint | Descrição | Permissão |
|--------|----------|-----------|-----------|
| GET | `/fornecedores/` | Listar fornecedores | Autenticado |
| POST | `/fornecedores/` | Criar fornecedor | Autenticado |
| GET | `/fornecedores/{id}/` | Detalhar fornecedor | Autenticado |
| PUT/PATCH | `/fornecedores/{id}/` | Atualizar fornecedor | Autenticado |
| DELETE | `/fornecedores/{id}/` | Deletar fornecedor | Admin/Gerente |

**Exemplo - Criar Fornecedor:**
```json
POST /api/fornecedores/
{
  "razao_social": "TechSupply Distribuidora LTDA",
  "nome_fantasia": "TechSupply",
  "cnpj": "12345678000190",
  "inscricao_estadual": "123456789",
  "email": "contato@techsupply.com.br",
  "telefone": "(11) 3456-7890",
  "contato_nome": "Carlos Souza",
  "contato_cargo": "Gerente Comercial",
  "contato_telefone": "(11) 98765-4321",
  "logradouro": "Rua da Indústria",
  "numero": "500",
  "bairro": "Distrito Industrial",
  "cidade": "São Paulo",
  "estado": "SP",
  "cep": "01234567",
  "banco": "001",
  "agencia": "1234",
  "conta": "56789-0",
  "tipo_conta": "corrente",
  "categoria": "eletronicos",
  "avaliacao": 4.5,
  "ativo": true
}
```

### 6.7 Usuários

**Base:** `/api/usuarios/`, `/api/departamentos/`

| Método | Endpoint | Descrição | Permissão |
|--------|----------|-----------|-----------|
| GET | `/usuarios/` | Listar usuários | Autenticado |
| POST | `/usuarios/` | Criar usuário | Admin |
| GET | `/usuarios/me/` | Dados do usuário logado | Autenticado |
| GET | `/usuarios/{id}/` | Detalhar usuário | Autenticado |
| POST | `/usuarios/{id}/alterar_senha/` | Alterar senha | Próprio usuário ou Admin |
| GET | `/departamentos/` | Listar departamentos | Autenticado |
| POST | `/departamentos/` | Criar departamento | Admin |

**Exemplo - Criar Usuário:**
```json
POST /api/usuarios/
{
  "username": "maria.vendas",
  "email": "maria@empresa.com.br",
  "nome_completo": "Maria Santos Vendedora",
  "cpf": "12345678901",
  "telefone": "(11) 98765-4321",
  "tipo": "vendedor",
  "departamento": 2,
  "password": "SenhaSegura@123",
  "password_confirm": "SenhaSegura@123",
  "is_active": true
}
```

**Exemplo - Alterar Senha:**
```json
POST /api/usuarios/5/alterar_senha/
{
  "old_password": "SenhaAntiga@123",
  "new_password": "NovaSenha@456",
  "new_password_confirm": "NovaSenha@456"
}

# Resposta:
{
  "detail": "Senha alterada com sucesso"
}
```

**Exemplo - Obter Dados do Usuário Logado:**
```json
GET /api/usuarios/me/

# Resposta:
{
  "id": 5,
  "username": "maria.vendas",
  "email": "maria@empresa.com.br",
  "nome_completo": "Maria Santos Vendedora",
  "tipo": "vendedor",
  "departamento": {
    "id": 2,
    "nome": "Vendas",
    "descricao": "Departamento de vendas"
  },
  "is_active": true,
  "date_joined": "2025-01-15T10:00:00Z"
}
```

### 6.8 Auditoria

**Base:** `/api/logs/`

| Método | Endpoint | Descrição | Permissão |
|--------|----------|-----------|-----------|
| GET | `/logs/` | Listar logs de auditoria | Admin |
| GET | `/logs/{id}/` | Detalhar log | Admin |

**Exemplo - Listar Logs:**
```json
GET /api/logs/?model_name=Produto&action=UPDATE

# Resposta:
{
  "count": 25,
  "results": [
    {
      "id": 100,
      "model_name": "Produto",
      "object_id": "1",
      "action": "UPDATE",
      "user": {
        "id": 2,
        "username": "admin"
      },
      "timestamp": "2025-11-01T14:30:00Z",
      "ip_address": "192.168.1.100",
      "user_agent": "Mozilla/5.0...",
      "changes": {
        "preco_venda": {
          "old": "3500.00",
          "new": "3200.00"
        }
      }
    }
  ]
}
```

---

## 7. Códigos de Status HTTP

| Código | Nome | Descrição | Exemplo de Uso |
|--------|------|-----------|----------------|
| **200** | OK | Requisição bem-sucedida | GET, PUT, PATCH |
| **201** | Created | Recurso criado com sucesso | POST |
| **204** | No Content | Sucesso sem corpo na resposta | DELETE |
| **400** | Bad Request | Dados inválidos | Validação falhou |
| **401** | Unauthorized | Não autenticado | Token inválido/ausente |
| **403** | Forbidden | Sem permissão | Usuário não é admin |
| **404** | Not Found | Recurso não encontrado | ID inexistente |
| **405** | Method Not Allowed | Método HTTP não permitido | POST em endpoint read-only |
| **409** | Conflict | Conflito de estado | CPF duplicado |
| **500** | Internal Server Error | Erro no servidor | Bug no código |

---

## 8. Tratamento de Erros

### 8.1 Formato Padrão de Erro

```json
{
  "detail": "Mensagem de erro legível",
  "code": "codigo_erro",
  "field_errors": {
    "campo": ["Erro específico do campo"]
  }
}
```

### 8.2 Exemplos de Erros

#### 400 Bad Request - Validação

```json
{
  "cpf_cnpj": ["CPF deve ter 11 dígitos"],
  "email": ["Digite um endereço de email válido"],
  "preco_venda": ["Preço de venda deve ser maior que preço de custo"]
}
```

#### 401 Unauthorized

```json
{
  "detail": "Token is invalid or expired",
  "code": "token_not_valid"
}
```

#### 403 Forbidden

```json
{
  "detail": "Você não tem permissão para executar essa ação."
}
```

#### 404 Not Found

```json
{
  "detail": "Não encontrado."
}
```

#### 409 Conflict

```json
{
  "detail": "Cliente com este CPF/CNPJ já existe",
  "code": "unique_constraint"
}
```

---

## 9. Rate Limiting

### 9.1 Limites (Planejado)

| Tipo de Usuário | Requisições/Hora | Burst |
|-----------------|------------------|-------|
| **Não Autenticado** | 100 | 10 |
| **Autenticado** | 1000 | 50 |
| **Admin** | 5000 | 100 |

### 9.2 Headers de Rate Limit

```http
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 995
X-RateLimit-Reset: 1635724800
```

### 9.3 Resposta de Rate Limit Excedido

**Status:** `429 Too Many Requests`

```json
{
  "detail": "Rate limit exceeded. Try again in 3600 seconds.",
  "available_in": 3600
}
```

---

## 10. Exemplos Práticos

### 10.1 Fluxo Completo: Criar Pedido

```javascript
// 1. Login
const loginResponse = await axios.post('http://127.0.0.1:8000/api/token/', {
  username: 'admin',
  password: 'admin123'
});
const token = loginResponse.data.access;

// 2. Configurar axios com token
axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

// 3. Buscar cliente
const clientes = await axios.get('http://127.0.0.1:8000/api/clientes/?search=João');
const cliente = clientes.data.results[0];

// 4. Buscar produtos
const produtos = await axios.get('http://127.0.0.1:8000/api/produtos/?search=notebook');
const produto = produtos.data.results[0];

// 5. Criar pedido
const pedido = await axios.post('http://127.0.0.1:8000/api/pedidos/', {
  cliente: cliente.id,
  forma_pagamento: 'cartao_credito',
  itens: [
    {
      produto: produto.id,
      quantidade: 1,
      preco_unitario: produto.preco_venda,
      desconto: 0
    }
  ]
});

console.log('Pedido criado:', pedido.data.numero_pedido);

// 6. Confirmar pedido
await axios.post(`http://127.0.0.1:8000/api/pedidos/${pedido.data.id}/confirmar/`);

console.log('Pedido confirmado!');
```

### 10.2 Fluxo: Relatório de Contas Atrasadas

```python
import requests
from datetime import date

# 1. Login
response = requests.post('http://127.0.0.1:8000/api/token/', json={
    'username': 'admin',
    'password': 'admin123'
})
token = response.json()['access']

# 2. Headers
headers = {'Authorization': f'Bearer {token}'}

# 3. Buscar contas a receber vencidas
hoje = date.today().isoformat()
response = requests.get(
    'http://127.0.0.1:8000/api/contas-receber/',
    headers=headers,
    params={
        'status': 'pendente',
        'vencimento__lt': hoje,
        'ordering': 'vencimento'
    }
)

contas_atrasadas = response.json()['results']

# 4. Calcular total
total_atrasado = sum(float(conta['valor']) for conta in contas_atrasadas)

print(f"Total de contas atrasadas: {len(contas_atrasadas)}")
print(f"Valor total atrasado: R$ {total_atrasado:,.2f}")

# 5. Listar por cliente
for conta in contas_atrasadas:
    print(f"Cliente: {conta['cliente']['nome']}")
    print(f"Documento: {conta['numero_documento']}")
    print(f"Valor: R$ {conta['valor']}")
    print(f"Vencimento: {conta['vencimento']}")
    print(f"Dias de atraso: {conta['dias_vencido']}")
    print("---")
```

### 10.3 Fluxo: Atualização de Preços em Lote

```python
import requests

# 1. Login
response = requests.post('http://127.0.0.1:8000/api/token/', json={
    'username': 'admin',
    'password': 'admin123'
})
token = response.json()['access']
headers = {'Authorization': f'Bearer {token}'}

# 2. Buscar produtos de uma categoria
response = requests.get(
    'http://127.0.0.1:8000/api/produtos/',
    headers=headers,
    params={'categoria': 5, 'page_size': 100}
)
produtos = response.json()['results']

# 3. Aplicar reajuste de 10%
for produto in produtos:
    novo_preco = float(produto['preco_venda']) * 1.10
    
    response = requests.patch(
        f"http://127.0.0.1:8000/api/produtos/{produto['id']}/",
        headers=headers,
        json={'preco_venda': round(novo_preco, 2)}
    )
    
    if response.status_code == 200:
        print(f"✅ {produto['nome']}: R$ {produto['preco_venda']} → R$ {novo_preco:.2f}")
    else:
        print(f"❌ Erro ao atualizar {produto['nome']}: {response.json()}")
```

---

## 📚 Recursos Adicionais

### Documentação Interativa

- **Swagger UI:** http://127.0.0.1:8000/api/docs/
  - Interface interativa para testar endpoints
  - Autenticação integrada
  - Exemplos de request/response

- **ReDoc:** http://127.0.0.1:8000/api/redoc/
  - Documentação limpa e organizada
  - Busca integrada
  - Download do schema OpenAPI

### Coleções Postman/Insomnia

Importe o schema OpenAPI:
```
http://127.0.0.1:8000/api/schema/?format=json
```

### Arquivo de Testes HTTP

Use o arquivo `backend/API_TESTS.http` com a extensão REST Client do VS Code.

---

## 🆘 Suporte

**Problemas ou dúvidas?**

- 📧 Email: marciopaivagil@gmail.com
- 💻 GitHub Issues: https://github.com/MarcioGil/Sistema_Integrador_Empresarial/issues
- 🔗 LinkedIn: https://linkedin.com/in/márcio-gil-1b7669309

---

<div align="center">

**🚀 API REST Profissional e Completa**

*Desenvolvido por Márcio Gil - DIO Campus Expert Turma 14*

</div>
