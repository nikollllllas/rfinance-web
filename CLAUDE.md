# Regras do projeto

- Não deixar comentários no código, de forma alguma.

## Design system

- **Tipografia**: Bricolage Grotesque pros títulos/números de destaque (`font-display`,
  carregado em `app/layout.tsx` via `next/font`, variável `--font-display`), Inter pro resto
  (fonte padrão do body).
- **Accent/marca**: verde-menta (`--success` no CSS, `oklch(0.75 0.17 165)` aprox),
  usado só pra identidade visual — sidebar ativo, login, tint de ícone nos stat cards.
  Justificativa: é o teal do Pix, não mint de fintech genérico.
- **Cor transacional (ganho/gasto, status Pago/Falta)**: NÃO usa `--success`/`text-success`.
  Usa verde/vermelho literais (`text-green-600 dark:text-green-500`, `bg-green-500`,
  `text-destructive`/`bg-destructive`). `--success` é token de marca, não de estado —
  misturar os dois foi bug já corrigido uma vez, não repetir.
- **Cards**: `rounded-2xl`, `shadow-soft` (token em `tailwind.config.ts`), sem borda.
  Fundo da página é `bg-muted/40` (ver `components/app-shell.tsx`), cards brancos por cima.
- **Sidebar**: mesmo fundo do canvas (branco), separação só por `border-r`. Não usar cor
  diferente pro sidebar.
- **Dark mode**: via `next-themes`, toggle Claro/Escuro/Sistema no sidebar
  (`components/theme-toggle.tsx`). Componentes usam tokens semânticos (`bg-card`,
  `text-foreground`, `border-border` etc.) pra adaptar sozinhos — não hardcodar cor que só
  funciona num tema.
- **Ícones**: só `lucide-react`. Nunca emoji como ícone.
- **Modais de formulário** (`transaction-create-dialog.tsx` e afins): grid 2 colunas
  (`sm:grid-cols-2`), campos curtos lado a lado (Valor+Data, Categoria+Status), campos longos
  full-width (`sm:col-span-2`).

## API / dados

- Cliente gerado por Kubb em `lib/api/` — não editar os arquivos existentes à mão em
  condições normais. **Toolchain local do kubb está quebrado**: rodar `kubb:generate`
  corrompe os tipos gerados pro client inteiro (vira `{}` em tudo), não só pro endpoint
  novo. Até resolver: escrever manualmente os arquivos de endpoint novo seguindo o padrão
  exato dos arquivos irmãos existentes (ver `lib/api/attachments/` como referência de como
  foi feito).
- Chamada de API passa por proxy same-origin: `next.config.ts` reescreve `/api/:path*` pro
  `API_PROXY_TARGET` (produção por padrão). Pra rodar contra backend local, setar
  `API_PROXY_TARGET=http://localhost:3333` antes do `next dev`.
- Hooks de mutation/query: `useXControllerY({ client: kubbClientConfig })`. Funções raw:
  `xControllerY(args, kubbClientConfig)` — config vai direto como argumento, não
  `{ client: kubbClientConfig }`.

## Dev local

- Nunca rodar `next dev` e `next build` ao mesmo tempo apontando pro mesmo `.next` —
  corrompe os manifests. Se acontecer: matar todo processo `next`/`next-server` por PID
  (não só o da porta, sobra processo órfão), `rm -rf .next`, subir de novo.
