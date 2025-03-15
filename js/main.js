/**
 * Wing-Suit Racing Game - Main JS
 * Inicializa la escena ThreeJS y configura el sistema de renderizado
 */

// Variables globales
let scene, camera, renderer;
let terrainManager;
let fpsCounter;
let controls; // Para desarrollo solamente

/**
 * Inicializar la escena
 */
function initScene() {
    // Contenedor
    const container = document.getElementById('scene-container');
    
    // Crear escena
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87CEEB); // Cielo azul
    scene.fog = new THREE.FogExp2(0x87CEEB, 0.0015); // Niebla para efecto de distancia
    
    // Crear cámara
    const fov = 60;
    const aspect = window.innerWidth / window.innerHeight;
    const near = 0.1;
    const far = 10000;
    camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.set(0, 200, 500);
    camera.lookAt(0, 0, 0);
    
    // Crear renderizador
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Limitar para mejor rendimiento
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);
    
    // Controles de órbita (solo para desarrollo)
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    
    // Contador de FPS
    fpsCounter = new FPSCounter();
    
    // Eventos de ventana
    window.addEventListener('resize', onWindowResize);
}

/**
 * Añadir luces a la escena
 */
function addLights() {
    // Luz ambiental (iluminación general)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    // Luz direccional (sol)
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(100, 300, 100);
    directionalLight.castShadow = true;
    
    // Configurar área de sombras
    directionalLight.shadow.camera.left = -500;
    directionalLight.shadow.camera.right = 500;
    directionalLight.shadow.camera.top = 500;
    directionalLight.shadow.camera.bottom = -500;
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 1000;
    directionalLight.shadow.mapSize.width = 1024;
    directionalLight.shadow.mapSize.height = 1024;
    
    scene.add(directionalLight);
    
    // Ayudantes visuales (solo para desarrollo)
    // const helper = new THREE.DirectionalLightHelper(directionalLight, 10);
    // scene.add(helper);
}

/**
 * Crear y cargar terreno
 */
async function createTerrain() {
    terrainManager = new TerrainManager(scene);
    
    // Tratar de cargar un modelo 3D para el terreno
    // Nota: Este es un URL a un modelo de ejemplo, debe ser reemplazado
    // por un modelo real antes de la implementación final
    const terrainModelUrl = 'models/mountain_terrain.glb';
    
    try {
        // Intentar cargar el modelo 3D
        await terrainManager.loadTerrainModel(terrainModelUrl);
    } catch (error) {
        // Si falla, crear un terreno procedural
        console.warn("Usando terreno procedural como respaldo");
        terrainManager.createProceduralTerrain();
    }
}

/**
 * Manejar el cambio de tamaño de ventana
 */
function onWindowResize() {
    // Actualizar cámara
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    
    // Actualizar renderizador
    renderer.setSize(window.innerWidth, window.innerHeight);
}

/**
 * Bucle de animación
 */
function animate() {
    requestAnimationFrame(animate);
    
    // Actualizar controles (solo para desarrollo)
    controls.update();
    
    // Actualizar contador de FPS
    fpsCounter.update();
    
    // Renderizar escena
    renderer.render(scene, camera);
}

/**
 * Función principal para iniciar la aplicación
 */
async function main() {
    // Inicializar escena
    initScene();
    
    // Añadir luces
    addLights();
    
    // Crear terreno
    await createTerrain();
    
    // Iniciar bucle de animación
    animate();
}

// Ejecutar la función principal cuando se carga la ventana
window.addEventListener('load', main); 