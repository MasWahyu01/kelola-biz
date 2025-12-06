import Chart from 'chart.js/auto';

document.addEventListener('DOMContentLoaded', () => {
    // 1. Ambil data yang dikirim dari Blade (via window variable)
    const data = window.dashboardData;

    if (!data) return;

    // --- GRAFIK 1: PIE CHART (Status Layanan) ---
    const ctxPie = document.getElementById('statusChart');
    if (ctxPie) {
        // Siapkan label dan data angka
        const labels = data.status.map(item => item.status.toUpperCase().replace('_', ' '));
        const totals = data.status.map(item => item.total);
        
        new Chart(ctxPie, {
            type: 'doughnut', // Grafik Lingkaran Bolong
            data: {
                labels: labels,
                datasets: [{
                    data: totals,
                    backgroundColor: [
                        '#0d6efd', // Primary (New)
                        '#0dcaf0', // Info (In Progress)
                        '#ffc107', // Warning (Pending)
                        '#198754', // Success (Completed)
                        '#6c757d'  // Secondary (Cancelled)
                    ],
                    hoverOffset: 4
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { position: 'bottom' }
                }
            }
        });
    }

    // --- GRAFIK 2: BAR CHART (Tren Bulanan) ---
    const ctxBar = document.getElementById('trendChart');
    if (ctxBar) {
        const months = data.monthly.map(item => item.month);
        const counts = data.monthly.map(item => item.total);

        new Chart(ctxBar, {
            type: 'bar', // Grafik Batang
            data: {
                labels: months,
                datasets: [{
                    label: 'Layanan Baru',
                    data: counts,
                    backgroundColor: '#6610f2', // Warna Ungu
                    borderRadius: 5
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: { beginAtZero: true, ticks: { stepSize: 1 } }
                }
            }
        });
    }
});