# Bootcamp Treinos AI

Um ecossistema completo para gestão de treinos personalizados, utilizando Inteligência Artificial para gerar planos de treino e interagir com o usuário via chat.

## 🚀 Tecnologias

### Backend
- **Node.js 24**: Ambiente de execução.
- **Fastify**: Framework web de alta performance.
- **Prisma**: ORM para interação com o banco de dados.
- **PostgreSQL**: Banco de dados relacional.
- **Groq & AI SDK**: Integração com modelos de linguagem (LLMs) como Llama 3.
- **Better-Auth**: Sistema de autenticação robusto.

### Frontend
- **Next.js 16**: Framework React para web.
- **Tailwind CSS**: Estilização moderna e responsiva.
- **Lucide React**: Ícones premium.
- **React Hook Form & Zod**: Gerenciamento e validação de formulários.

---

## ✨ Funcionalidades

- **Autenticação**: Login social via Google.
- **Chat de IA**: Personal Trainer virtual que ajuda a tirar dúvidas e configurar perfis.
- **Geração de Treino**: Planos de treino personalizados geridos por IA com base no perfil do usuário (peso, altura, objetivo).
- **Dashboard de Estatísticas**: Visualização de métricas de evolução.
- **Gestão de Exercícios**: Listagem e organização de treinos semanais.

---

## 🛠️ Como Utilizar

### Requisitos
- [Docker](https://www.docker.com/) e [Docker Compose](https://docs.docker.com/compose/) instalados.
- Chave de API do **Groq** (configurada no `.env`).

### Executando com Docker (Recomendado)

O projeto possui uma configuração unificada do Docker Compose que levanta o Banco de Dados, o Backend e o Frontend simultaneamente.

1. Clone o repositório.
2. Configure as variáveis de ambiente no arquivo `.env` da pasta `bootcamp-treinamentos-api`.
3. Na pasta do backend, execute:
   ```bash
   docker compose up --build
   ```
4. Acesse o frontend em `http://localhost:3000` e a documentação da API em `http://localhost:8080/docs`.

### Execução Local (Desenvolvimento)

#### Backend
```bash
cd bootcamp-treinamentos-api
pnpm install
pnpm exec prisma generate
pnpm run dev
```

#### Frontend
```bash
cd bootcamp-treinos-frontend
pnpm install
pnpm run dev
```

---

## ⚙️ Variáveis de Ambiente

### Backend (.env)
- `DATABASE_URL`: String de conexão com o PostgreSQL.
- `GROQ_API_KEY`: Sua chave de API do Groq.
- `GOOGLE_CLIENT_ID`: ID do cliente Google para OAuth.
- `GOOGLE_CLIENT_SECRET`: Segredo do cliente Google para OAuth.
- `BETTER_AUTH_SECRET`: Segredo para o sistema de autenticação.
- `API_BASE_URL`: URL base da API (ex: `http://localhost:8080`).
- `WEB_APP_BASE_URL`: URL base do frontend (ex: `http://localhost:3000`).

---

## 🛡️ Correções Recentes (AI Chat)

- **Versão do Node**: Backend configurado para rodar no Node 24 (exigência do Fastify/SDK).
- **Validação de Ferramentas**: Correção na validação de dados nulos nas ferramentas de IA via `z.preprocess`.
- **Limite de Tokens**: Migração do modelo para `llama-3.1-8b-instant` para evitar limites diários restritivos da Groq.
- **Contexto de Conversa**: Suporte verificado para múltiplas iterações no chat sem perda de contexto ou autenticação.
