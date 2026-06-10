// ============================================
// FACE RECOGNITION MODULE
// ============================================

let currentStream = null;
let faceDescriptors = [];
let capturedPhotos = [];

const FACE_DETECTION_THRESHOLD = 0.85; // 85% accuracy threshold

/**
 * Initialize Face API
 */
async function initFaceAPI() {
    try {
        console.log('Loading face-api models...');
        // Load models dari CDN
        const MODEL_URL = 'https://cdn.jsdelivr.net/npm/@vladmandic/face-api@1.7.13/model/';
        
        await Promise.all([
            faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
            faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
            faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
            faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL)
        ]);
        
        console.log('Face API models loaded successfully');
        return true;
    } catch (error) {
        console.error('Error loading Face API models:', error);
        return false;
    }
}

/**
 * Start Camera
 */
async function startCamera(videoElement) {
    try {
        currentStream = await navigator.mediaDevices.getUserMedia({
            video: {
                width: { ideal: 640 },
                height: { ideal: 480 },
                facingMode: 'user'
            }
        });
        
        videoElement.srcObject = currentStream;
        return true;
    } catch (error) {
        console.error('Error accessing camera:', error);
        showToast('Tidak dapat mengakses kamera: ' + error.message, 'danger');
        return false;
    }
}

/**
 * Stop Camera
 */
function stopCamera() {
    if (currentStream) {
        currentStream.getTracks().forEach(track => track.stop());
        currentStream = null;
    }
}

/**
 * Detect Face
 */
async function detectFace(videoElement) {
    try {
        const detections = await faceapi
            .detectAllFaces(videoElement, new faceapi.TinyFaceDetectorOptions())
            .withFaceLandmarks()
            .withFaceDescriptors();
        
        return detections;
    } catch (error) {
        console.error('Error detecting face:', error);
        return [];
    }
}

/**
 * Draw Face Detection on Canvas
 */
function drawDetections(canvas, detections, videoElement) {
    const displaySize = { 
        width: videoElement.width, 
        height: videoElement.height 
    };
    faceapi.matchDimensions(canvas, displaySize);
    
    const resizedDetections = faceapi.resizeResults(detections, displaySize);
    
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    faceapi.draw.drawDetections(canvas, resizedDetections);
    faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
}

/**
 * Capture Photo
 */
function capturePhoto(videoElement) {
    const canvas = document.createElement('canvas');
    canvas.width = videoElement.videoWidth;
    canvas.height = videoElement.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(videoElement, 0, 0);
    return canvas.toDataURL('image/jpeg', 0.9);
}

/**
 * Registrasi Face ID - Ambil 5 foto
 */
async function startFaceIDRegistration(videoElement) {
    faceDescriptors = [];
    capturedPhotos = [];
    
    const angles = ['Depan', 'Kiri', 'Kanan', 'Atas', 'Bawah'];
    const positions = {
        'Depan': 0,
        'Kiri': 1,
        'Kanan': 2,
        'Atas': 3,
        'Bawah': 4
    };
    
    for (const angle of angles) {
        // Instruksikan user untuk mengambil pose
        showToast(`Silakan hadap ke ${angle}...`, 'info', 5000);
        await sleep(3000);
        
        // Deteksi wajah
        const detections = await detectFace(videoElement);
        
        if (detections.length === 0) {
            showToast(`Wajah tidak terdeteksi saat menghadap ke ${angle}. Silakan coba lagi.`, 'warning', 3000);
            continue;
        }
        
        // Simpan descriptor
        faceDescriptors.push({
            angle: angle,
            descriptor: detections[0].descriptor,
            position: positions[angle]
        });
        
        // Capture foto
        const photo = capturePhoto(videoElement);
        capturedPhotos.push({
            angle: angle,
            data: photo
        });
        
        showToast(`✓ Foto ${angle} berhasil diambil`, 'success', 2000);
    }
    
    return {
        descriptors: faceDescriptors,
        photos: capturedPhotos
    };
}

/**
 * Verifikasi Face ID
 */
async function verifyFaceID(videoElement, storedDescriptors) {
    try {
        const detections = await detectFace(videoElement);
        
        if (detections.length === 0) {
            return {
                success: false,
                confidence: 0,
                message: 'Wajah tidak terdeteksi'
            };
        }
        
        const currentDescriptor = detections[0].descriptor;
        
        // Hitung distance ke semua stored descriptors
        const distances = storedDescriptors.map(stored => {
            const distance = faceapi.euclideanDistance(
                currentDescriptor,
                new Float32Array(stored.descriptor)
            );
            return distance;
        });
        
        // Dapatkan jarak minimum
        const minDistance = Math.min(...distances);
        
        // Konversi distance ke confidence (0-100)
        // Distance 0.4 atau lebih kecil = match, lebih besar = tidak match
        const confidence = Math.max(0, (1 - minDistance) * 100);
        
        return {
            success: confidence >= (FACE_DETECTION_THRESHOLD * 100),
            confidence: confidence,
            distance: minDistance,
            message: confidence >= (FACE_DETECTION_THRESHOLD * 100) 
                ? 'Wajah terverifikasi'
                : 'Wajah tidak cocok'
        };
    } catch (error) {
        console.error('Error verifying face:', error);
        return {
            success: false,
            confidence: 0,
            message: 'Error: ' + error.message
        };
    }
}

/**
 * Compare Multiple Faces
 */
function compareFaces(descriptor1, descriptor2) {
    const distance = faceapi.euclideanDistance(
        new Float32Array(descriptor1),
        new Float32Array(descriptor2)
    );
    return {
        distance: distance,
        match: distance < 0.4
    };
}

/**
 * Display Face Recognition Status
 */
function updateFaceStatus(status, confidence, elementId) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    let html = `
        <div class="alert alert-${status.success ? 'success' : 'warning'}" role="alert">
            <strong>${status.message}</strong><br>
            Confidence: ${status.confidence.toFixed(2)}%
    `;
    
    if (status.distance) {
        html += `<br>Distance: ${status.distance.toFixed(4)}`;
    }
    
    html += '</div>';
    
    element.innerHTML = html;
}

/**
 * Export Face Descriptor to JSON
 */
function exportFaceDescriptor(nip, descriptors) {
    return {
        nip: nip,
        timestamp: new Date().toISOString(),
        descriptors: descriptors.map(d => ({
            angle: d.angle,
            descriptor: Array.from(d.descriptor),
            position: d.position
        }))
    };
}
