(function () {
  const cfg = window.PORTFOLIO || {};

  function show(el) {
    if (el) el.classList.remove("is-hidden");
  }

  function hide(el) {
    if (el) el.classList.add("is-hidden");
  }

  function setHref(id, url) {
    const el = document.getElementById(id);
    if (el && url) el.href = url;
  }

  function toLookerEmbed(url) {
    if (!url) return "";
    return url
      .replace("lookerstudio.google.com/reporting/", "lookerstudio.google.com/embed/reporting/")
      .replace("lookerstudio.google.com/u/0/reporting/", "lookerstudio.google.com/embed/reporting/")
      .replace("datastudio.google.com/reporting/", "lookerstudio.google.com/embed/reporting/");
  }

  if (cfg.olamaniUrl) {
    const link = document.getElementById("olamani-link");
    if (link) {
      link.href = cfg.olamaniUrl;
      link.textContent = "Abrir Olamani";
      link.target = "_blank";
      link.rel = "noopener noreferrer";
    }
    hide(document.getElementById("olamani-note"));
  }

  setHref("socceriq-link", cfg.socceriqUrl);
  if (cfg.socceriqDemoUrl) {
    const demo = document.getElementById("socceriq-demo");
    if (demo) {
      demo.href = cfg.socceriqDemoUrl;
      demo.target = "_blank";
      demo.rel = "noopener noreferrer";
      show(demo);
    }
  }

  setHref("gh-link", cfg.github);
  setHref("li-link", cfg.linkedin);

  if (cfg.lookerUrl) {
    const embed = toLookerEmbed(cfg.lookerUrl);
    const frame = document.getElementById("looker-frame");
    const open = document.getElementById("looker-open");
    if (frame) frame.src = embed;
    if (open) {
      open.href = cfg.lookerUrl;
    }
    show(document.getElementById("looker-embed-wrap"));
    hide(document.getElementById("sankey-figure"));
  } else {
    drawSankey();
  }

  function drawSankey() {
    const root = document.getElementById("sankey");
    if (!root) return;

    const flows = [
      { source: "México", target: "Liga MX Femenil", value: 62, color: "#0d2137" },
      { source: "Colombia", target: "Liga MX Femenil", value: 12, color: "#1b4f8a" },
      { source: "Brasil", target: "Liga MX Femenil", value: 8, color: "#1f6b4a" },
      { source: "España", target: "Liga MX Femenil", value: 6, color: "#8b6914" },
      { source: "EE. UU.", target: "Liga MX Femenil", value: 5, color: "#4a6fa5" },
      { source: "Argentina", target: "Liga MX Femenil", value: 4, color: "#8b1e1e" },
      { source: "Otras", target: "Liga MX Femenil", value: 3, color: "#c9a227" },
    ];

    const width = Math.max(root.clientWidth || 720, 320);
    const height = width < 640 ? 420 : 340;
    const pad = 16;
    const nodeW = 12;
    const leftX = pad;
    const rightX = width - pad - nodeW;
    const sources = flows.map((f) => f.source);
    const total = flows.reduce((s, f) => s + f.value, 0);
    const gap = 10;
    const usable = height - pad * 2 - gap * (sources.length - 1);
    let y = pad;
    const sourceNodes = flows.map((f) => {
      const h = (f.value / total) * usable;
      const node = { ...f, y, h };
      y += h + gap;
      return node;
    });
    const targetH = usable + gap * (sources.length - 1);
    const target = { x: rightX, y: pad, h: targetH };

    const ns = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(ns, "svg");
    svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
    svg.setAttribute("role", "presentation");

    sourceNodes.forEach((n) => {
      const path = document.createElementNS(ns, "path");
      const x0 = leftX + nodeW;
      const x1 = rightX;
      const y0 = n.y + n.h / 2;
      const y1 = target.y + ((n.y - pad + n.h / 2) / targetH) * targetH;
      const c = (x1 - x0) * 0.45;
      path.setAttribute(
        "d",
        `M ${x0} ${n.y} C ${x0 + c} ${n.y}, ${x1 - c} ${y1 - n.h / 2}, ${x1} ${y1 - n.h / 2}
         L ${x1} ${y1 + n.h / 2} C ${x1 - c} ${y1 + n.h / 2}, ${x0 + c} ${n.y + n.h}, ${x0} ${n.y + n.h} Z`
      );
      path.setAttribute("fill", n.color);
      path.setAttribute("opacity", "0.38");
      path.dataset.label = `${n.source} → ${n.target}`;
      svg.appendChild(path);

      const rect = document.createElementNS(ns, "rect");
      rect.setAttribute("x", String(leftX));
      rect.setAttribute("y", String(n.y));
      rect.setAttribute("width", String(nodeW));
      rect.setAttribute("height", String(n.h));
      rect.setAttribute("rx", "2");
      rect.setAttribute("fill", n.color);
      svg.appendChild(rect);

      const label = document.createElementNS(ns, "text");
      label.setAttribute("x", String(leftX + nodeW + 8));
      label.setAttribute("y", String(n.y + n.h / 2 + 4));
      label.setAttribute("fill", "#0d2137");
      label.setAttribute("font-size", width < 640 ? "12" : "13");
      label.setAttribute("font-family", "Source Sans 3, Segoe UI, sans-serif");
      label.textContent = `${n.source}  ${n.value}%`;
      svg.appendChild(label);
    });

    const tRect = document.createElementNS(ns, "rect");
    tRect.setAttribute("x", String(target.x));
    tRect.setAttribute("y", String(target.y));
    tRect.setAttribute("width", String(nodeW));
    tRect.setAttribute("height", String(target.h));
    tRect.setAttribute("rx", "2");
    tRect.setAttribute("fill", "#c9a227");
    svg.appendChild(tRect);

    const tLabel = document.createElementNS(ns, "text");
    tLabel.setAttribute("x", String(target.x - 8));
    tLabel.setAttribute("y", String(target.y + 16));
    tLabel.setAttribute("text-anchor", "end");
    tLabel.setAttribute("fill", "#0d2137");
    tLabel.setAttribute("font-size", "13");
    tLabel.setAttribute("font-family", "Source Sans 3, Segoe UI, sans-serif");
    tLabel.setAttribute("font-weight", "600");
    tLabel.textContent = "Liga MX Femenil";
    svg.appendChild(tLabel);

    root.replaceChildren(svg);
  }
})();
