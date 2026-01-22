// ============================================================
// Imports
// ============================================================

import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';


// ============================================================
// Configuration / Constants
// ============================================================

// Visual tuning
const HOLOGRAM_Y_STRETCH = 1.15;
const ROTATION_SPEED = 0.002;
const HOLOGRAM_EXPOSURE = 1.4;
const HOLOGRAM_Y_OFFSET = -0.25;

// Interaction tuning
const DRAG_ROTATION_FACTOR = 0.0005;
const INERTIA_DECAY = 0.95;


// ============================================================
// Custom Shader: Hologram Fade Overlay
// ============================================================

const HoloFadeMaterial = new THREE.ShaderMaterial({
  transparent: true,
  depthWrite: false,
  uniforms: {
    strength: { value: 0.40 }
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    varying vec2 vUv;
    uniform float strength;

    void main() {
      vec2 centered = vUv - 0.5;
      float dist = length(centered);

      float fade = smoothstep(0.25, 0.75, dist);
      fade *= strength;

      gl_FragColor = vec4(0.0, 0.0, 0.0, fade);
    }
  `
});


// ============================================================
// Renderer & Canvas Setup
// ============================================================

const canvas = document.getElementById('holo');

const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
  alpha: false
});

renderer.autoClear = false;
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000000, 1);

renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.physicallyCorrectLights = true;

renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = HOLOGRAM_EXPOSURE;


// ============================================================
// Global Interaction State
// ============================================================

// Pointer drag
let isDragging = false;
let lastX = 0;
let rotationVelocity = 0;

// Voice control
let voiceRotationSpeed = 0;
let voiceEnabled = false;


// ============================================================
// Speech Recognition Setup
// ============================================================

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

let recognition = null;

if (SpeechRecognition) {
  recognition = new SpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = false;
  recognition.lang = 'en-US';

  recognition.onstart = () => {
    console.log('🎤 Voice control active');
    voiceEnabled = true;
  };

  recognition.onend = () => {
    console.log('🎤 Voice control stopped');
    voiceEnabled = false;
  };

  recognition.onerror = (e) => {
    console.warn('Voice error:', e.error);
  };

  recognition.onresult = (event) => {
    const lastResult = event.results[event.results.length - 1];
    const transcript = lastResult[0].transcript.trim();
    handleVoiceCommand(transcript);
  };

} else {
  console.warn('Speech recognition not supported');
}


// ============================================================
// Voice Command Handler
// ============================================================

function handleVoiceCommand(text) {
  const command = text.toLowerCase();
  console.log('🗣 Command:', command);

  if (command.includes('rotate left'))  voiceRotationSpeed = 0.01;
  if (command.includes('rotate right')) voiceRotationSpeed = -0.01;

  if (command.includes('faster')) voiceRotationSpeed *= 5.0;
  if (command.includes('slower')) voiceRotationSpeed *= 0.5;

  if (command.includes('stop')) voiceRotationSpeed = 0;
  if (command.includes('reset')) modelGroup.rotation.y = 0;
}


// ============================================================
// Scene Setup
// ============================================================

const scene = new THREE.Scene();


// ============================================================
// Lighting
// ============================================================

scene.add(new THREE.AmbientLight(0xffffff, 0.6));

const directional = new THREE.DirectionalLight(0xffffff, 0.8);
directional.position.set(5, 5, 5);
scene.add(directional);

scene.add(new THREE.HemisphereLight(0xffffff, 0x222222, 0.4));

const rimLight = new THREE.DirectionalLight(0x88ccff, 0.6);
rimLight.position.set(-5, 3, -5);
scene.add(rimLight);


// ============================================================
// Model Group & Loader
// ============================================================

const modelGroup = new THREE.Group();
scene.add(modelGroup);

const loader = new GLTFLoader();

loader.load(
  './models/DamagedHelmet/glTF/DamagedHelmet.gltf',
  (gltf) => {
    console.log('MODEL LOADED');

    const model = gltf.scene;
    modelGroup.add(model);

    // Center & scale model
    const box = new THREE.Box3().setFromObject(model);
    const size = box.getSize(new THREE.Vector3()).length();
    const center = box.getCenter(new THREE.Vector3());

    model.position.sub(center);
    model.scale.setScalar(1.2 / size);
  },
  undefined,
  (error) => console.error('GLTF load error:', error)
);


// ============================================================
// Camera Setup (Multi-View Hologram)
// ============================================================

const cameraDistance = 3;
const fov = 45;
const aspect = 1;

const cameras = {
  front: new THREE.PerspectiveCamera(fov, aspect, 0.1, 100),
  back:  new THREE.PerspectiveCamera(fov, aspect, 0.1, 100),
  left:  new THREE.PerspectiveCamera(fov, aspect, 0.1, 100),
  right: new THREE.PerspectiveCamera(fov, aspect, 0.1, 100)
};

cameras.front.position.set(0, 0, cameraDistance);
cameras.back.position.set(0, 0, -cameraDistance);
cameras.left.position.set(-cameraDistance, 0, 0);
cameras.right.position.set(cameraDistance, 0, 0);

Object.values(cameras).forEach(cam => cam.lookAt(0, 0, 0));


// ============================================================
// Pointer / Touch Controls
// ============================================================

canvas.addEventListener('pointerdown', (e) => {
  isDragging = true;
  lastX = e.clientX;
});

canvas.addEventListener('pointermove', (e) => {
  if (!isDragging) return;

  const deltaX = e.clientX - lastX;
  lastX = e.clientX;

  rotationVelocity = deltaX * DRAG_ROTATION_FACTOR;
  modelGroup.rotation.y += rotationVelocity;
});

canvas.addEventListener('pointerup', () => isDragging = false);
canvas.addEventListener('pointerleave', () => isDragging = false);

// Toggle voice on double-click (Should not be here, change later [keep with voice cmds])
canvas.addEventListener('dblclick', () => {
  if (!recognition) return;
  voiceEnabled ? recognition.stop() : recognition.start();
});


// ============================================================
// Overlay Scene (Fade)
// ============================================================

const overlayScene = new THREE.Scene();
const overlayCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

overlayScene.add(
  new THREE.Mesh(new THREE.PlaneGeometry(2, 2), HoloFadeMaterial)
);


// ============================================================
// Render Helpers
// ============================================================

function renderWithFlip(scene, camera, flipX = false, flipY = false) {
  const sx = camera.scale.x;
  const sy = camera.scale.y;

  camera.scale.set(flipX ? -1 : 1, flipY ? -1 : 1, 1);

  renderer.render(scene, camera);
  renderer.render(overlayScene, overlayCamera);

  camera.scale.set(sx, sy, 1);
}


// ============================================================
// Main Render Loop
// ============================================================

function render() {

  // Auto rotation + inertia
  if (!isDragging) {
    modelGroup.rotation.y += ROTATION_SPEED + rotationVelocity;
    rotationVelocity *= INERTIA_DECAY;
  }

  // Voice rotation
  modelGroup.rotation.y += voiceRotationSpeed;

  // Hologram shaping
  modelGroup.scale.y = HOLOGRAM_Y_STRETCH;
  modelGroup.position.y = HOLOGRAM_Y_OFFSET;

  const w = window.innerWidth;
  const h = window.innerHeight;

  renderer.setScissorTest(true);

  const vw = w / 2;
  const vh = h / 2;

  // FRONT (bottom)
  cameras.front.aspect = vw / vh;
  cameras.front.updateProjectionMatrix();
  renderer.setViewport(w / 4, 0, vw, vh);
  renderer.setScissor(w / 4, 0, vw, vh);
  renderWithFlip(scene, cameras.front);

  // BACK (top)
  cameras.back.aspect = vw / vh;
  cameras.back.updateProjectionMatrix();
  renderer.setViewport(w / 4, vh, vw, vh);
  renderer.setScissor(w / 4, vh, vw, vh);
  renderWithFlip(scene, cameras.back, false, true);

  // LEFT
  cameras.left.aspect = vw / vh;
  cameras.left.updateProjectionMatrix();
  renderer.setViewport(0, vh / 2, vw, vh);
  renderer.setScissor(0, vh / 2, vw, vh);
  renderWithFlip(scene, cameras.left, true, false);

  // RIGHT
  cameras.right.aspect = vw / vh;
  cameras.right.updateProjectionMatrix();
  renderer.setViewport(vw, vh / 2, vw, vh);
  renderer.setScissor(vw, vh / 2, vw, vh);
  renderWithFlip(scene, cameras.right, true, false);

  requestAnimationFrame(render);
}

render();


// ============================================================
// Resize Handling
// ============================================================

window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
});
