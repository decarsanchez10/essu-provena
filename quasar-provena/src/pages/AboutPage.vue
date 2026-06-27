<template>
  <div class="about-page">
    <!-- 3D Canvas Container -->
    <div id="container3D" ref="container3D"></div>

    <!-- Scrolling Content Overlay -->
    <div class="content-overlay">
      <div id="banner" class="section">
        <div class="section-content">
          <h1>Provena</h1>
          <p>Decentralized, verifiable notarization powered by Bitcoin Cash.</p>
        </div>
      </div>

      <div id="vision" class="section right">
        <div class="section-content">
          <h2>Our Vision</h2>
          <p>We combine cryptographic proof, robust identity, seamless workflow, immutable timestamping, low‑cost payment rails, provenance tracking, and open interoperability to solve real‑world business friction.</p>
        </div>
      </div>

      <div id="design" class="section left">
        <div class="section-content">
          <h2>Core Design Philosophy</h2>
          <p>A non‑custodial, independently verifiable, censorship‑resistant, cheap, global, and permanent platform – like DocuSign meets Git on Bitcoin Cash.</p>
        </div>
      </div>

      <div id="identity" class="section right">
        <div class="section-content">
          <h2>Layered Identity</h2>
          <p>Pure anonymity isn’t enough. We provide wallet‑based identity, optional verified attestations, and a decentralized PKI that puts users in control.</p>
        </div>
      </div>

      <div id="cashtokens" class="section left">
        <div class="section-content">
          <h2>CashTokens Utility</h2>
          <p>Tokenized certificates, notarization rights, organizational authority, and transferable licenses enable powerful smart‑contract workflows.</p>
        </div>
      </div>

      <div id="contact" class="section center">
        <div class="section-content">
          <h2>Join the Movement</h2>
          <p>Experience a premium document platform where blockchain complexity is invisible and trust is guaranteed.</p>
          <a href="#" class="cta-btn">Get Started</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { gsap } from 'gsap'
import modelUrl from '../assets/base_basic_shaded.glb?url'

const container3D = ref(null)

// Three.js instances
let renderer, scene, camera, mixer, animationId
let modelInstance = null

// Animation coordinates for different sections
const arrPositionModel = [
  { id: 'banner',      position: {x: 0, y: -1, z: 0},   rotation: {x: 0, y: 1.5, z: 0} },
  { id: 'vision',      position: {x: 1, y: -1, z: -5},  rotation: {x: 0.5, y: -0.5, z: 0} },
  { id: 'design',      position: {x: -1, y: -1, z: -5}, rotation: {x: 0, y: 0.5, z: 0} },
  { id: 'identity',    position: {x: 0.8, y: -1, z: -5}, rotation: {x: 0.3, y: -0.5, z: 0} },
  { id: 'cashtokens',  position: {x: -1, y: -1, z: -4}, rotation: {x: 0, y: 0.5, z: 0} },
  { id: 'contact',     position: {x: 0.8, y: -1, z: 0},  rotation: {x: 0.3, y: -0.5, z: 0} },
];

function initThreeJS() {
  if (!container3D.value) return

  // Camera setup
  camera = new THREE.PerspectiveCamera(10, window.innerWidth / window.innerHeight, 0.1, 1000)
  camera.position.z = 13

  // Scene setup
  scene = new THREE.Scene()

  // Lights
  const ambientLight = new THREE.AmbientLight(0xffffff, 1.3)
  scene.add(ambientLight)

  const topLight = new THREE.DirectionalLight(0xffffff, 1)
  topLight.position.set(500, 500, 500)
  scene.add(topLight)

  // Renderer setup
  renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setPixelRatio(window.devicePixelRatio)
  container3D.value.appendChild(renderer.domElement)

  // Load Model
  const loader = new GLTFLoader()
  loader.load(
    modelUrl,
    function (gltf) {
      modelInstance = gltf.scene
      // Scale down the model (increased slightly from previous value)
      modelInstance.scale.set(0.8, 0.8, 0.8) 
      scene.add(modelInstance)

      // Initialize animation if present
      if (gltf.animations && gltf.animations.length > 0) {
        mixer = new THREE.AnimationMixer(modelInstance)
        mixer.clipAction(gltf.animations[0]).play()
      }

      // Initial position sync
      modelMove()
    },
    function (xhr) {
      console.log((xhr.loaded / xhr.total * 100) + '% loaded')
    },
    function (error) {
      console.error('An error occurred loading the model:', error)
    }
  )

  // Render loop
  const clock = new THREE.Clock()
  function reRender3D() {
    animationId = requestAnimationFrame(reRender3D)
    
    // Horizontal movement handled in onScroll (no automatic rotation)

    renderer.render(scene, camera)
    
    const delta = clock.getDelta()
    if (mixer) mixer.update(delta)
  }
  reRender3D()
}

function modelMove() {
  if (!modelInstance) return

  const sections = document.querySelectorAll('.section')
  let currentSection = 'banner' // default

  sections.forEach((section) => {
    const rect = section.getBoundingClientRect()
    // Trigger point: when section top reaches 1/3 of the screen
    if (rect.top <= window.innerHeight / 3 && rect.bottom > 0) {
      currentSection = section.id
    }
  })

  const position_active = arrPositionModel.findIndex((val) => val.id === currentSection)
  if (position_active >= 0) {
    const new_coordinates = arrPositionModel[position_active]

    gsap.to(modelInstance.position, {
      x: new_coordinates.position.x,
      y: new_coordinates.position.y,
      z: new_coordinates.position.z,
      duration: 3,
      ease: 'power1.out'
    })

    gsap.to(modelInstance.rotation, {
      x: new_coordinates.rotation.x,
      z: new_coordinates.rotation.z,
      duration: 3,
      ease: 'power1.out'
    })
  }
}

function onWindowResize() {
  if (!camera || !renderer) return
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
}

function onScroll() {
  // Spin the model on scroll
  if (modelInstance) {
    // Adjust factor for desired speed
    const rotationY = window.scrollY * 0.01;
    modelInstance.rotation.y = rotationY;
  }
  // Also update model position for section changes
  modelMove();
}

onMounted(() => {
  initThreeJS()
  window.addEventListener('scroll', onScroll)
  window.addEventListener('resize', onWindowResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('resize', onWindowResize)
  if (animationId) cancelAnimationFrame(animationId)
  if (renderer && renderer.domElement) {
    renderer.domElement.remove()
    renderer.dispose()
  }
  if (scene) {
    scene.clear()
  }
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap');

.about-page {
  position: relative;
  background: var(--bgc);
  color: var(--tx);
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  font-family: 'Inter', sans-serif;
}

#container3D {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 1; /* Behind content */
  pointer-events: none; /* Let clicks pass through to content */
}

.content-overlay {
  position: relative;
  z-index: 2;
  /* Add padding to ensure first and last sections can be centered on screen */
  padding-bottom: 50vh;
}

.section {
  min-height: 100vh;
  display: flex;
  align-items: center;
  padding: 0 10%;
  box-sizing: border-box;
  opacity: 0;
  transform: translateY(20px);
  animation: fadeIn 0.8s ease forwards;
}

.section:nth-child(odd) { animation-delay: 0.2s; }
.section:nth-child(even) { animation-delay: 0.4s; }

.section-content {
  max-width: 450px;
  background: rgba(10, 21, 16, 0.4);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  padding: 40px;
  border-radius: 24px;
  border: 1px solid rgba(34, 197, 94, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255,255,255,0.05);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.section h1 {
  font-family: var(--fd);
  font-size: 3.5rem;
  font-weight: 800;
  letter-spacing: -0.04em;
  color: #16ff55;
  margin: 0 0 16px;
  line-height: 1.1;
}

.section h2 {
  font-family: var(--fd);
  font-size: 2.2rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: #fff;
  margin: 0 0 16px;
}

.section p {
  font-size: 1.1rem;
  line-height: 1.6;
  color: var(--step-p);
  margin: 0;
}

/* Positioning overrides */
.section.right {
  justify-content: flex-end;
}

.section.left {
  justify-content: flex-start;
}

.section.center {
  justify-content: center;
  text-align: center;
}

.section.center .section-content {
  max-width: 540px;
  background: rgba(10, 21, 16, 0.4);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  padding: 48px 36px;
  border-radius: 24px;
  border: 1px solid rgba(34, 197, 94, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255,255,255,0.05);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  margin: 0 auto;
}

.section-content:hover {
  transform: translateY(-6px);
  box-shadow: 0 12px 48px rgba(0, 0, 0, 0.5);
}

.cta-btn {
  display: inline-block;
  margin-top: 1.5rem;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  color: #fff;
  background: linear-gradient(45deg, #16ff55, #00c853);
  border-radius: 30px;
  text-decoration: none;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.cta-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(22, 163, 74, 0.4);
}
</style>
