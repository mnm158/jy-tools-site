(() => {
  const currentScript = document.currentScript;
  const configPath = currentScript?.dataset.config || "content/site.json";

  function injectCloudflareBeacon(token) {
    if (!token || document.querySelector("script[data-jy-cloudflare-analytics]")) {
      return;
    }

    const script = document.createElement("script");
    script.defer = true;
    script.src = "https://static.cloudflareinsights.com/beacon.min.js";
    script.dataset.cfBeacon = JSON.stringify({ token });
    script.dataset.jyCloudflareAnalytics = "true";
    document.head.appendChild(script);
  }

  async function initAnalytics() {
    if (window.location.protocol === "file:") {
      return;
    }

    try {
      const response = await fetch(configPath, { cache: "no-store" });
      if (!response.ok) return;
      const site = await response.json();
      const token = site?.analytics?.cloudflareToken;
      injectCloudflareBeacon(token);
    } catch (error) {
      console.warn("Analytics config not loaded", error);
    }
  }

  initAnalytics();
})();
