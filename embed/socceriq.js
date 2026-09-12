(() => {
  const data = window.SOCCERIQ_EMBED;
  if (!data) return;

  const weight = { Available: 1, Modified: 0.5, Injured: 0 };
  const statusLabel = { Available: "Disponible", Modified: "Modificado", Injured: "Lesionado" };
  const riskLabel = { Low: "Bajo", Moderate: "Moderado", High: "Alto", Critical: "Crítico" };
  const riskColor = { Low: "#1b8a4a", Moderate: "#d6a826", High: "#f4b183", Critical: "#b23a3a" };
  const statusColor = { Available: "#1b8a4a", Modified: "#d6a826", Injured: "#b23a3a" };
  const pillFg = (bg) => (bg === "#d6a826" || bg === "#f4b183" ? "#111" : "#fff");

  const n = data.players.length;
  const avail = (100 * data.players.reduce((s, p) => s + (weight[p.status] || 0), 0)) / n;
  const high = data.players.filter((p) => p.risk === "High" || p.risk === "Critical").length;
  const days = data.players.reduce((s, p) => s + p.days, 0);

  document.getElementById("kpis").innerHTML = `
    <div><span>Disponibilidad</span><strong>${avail.toFixed(1)}%</strong></div>
    <div><span>Riesgo alto</span><strong>${high}</strong></div>
    <div><span>Días baja</span><strong>${days}</strong></div>
  `;

  document.getElementById("rows").innerHTML = data.players
    .map(
      (p) => `<tr>
        <td>${p.name}</td>
        <td><span class="pill" style="background:${statusColor[p.status]};color:${pillFg(statusColor[p.status])}">${statusLabel[p.status]}</span></td>
        <td>${p.load.toFixed(0)}%</td>
        <td><span class="pill" style="background:${riskColor[p.risk]};color:${pillFg(riskColor[p.risk])}">${riskLabel[p.risk]}</span></td>
      </tr>`
    )
    .join("");

  const weeks = data.weekly.map((d) => d.w);
  const layout = {
    paper_bgcolor: "rgba(0,0,0,0)",
    plot_bgcolor: "rgba(0,0,0,0)",
    font: { family: "IBM Plex Sans, sans-serif", size: 12, color: "#e7eee6" },
    title: { text: "Distancia por semana", font: { size: 16 }, x: 0, xanchor: "left" },
    margin: { t: 48, b: 88, l: 56, r: 16 },
    xaxis: {
      title: { text: "Semana", font: { size: 13 } },
      tickfont: { size: 11 },
      tickangle: 0,
      tickvals: weeks.filter((_, i) => i % 2 === 0),
      gridcolor: "#24302a",
      zeroline: false,
    },
    yaxis: {
      title: { text: "Distancia (km)", font: { size: 13 } },
      tickfont: { size: 11 },
      rangemode: "tozero",
      gridcolor: "#24302a",
      zeroline: false,
    },
    legend: {
      orientation: "h",
      y: -0.32,
      x: 0.5,
      xanchor: "center",
      font: { size: 12 },
    },
    showlegend: true,
  };

  Plotly.newPlot(
    "trend",
    [
      {
        x: weeks,
        y: data.weekly.map((d) => d.match),
        name: "Partido",
        mode: "lines+markers",
        line: { color: "#c6f04d", width: 3 },
        marker: { size: 7 },
      },
      {
        x: weeks,
        y: data.weekly.map((d) => d.training),
        name: "Entrenamiento",
        mode: "lines+markers",
        line: { color: "#8b978c", width: 3 },
        marker: { size: 7 },
      },
    ],
    layout,
    { displayModeBar: false, responsive: true }
  );
  window.addEventListener("resize", () => Plotly.Plots.resize("trend"));
})();
