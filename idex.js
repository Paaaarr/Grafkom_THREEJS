// index.js

// Impor Three.js sekali di awal
import * as THREE from 'three';

console.log("index.js loaded, THREE imported:", THREE ? "Yes" : "No");

// Variabel global untuk scene, kamera, renderer, dan kubus
let scene, camera, renderer, cube;
let animationId = null;

// --- Fungsi untuk Scene ---
function createScene() {
    const sceneInstance = new THREE.Scene();
    sceneInstance.background = new THREE.Color(0x222222); // Latar belakang scene agak gelap
    console.log("Scene created:", sceneInstance);
    return sceneInstance;
}

// --- Fungsi untuk Kamera ---
function createCamera() {
    const fov = 75; // Field of View
    const aspect = window.innerWidth / window.innerHeight; // Aspect ratio
    const near = 0.1; // Near clipping plane
    const far = 1000; // Far clipping plane
    const cameraInstance = new THREE.PerspectiveCamera(fov, aspect, near, far);
    
    cameraInstance.position.z = 5; // Posisikan kamera sedikit mundur
    // cameraInstance.lookAt(0, 0, 0); // Kamera sudah default melihat ke origin
    console.log("Camera created at z=5:", cameraInstance);
    return cameraInstance;
}

function updateCameraAspect(cameraToUpdate) {
    cameraToUpdate.aspect = window.innerWidth / window.innerHeight;
    cameraToUpdate.updateProjectionMatrix();
    console.log("Camera aspect updated.");
}

// --- Fungsi untuk Renderer ---
function createRenderer(container) {
    const rendererInstance = new THREE.WebGLRenderer({ antialias: true });
    rendererInstance.setSize(window.innerWidth, window.innerHeight);
    rendererInstance.setPixelRatio(window.devicePixelRatio);
    container.appendChild(rendererInstance.domElement); // Ini penting!
    console.log("Renderer created and canvas appended to container:", container);
    return rendererInstance;
}

function updateRendererSize(rendererToUpdate) {
    rendererToUpdate.setSize(window.innerWidth, window.innerHeight);
    console.log("Renderer size updated.");
}

// --- Fungsi untuk Kubus ---
function createBlueCube() {
    const geometry = new THREE.BoxGeometry(1.5, 1.5, 1.5); // Ukuran kubus
    const material = new THREE.MeshBasicMaterial({ color: 0x0000ff }); // Warna biru
    const cubeInstance = new THREE.Mesh(geometry, material);
    // Posisi default kubus adalah (0,0,0)
    console.log("Blue cube created:", cubeInstance);
    return cubeInstance;
}

function rotateCube(cubeToRotate) {
    cubeToRotate.rotation.x += 0.005;
    cubeToRotate.rotation.y += 0.008;
    cubeToRotate.rotation.z += 0.003;
}

// --- Fungsi untuk Loop Animasi ---
function animate() {
    animationId = requestAnimationFrame(animate); // Loop rekursif

    if (cube) {
        rotateCube(cube);
    }
    
    // Pastikan renderer, scene, dan camera sudah ada sebelum render
    if (renderer && scene && camera) {
        renderer.render(scene, camera);
    } else {
        // Log ini akan muncul terus menerus jika ada masalah inisialisasi
        // console.warn("Attempted to render but renderer, scene, or camera is missing.");
    }
}

// --- Fungsi Inisialisasi Utama ---
function init() {
    console.log("init() called.");
    const container = document.getElementById('scene-container');
    if (!container) {
        console.error("CRITICAL: Scene container div#scene-container NOT FOUND in HTML!");
        return; // Hentikan eksekusi jika container tidak ada
    }
    console.log("Scene container found:", container);

    // 1. Buat Scene
    scene = createScene();

    // 2. Buat Kamera
    camera = createCamera();

    // 3. Buat Renderer
    renderer = createRenderer(container);

    // 4. Buat Objek Kubus
    cube = createBlueCube();
    
    // 5. Tambahkan Kubus ke Scene
    if (scene && cube) {
        scene.add(cube);
        console.log("Cube added to scene.");
    } else {
        console.error("CRITICAL: Scene or Cube is undefined. Cannot add cube to scene.");
        return;
    }
    
    // 6. Mulai Loop Animasi
    if (animationId) { // Hentikan loop lama jika ada (seharusnya tidak terjadi di init awal)
        cancelAnimationFrame(animationId);
    }
    animate(); // Panggil fungsi animate untuk memulai loop
    console.log("Animation loop started.");

    // 7. Handle window resize
    window.addEventListener('resize', onWindowResize, false);
    console.log("Resize listener added.");

    // Render sekali di awal untuk memastikan sesuatu muncul jika loop animasi bermasalah
    // Ini bisa membantu debugging, tapi seharusnya tidak perlu jika loop berjalan benar
    if (renderer && scene && camera) {
       // renderer.render(scene, camera); 
       // console.log("Initial render performed.");
    }
}

// --- Fungsi Handler untuk Window Resize ---
function onWindowResize() {
    console.log("Window resize event triggered.");
    if (camera && renderer) {
        updateCameraAspect(camera);
        updateRendererSize(renderer);
        // Tidak perlu memanggil renderer.render() di sini secara eksplisit jika loop animasi berjalan,
        // karena loop akan mengambil perubahan ukuran pada frame berikutnya.
    } else {
        console.warn("onWindowResize called, but camera or renderer is not defined.");
    }
}

// Panggil fungsi init setelah DOM siap
// Ini adalah cara yang lebih aman untuk memastikan DOM sudah dimuat sepenuhnya
if (document.readyState === 'loading') {  // Masih loading
    console.log("DOM is loading, adding DOMContentLoaded listener.");
    document.addEventListener('DOMContentLoaded', init);
} else {  // `DOMContentLoaded` sudah fired
    console.log("DOM already loaded, calling init() directly.");
    init();
}