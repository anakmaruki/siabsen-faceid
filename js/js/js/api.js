// ============================================
// API MODULE - Google Apps Script Integration
// ============================================

// IMPORTANT: Replace this with your Google Apps Script deployment URL
const GAS_URL = 'https://script.google.com/macros/d/YOUR_DEPLOYMENT_ID/usercopy';

/**
 * API Call Helper
 */
async function apiCall(action, data = {}) {
    try {
        const response = await fetch(GAS_URL, {
            method: 'POST',
            body: JSON.stringify({
                action: action,
                data: data
            })
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.statusText}`);
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('API Call Error:', error);
        throw error;
    }
}

/**
 * GET ENDPOINTS
 */

// Dapatkan semua pegawai
async function getPegawai() {
    return await apiCall('getPegawai');
}

// Dapatkan detail pegawai
async function getPegawaiById(nip) {
    return await apiCall('getPegawaiById', { nip });
}

// Dapatkan semua absensi
async function getAbsensi(filters = {}) {
    return await apiCall('getAbsensi', filters);
}

// Dapatkan absensi pegawai
async function getAbsensiPegawai(nip) {
    return await apiCall('getAbsensiPegawai', { nip });
}

// Dapatkan data dashboard
async function getDashboard() {
    return await apiCall('getDashboard');
}

// Dapatkan izin/sakit
async function getIzin(filters = {}) {
    return await apiCall('getIzin', filters);
}

/**
 * POST ENDPOINTS
 */

// Simpan pegawai baru
async function savePegawai(pegawai) {
    return await apiCall('savePegawai', pegawai);
}

// Update pegawai
async function updatePegawai(nip, pegawai) {
    return await apiCall('updatePegawai', { nip, pegawai });
}

// Hapus pegawai
async function deletePegawai(nip) {
    return await apiCall('deletePegawai', { nip });
}

// Registrasi Face ID
async function registrasi FaceID(nip, descriptor, photoUrl) {
    return await apiCall('registrasi FaceID', { nip, descriptor, photoUrl });
}

// Absensi masuk
async function absenMasuk(absensi) {
    return await apiCall('absenMasuk', absensi);
}

// Absensi pulang
async function absenPulang(absensi) {
    return await apiCall('absenPulang', absensi);
}

// Simpan izin/sakit
async function simpanIzin(izin) {
    return await apiCall('simpanIzin', izin);
}

// Update status izin
async function updateIzinStatus(id, status) {
    return await apiCall('updateIzinStatus', { id, status });
}

/**
 * Local Storage API (untuk demo/offline)
 */

function saveLocalData(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

function getLocalData(key) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
}

/**
 * Mock API untuk Demo
 */

const mockData = {
    pegawai: [
        { nip: 'EMP001', nama: 'John Doe', jabatan: 'Manager', unit: 'IT', email: 'john@example.com', wa: '081234567890' },
        { nip: 'EMP002', nama: 'Jane Smith', jabatan: 'Developer', unit: 'IT', email: 'jane@example.com', wa: '081234567891' },
        { nip: 'EMP003', nama: 'Bob Johnson', jabatan: 'Designer', unit: 'Design', email: 'bob@example.com', wa: '081234567892' }
    ],
    absensi: [
        { nip: 'EMP001', tanggal: '2026-01-10', jamMasuk: '07:30', jamPulang: '17:00', status: 'Hadir', lokasi: '-6.2088, 106.8456' },
        { nip: 'EMP002', tanggal: '2026-01-10', jamMasuk: '08:15', jamPulang: '17:00', status: 'Terlambat', lokasi: '-6.2088, 106.8456' },
        { nip: 'EMP003', tanggal: '2026-01-10', jamMasuk: '08:00', jamPulang: '17:30', status: 'Hadir', lokasi: '-6.2088, 106.8456' }
    ]
};

// Get mock data
function getMockPegawai() {
    return mockData.pegawai;
}

function getMockAbsensi() {
    return mockData.absensi;
}
