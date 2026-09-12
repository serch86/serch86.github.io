(() => {
  const cfg = window.PORTFOLIO || {};

  const show = (el) => el && el.classList.remove("is-hidden");
  const hide = (el) => el && el.classList.add("is-hidden");

  const toLookerEmbed = (url) =>
    url
      .replace("lookerstudio.google.com/u/0/reporting/", "lookerstudio.google.com/embed/reporting/")
      .replace("lookerstudio.google.com/reporting/", "lookerstudio.google.com/embed/reporting/")
      .replace("datastudio.google.com/u/0/reporting/", "lookerstudio.google.com/embed/reporting/")
      .replace("datastudio.google.com/reporting/", "lookerstudio.google.com/embed/reporting/");

  const toStreamlitEmbed = (url) => {
    const u = new URL(url);
    u.searchParams.set("embed", "true");
    return u.toString();
  };

  if (cfg.olamaniUrl) {
    const live = document.getElementById("olamani-live");
    if (live) {
      live.href = cfg.olamaniUrl;
      live.textContent = "Abrir Olamani";
      show(live);
    }
    hide(document.getElementById("olamani-note"));
    hide(document.getElementById("olamani-mock"));
    document.querySelectorAll(".js-olamani-frame").forEach((frame) => {
      frame.src = toStreamlitEmbed(cfg.olamaniUrl);
      show(frame);
    });
    show(document.getElementById("olamani-embed-wrap"));
  }

  if (cfg.socceriqDemoUrl) {
    const demo = document.getElementById("socceriq-demo");
    if (demo) {
      demo.href = cfg.socceriqDemoUrl;
      show(demo);
    }
    document.querySelectorAll("#socceriq-frame").forEach((frame) => {
      try {
        const u = new URL(cfg.socceriqDemoUrl);
        u.searchParams.set("embed", "true");
        frame.src = u.toString();
      } catch {
        frame.src = cfg.socceriqDemoUrl;
      }
    });
  }

  if (cfg.lookerUrl) {
    const embed = toLookerEmbed(cfg.lookerUrl);
    document.querySelectorAll(".js-looker-frame").forEach((frame) => {
      frame.src = embed;
    });
    document.querySelectorAll(".js-looker-open").forEach((open) => {
      open.href = cfg.lookerUrl;
    });
    document.querySelectorAll(".js-looker-wrap").forEach((wrap) => show(wrap));
    hide(document.getElementById("sankey-figure"));
  } else if (document.getElementById("sankey")) {
    drawSankey();
    window.addEventListener("resize", () => {
      clearTimeout(drawSankey._t);
      drawSankey._t = setTimeout(drawSankey, 160);
    });
  }

  function drawSankey() {
    const root = document.getElementById("sankey");
    if (!root) return;
    const flows = [
      { source: "México", value: 62, color: "#c6f04d" },
      { source: "Colombia", value: 12, color: "#8fd14f" },
      { source: "Brasil", value: 8, color: "#6bbf63" },
      { source: "España", value: 6, color: "#4ea37a" },
      { source: "EE. UU.", value: 5, color: "#3d8a7a" },
      { source: "Argentina", value: 4, color: "#9aa86a" },
      { source: "Otras", value: 3, color: "#5c6f5e" },
    ];
    const width = Math.max(root.clientWidth || 720, 280);
    const ns = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(ns, "svg");
    svg.setAttribute("role", "presentation");

    if (width < 560) {
      const rowH = 36;
      const height = 28 + flows.length * rowH;
      const labelW = 108;
      const trackX = labelW + 8;
      const trackW = width - trackX - 44;
      svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
      flows.forEach((f, i) => {
        const y = 8 + i * rowH;
        const name = document.createElementNS(ns, "text");
        name.setAttribute("x", "0");
        name.setAttribute("y", String(y + 16));
        name.setAttribute("fill", "#e7eee6");
        name.setAttribute("font-size", "13");
        name.setAttribute("font-family", "IBM Plex Sans, sans-serif");
        name.textContent = f.source;
        svg.appendChild(name);

        const track = document.createElementNS(ns, "rect");
        track.setAttribute("x", String(trackX));
        track.setAttribute("y", String(y + 6));
        track.setAttribute("width", String(trackW));
        track.setAttribute("height", "12");
        track.setAttribute("rx", "6");
        track.setAttribute("fill", "#24302a");
        svg.appendChild(track);

        const bar = document.createElementNS(ns, "rect");
        bar.setAttribute("x", String(trackX));
        bar.setAttribute("y", String(y + 6));
        bar.setAttribute("width", String(Math.max(8, (f.value / 62) * trackW)));
        bar.setAttribute("height", "12");
        bar.setAttribute("rx", "6");
        bar.setAttribute("fill", f.color);
        svg.appendChild(bar);

        const pct = document.createElementNS(ns, "text");
        pct.setAttribute("x", String(width));
        pct.setAttribute("y", String(y + 16));
        pct.setAttribute("text-anchor", "end");
        pct.setAttribute("fill", "#c6f04d");
        pct.setAttribute("font-size", "13");
        pct.setAttribute("font-family", "IBM Plex Sans, sans-serif");
        pct.textContent = `${f.value}%`;
        svg.appendChild(pct);
      });
      root.replaceChildren(svg);
      return;
    }

    const height = 340;
    const pad = 16;
    const nodeW = 11;
    const leftX = pad;
    const rightX = width - pad - nodeW;
    const total = flows.reduce((s, f) => s + f.value, 0);
    const gap = 9;
    const usable = height - pad * 2 - gap * (flows.length - 1);
    let y = pad;
    const nodes = flows.map((f) => {
      const h = (f.value / total) * usable;
      const node = { ...f, y, h };
      y += h + gap;
      return node;
    });
    const targetH = usable + gap * (flows.length - 1);
    svg.setAttribute("viewBox", `0 0 ${width} ${height}`);

    nodes.forEach((n) => {
      const path = document.createElementNS(ns, "path");
      const x0 = leftX + nodeW;
      const x1 = rightX;
      const y1 = pad + ((n.y - pad + n.h / 2) / targetH) * targetH;
      const c = (x1 - x0) * 0.46;
      path.setAttribute(
        "d",
        `M ${x0} ${n.y} C ${x0 + c} ${n.y}, ${x1 - c} ${y1 - n.h / 2}, ${x1} ${y1 - n.h / 2}
         L ${x1} ${y1 + n.h / 2} C ${x1 - c} ${y1 + n.h / 2}, ${x0 + c} ${n.y + n.h}, ${x0} ${n.y + n.h} Z`
      );
      path.setAttribute("fill", n.color);
      path.setAttribute("opacity", "0.32");
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
      label.setAttribute("fill", "#e7eee6");
      label.setAttribute("font-size", width < 640 ? "12" : "13");
      label.setAttribute("font-family", "IBM Plex Sans, sans-serif");
      label.textContent = `${n.source}  ${n.value}%`;
      svg.appendChild(label);
    });

    const tRect = document.createElementNS(ns, "rect");
    tRect.setAttribute("x", String(rightX));
    tRect.setAttribute("y", String(pad));
    tRect.setAttribute("width", String(nodeW));
    tRect.setAttribute("height", String(targetH));
    tRect.setAttribute("rx", "2");
    tRect.setAttribute("fill", "#c6f04d");
    svg.appendChild(tRect);

    const tLabel = document.createElementNS(ns, "text");
    tLabel.setAttribute("x", String(rightX - 8));
    tLabel.setAttribute("y", String(pad + 16));
    tLabel.setAttribute("text-anchor", "end");
    tLabel.setAttribute("fill", "#c6f04d");
    tLabel.setAttribute("font-size", "13");
    tLabel.setAttribute("font-family", "IBM Plex Sans, sans-serif");
    tLabel.setAttribute("font-weight", "600");
    tLabel.textContent = "Liga MX Femenil";
    svg.appendChild(tLabel);

    root.replaceChildren(svg);
  }

  const canvas = document.getElementById("net");
  if (!canvas || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const ctx = canvas.getContext("2d");
  const nodes = [];
  const N = 46;

  const resize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };
  resize();
  window.addEventListener("resize", resize);

  for (let i = 0; i < N; i++) {
    nodes.push({
      x: Math.random(),
      y: Math.random(),
      vx: (Math.random() - 0.5) * 0.00025,
      vy: (Math.random() - 0.5) * 0.00025,
      r: Math.random() * 1.6 + 0.8,
    });
  }

  const step = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (const n of nodes) {
      n.x += n.vx;
      n.y += n.vy;
      if (n.x < 0 || n.x > 1) n.vx *= -1;
      if (n.y < 0 || n.y > 1) n.vy *= -1;
    }
    for (let i = 0; i < N; i++) {
      for (let j = i + 1; j < N; j++) {
        const a = nodes[i];
        const b = nodes[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const d = Math.hypot(dx, dy);
        if (d < 0.18) {
          ctx.strokeStyle = `rgba(198, 240, 77, ${0.18 - d})`;
          ctx.beginPath();
          ctx.moveTo(a.x * canvas.width, a.y * canvas.height);
          ctx.lineTo(b.x * canvas.width, b.y * canvas.height);
          ctx.stroke();
        }
      }
    }
    ctx.fillStyle = "#c6f04d";
    for (const n of nodes) {
      ctx.globalAlpha = 0.7;
      ctx.beginPath();
      ctx.arc(n.x * canvas.width, n.y * canvas.height, n.r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    requestAnimationFrame(step);
  };
  step();
})();
