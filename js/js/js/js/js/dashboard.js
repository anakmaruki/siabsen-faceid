// ============================================
// DASHBOARD MODULE
// ============================================

let dashboardData = {};
let chartInstances = {};

/**
 * Load Dashboard Data
 */
async function loadDashboardData() {
    try {
        // Use mock data for demo
        dashboardData = {
            totalPegawai: 25,
            hadirHariIni: 22,
            terlambat: 2,
            izin: 1,
            sakit: 0,
            alpha: 0,
            kehadiranMingguan: {
                labels: ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat'],
                data: [20, 21, 19, 22, 20]
            },
            kehadiranBulanan: {
                labels: ['Minggu 1', 'Minggu 2', 'Minggu 3', 'Minggu 4'],
                data: [85, 88, 82, 90]
            },
            recentActivities: [
                { nip: 'EMP001', nama: 'John Doe', status: 'Hadir', waktu: '07:30', type: 'masuk' },
                { nip: 'EMP002', nama: 'Jane Smith', status: 'Terlambat', waktu: '08:15', type: 'masuk' },
                { nip: 'EMP001', nama: 'John Doe', status: 'Hadir', waktu: '17:00', type: 'pulang' }
            ]
        };
        
        updateStatCards();
        updateCharts();
        updateActivityTable();
        
    } catch (error) {
        console.error('Error loading dashboard data:', error);
        showToast('Error loading dashboard data', 'danger');
    }
}

/**
 * Update Stat Cards
 */
function updateStatCards() {
    const stats = [
        { id: 'totalPegawai', value: dashboardData.totalPegawai, label: 'Total Pegawai', icon: 'bi-people' },
        { id: 'hadirHariIni', value: dashboardData.hadirHariIni, label: 'Hadir Hari Ini', icon: 'bi-check-circle', color: 'success' },
        { id: 'terlambat', value: dashboardData.terlambat, label: 'Terlambat', icon: 'bi-clock', color: 'warning' },
        { id: 'izin', value: dashboardData.izin, label: 'Izin', icon: 'bi-file-earmark', color: 'info' },
        { id: 'sakit', value: dashboardData.sakit, label: 'Sakit', icon: 'bi-heart', color: 'danger' },
        { id: 'alpha', value: dashboardData.alpha, label: 'Alpha', icon: 'bi-x-circle', color: 'secondary' }
    ];
    
    stats.forEach(stat => {
        const element = document.getElementById(`stat-${stat.id}`);
        if (element) {
            element.innerHTML = `
                <div class="stat-card card h-100">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-start">
                            <div>
                                <p class="stat-label mb-2">${stat.label}</p>
                                <p class="stat-number">${stat.value}</p>
                            </div>
                            <div>
                                <i class="bi ${stat.icon}" style="font-size: 2rem; color: ${stat.color ? 'var(--' + stat.color + '-color)' : 'var(--primary-color)'}"></i>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }
    });
}

/**
 * Update Charts
 */
function updateCharts() {
    // Chart 1: Kehadiran Mingguan
    const weeklyCtx = document.getElementById('weeklyAttendanceChart');
    if (weeklyCtx) {
        if (chartInstances.weekly) {
            chartInstances.weekly.destroy();
        }
        
        chartInstances.weekly = new Chart(weeklyCtx, {
            type: 'bar',
            data: {
                labels: dashboardData.kehadiranMingguan.labels,
                datasets: [{
                    label: 'Kehadiran Mingguan',
                    data: dashboardData.kehadiranMingguan.data,
                    backgroundColor: 'rgba(13, 110, 253, 0.6)',
                    borderColor: 'rgba(13, 110, 253, 1)',
                    borderWidth: 1,
                    borderRadius: 5
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        position: 'bottom'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 25
                    }
                }
            }
        });
    }
    
    // Chart 2: Kehadiran Bulanan
    const monthlyCtx = document.getElementById('monthlyAttendanceChart');
    if (monthlyCtx) {
        if (chartInstances.monthly) {
            chartInstances.monthly.destroy();
        }
        
        chartInstances.monthly = new Chart(monthlyCtx, {
            type: 'line',
            data: {
                labels: dashboardData.kehadiranBulanan.labels,
                datasets: [{
                    label: 'Presentasi Kehadiran',
                    data: dashboardData.kehadiranBulanan.data,
                    borderColor: 'rgba(13, 110, 253, 1)',
                    backgroundColor: 'rgba(13, 110, 253, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: 'rgba(13, 110, 253, 1)',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointRadius: 5,
                    pointHoverRadius: 7
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        position: 'bottom'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100
                    }
                }
            }
        });
    }
}

/**
 * Update Activity Table
 */
function updateActivityTable() {
    const tableBody = document.getElementById('activityTableBody');
    if (!tableBody) return;
    
    let html = '';
    dashboardData.recentActivities.forEach((activity, index) => {
        const statusBadge = activity.status === 'Hadir' 
            ? '<span class="badge badge-hadir">Hadir</span>' 
            : '<span class="badge badge-terlambat">Terlambat</span>';
        
        const actionBadge = activity.type === 'masuk'
            ? '<span class="badge bg-primary">Masuk</span>'
            : '<span class="badge bg-info">Pulang</span>';
        
        html += `
            <tr>
                <td>${index + 1}</td>
                <td>${activity.nip}</td>
                <td>${activity.nama}</td>
                <td>${actionBadge}</td>
                <td>${activity.waktu}</td>
                <td>${statusBadge}</td>
            </tr>
        `;
    });
    
    tableBody.innerHTML = html;
}

/**
 * Initialize Dashboard
 */
document.addEventListener('DOMContentLoaded', () => {
    requireRole(['admin']);
    setupUserDisplay();
    loadDashboardData();
});
