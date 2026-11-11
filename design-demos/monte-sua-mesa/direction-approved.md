# Direção aprovada

Três rascunhos, todos na paleta já usada no site (marfim `#f2f2f3`, tinta `#404041`):

- [design-demos/monte-sua-mesa/ao-lado.html](design-demos/monte-sua-mesa/ao-lado.html) — mesa à esquerda, cardápio e kits à direita, botão da lista.
- [design-demos/monte-sua-mesa/faixa.html](design-demos/monte-sua-mesa/faixa.html) — mesa larga no topo e kits numa faixa.
- [design-demos/monte-sua-mesa/centro.html](design-demos/monte-sua-mesa/centro.html) — kits em mini mesas à esquerda, mesa no centro, lista aberta à direita.

`design_lint.py check` nos três: sem luz vermelha e sem decoração de template. A paleta é a mesma porque a marca está fixa; o que muda é a composição.

Escolha, nas palavras de quem pediu a implementação: "Implement the plan as specified" e "Don't stop until you have completed all the to-dos." A seção de implementação do plano já descreve a composição ao lado (mesa grudada, cardápio ao lado, gaveta da lista). A página em React segue `ao-lado.html`.
