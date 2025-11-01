# 📝 Tarefas do Projeto - Sistema Integrador Empresarial

## ✅ ETAPA 1 - Planejamento e Modelagem (CONCLUÍDA)

- [x] Listar setores da empresa
- [x] Definir entidades principais
- [x] Criar diagrama ER
- [x] Escrever descrição dos módulos
- [x] Definir stack tecnológico
- [x] Estabelecer regras de negócio

---

## 📋 ETAPA 2 - Configuração do Ambiente

### Back-end
- [ ] Instalar Python 3.11+
- [ ] Criar ambiente virtual (venv)
- [ ] Instalar Django e dependências
- [ ] Criar projeto Django `config`
- [ ] Configurar PostgreSQL
- [ ] Conectar Django ao PostgreSQL
- [ ] Criar estrutura de apps
- [ ] Configurar variáveis de ambiente (.env)
- [ ] Criar .gitignore
- [ ] Fazer primeiro commit

### Front-end
- [ ] Instalar Node.js e npm
- [ ] Criar projeto React
- [ ] Instalar Tailwind CSS
- [ ] Instalar dependências (axios, react-router, recharts)
- [ ] Configurar estrutura de pastas
- [ ] Configurar variáveis de ambiente

---

## 📋 ETAPA 3 - Back-end e Banco de Dados

### App: Clientes
- [ ] Criar app `clientes`
- [ ] Criar modelo `Cliente`
- [ ] Criar serializer
- [ ] Criar ViewSet
- [ ] Configurar rotas
- [ ] Testar endpoints no Postman

### App: Produtos
- [ ] Criar app `produtos`
- [ ] Criar modelos `Categoria` e `Produto`
- [ ] Criar serializers
- [ ] Criar ViewSets
- [ ] Configurar rotas
- [ ] Testar endpoints

### App: Estoque
- [ ] Criar app `estoque`
- [ ] Criar modelos `Estoque` e `MovimentacaoEstoque`
- [ ] Criar serializers
- [ ] Criar ViewSets
- [ ] Implementar lógica de movimentação
- [ ] Configurar rotas
- [ ] Testar endpoints

### App: Vendas
- [ ] Criar app `vendas`
- [ ] Criar modelos `Pedido` e `ItemPedido`
- [ ] Criar serializers
- [ ] Criar ViewSets
- [ ] Implementar lógica de criação de pedido
- [ ] Integrar com estoque (baixa automática)
- [ ] Configurar rotas
- [ ] Testar endpoints

### App: Financeiro
- [ ] Criar app `financeiro`
- [ ] Criar modelos `Fatura`, `ContaReceber`, `ContaPagar`
- [ ] Criar serializers
- [ ] Criar ViewSets
- [ ] Implementar lógica de geração de fatura
- [ ] Configurar rotas
- [ ] Testar endpoints

### App: Fornecedores
- [ ] Criar app `fornecedores`
- [ ] Criar modelo `Fornecedor`
- [ ] Criar serializer
- [ ] Criar ViewSet
- [ ] Configurar rotas
- [ ] Testar endpoints

### App: Usuários
- [ ] Criar app `usuarios`
- [ ] Criar modelos `Usuario` e `Departamento`
- [ ] Criar serializers
- [ ] Configurar JWT (SimpleJWT)
- [ ] Criar endpoints de login/logout
- [ ] Criar endpoint de refresh token
- [ ] Criar ViewSets
- [ ] Configurar rotas
- [ ] Testar autenticação

### App: Auditoria
- [ ] Criar app `auditoria`
- [ ] Criar modelo `LogAuditoria`
- [ ] Criar middleware de auditoria
- [ ] Implementar logging automático
- [ ] Criar ViewSet (apenas leitura)
- [ ] Configurar rotas

---

## 📋 ETAPA 4 - Front-end (Interface Web)

### Configuração Inicial
- [ ] Configurar React Router
- [ ] Criar Context API para autenticação
- [ ] Configurar Axios (interceptors, baseURL)
- [ ] Criar componentes base (Header, Sidebar, Footer)
- [ ] Criar sistema de layout

### Autenticação
- [ ] Criar página de Login
- [ ] Implementar lógica de login
- [ ] Implementar logout
- [ ] Criar rota protegida (PrivateRoute)
- [ ] Armazenar token no localStorage

### Dashboard
- [ ] Criar página Dashboard
- [ ] Criar cards de KPIs
- [ ] Implementar gráficos iniciais
- [ ] Conectar com API

### Módulo Clientes
- [ ] Criar página de listagem
- [ ] Criar formulário de cadastro
- [ ] Criar formulário de edição
- [ ] Implementar busca e filtros
- [ ] Conectar com API

### Módulo Produtos
- [ ] Criar página de listagem
- [ ] Criar formulário de cadastro
- [ ] Criar formulário de edição
- [ ] Implementar busca e filtros
- [ ] Conectar com API

### Módulo Vendas
- [ ] Criar página de listagem de pedidos
- [ ] Criar formulário de novo pedido
- [ ] Implementar seleção de produtos
- [ ] Implementar cálculo automático de totais
- [ ] Criar página de detalhes do pedido
- [ ] Conectar com API

### Módulo Estoque
- [ ] Criar página de listagem
- [ ] Criar página de movimentações
- [ ] Criar formulário de entrada/saída
- [ ] Implementar alertas de estoque mínimo
- [ ] Conectar com API

### Módulo Financeiro
- [ ] Criar página de contas a receber
- [ ] Criar página de contas a pagar
- [ ] Criar página de fluxo de caixa
- [ ] Implementar filtros por período
- [ ] Conectar com API

---

## 📋 ETAPA 5 - Relatórios e Gráficos

- [ ] Instalar e configurar Recharts
- [ ] Criar gráfico de vendas por período
- [ ] Criar gráfico de vendas por produto
- [ ] Criar gráfico de vendas por vendedor
- [ ] Criar gráfico financeiro (receitas x despesas)
- [ ] Criar gráfico de estoque
- [ ] Implementar filtros dinâmicos
- [ ] Implementar exportação para PDF
- [ ] (Opcional) Integrar com Power BI

---

## 📋 ETAPA 6 - Implantação

### Back-end (Railway)
- [ ] Criar conta no Railway
- [ ] Criar projeto
- [ ] Provisionar PostgreSQL
- [ ] Configurar variáveis de ambiente
- [ ] Fazer deploy do Django
- [ ] Executar migrações no Railway
- [ ] Criar superusuário em produção
- [ ] Testar API em produção

### Front-end (Vercel)
- [ ] Criar conta no Vercel
- [ ] Conectar repositório GitHub
- [ ] Configurar variáveis de ambiente
- [ ] Fazer deploy
- [ ] Configurar domínio (opcional)
- [ ] Testar aplicação em produção

### CI/CD (Opcional)
- [ ] Configurar GitHub Actions
- [ ] Criar workflow de testes
- [ ] Criar workflow de deploy automático

---

## 📋 ETAPA 7 - Segurança e Permissões

- [ ] Criar grupos no Django Admin (Vendas, Financeiro, Gerência, Admin)
- [ ] Configurar permissões por grupo
- [ ] Implementar decorators de permissão nas views
- [ ] Testar restrições de acesso
- [ ] Configurar CORS adequadamente
- [ ] Implementar rate limiting (opcional)
- [ ] Configurar HTTPS
- [ ] Revisar segurança geral

---

## 📋 ETAPA 8 - Documentação e Portfólio

- [ ] Atualizar README.md completo
- [ ] Adicionar screenshots do sistema
- [ ] Criar vídeo de demonstração
- [ ] Documentar API (Swagger/OpenAPI)
- [ ] Criar guia de instalação
- [ ] Criar guia de uso
- [ ] Publicar no GitHub Pages (opcional)
- [ ] Adicionar ao portfólio

---

## 🌟 Funcionalidades Bônus

- [ ] Notificações por e-mail (SMTP)
- [ ] Modo escuro no front-end
- [ ] Gráficos dinâmicos avançados
- [ ] Sistema completo de logs de auditoria
- [ ] Exportação de relatórios em Excel
- [ ] Importação de dados via CSV
- [ ] API de integração com outros sistemas
- [ ] Aplicativo mobile (React Native)
- [ ] Testes automatizados (pytest, jest)
- [ ] Documentação com Storybook

---

**Última atualização:** 01/11/2025
