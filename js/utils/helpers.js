/**
 * Utilidades para el juego de carreras con traje de alas
 */

// Contador de FPS
class FPSCounter {
    constructor() {
        this.fps = 0;
        this.frames = 0;
        this.lastTime = performance.now();
        this.fpsElement = document.getElementById('fps-counter');
    }

    update() {
        this.frames++;
        const time = performance.now();
        const elapsed = time - this.lastTime;

        if (elapsed >= 1000) {
            this.fps = Math.round(this.frames / (elapsed / 1000));
            this.fpsElement.textContent = `FPS: ${this.fps}`;
            this.frames = 0;
            this.lastTime = time;
        }

        return this.fps;
    }
}

// Función para cargar modelos GLTF/GLB
function loadModel(url, onProgress) {
    return new Promise((resolve, reject) => {
        const loader = new THREE.GLTFLoader();
        
        loader.load(
            url,
            (gltf) => {
                resolve(gltf);
            },
            (xhr) => {
                if (onProgress) {
                    onProgress(xhr.loaded / xhr.total * 100);
                }
            },
            (error) => {
                console.error('Error cargando modelo:', error);
                reject(error);
            }
        );
    });
}

// Función para generar un terreno procedural simple
function createProceduralTerrain(width, height, segmentsW, segmentsH, heightScale) {
    const geometry = new THREE.PlaneGeometry(width, height, segmentsW, segmentsH);
    
    // Generar alturas aleatorias para un terreno montañoso
    const vertices = geometry.attributes.position.array;
    for (let i = 0; i < vertices.length; i += 3) {
        // Aplicar ruido para la altura (y) - podríamos usar Perlin/Simplex noise para mejores resultados
        if (i % 3 === 1) { // solo modificar coordenada Y
            const xPos = vertices[i-1] / width;
            const zPos = vertices[i+1] / height;
            
            // Fórmula simple para generar montañas (en producción usaríamos un algoritmo de ruido mejor)
            vertices[i] = Math.sin(xPos * 10) * Math.cos(zPos * 10) * heightScale;
        }
    }
    
    geometry.computeVertexNormals();
    
    // Material básico para el terreno
    const material = new THREE.MeshStandardMaterial({
        color: 0x3d6d4a,  // Verde oscuro para simular montañas
        wireframe: false,
        flatShading: true
    });
    
    return new THREE.Mesh(geometry, material);
} 