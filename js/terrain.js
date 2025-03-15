/**
 * Gestor del terreno para el juego de carreras con traje de alas
 */
class TerrainManager {
    constructor(scene) {
        this.scene = scene;
        this.terrain = null;
        this.isLoaded = false;
        this.loadingIndicator = document.getElementById('loading-indicator');
    }

    // Cargar un modelo de terreno desde un archivo
    async loadTerrainModel(modelUrl) {
        try {
            this.loadingIndicator.textContent = "Cargando terreno...";
            
            const gltf = await loadModel(modelUrl, (progress) => {
                this.loadingIndicator.textContent = `Cargando terreno: ${Math.floor(progress)}%`;
            });
            
            this.terrain = gltf.scene;
            
            // Ajustes al modelo cargado
            this.terrain.scale.set(50, 50, 50); // Escalar según sea necesario
            this.terrain.position.y = -100; // Posicionar en la escena
            
            // Recorrer todos los meshes del modelo para configurar materiales y sombras
            this.terrain.traverse((child) => {
                if (child.isMesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                    
                    // Opcionalmente mejorar materiales
                    if (child.material) {
                        child.material.roughness = 0.8;
                    }
                }
            });
            
            this.scene.add(this.terrain);
            this.isLoaded = true;
            document.body.classList.add('loaded');
            this.loadingIndicator.textContent = "Terreno cargado";
            
            return this.terrain;
        } catch (error) {
            console.error("Error al cargar el modelo de terreno:", error);
            this.loadingIndicator.textContent = "Error al cargar terreno. Usando terreno procedural...";
            
            // Crear terreno procedural como respaldo
            return this.createProceduralTerrain();
        }
    }
    
    // Crear un terreno procedural (como respaldo si falla la carga del modelo)
    createProceduralTerrain() {
        // Crear un terreno grande usando la función de utilidad
        const terrainWidth = 2000;
        const terrainHeight = 2000;
        const terrainSegments = 100;
        const heightScale = 200;
        
        this.terrain = createProceduralTerrain(
            terrainWidth, 
            terrainHeight, 
            terrainSegments, 
            terrainSegments, 
            heightScale
        );
        
        // Rotar para que sea horizontal
        this.terrain.rotation.x = -Math.PI / 2;
        this.terrain.position.y = -100;
        
        // Configurar sombras
        this.terrain.castShadow = false;
        this.terrain.receiveShadow = true;
        
        this.scene.add(this.terrain);
        this.isLoaded = true;
        document.body.classList.add('loaded');
        
        return this.terrain;
    }
} 