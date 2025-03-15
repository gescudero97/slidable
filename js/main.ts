import { scene, camera, renderer, animate } from './scene'

// Agregar el canvas al DOM
document.getElementById('app')?.appendChild(renderer.domElement)

// Iniciar el bucle de renderizado
animate() 