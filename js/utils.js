// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * LocalStorage Helper Functions
 */

// Simpan data ke localStorage
function saveToStorage(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
    } catch (error) {
        console.error('Error saving to localStorage:', error);
        return false;
    }
}

// Ambil data dari localStorage
function getFromStorage(key) {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
    } catch (error) {
        console.error('Error reading from localStorage:', error);
        return null;
    }
}

// Hapus data dari localStorage
function removeFromStorage(key) {
    try {
        localStorage.removeItem(key);
        return true;
    } catch (error) {
        console.error('Error removing from localStorage:', error);
        return false;
    }
}

// Clear semua localStorage
function clearAllStorage() {
    try {
        localStorage.clear();
        return true;
    } catch (error) {
        console.error('Error clearing localStorage:', error);
        return false;
    }
}

/**
 * Date & Time Functions
 */

// Format tanggal ke format Indonesia
function formatDate(date) {
    const options = { year: 'numeric', month: 'long', day: 'numeric', locale: 'id-ID' };
    return new Date(date).toLocaleDateString('id-ID', options);
}

// Format waktu ke format HH:MM:SS
function formatTime(date) {
    return new Date(date).toLocaleTimeString('id-ID', { hour12: false });
}

// Format tanggal dan waktu lengkap
function formatDateTime(date) {
    return `${formatDate(date)} ${formatTime(date)}`;
}

// Dapatkan waktu saat ini dalam format HH:MM
function getCurrentTime() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
}

// Cek apakah sudah terlambat (jam 8 pagi)
function isLate() {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const currentMinutes = hours * 60 + minutes;
    const eightAMMinutes = 8 * 60;
    return currentMinutes > eightAMMinutes;
}

// Hitung durasi kerja
function calculateWorkDuration(startTime, endTime) {
    const start = new Date(`2000-01-01 ${startTime}`);
    const end = new Date(`2000-01-01 ${endTime}`);
    const diff = end - start;
    const hours = Math.floor(diff / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    return `${hours}h ${minutes}m`;
}

/**
 * Number & Currency Functions
 */

// Format angka ke format Rupiah
function formatCurrency(amount) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(amount);
}

// Format angka dengan separator
function formatNumber(num) {
    return new Intl.NumberFormat('id-ID').format(num);
}

/**
 * String Functions
 */

// Capitalize string
function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

// Sanitasi input
function sanitizeInput(input) {
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
}

// Validasi email
function validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

// Validasi nomor telepon
function validatePhone(phone) {
    const regex = /^(\+62|62|0)?[0-9]{9,12}$/;
    return regex.test(phone.replace(/\s/g, ''));
}

// Validasi NIP
function validateNIP(nip) {
    return nip.length >= 3;
}

/**
 * Geolocation Functions
 */

// Dapatkan lokasi saat ini
function getCurrentLocation() {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject('Geolocation tidak didukung oleh browser ini');
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                resolve({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    accuracy: position.coords.accuracy,
                    timestamp: new Date()
                });
            },
            (error) => {
                reject(error.message);
            },
            {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0
            }
        );
    });
}

// Hitung jarak antara dua titik GPS (Haversine formula)
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius bumi dalam km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Jarak dalam km
}

/**
 * Camera Functions
 */

// Request camera access
async function requestCameraAccess() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: 'user' }
        });
        return stream;
    } catch (error) {
        throw new Error('Tidak dapat mengakses kamera: ' + error.message);
    }
}

// Stop camera stream
function stopCameraStream(stream) {
    stream.getTracks().forEach(track => track.stop());
}

// Capture screenshot dari video
function captureScreenshot(videoElement) {
    const canvas = document.createElement('canvas');
    canvas.width = videoElement.videoWidth;
    canvas.height = videoElement.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(videoElement, 0, 0);
    return canvas.toDataURL('image/jpeg', 0.8);
}

/**
 * DOM Functions
 */

// Show element
function show(element) {
    if (typeof element === 'string') {
        element = document.getElementById(element);
    }
    if (element) element.style.display = 'block';
}

// Hide element
function hide(element) {
    if (typeof element === 'string') {
        element = document.getElementById(element);
    }
    if (element) element.style.display = 'none';
}

// Toggle visibility
function toggle(element) {
    if (typeof element === 'string') {
        element = document.getElementById(element);
    }
    if (element) {
        element.style.display = element.style.display === 'none' ? 'block' : 'none';
    }
}

// Add class
function addClass(element, className) {
    if (typeof element === 'string') {
        element = document.getElementById(element);
    }
    if (element) element.classList.add(className);
}

// Remove class
function removeClass(element, className) {
    if (typeof element === 'string') {
        element = document.getElementById(element);
    }
    if (element) element.classList.remove(className);
}

// Toggle class
function toggleClass(element, className) {
    if (typeof element === 'string') {
        element = document.getElementById(element);
    }
    if (element) element.classList.toggle(className);
}

/**
 * Dark Mode
 */

function toggleDarkMode() {
    const htmlElement = document.documentElement;
    const currentTheme = htmlElement.getAttribute('data-bs-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    htmlElement.setAttribute('data-bs-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    // Update button icon
    const darkModeBtn = document.getElementById('darkModeBtn');
    if (darkModeBtn) {
        const icon = darkModeBtn.querySelector('i');
        if (icon) {
            icon.className = newTheme === 'dark' ? 'bi bi-sun' : 'bi bi-moon';
        }
    }
}

// Load theme from localStorage
function loadTheme() {
    const theme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-bs-theme', theme);
}

// Load theme on page load
document.addEventListener('DOMContentLoaded', loadTheme);

/**
 * Alert & Notification Functions
 */

// Show toast notification
function showToast(message, type = 'info', duration = 3000) {
    const toastHTML = `
        <div class="toast align-items-center text-white bg-${type} border-0" role="alert" aria-live="assertive" aria-atomic="true">
            <div class="d-flex">
                <div class="toast-body">
                    ${message}
                </div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
            </div>
        </div>
    `;
    
    const toastContainer = document.getElementById('toastContainer') || document.body;
    const toastElement = document.createElement('div');
    toastElement.innerHTML = toastHTML;
    toastContainer.appendChild(toastElement);
    
    const toast = new bootstrap.Toast(toastElement.querySelector('.toast'));
    toast.show();
    
    setTimeout(() => {
        toastElement.remove();
    }, duration);
}

// Show sweet alert
function showAlert(title, message, type = 'info') {
    alert(`${title}\n\n${message}`);
}

/**
 * File Functions
 */

// Read file as data URL
function readFileAsDataURL(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

// Download file
function downloadFile(data, filename, type = 'application/octet-stream') {
    const blob = new Blob([data], { type });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
}

/**
 * QR Code Generator (menggunakan library)
 */

async function generateQRCode(text, elementId) {
    // Menggunakan qrcode.js library
    const element = document.getElementById(elementId);
    if (element) {
        element.innerHTML = '';
        new QRCode(element, {
            text: text,
            width: 200,
            height: 200,
            colorDark: '#000000',
            colorLight: '#ffffff',
            correctLevel: QRCode.CorrectLevel.H
        });
    }
}

/**
 * Export Functions
 */

// Export table to CSV
function exportTableToCSV(tableId, filename = 'export.csv') {
    const table = document.getElementById(tableId);
    if (!table) return;
    
    let csv = [];
    const rows = table.querySelectorAll('tr');
    
    rows.forEach(row => {
        const cols = row.querySelectorAll('td, th');
        const csvRow = [];
        cols.forEach(col => {
            csvRow.push('"' + col.innerText.replace(/"/g, '""') + '"');
        });
        csv.push(csvRow.join(','));
    });
    
    downloadFile(csv.join('\n'), filename, 'text/csv;charset=utf-8;');
}

// Export table to JSON
function exportTableToJSON(tableId, filename = 'export.json') {
    const table = document.getElementById(tableId);
    if (!table) return;
    
    const rows = table.querySelectorAll('tbody tr');
    const headers = Array.from(table.querySelectorAll('thead th')).map(h => h.innerText);
    
    const data = Array.from(rows).map(row => {
        const cols = row.querySelectorAll('td');
        const obj = {};
        headers.forEach((header, index) => {
            obj[header] = cols[index] ? cols[index].innerText : '';
        });
        return obj;
    });
    
    downloadFile(JSON.stringify(data, null, 2), filename, 'application/json;charset=utf-8;');
}

/**
 * Delay/Sleep Function
 */

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Console Logging (Development Only)
 */

function devLog(message, data = null) {
    if (process.env.NODE_ENV === 'development') {
        console.log(`[DEV] ${message}`, data || '');
    }
}

function devError(message, error = null) {
    console.error(`[ERROR] ${message}`, error || '');
}
