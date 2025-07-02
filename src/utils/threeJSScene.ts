
import * as THREE from 'three';

let scene: THREE.Scene;
let camera: THREE.PerspectiveCamera;
let renderer: THREE.WebGLRenderer;
let planets: { [key: string]: THREE.Mesh } = {};
let sun: THREE.Mesh;
let animationId: number;
let isAnimating = true;
let planetSpeeds: { [key: string]: number } = {
  mercury: 1,
  venus: 1,
  earth: 1,
  mars: 1,
  jupiter: 1,
  saturn: 1,
  uranus: 1,
  neptune: 1
};

const planetData = [
  { name: 'mercury', distance: 15, size: 0.8, color: 0x8C7853, speed: 0.04 },
  { name: 'venus', distance: 20, size: 1.2, color: 0xFFC649, speed: 0.03 },
  { name: 'earth', distance: 25, size: 1.3, color: 0x6B93D6, speed: 0.02 },
  { name: 'mars', distance: 30, size: 1.0, color: 0xCD5C5C, speed: 0.015 },
  { name: 'jupiter', distance: 40, size: 3.0, color: 0xD8CA9D, speed: 0.01 },
  { name: 'saturn', distance: 50, size: 2.5, color: 0xFAD5A5, speed: 0.008 },
  { name: 'uranus', distance: 60, size: 2.0, color: 0x4FD0E7, speed: 0.006 },
  { name: 'neptune', distance: 70, size: 1.8, color: 0x4B70DD, speed: 0.004 }
];

// Create texture loader
const textureLoader = new THREE.TextureLoader();

// Create procedural textures for planets
const createPlanetTexture = (planetName: string, baseColor: number) => {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;
  
  // Create gradient background
  const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  const color = new THREE.Color(baseColor);
  
  switch(planetName) {
    case 'earth':
      // Earth-like with blues and greens
      gradient.addColorStop(0, `hsl(${color.getHSL({}).h * 360}, 80%, 60%)`);
      gradient.addColorStop(0.3, '#4a90e2');
      gradient.addColorStop(0.7, '#2d5016');
      gradient.addColorStop(1, `hsl(${color.getHSL({}).h * 360}, 70%, 40%)`);
      break;
    case 'mars':
      // Mars-like with reds and browns  
      gradient.addColorStop(0, '#ff6b35');
      gradient.addColorStop(0.5, '#cd5c5c');
      gradient.addColorStop(1, '#8b3a3a');
      break;
    case 'jupiter':
      // Jupiter-like with bands
      gradient.addColorStop(0, '#f4e4bc');
      gradient.addColorStop(0.3, '#d8ca9d');
      gradient.addColorStop(0.7, '#c7b377');
      gradient.addColorStop(1, '#a0956b');
      break;
    default:
      // Default gradient for other planets
      gradient.addColorStop(0, `hsl(${color.getHSL({}).h * 360}, 90%, 70%)`);
      gradient.addColorStop(0.5, `hsl(${color.getHSL({}).h * 360}, 80%, 50%)`);
      gradient.addColorStop(1, `hsl(${color.getHSL({}).h * 360}, 70%, 30%)`);
  }
  
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Add surface details
  ctx.globalAlpha = 0.3;
  for (let i = 0; i < 50; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const radius = Math.random() * 10 + 2;
    
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fillStyle = Math.random() > 0.5 ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)';
    ctx.fill();
  }
  
  return new THREE.CanvasTexture(canvas);
};

export const initThreeJS = (canvas: HTMLCanvasElement) => {
  // Scene setup
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x000011);

  // Lighting
  const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
  scene.add(ambientLight);

  const pointLight = new THREE.PointLight(0xffffff, 2, 1000);
  pointLight.position.set(0, 0, 0);
  scene.add(pointLight);

  // Create starfield
  createStarfield();

  // Create Sun with enhanced glow
  const sunGeometry = new THREE.SphereGeometry(5, 32, 32);
  const sunMaterial = new THREE.MeshBasicMaterial({ 
    color: 0xFFD700
  });
  sun = new THREE.Mesh(sunGeometry, sunMaterial);
  scene.add(sun);

  // Create planets with bright, visible colors
  planetData.forEach(planet => {
    const geometry = new THREE.SphereGeometry(planet.size, 32, 32);
    
    // Create texture for the planet
    const texture = createPlanetTexture(planet.name, planet.color);
    
    // Use MeshPhongMaterial with bright colors that match the control panel
    const material = new THREE.MeshPhongMaterial({ 
      color: planet.color,
      emissive: new THREE.Color(planet.color).multiplyScalar(0.1),
      shininess: 30,
      specular: 0x222222
    });
    
    const mesh = new THREE.Mesh(geometry, material);
    
    mesh.position.x = planet.distance;
    mesh.userData = { 
      distance: planet.distance, 
      speed: planet.speed,
      angle: Math.random() * Math.PI * 2
    };
    
    planets[planet.name] = mesh;
    scene.add(mesh);

    // Create orbital path
    const orbitGeometry = new THREE.RingGeometry(planet.distance - 0.1, planet.distance + 0.1, 64);
    const orbitMaterial = new THREE.MeshBasicMaterial({ 
      color: 0x333333, 
      transparent: true, 
      opacity: 0.1,
      side: THREE.DoubleSide
    });
    const orbit = new THREE.Mesh(orbitGeometry, orbitMaterial);
    orbit.rotation.x = Math.PI / 2;
    scene.add(orbit);
  });

  // Position camera with better mobile view
  const isMobile = window.innerWidth < 768;
  camera.position.set(0, isMobile ? 40 : 50, isMobile ? 60 : 80);
  camera.lookAt(0, 0, 0);

  // Handle window resize with mobile responsiveness
  const handleResize = () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const isMobile = width < 768;
    
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
    
    // Adjust camera position for mobile
    if (isMobile) {
      camera.position.set(0, 40, 60);
    } else {
      camera.position.set(0, 50, 80);
    }
    camera.lookAt(0, 0, 0);
  };
  window.addEventListener('resize', handleResize);

  return scene;
};

const createStarfield = () => {
  const starsGeometry = new THREE.BufferGeometry();
  const starsCount = 2000;
  const positions = new Float32Array(starsCount * 3);

  for (let i = 0; i < starsCount * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 2000;
  }

  starsGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const starsMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 2 });
  const stars = new THREE.Points(starsGeometry, starsMaterial);
  scene.add(stars);
};

export const animateScene = () => {
  if (!isAnimating) return;

  // Rotate sun
  if (sun) {
    sun.rotation.y += 0.005;
  }

  // Update planet positions
  Object.keys(planets).forEach(planetName => {
    const planet = planets[planetName];
    const userData = planet.userData;
    const currentSpeed = planetSpeeds[planetName] || 1;
    
    userData.angle += userData.speed * currentSpeed;
    planet.position.x = Math.cos(userData.angle) * userData.distance;
    planet.position.z = Math.sin(userData.angle) * userData.distance;
    
    // Rotate planet on its axis
    planet.rotation.y += 0.01;
  });

  renderer.render(scene, camera);
  animationId = requestAnimationFrame(animateScene);
};

export const updatePlanetSpeeds = (speeds: { [key: string]: number }) => {
  planetSpeeds = { ...speeds };
};

export const pauseAnimation = () => {
  isAnimating = false;
  if (animationId) {
    cancelAnimationFrame(animationId);
  }
};

export const resumeAnimation = () => {
  isAnimating = true;
  animateScene();
};

export const focusOnPlanet = (planetName: string) => {
  const planet = planets[planetName];
  if (planet && camera) {
    const targetPosition = planet.position.clone();
    targetPosition.y += 10;
    targetPosition.z += 20;
    
    // Smooth camera transition
    const startPos = camera.position.clone();
    const startTime = Date.now();
    const duration = 1000; // 1 second

    const animateCamera = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function for smooth transition
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      
      camera.position.lerpVectors(startPos, targetPosition, easeProgress);
      camera.lookAt(planet.position);
      
      if (progress < 1) {
        requestAnimationFrame(animateCamera);
      }
    };
    
    animateCamera();
  }
};
