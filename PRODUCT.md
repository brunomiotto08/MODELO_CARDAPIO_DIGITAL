# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Quem monta um pedido da Flor Alecrim para levar ou para uma mesa de evento, em Caxias do Sul e nas cidades vizinhas da Serra Gaúcha (Farroupilha, Bento Gonçalves e Garibaldi). A pessoa chega pelo site, escolhe no cardápio ou compõe a mesa, e manda a consulta pelo WhatsApp. A equipe confirma quantidades, valores e a data.

## Product Purpose

O site apresenta a Flor Alecrim e o cardápio de encomendas, e deixa a pessoa pré-visualizar uma mesa com os produtos escolhidos. O sucesso é a mensagem no WhatsApp com os itens da mesa, não um pagamento online.

## Positioning

A mesa é uma prévia de como os itens ficam juntos. O total não fecha no site: quantidades, valores e a data se confirmam no atendimento.

Exceção: a página de Pacotes mostra uma **estimativa** (soma dos preços do cardápio, ou preço por pessoa definido no pacote), sempre rotulada como estimativa e com o aviso de confirmação no atendimento. Ela pode ser desligada em `siteConfig.packages.showPrices`.

## Operating Context

Rotas (cada uma liga/desliga em `src/config/site.config.ts`): início, cardápio avulso, Monte sua mesa, Pacotes para eventos, Orçamento guiado e Eventos realizados. O cardápio tem a lista de interesse (Minha lista). A mesa tem a própria composição, com quatro sugestões prontas e os itens de todo o cardápio. Doces e arranjo floral entram como interesse sem valor fechado. O atendimento por WhatsApp é em dias úteis das 8h às 11h30 e das 13h30 às 18h, e aos sábados das 8h às 11h.

## Capabilities and Constraints

- Catálogo, preços e rendimentos vêm de `src/data/catalog.ts` e de `public/descriptions/cardapio.txt`.
- A mensagem da mesa é montada em `src/data/brand.ts` e abre `wa.me` com o número já configurado.
- Não há checkout, conta de cliente nem estoque.
- Configuração do cliente (marca, contato, features, textos do WhatsApp) em `src/config/site.config.ts`; páginas em `src/config/routes.ts`. Ver `CLONE.md`.
- Lista e mesa ficam salvas no navegador (feature `persistence`); a mesa pode ser compartilhada por link (`shareTable`).
- Depoimentos só reais, em `src/data/testimonials.ts`. Com a lista vazia, a seção não aparece no site publicado.
- Cada produto na mesa aparece uma vez. A quantidade fica na lista, não vira várias peças.
- As miniaturas vistas de cima ainda não estão no repositório. Até o arquivo existir, a peça é uma silhueta do formato em que o produto é servido. Não se inventa foto de comida.
- A interface já observa `prefers-reduced-motion`.

## Brand Commitments

O nome é Flor Alecrim. O Instagram é floralecrim_. O manual de identidade de junho de 2020 é a autoridade da marca já aplicada no site. Este trabalho não troca essa identidade.

## Evidence on Hand

Fotos reais dos produtos em `public/images/products` e mesas de evento em `public/images/insta`. Não há depoimentos, números de clientes nem avaliações para usar. As miniaturas vistas de cima são um material que o responsável pelo site ainda vai entregar.

## Product Principles

- A mesa mostra o produto como ele é servido.
- Preço e data se confirmam na conversa, não numa soma fechada. Estimativas, quando aparecem, dizem que são estimativas.
- A lista do cardápio e a lista da mesa não se misturam.
- O que não tem imagem permanece uma silhueta, sem desenho no lugar da comida.
