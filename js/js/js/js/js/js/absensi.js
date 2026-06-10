// ============================================
// ATTENDANCE MODULE
// ============================================

let currentAbsensiData = {};
let faceDescriptorsDB = [];

/**
 * Initialize Attendance Page
 */
async function initAttendance() {
    requireRole(['pegawai']);
    setupUserDisplay();
    
    // Initialize Face API
    const loaded = await initFaceAPI();
    if (!loaded) {
        showToast('Gagal memuat Face Recognition library', 'danger');
    }
    
    // Load stored face descriptors
    loadStoredDescriptors();
}

/**
 * Load Stored Face Descriptors
 */
function loadStoredDescriptors() {
    const user = getCurrentUser();
    const stored = localStorage.getItem(`facedata_${user.username}`);
    
    if (stored) {
        try {
            faceDescriptorsDB = JSON.parse(stored);
        } catch (error) {
            console.error('Error loading face descriptors:', error);
        }
    }
}

/**
 * Start Absensi Masuk
 */
async function startAbsensiMasuk() {
    const videoElement = document.getElementById('videoFeed');
    const canvasElement = document.getElementById('canvasOutput');
    const statusElement = document.getElementById('absensiStatus');
    
    if (!videoElement) {
        showToast('Video element not found', 'danger');
        return;
    }
    
    // Start camera
    const cameraStarted = await startCamera(videoElement);
    if (!cameraStarted) return;
    
    // Allow video to load
    await new Promise(resolve => {
        videoElement.onloadedmetadata = resolve;
    });
    
    // Detection loop
    let detectionActive = true;
    let verificationComplete = false;
    
    const detectionLoop = async () => {
        if (!detectionActive) return;
        
        const detections = await detectFace(videoElement);
        
        if (canvasElement && detections.length > 0) {
            drawDetections(canvasElement, detections, videoElement);
        }
        
        if (detections.length > 0 && !verificationComplete) {
            // Verify face
            const verification = await verifyFaceID(videoElement, faceDescriptorsDB);
            
            if (verification.success) {
                detectionActive = false;
                verificationComplete = true;
                
                // Get location
                try {
                    const location = await getCurrentLocation();
                    
                    // Capture photo
                    const photo = capturePhoto(videoElement);
                    
                    // Create absensi data
                    const user = getCurrentUser();
                    const time = getCurrentTime();
                    const isLateStatus = isLate();
                    
                    currentAbsensiData = {
                        nip: user.username,
                        nama: user.name,
                        tanggal: new Date().toLocaleDateString('id-ID'),
                        jamMasuk: time,
                        status: isLateStatus ? 'Terlambat' : 'Hadir',
                        latitude: location.latitude,
                        longitude: location.longitude,
                        foto: photo,
                        confidence: verification.confidence
                    };
                    
                    // Save absensi
                    await saveAbsensiData();
                    
                    stopCamera();
                    
                } catch (error) {
                    console.error('Error getting location:', error);
                    showToast('Error: ' + error, 'danger');
                }
            } else {
                updateFaceStatus(verification, 'faceStatus');
            }
        }
        
        requestAnimationFrame(detectionLoop);
    };
    
    detectionLoop();
}

/**
 * Save Absensi Data
 */
async function saveAbsensiData() {
    try {
        // Save to localStorage (demo)
        const absensiList = localStorage.getItem('absensiList')
            ? JSON.parse(localStorage.getItem('absensiList'))
            : [];
        
        absensiList.push(currentAbsensiData);
        localStorage.setItem('absensiList', JSON.stringify(absensiList));
        
        // Show success message
        showToast('✓ Absensi Masuk Berhasil!', 'success');
        
        // Show absensi details
        displayAbsensiResult();
        
    } catch (error) {
        console.error('Error saving absensi:', error);
        showToast('Error saving absensi: ' + error, 'danger');
    }
}

/**
 * Display Absensi Result
 */
function displayAbsensiResult() {
    const resultElement = document.getElementById('absensiResult');
    if (!resultElement) return;
    
    const data = currentAbsensiData;
    const statusBadge = data.status === 'Hadir'
        ? '<span class="badge badge-hadir">Hadir</span>'
        : '<span class="badge badge-terlambat">Terlambat</span>';
    
    const html = `
        <div class="alert alert-success alert-dismissible fade show" role="alert">
            <h5 class="alert-heading">✓ Absensi Masuk Berhasil!</h5>
            <hr>
            <table class="table table-sm">
                <tr>
                    <td><strong>Nama</strong></td>
                    <td>${data.nama}</td>
                </tr>
                <tr>
                    <td><strong>NIP</strong></td>
                    <td>${data.nip}</td>
                </tr>
                <tr>
                    <td><strong>Tanggal</strong></td>
                    <td>${data.tanggal}</td>
                </tr>
                <tr>
                    <td><strong>Jam Masuk</strong></td>
                    <td>${data.jamMasuk}</td>
                </tr>
                <tr>
                    <td><strong>Status</strong></td>
                    <td>${statusBadge}</td>
                </tr>
                <tr>
                    <td><strong>Confidence</strong></td>
                    <td>${data.confidence.toFixed(2)}%</td>
                </tr>
            </table>
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `;
    
    resultElement.innerHTML = html;
}

/**
 * Get Attendance History
 */
function getAttendanceHistory() {
    const user = getCurrentUser();
    const absensiList = localStorage.getItem('absensiList')
        ? JSON.parse(localStorage.getItem('absensiList'))
        : [];
    
    return absensiList.filter(a => a.nip === user.username);
}

/**
 * Display Attendance History
 */
function displayAttendanceHistory() {
    const tableBody = document.getElementById('attendanceTableBody');
    if (!tableBody) return;
    
    const history = getAttendanceHistory();
    
    let html = '';
    history.reverse().forEach((item, index) => {
        const statusBadge = item.status === 'Hadir'
            ? '<span class="badge badge-hadir">Hadir</span>'
            : '<span class="badge badge-terlambat">Terlambat</span>';
        
        html += `
            <tr>
                <td>${index + 1}</td>
                <td>${item.tanggal}</td>
                <td>${item.jamMasuk}</td>
                <td>${item.jamPulang || '-'}</td>
                <td>${statusBadge}</td>
                <td>${item.confidence.toFixed(2)}%</td>
            </tr>
        `;
    });
    
    if (html === '') {
        html = '<tr><td colspan="6" class="text-center text-muted">Tidak ada data absensi</td></tr>';
    }
    
    tableBody.innerHTML = html;
}

/**
 * Initialize on page load
 */
document.addEventListener('DOMContentLoaded', () => {
    initAttendance();
    displayAttendanceHistory();
});
