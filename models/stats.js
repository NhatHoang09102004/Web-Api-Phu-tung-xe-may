// public/js/stats.js
// Client script for /stats page. Requires Chart.js loaded first.
// Assumes DOM contains elements with IDs:
// totalProducts, monthlyRevenue, topBrand, newCustomers, lowStockCount, lowThresholdView, topLowStockBody, overviewChart, btnRefresh, btnDownloadChart

const API_BASE = (window.__API_BASE__ || "/api"); // or set window.__API_BASE__ = 'https://...'
const fmtVND = (n) => (n == null ? "—" : Number(n).toLocaleString("vi-VN") + " ₫");
const fmtShortM = (v) => (v == null ? "—" : (Math.round((v/1000000) * 100)/100) + " M");

// charts holders
let overviewChart = null;
let brandChart = null;
let categoryChart = null;

function initCharts() {
  // overviewChart (line) — revenue
  const ctx = document.getElementById("overviewChart").getContext("2d");
  overviewChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: ["-11","-10","-9","-8","-7","-6","-5","-4","-3","-2","-1","0"],
      datasets: [{
        label: "Doanh thu (triệu ₫)",
        data: Array(12).fill(0),
        borderWidth: 3,
        tension: 0.35,
        fill: true,
        pointRadius: 4,
      }]
    },
    options: { responsive: true, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true } } }
  });

  // brandChart (bar) placeholder
  const bctx = document.getElementById("brandChart");
  if (bctx) {
    brandChart = new Chart(bctx, {
      type: "bar",
      data: { labels: [], datasets: [{ label: "Tồn kho", data: [], borderRadius: 6 }] },
      options: { responsive: true, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true } } }
    });
  }

  // categoryChart (doughnut) placeholder
  const cctx = document.getElementById("categoryChart");
  if (cctx) {
    categoryChart = new Chart(cctx, { type: "doughnut", data: { labels: [], datasets: [{ data: [] }] }, options: { responsive: true } });
  }
}

async function loadStats() {
  try {
    const res = await fetch(`${API_BASE}/stats/overview`);
    if (!res.ok) throw new Error("Không thể lấy stats");
    const data = await res.json();

    // cards
    document.getElementById("totalProducts").textContent = (data.totalProducts ?? 0).toLocaleString("vi-VN");
    const lastRev = Array.isArray(data.monthlyRevenueSeries) && data.monthlyRevenueSeries.length ? data.monthlyRevenueSeries.slice(-1)[0] : 0;
    document.getElementById("monthlyRevenue").textContent = fmtShortM(lastRev);
    document.getElementById("topBrand").textContent = data.topBrand || "—";
    document.getElementById("newCustomers").textContent = (data.newCustomers ?? 0).toLocaleString("vi-VN");

    // low stock
    const threshold = Number(localStorage.getItem("lowStockThreshold") || 5);
    document.getElementById("lowThresholdView").textContent = String(threshold);
    document.getElementById("lowStockCount").textContent = (data.topLowStock?.length ?? 0);

    // top low stock table
    const tbody = document.getElementById("topLowStockBody");
    if (Array.isArray(data.topLowStock) && data.topLowStock.length) {
      tbody.innerHTML = data.topLowStock.map((p, i) => `
        <tr>
          <td>${i+1}</td>
          <td><img src="${p.image || 'https://via.placeholder.com/56'}" width="56" height="44" class="rounded" alt=""></td>
          <td class="fw-semibold">${p.name || ""}</td>
          <td>${p.vehicle || ""}</td>
          <td>${p.model || ""}</td>
          <td>${p.category || ""}</td>
          <td class="text-danger fw-bold">${p.quantity ?? 0}</td>
        </tr>
      `).join("");
    } else {
      tbody.innerHTML = `<tr><td colspan="7" class="text-success text-center py-3">🎉 Không có mặt hàng dưới ngưỡng!</td></tr>`;
    }

    // overviewChart: convert VND -> triệu (for nicer axis)
    if (overviewChart && Array.isArray(data.monthlyRevenueSeries)) {
      overviewChart.data.labels = computeMonthLabels(); // human friendly
      overviewChart.data.datasets[0].data = data.monthlyRevenueSeries.map(v => Math.round((v/1000000) * 100)/100);
      overviewChart.update();
    }

    // brand chart (if placeholder exists)
    if (brandChart && data.totalByBrand) {
      const labels = Object.keys(data.totalByBrand);
      const values = labels.map(k => data.totalByBrand[k]);
      brandChart.data.labels = labels;
      brandChart.data.datasets[0].data = values;
      brandChart.update();
    }

    // category chart
    if (categoryChart && data.categoryDistribution) {
      const labels = Object.keys(data.categoryDistribution);
      const values = labels.map(k => data.categoryDistribution[k]);
      categoryChart.data.labels = labels;
      categoryChart.data.datasets[0].data = values;
      categoryChart.update();
    }
  } catch (err) {
    console.error("loadStats error:", err);
    // graceful fallback: show placeholders
  }
}

function computeMonthLabels() {
  const now = new Date();
  const labels = [];
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    labels.push(`Th${d.getMonth()+1}`);
  }
  return labels;
}

// auto refresh
let autoTimer = null;
function setAutoRefresh(enabled = false, intervalMs = 30000) {
  if (autoTimer) { clearInterval(autoTimer); autoTimer = null; }
  if (enabled) autoTimer = setInterval(loadStats, intervalMs);
}

// Download overview chart image
function downloadOverviewChart() {
  if (!overviewChart) return alert("Biểu đồ chưa sẵn sàng");
  const url = overviewChart.toBase64Image();
  const a = document.createElement("a");
  a.href = url;
  a.download = `overview_${new Date().toISOString().slice(0,10)}.png`;
  a.click();
}

// wire UI
document.addEventListener("DOMContentLoaded", () => {
  initCharts();
  loadStats();

  const btnRefresh = document.getElementById("btnRefresh");
  if (btnRefresh) btnRefresh.addEventListener("click", () => { loadStats(); });

  const btnDownload = document.getElementById("btnDownloadChart");
  if (btnDownload) btnDownload.addEventListener("click", downloadOverviewChart);

  // optional auto refresh toggle elements (if exist)
  const autoToggle = document.getElementById("autoRefreshToggle");
  const autoInterval = document.getElementById("autoRefreshInterval");
  if (autoToggle && autoInterval) {
    autoToggle.addEventListener("change", () => setAutoRefresh(autoToggle.checked, Number(autoInterval.value)));
    autoInterval.addEventListener("change", () => { if (autoToggle.checked) setAutoRefresh(true, Number(autoInterval.value)); });
  }
});
