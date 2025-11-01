# Frontend Guide — Capturas e GIFs para README

Quando adicionar o frontend, inclua uma seção visual no README com prints e pequenos GIFs que mostrem o fluxo principal: login, criação de pedido, dashboard e relatórios.

## Ferramenta recomendada para GIFs
- ScreenToGif (gratuito) — https://www.screentogif.com/

## Como gerar GIFs curtos
1. Abra o app ScreenToGif
2. Grave uma área da tela com 5-15 segundos
3. Corte o começo/fim e otimize (reduza frames)
4. Exporte como GIF em `docs/gifs/` com nomes descritivos:
   - `login.gif`
   - `dashboard_vendas.gif`
   - `criar_pedido.gif`

## Prints (screenshots)
- Tire screenshots em PNG (1920x1080) e coloque em `docs/screenshots/` com nomes como `dashboard.png`, `clientes_list.png`.

## Boas práticas
- GIFs curtos (≤10s), focados em um fluxo
- Use setas/legendas se necessário (ScreenToGif permite adicionar textos)
- Compacte GIFs para reduzir tamanho; preferir PNG para imagens estáticas

## Como referenciar no README principal
Adicionar uma seção 'Demonstração' no `README.md` com imagens embutidas:

```markdown
## Demonstração

![Dashboard](docs/screenshots/dashboard.png)

### Fluxo rápido (GIF)

![Criar Pedido](docs/gifs/criar_pedido.gif)
```

Coloque as imagens e GIFs no repositório antes de gerar o build do frontend para garantir que os links funcionem.

---

**Observação:** eu posso gerar GIFs automáticos em dev usando ferramentas locais, mas por questões de ambiente eu forneço instruções e placeholders; você pode gravar rapidamente com ScreenToGif e eu adiciono ao README quando você enviar os arquivos.
