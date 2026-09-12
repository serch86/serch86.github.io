# serch86.github.io

Portafolio personal de [Sergio Camposortega Rendón](https://github.com/serch86).

Sitio estático en GitHub Pages: https://serch86.github.io/

## Productos

- [Olamani](olamani.html) — chat analista de Liga MX Femenil
- [Dashboard de plantel](dashboard.html) — disponibilidad, riesgo, carga y tendencias
- [Origen de las jugadoras](origenes.html) — Looker Studio

## Enlaces vivos

Edita `config.js`:

```js
window.PORTFOLIO = {
  olamaniUrl: "https://soccerbi-enxtdbhzxgv4w8duvhgk4c.streamlit.app/",
  dashboardUrl: "https://socceriqonline-r94gmgbxcu6sp4zqeffe5i.streamlit.app/",
  lookerUrl: "https://datastudio.google.com/reporting/e13aca94-82cb-4166-b000-772a2f003ce0",
};
```

Si `lookerUrl` está definido, la ficha de orígenes embebe el dashboard y oculta el Sankey ilustrativo.
