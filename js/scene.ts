import * as THREE from 'three'
import { WingSuit } from './wingsuit'

// Configuración de la escena
const scene = new THREE.Scene()
scene.background = new THREE.Color(0x87CEEB) // Color de cielo

// Configuración de la cámara
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
)
camera.position.set(0, 15, 20)
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
directionalLight.shadow.mapSize.width = 2048
directionalLight.shadow.mapSize.height = 2048
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

// Crear el traje de alas
const wingsuit = new WingSuit({
  position: new THREE.Vector3(0, 10, 0),
  rotation: new THREE.Euler(-Math.PI / 6, 0, 0), // Inclinación inicial
  color: 0xff0000
})
scene.add(wingsuit.mesh)

// Función de animación
function animate() {
  requestAnimationFrame(animate)
  
  // Actualizar la posición de la cámara para seguir al wingsuit
  camera.position.copy(wingsuit.mesh.position)
  camera.position.y += 5 // Altura sobre el wingsuit
  camera.position.z += 15 // Distancia detrás del wingsuit
  camera.lookAt(wingsuit.mesh.position)
  
  // Actualizar el wingsuit
  wingsuit.update()
  
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
  animate,
  wingsuit
} 