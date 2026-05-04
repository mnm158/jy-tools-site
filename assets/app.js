const fallbackSite = {
  siteName: "JY工具站",
  domain: "jyyyyy.dpdns.org",
  tagline: "收集、发布和记录好用的小工具。",
  intro:
    "这里会陆续放出个人插件、工具使用说明、更新记录和一些折腾经验，方便自己维护，也方便大家下载使用。",
  about:
    "这是一个从零开始维护的个人工具站，重点是让内容更新足够简单。你可以先把它当作个人主页、插件下载页和技术笔记入口。",
  footerText: "© 2026 JY工具站. Powered by GitHub and Cloudflare Pages.",
  socialLinks: [
    {
      name: "GitHub",
      url: "https://github.com/"
    },
    {
      name: "联系我",
      url: "mailto:hello@example.com"
    }
  ]
};

const fallbackPlugins = [
  {
    name: "示例插件：效率工具箱",
    version: "v0.1.0",
    description:
      "这是一个占位插件卡片。以后把它改成你的真实插件名称、说明和下载地址即可。",
    platform: "Windows / macOS",
    downloadUrl: "#",
    updatedAt: "2026-05-04",
    tags: ["示例", "效率", "插件"]
  },
  {
    name: "示例插件：数据整理助手",
    version: "v0.1.0",
    description:
      "适合展示安装包、脚本、压缩包或 GitHub Releases 链接。下载按钮支持外链。",
    platform: "跨平台",
    downloadUrl: "#",
    updatedAt: "2026-05-04",
    tags: ["工具", "下载", "开源"]
  },
  {
    name: "示例插件：CAD 小工具",
    version: "v0.1.0",
    description:
      "如果你后续发布专业插件，可以在这里写适用软件、使用场景和版本说明。",
    platform: "Windows",
    downloadUrl: "#",
    updatedAt: "2026-05-04",
    tags: ["CAD", "工作流", "示例"]
  }
];

const fallbackPosts = [
  {
    title: "网站上线记录",
    summary: "记录 JY工具站从空目录搭建到 GitHub + Cloudflare Pages 发布的过程。",
    date: "2026-05-04",
    category: "建站",
    url: "#"
  },
  {
    title: "如何新增一个插件下载入口",
    summary:
      "只需要编辑 content/plugins.json，补充插件名称、版本、说明和下载链接。",
    date: "2026-05-04",
    category: "教程",
    url: "#"
  }
];

const state = {
  site: fallbackSite,
  plugins: fallbackPlugins,
  posts: fallbackPosts,
  query: ""
};

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => Array.from(document.querySelectorAll(selector));

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function normalizeText(value) {
  return String(value ?? "").toLowerCase().trim();
}

async function loadJson(path, fallback) {
  if (window.location.protocol === "file:") {
    return fallback;
  }

  try {
    const response = await fetch(path, { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`Failed to load ${path}`);
    }
    return await response.json();
  } catch (error) {
    console.warn(error);
    return fallback;
  }
}

function applySiteContent() {
  const { site } = state;
  document.title = site.siteName || fallbackSite.siteName;

  $$("[data-site-name]").forEach((node) => {
    node.textContent = site.siteName || fallbackSite.siteName;
  });

  const heroTitle = $("[data-hero-title]");
  const domain = $("[data-domain]");
  const tagline = $("[data-tagline]");
  const intro = $("[data-intro]");
  const about = $("[data-about]");
  const footer = $("[data-footer-text]");

  if (heroTitle) heroTitle.textContent = site.siteName || fallbackSite.siteName;
  if (domain) domain.textContent = site.domain || fallbackSite.domain;
  if (tagline) tagline.textContent = site.tagline || fallbackSite.tagline;
  if (intro) intro.textContent = site.intro || fallbackSite.intro;
  if (about) about.textContent = site.about || fallbackSite.about;
  if (footer) footer.textContent = site.footerText || fallbackSite.footerText;

  const socialWrap = $("[data-social-links]");
  if (socialWrap) {
    const links = Array.isArray(site.socialLinks) ? site.socialLinks : [];
    socialWrap.innerHTML = links
      .map((link) => {
        const href = link.url || "#";
        return `<a href="${escapeHtml(href)}" target="_blank" rel="noopener">${escapeHtml(
          link.name || href
        )}</a>`;
      })
      .join("");
  }
}

function itemMatchesQuery(item) {
  if (!state.query) {
    return true;
  }

  const haystack = [
    item.name,
    item.title,
    item.version,
    item.description,
    item.summary,
    item.platform,
    item.category,
    ...(Array.isArray(item.tags) ? item.tags : [])
  ]
    .map(normalizeText)
    .join(" ");

  return haystack.includes(state.query);
}

function renderPlugins() {
  const grid = $("#plugin-grid");
  if (!grid) return;

  const plugins = state.plugins.filter(itemMatchesQuery);
  const count = $("[data-plugin-count]");
  if (count) count.textContent = String(state.plugins.length);

  if (!plugins.length) {
    grid.innerHTML = `<div class="empty-state">没有找到匹配的插件。可以换个关键词试试。</div>`;
    return;
  }

  grid.innerHTML = plugins
    .map((plugin) => {
      const tags = Array.isArray(plugin.tags) ? plugin.tags : [];
      const name = plugin.name || "未命名插件";
      const initials = name.replace(/\s+/g, "").slice(0, 2).toUpperCase() || "JY";
      const href = plugin.downloadUrl || "#";
      const disabled = href === "#";

      return `
        <article class="plugin-card">
          <div class="plugin-topline">
            <span class="plugin-icon" aria-hidden="true">${escapeHtml(initials)}</span>
            <span class="plugin-version">${escapeHtml(plugin.version || "v0.0.0")}</span>
          </div>
          <h3>${escapeHtml(name)}</h3>
          <p>${escapeHtml(plugin.description || "暂无说明。")}</p>
          <span class="platform-pill">${escapeHtml(plugin.platform || "通用")}</span>
          <div class="tag-row">
            ${tags.map((tag) => `<span>${escapeHtml(tag)}</span>`).join("")}
          </div>
          <div class="card-footer">
            <span class="updated-at">${escapeHtml(plugin.updatedAt || "待更新")}</span>
            <a class="download-link" href="${escapeHtml(href)}" ${
        disabled ? 'aria-disabled="true"' : 'target="_blank" rel="noopener"'
      }>下载</a>
          </div>
        </article>
      `;
    })
    .join("");
}

function renderPosts() {
  const grid = $("#post-grid");
  if (!grid) return;

  const posts = state.posts.filter(itemMatchesQuery);
  const count = $("[data-post-count]");
  if (count) count.textContent = String(state.posts.length);

  if (!posts.length) {
    grid.innerHTML = `<div class="empty-state">没有找到匹配的文章。</div>`;
    return;
  }

  grid.innerHTML = posts
    .map((post) => {
      const href = post.url || "#";
      const disabled = href === "#";
      return `
        <article class="post-card">
          <div class="post-topline">
            <span class="post-date">${escapeHtml(post.date || "待发布")}</span>
            <span class="post-category">${escapeHtml(post.category || "记录")}</span>
          </div>
          <h3>${escapeHtml(post.title || "未命名文章")}</h3>
          <p>${escapeHtml(post.summary || "暂无摘要。")}</p>
          <div class="card-footer">
            <span class="updated-at">文章入口</span>
            <a class="text-link" href="${escapeHtml(href)}" ${
        disabled ? 'aria-disabled="true"' : 'target="_blank" rel="noopener"'
      }>阅读</a>
          </div>
        </article>
      `;
    })
    .join("");
}

function renderAll() {
  applySiteContent();
  renderPlugins();
  renderPosts();
}

function setupSearch() {
  const input = $("#site-search");
  if (!input) return;

  input.addEventListener("input", () => {
    state.query = normalizeText(input.value);
    renderPlugins();
    renderPosts();
  });
}

function setupTheme() {
  const toggle = $("#theme-toggle");
  const saved = window.localStorage.getItem("jy-theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const initialTheme = saved || (prefersDark ? "dark" : "light");

  function setTheme(theme) {
    document.documentElement.dataset.theme = theme;
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", theme === "dark" ? "#18171d" : "#f7f9fe");
    if (toggle) {
      toggle.setAttribute(
        "aria-label",
        theme === "dark" ? "切换浅色模式" : "切换深色模式"
      );
    }
  }

  setTheme(initialTheme);

  toggle?.addEventListener("click", () => {
    const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    window.localStorage.setItem("jy-theme", next);
    setTheme(next);
    drawHeroCanvas();
  });
}

function setupMobileNav() {
  const wrap = $(".nav-wrap");
  const toggle = $(".nav-toggle");
  if (!wrap || !toggle) return;

  toggle.addEventListener("click", () => {
    const isOpen = wrap.classList.toggle("nav-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  $$(".nav-menu a").forEach((link) => {
    link.addEventListener("click", () => {
      wrap.classList.remove("nav-open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
}

function getCssColor(name) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

function drawRoundRect(ctx, x, y, width, height, radius) {
  const r = Math.min(radius, width / 2, height / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + width, y, x + width, y + height, r);
  ctx.arcTo(x + width, y + height, x, y + height, r);
  ctx.arcTo(x, y + height, x, y, r);
  ctx.arcTo(x, y, x + width, y, r);
  ctx.closePath();
}

function drawHeroCanvas(time = 0) {
  const canvas = $("#hero-canvas");
  if (!canvas) return;

  const rect = canvas.getBoundingClientRect();
  const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
  const width = Math.max(320, rect.width);
  const height = Math.max(280, rect.height);

  if (canvas.width !== Math.floor(width * dpr) || canvas.height !== Math.floor(height * dpr)) {
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
  }

  const ctx = canvas.getContext("2d");
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, width, height);

  const card = getCssColor("--card-bg");
  const line = getCssColor("--line");
  const text = getCssColor("--text");
  const second = getCssColor("--second-text");
  const theme = getCssColor("--theme");
  const themeSoft = getCssColor("--theme-soft");
  const accents = ["#57bd6a", "#d8213c", "#f2b94b", "#5ca1ff"];
  const pulse = (Math.sin(time / 850) + 1) / 2;

  ctx.fillStyle = card;
  ctx.fillRect(0, 0, width, height);

  ctx.strokeStyle = line;
  ctx.lineWidth = 1;
  for (let x = 24; x < width; x += 44) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }
  for (let y = 22; y < height; y += 44) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }

  const panelX = width * 0.09;
  const panelY = height * 0.14;
  const panelW = width * 0.58;
  const panelH = height * 0.52;

  drawRoundRect(ctx, panelX, panelY, panelW, panelH, 8);
  ctx.fillStyle = "rgba(255,255,255,0.02)";
  ctx.fill();
  ctx.strokeStyle = line;
  ctx.stroke();

  ctx.fillStyle = theme;
  drawRoundRect(ctx, panelX + 18, panelY + 18, panelW * 0.38, 12, 6);
  ctx.fill();

  ctx.fillStyle = second;
  ctx.font = "700 13px system-ui, sans-serif";
  ctx.fillText("plugins.json", panelX + 18, panelY + 54);

  const rows = [
    [0.72, accents[0]],
    [0.54, theme],
    [0.82, accents[3]],
    [0.43, accents[2]]
  ];

  rows.forEach(([ratio, color], index) => {
    const y = panelY + 82 + index * 36;
    ctx.fillStyle = themeSoft;
    drawRoundRect(ctx, panelX + 18, y, panelW - 36, 14, 7);
    ctx.fill();
    ctx.fillStyle = color;
    drawRoundRect(ctx, panelX + 18, y, (panelW - 36) * ratio, 14, 7);
    ctx.fill();
  });

  const nodeRadius = 22 + pulse * 3;
  const nodes = [
    [width * 0.74, height * 0.19, theme, "GH"],
    [width * 0.83, height * 0.38, accents[0], "CF"],
    [width * 0.72, height * 0.58, accents[2], "JY"]
  ];

  ctx.lineWidth = 3;
  ctx.strokeStyle = "rgba(66, 90, 239, 0.25)";
  ctx.beginPath();
  ctx.moveTo(panelX + panelW - 10, panelY + 94);
  nodes.forEach(([x, y]) => ctx.lineTo(x, y));
  ctx.stroke();

  nodes.forEach(([x, y, color, label], index) => {
    drawRoundRect(ctx, x - nodeRadius, y - nodeRadius, nodeRadius * 2, nodeRadius * 2, 8);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.fillStyle = "#fff";
    ctx.font = "900 14px system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(label, x, y + (index === 1 ? 0 : 1));
  });

  const miniW = width * 0.25;
  const miniH = 74;
  const miniX = width * 0.63;
  const miniY = height * 0.56;
  drawRoundRect(ctx, miniX, miniY, miniW, miniH, 8);
  ctx.fillStyle = card;
  ctx.fill();
  ctx.strokeStyle = line;
  ctx.stroke();
  ctx.fillStyle = text;
  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";
  ctx.font = "900 15px system-ui, sans-serif";
  ctx.fillText("Cloudflare Pages", miniX + 16, miniY + 30);
  ctx.fillStyle = second;
  ctx.font = "700 12px system-ui, sans-serif";
  ctx.fillText("auto deploy", miniX + 16, miniY + 52);
}

function setupCanvas() {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let rafId = 0;

  function frame(time) {
    drawHeroCanvas(time);
    if (!reduceMotion) {
      rafId = window.requestAnimationFrame(frame);
    }
  }

  frame(0);
  window.addEventListener("resize", () => drawHeroCanvas());

  if (reduceMotion && rafId) {
    window.cancelAnimationFrame(rafId);
  }
}

async function init() {
  setupTheme();
  setupMobileNav();
  setupSearch();
  setupCanvas();

  const [site, plugins, posts] = await Promise.all([
    loadJson("content/site.json", fallbackSite),
    loadJson("content/plugins.json", fallbackPlugins),
    loadJson("content/posts.json", fallbackPosts)
  ]);

  state.site = { ...fallbackSite, ...site };
  state.plugins = Array.isArray(plugins) ? plugins : fallbackPlugins;
  state.posts = Array.isArray(posts) ? posts : fallbackPosts;
  renderAll();
}

init();
