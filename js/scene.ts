import * as THREE from 'three'

// Configuración de la escena
const scene = new THREE.Scene()

// Configuración de la cámara
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
)
camera.position.set(0, 5, 10)
camera.lookAt(0, 0, 0)

// Configuración del renderer
const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap

// Iluminación
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
directionalLight.position.set(5, 5, 5)
directionalLight.castShadow = true
scene.add(directionalLight)

// Terreno básico
const terrainGeometry = new THREE.PlaneGeometry(100, 100, 20, 20)
const terrainMaterial = new THREE.MeshStandardMaterial({
  color: 0x3a7e4d,
  side: THREE.DoubleSide,
  wireframe: false
})
const terrain = new THREE.Mesh(terrainGeometry, terrainMaterial)
terrain.rotation.x = -Math.PI / 2
terrain.receiveShadow = true
scene.add(terrain)

// Función de animación
function animate() {
  requestAnimationFrame(animate)
  renderer.render(scene, camera)
}

// Manejo de redimensionamiento
function handleResize() {
  const width = window.innerWidth
  const height = window.innerHeight
  camera.aspect = width / height
  camera.updateProjectionMatrix()
  renderer.setSize(width, height)
}

window.addEventListener('resize', handleResize)

// Exportar elementos necesarios
export {
  scene,
  camera,
  renderer,
  animate
} 