# serch86.github.io

Portafolio personal de [Sergio Camposortega Rendón](https://github.com/serch86).

Sitio estático en GitHub Pages: https://serch86.github.io/

## Productos

- [Olamani](olamani.html) — chat analista de Liga MX Femenil
- [SoccerIQ](socceriq.html) — rendimiento físico (`team-performance-dashboard`), **demo embebida** en `embed/socceriq.html`
- [Origen de las jugadoras](origenes.html) — Looker Studio (Sankey)

## Enlaces vivos

Edita `config.js`:

```js
window.PORTFOLIO = {
  olamaniUrl: "",       // Streamlit Cloud
  socceriqDemoUrl: "",  // demo Streamlit
  lookerUrl: "",        // informe Looker (cualquiera con el enlace)
};
```

Si `lookerUrl` está definido, la ficha de orígenes embebe el dashboard y oculta el Sankey ilustrativo.
