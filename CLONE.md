# Novo cliente a partir deste modelo

Passo a passo para clonar o projeto e entregar o site de um estabelecimento novo.

```bash
git clone <este-repo> nome-do-cliente
cd nome-do-cliente
npm install
npm run dev
```

## 1. Configuração do cliente — `src/config/site.config.ts`

O primeiro arquivo a editar. Tudo que muda de cliente para cliente fica aqui:

| Bloco | O que preencher |
|---|---|
| `brand` | Nome, WhatsApp (só dígitos, com 55 + DDD), telefone formatado, Instagram, cidade, região, cidades atendidas, horários, antecedência mínima (`leadTimeHours`), mínimo de convidados para eventos, ponto de retirada (vazio = sem retirada), formas de pagamento |
| `site` | Domínio canônico (sem barra no fim), `storageKey` (prefixo único por cliente), imagem e texto de compartilhamento |
| `features` | Liga/desliga cada feature (ver tabela abaixo) |
| `packages` | `showPrices: false` esconde preços e estimativas dos pacotes |
| `messages` | Textos base das mensagens de WhatsApp |

### Features

| Flag | O que faz | Página |
|---|---|---|
| `menu` | Cardápio avulso com "Minha lista" | `/cardapio` |
| `table` | Monte sua mesa (prévia visual) | `/monte-sua-mesa` |
| `packages` | Pacotes prontos com nº de convidados e estimativa | `/pacotes` |
| `quoteWizard` | Orçamento guiado em 6 passos | `/orcamento` |
| `calculator` | "Quanto pedir?" na mesa, no cardápio e no orçamento | — |
| `persistence` | Lista e mesa salvas no navegador | — |
| `shareTable` | Link compartilhável da mesa (vai junto na mensagem) | — |
| `gallery` | Galeria de eventos realizados | `/eventos-realizados` |
| `testimonials` | Depoimentos (home, pacotes, galeria) | — |

Uma feature desligada some do menu, do rodapé, das rotas (vira 404), do sitemap e dos botões que apontam para ela. Não é preciso apagar código.

## 2. Dados — `src/data/`

| Arquivo | Conteúdo |
|---|---|
| `catalog.ts` | Produtos, categorias, preços, mínimos e máximos |
| `offers.ts` | Como os produtos aparecem no cardápio (tamanhos, sabores) |
| `table.ts` | Sugestões prontas da mesa |
| `packages.ts` | Pacotes de eventos. Itens por convidado (`perGuest`), por peça (`servesPerPiece`) ou fixos |
| `calculator.ts` | Regras da calculadora (salgados por pessoa e por hora, pessoas por peça) |
| `events.ts` | Tipos de evento (filtros e orçamento) |
| `quote.ts` | Opções do orçamento guiado (horários, durações, restrições) |
| `gallery.ts` | Fotos de eventos realizados |
| `testimonials.ts` | Depoimentos **reais** (lista vazia = seção escondida) |
| `src/seo/site.ts` | Perguntas frequentes (`faqs`) |
| `src/config/routes.ts` | Título e descrição de cada página (SEO) |

**Pacotes:** a estimativa soma os preços do cardápio. Se o cliente tem preço fechado por pessoa, use `pricePerGuest` (em centavos: `4500` = R$ 45,00).

**Depoimentos:** só com autorização do cliente e do autor. Em `npm run dev` aparecem exemplos para conferir o layout; eles nunca vão para o build.

## 3. Identidade visual

- Cores e fontes: bloco `@theme` no topo de `src/index.css`.
- Cor de fundo inicial: `index.html` (`theme-color` e o `<style>` inicial).
- Logos: `public/images/logos/` (`BrandLogo.tsx`, `Hero.tsx` e `src/lib/boot.ts` apontam para eles).
- Micro-ícones da marca: `public/images/logos/micros/` (`Mark.tsx`).
- Favicons e imagem de compartilhamento: `public/favicon.png`, `public/apple-touch-icon.png`, `public/og.jpg` (1200×630).

## 4. Fotos

As fotos de produto e de eventos ficam em `public/images/` e são otimizadas automaticamente no `npm run dev` / `npm run build` (`scripts/optimize-images.mjs` gera `public/images/opt/`).

- Fotos de produtos: caminhos em `catalog.ts`.
- Mesas e eventos: `public/images/insta/` (usadas em `RealTables.tsx`, `gallery.ts` e `packages.ts`).
- Miniaturas recortadas da mesa: `public/images/mesa/halo/<id>.webp`.

Foto que não existe aparece como placeholder. Nunca use foto de comida que não seja do cliente.

## 5. Textos que ainda estão nos componentes

Revise e troque pelos do cliente: `Hero.tsx` (título), `About.tsx`, `ContactInfo.tsx` (entrega e retirada), `HowToOrder.tsx`, `Footer.tsx` (frase), `BrandLogo.tsx` (texto alternativo), `src/seo/render.ts` (HTML para buscadores), `src/seo/schema.ts` (descrição e cidade da empresa) e `catalog.ts` (`eventOffer`).

## 6. Publicação

1. `vercel.json`: troque o domínio do redirecionamento `www` → domínio principal.
2. `npm run build`: compila, gera o HTML de cada página, `sitemap.xml`, `robots.txt` e `llms.txt`.
3. `node scripts/check-seo.mjs`: confere títulos, descrições, canonical e links de todas as páginas ligadas.
4. Teste um pedido de ponta a ponta no celular e confira se a mensagem chega no WhatsApp certo.
