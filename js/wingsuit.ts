import * as THREE from 'three'

interface WingSuitConfig {
  position?: THREE.Vector3
  rotation?: THREE.Euler
  color?: number
}

interface WingSuitPhysics {
  velocity: THREE.Vector3
  acceleration: THREE.Vector3
  drag: number
  turnSpeed: number
  maxSpeed: number
  minSpeed: number
  gravity: number
}

export class WingSuit {
  mesh: THREE.Group
  body: THREE.Mesh
  wings: THREE.Mesh
  physics: WingSuitPhysics
  isGrounded: boolean

  constructor({
    position = new THREE.Vector3(0, 10, 0),
    rotation = new THREE.Euler(-Math.PI / 6, 0, 0),
    color = 0xff0000
  }: WingSuitConfig = {}) {
    this.mesh = new THREE.Group()
    
    // Crear el cuerpo (cápsula)
    const bodyGeometry = new THREE.CapsuleGeometry(0.5, 2, 4, 8)
    const bodyMaterial = new THREE.MeshStandardMaterial({ color })
    this.body = new THREE.Mesh(bodyGeometry, bodyMaterial)
    this.body.castShadow = true
    
    // Crear las alas (planos)
    const wingGeometry = new THREE.PlaneGeometry(4, 1)
    const wingMaterial = new THREE.MeshStandardMaterial({ 
      color, 
      side: THREE.DoubleSide 
    })
    this.wings = new THREE.Mesh(wingGeometry, wingMaterial)
    this.wings.castShadow = true
    
    // Posicionar las alas
    this.wings.position.y = 0.5
    this.wings.rotation.x = Math.PI / 2

    // Agrupar todo
    this.mesh.add(this.body)
    this.mesh.add(this.wings)
    
    // Posicionar y rotar el grupo
    this.mesh.position.copy(position)
    this.mesh.rotation.copy(rotation)

    // Inicializar física
    this.physics = {
      velocity: new THREE.Vector3(0, 0, -5), // Velocidad inicial hacia adelante
      acceleration: new THREE.Vector3(),
      drag: 0.01,
      turnSpeed: 0.03,
      maxSpeed: 20,
      minSpeed: 5,
      gravity: 0.1
    }

    this.isGrounded = false

    // Configurar controles
    this.setupControls()
  }

  private setupControls() {
    document.addEventListener('keydown', (event) => {
      switch (event.code) {
        case 'ArrowLeft':
          this.turn(-1)
          break
        case 'ArrowRight':
          this.turn(1)
          break
        case 'ArrowUp':
          this.pitch(-1)
          break
        case 'ArrowDown':
          this.pitch(1)
          break
      }
    })
  }

  private turn(direction: number) {
    if (this.isGrounded) return
    this.mesh.rotation.y += direction * this.physics.turnSpeed
  }

  private pitch(direction: number) {
    if (this.isGrounded) return
    // Limitar el ángulo de inclinación entre -60 y 0 grados
    const targetRotation = this.mesh.rotation.x + direction * this.physics.turnSpeed
    this.mesh.rotation.x = Math.max(Math.min(targetRotation, 0), -Math.PI / 3)
  }

  update() {
    if (this.isGrounded) return

    // Aplicar gravedad
    this.physics.velocity.y -= this.physics.gravity

    // Calcular la dirección forward basada en la rotación
    const forward = new THREE.Vector3(0, 0, -1)
    forward.applyEuler(this.mesh.rotation)

    // Ajustar la velocidad basada en la inclinación
    const pitch = this.mesh.rotation.x
    const speedMultiplier = Math.cos(pitch) // Más rápido cuando está nivelado
    const liftMultiplier = Math.sin(-pitch) // Más elevación cuando está inclinado hacia arriba

    // Aplicar velocidad en la dirección forward
    this.physics.velocity.copy(forward.multiplyScalar(
      Math.max(this.physics.minSpeed, 
      Math.min(this.physics.maxSpeed, 
      this.physics.velocity.length() * speedMultiplier))
    ))

    // Aplicar elevación
    this.physics.velocity.y += liftMultiplier * 0.2

    // Aplicar drag (resistencia del aire)
    this.physics.velocity.multiplyScalar(1 - this.physics.drag)

    // Actualizar posición
    this.mesh.position.add(this.physics.velocity)

    // Verificar colisión con el suelo
    if (this.mesh.position.y < 1) {
      this.mesh.position.y = 1
      this.isGrounded = true
      this.physics.velocity.set(0, 0, 0)
    }
  }
} 