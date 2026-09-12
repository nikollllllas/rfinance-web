# RFinance Web

Frontend web do **RFinance** — dashboard de finanças pessoais para gerenciar transações, categorias e orçamentos, com gráficos e relatórios. Construído em ReactJS e consome a [RFinance API](https://github.com/nikollllllas/rfinance-api) através de um cliente TypeScript gerado automaticamente a partir do contrato OpenAPI.

## Funcionalidades

- 💰 Gestão de transações e categorias
- 📊 Dashboard com gráficos (Recharts)
- 🎯 Orçamentos (budgets) e acompanhamento de metas
- 🔐 Autenticação integrada com a API (JWT)
- 🌗 Dark mode
- 🔄 Cliente de API tipado, gerado automaticamente a partir do OpenAPI do backend

## Stack

- **Framework:** Tanstack Router
- **Linguagem:** TypeScript
- **UI:** Tailwind CSS + shadcn/ui (Radix primitives)
- **Dados:** TanStack React Query + Axios
- **Geração de client:** Kubb (a partir do OpenAPI da API)
- **Formulários/validação:** Zod
- **Gráficos:** Recharts
- **Lint/format:** Biome
- **Analytics:** Vercel Analytics

## Estrutura

- `app/` — rotas e páginas
- `components/` — componentes de UI reutilizáveis
- `hooks/` — hooks customizados
- `lib/` — utilitários e configuração de clientes
- `openapi/` — spec OpenAPI consumida pelo Kubb
- `public/` — assets estáticos
- `scripts/` — scripts auxiliares (ex: preparo do spec OpenAPI)

## Como rodar

Requer [Bun](https://bun.sh) e a [RFinance API](https://github.com/nikollllllas/rfinance-api) rodando localmente (ou uma URL de API configurada).

```bash
bun install
cp .env.example .env   # configure a URL da API etc.
bun run dev            # http://localhost:3000
```

### Gerando o cliente de API

O cliente TypeScript (tipos + hooks do React Query) é gerado a partir do OpenAPI da API:

```bash
bun run kubb:generate
```

Isso executa `openapi:prepare` (busca/prepara o spec) e depois roda o Kubb, gerando os arquivos em `openapi/`.

### Build de produção

```bash
bun run build
bun run start
```
