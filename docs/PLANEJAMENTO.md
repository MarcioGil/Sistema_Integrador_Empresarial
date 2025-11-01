# 🧱 ETAPA 1 — Planejamento e Modelagem
**Sistema Integrador Empresarial**

## 📊 1. Setores da Empresa

### 1.1 Vendas
- Gerenciamento de pedidos
- Acompanhamento de vendedores
- Metas e comissões
- Pipeline de vendas

### 1.2 Financeiro
- Contas a pagar e receber
- Fluxo de caixa
- Conciliação bancária
- Relatórios financeiros

### 1.3 Estoque
- Controle de produtos
- Movimentações de entrada/saída
- Inventário
- Pontos de reposição

### 1.4 Clientes (CRM)
- Cadastro de clientes
- Histórico de interações
- Segmentação
- Fidelização

### 1.5 Recursos Humanos
- Cadastro de funcionários
- Departamentos
- Controle de permissões

### 1.6 Compras
- Fornecedores
- Ordens de compra
- Cotações

---

## 🗂️ 2. Entidades Principais

### 2.1 **Cliente**
- `id` (PK)
- `nome_completo`
- `cpf_cnpj` (único)
- `email`
- `telefone`
- `endereco`
- `cidade`
- `estado`
- `cep`
- `tipo` (PF/PJ)
- `status` (ativo/inativo)
- `data_cadastro`
- `observacoes`

### 2.2 **Produto**
- `id` (PK)
- `codigo` (único)
- `nome`
- `descricao`
- `categoria_id` (FK)
- `preco_custo`
- `preco_venda`
- `margem_lucro`
- `unidade_medida`
- `peso`
- `dimensoes`
- `status` (ativo/inativo)
- `data_cadastro`

### 2.3 **Categoria**
- `id` (PK)
- `nome`
- `descricao`
- `categoria_pai_id` (FK - para subcategorias)

### 2.4 **Estoque**
- `id` (PK)
- `produto_id` (FK)
- `quantidade_atual`
- `quantidade_minima`
- `quantidade_maxima`
- `localizacao`
- `ultima_atualizacao`

### 2.5 **Movimentacao_Estoque**
- `id` (PK)
- `produto_id` (FK)
- `tipo` (entrada/saída)
- `quantidade`
- `motivo` (venda, compra, ajuste, devolução)
- `usuario_id` (FK)
- `data_movimentacao`
- `observacoes`

### 2.6 **Pedido (Venda)**
- `id` (PK)
- `numero_pedido` (único)
- `cliente_id` (FK)
- `vendedor_id` (FK)
- `data_pedido`
- `data_entrega_prevista`
- `data_entrega_realizada`
- `status` (pendente, confirmado, em_separacao, enviado, entregue, cancelado)
- `valor_subtotal`
- `valor_desconto`
- `valor_frete`
- `valor_total`
- `forma_pagamento`
- `observacoes`

### 2.7 **Item_Pedido**
- `id` (PK)
- `pedido_id` (FK)
- `produto_id` (FK)
- `quantidade`
- `preco_unitario`
- `desconto`
- `valor_total`

### 2.8 **Fatura**
- `id` (PK)
- `pedido_id` (FK)
- `numero_fatura` (único)
- `data_emissao`
- `data_vencimento`
- `data_pagamento`
- `valor_total`
- `valor_pago`
- `status` (pendente, pago, atrasado, cancelado)
- `forma_pagamento`
- `observacoes`

### 2.9 **Conta_Receber**
- `id` (PK)
- `fatura_id` (FK)
- `cliente_id` (FK)
- `descricao`
- `valor`
- `data_vencimento`
- `data_recebimento`
- `status` (aberto, recebido, atrasado)

### 2.10 **Conta_Pagar**
- `id` (PK)
- `fornecedor_id` (FK)
- `descricao`
- `valor`
- `data_vencimento`
- `data_pagamento`
- `status` (aberto, pago, atrasado)
- `categoria` (fornecedor, salário, aluguel, etc)

### 2.11 **Fornecedor**
- `id` (PK)
- `nome`
- `cnpj`
- `email`
- `telefone`
- `endereco`
- `status` (ativo/inativo)
- `data_cadastro`

### 2.12 **Usuario (Funcionário)**
- `id` (PK)
- `username` (único)
- `email` (único)
- `senha_hash`
- `nome_completo`
- `departamento_id` (FK)
- `cargo`
- `telefone`
- `data_admissao`
- `status` (ativo/inativo)
- `is_superuser`
- `ultimo_login`

### 2.13 **Departamento**
- `id` (PK)
- `nome`
- `descricao`
- `responsavel_id` (FK - Usuario)

### 2.14 **Log_Auditoria**
- `id` (PK)
- `usuario_id` (FK)
- `acao` (criar, editar, excluir, visualizar)
- `tabela`
- `registro_id`
- `dados_anteriores` (JSON)
- `dados_novos` (JSON)
- `ip_address`
- `data_hora`

---

## 🔗 3. Relacionamentos (Diagrama ER)

```
┌─────────────┐       ┌──────────────┐       ┌─────────────┐
│   Cliente   │───────│    Pedido    │───────│   Vendedor  │
│             │ 1:N   │              │ N:1   │  (Usuario)  │
└─────────────┘       └──────────────┘       └─────────────┘
                             │
                             │ 1:N
                             ▼
                      ┌──────────────┐
                      │ Item_Pedido  │
                      └──────────────┘
                             │ N:1
                             ▼
                      ┌──────────────┐       ┌─────────────┐
                      │   Produto    │───────│  Categoria  │
                      └──────────────┘ N:1   └─────────────┘
                             │
                             │ 1:1
                             ▼
                      ┌──────────────┐
                      │   Estoque    │
                      └──────────────┘
                             │
                             │ 1:N
                             ▼
                 ┌─────────────────────────┐
                 │ Movimentacao_Estoque    │
                 └─────────────────────────┘

┌──────────────┐       ┌─────────────┐
│    Pedido    │───────│   Fatura    │
└──────────────┘ 1:1   └─────────────┘
                             │
                             │ 1:N
                             ▼
                      ┌──────────────┐
                      │Conta_Receber │
                      └──────────────┘

┌──────────────┐       ┌─────────────┐
│  Fornecedor  │───────│Conta_Pagar  │
└──────────────┘ 1:N   └─────────────┘

┌──────────────┐       ┌─────────────┐
│   Usuario    │───────│Departamento │
└──────────────┘ N:1   └─────────────┘
```

---

## 📦 4. Descrição dos Módulos

### 4.1 **Módulo de Clientes (CRM)**
**Objetivo:** Centralizar todas as informações dos clientes, histórico de compras e interações.

**Funcionalidades:**
- Cadastro completo de clientes (PF e PJ)
- Histórico de pedidos e compras
- Segmentação por categorias
- Análise de clientes mais rentáveis
- Status de cliente (ativo, inativo, inadimplente)

### 4.2 **Módulo de Vendas**
**Objetivo:** Gerenciar todo o processo de vendas desde o pedido até a entrega.

**Funcionalidades:**
- Criação e gerenciamento de pedidos
- Acompanhamento de status do pedido
- Cálculo automático de totais, descontos e frete
- Vinculação com estoque (baixa automática)
- Relatórios de vendas por período, vendedor, produto
- Dashboard com metas e performance

### 4.3 **Módulo de Estoque**
**Objetivo:** Controlar entrada, saída e níveis de produtos.

**Funcionalidades:**
- Controle de quantidade em tempo real
- Alertas de estoque mínimo
- Histórico completo de movimentações
- Inventário e ajustes de estoque
- Relatórios de giro de estoque
- Integração automática com vendas e compras

### 4.4 **Módulo Financeiro**
**Objetivo:** Gerenciar fluxo de caixa, contas a pagar e receber.

**Funcionalidades:**
- Contas a receber (geradas automaticamente pelos pedidos)
- Contas a pagar (fornecedores, despesas operacionais)
- Dashboard de fluxo de caixa
- Relatórios de inadimplência
- Previsões financeiras
- Conciliação bancária

### 4.5 **Módulo de Produtos**
**Objetivo:** Cadastrar e gerenciar catálogo de produtos.

**Funcionalidades:**
- Cadastro completo de produtos
- Categorização hierárquica
- Controle de preços (custo, venda, margem)
- Fotos e descrições detalhadas
- Produtos ativos/inativos
- Variações de produtos (tamanho, cor, etc)

### 4.6 **Módulo de Fornecedores**
**Objetivo:** Gerenciar relacionamento com fornecedores.

**Funcionalidades:**
- Cadastro de fornecedores
- Histórico de compras
- Avaliação de fornecedores
- Cotações e comparativos
- Controle de pagamentos

### 4.7 **Módulo de Usuários e Permissões**
**Objetivo:** Controlar acesso e segurança do sistema.

**Funcionalidades:**
- Cadastro de usuários por departamento
- Grupos de permissões (Vendas, Financeiro, Gerência, Admin)
- Controle de acesso por funcionalidade
- Logs de auditoria (quem fez o quê)
- Autenticação JWT com refresh token

### 4.8 **Módulo de Relatórios**
**Objetivo:** Fornecer insights e análises de negócio.

**Funcionalidades:**
- Dashboard executivo com KPIs
- Relatórios de vendas (período, produto, vendedor)
- Relatórios financeiros (DRE simplificado, fluxo de caixa)
- Relatórios de estoque (giro, ruptura)
- Gráficos interativos
- Exportação em PDF e Excel

---

## 🎯 5. Regras de Negócio

### 5.1 Vendas
- Um pedido só pode ser confirmado se houver estoque disponível
- Desconto máximo por vendedor (configurável por perfil)
- Pedidos acima de R$ 10.000 requerem aprovação de gerente
- Após confirmação do pedido, gera-se automaticamente uma fatura

### 5.2 Estoque
- Baixa automática ao confirmar pedido
- Não permitir estoque negativo (opcional)
- Alerta quando estoque atingir quantidade mínima
- Movimentações devem ser rastreáveis (quem, quando, por quê)

### 5.3 Financeiro
- Fatura gerada automaticamente após pedido confirmado
- Status muda automaticamente baseado em datas de vencimento
- Não permitir exclusão de faturas pagas (apenas cancelamento)
- Relatório de inadimplência atualizado diariamente

### 5.4 Segurança
- Senhas devem ser hasheadas (bcrypt/pbkdf2)
- Token JWT expira em 1 hora (refresh token em 7 dias)
- Tentativas de login limitadas (3 tentativas)
- Logs de auditoria para todas as operações críticas

---

## 📐 6. Stack Tecnológico

### Back-end
- **Python 3.11+**
- **Django 5.0**
- **Django Rest Framework (DRF)**
- **PostgreSQL 15**
- **SimpleJWT** (autenticação)
- **Django CORS Headers**
- **Celery** (tarefas assíncronas - opcional)

### Front-end
- **React 18**
- **React Router v6**
- **Tailwind CSS**
- **Axios**
- **Recharts** (gráficos)
- **React Hook Form** (formulários)
- **Context API / Zustand** (gerenciamento de estado)

### DevOps
- **Git / GitHub**
- **Railway** (back-end)
- **Vercel** (front-end)
- **GitHub Actions** (CI/CD)

### Ferramentas de Desenvolvimento
- **VS Code**
- **Postman** (testes de API)
- **DBeaver** (gerenciamento do banco)
- **Draw.io** (diagramas)

---

## 📅 7. Cronograma Estimado

| Etapa | Descrição | Tempo Estimado |
|-------|-----------|----------------|
| 1 | Planejamento e Modelagem | ✅ Concluído |
| 2 | Configuração do Ambiente | 1-2 dias |
| 3 | Back-end e Banco de Dados | 7-10 dias |
| 4 | Front-end (Interface Web) | 7-10 dias |
| 5 | Relatórios e Gráficos | 3-5 dias |
| 6 | Implantação | 2-3 dias |
| 7 | Segurança e Permissões | 2-3 dias |
| 8 | Documentação e Portfólio | 2-3 dias |

**Total estimado:** 24-36 dias de desenvolvimento

---

## ✅ Próximos Passos

1. **Revisar este planejamento** e ajustar conforme necessário
2. **Criar diagrama visual** no Draw.io (opcional)
3. **Iniciar ETAPA 2:** Configuração do ambiente
4. **Configurar o repositório Git** com estrutura inicial

---

**Data:** 01/11/2025
**Versão:** 1.0
