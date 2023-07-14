import './style.css'
import * as THREE from 'three';
import WebGL from 'three/addons/capabilities/WebGL.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// Vertex Shader
const _VS = `
varying vec2 vertexUv;
varying vec3 vertexNormal;


void main () {
    vertexUv = uv;
    vertexNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

// Fragment Shader
const _FS = `
uniform sampler2D frogtexture;
varying vec2 vertexUv;
varying vec3 vertexNormal;

void main () {
    float intensity = 1.01 - dot(vertexNormal, vec3(0.0, 0.0, 1.0));
    vec3 atmosphere = vec3(0.3, 0.9, 0.1) * pow(intensity, 1.7);

    gl_FragColor = vec4(atmosphere + texture2D(frogtexture, vertexUv).xyz, 1.0);
}
`;

// Creating a Shader Material
const material = new THREE.ShaderMaterial({
  uniforms: {
    frogtexture: {
      value: new THREE.TextureLoader().load('STmap.jpeg')
    }
  },
  vertexShader: _VS,
  fragmentShader: _FS
  // Adding a texture to the material
  // map : new THREE.TextureLoader().load('STmap.jpeg'),
});

// Fit Screen
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}

// Creating A Scene
const scene = new THREE.Scene();

// Creating A Camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
scene.add(camera);

// Creating A Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Creating Ambient and Directional light
const Light = new THREE.PointLight(0x0f0fff, 10);
Light.position.set(0, 7, 0);
scene.add(Light);

// Add a Plane surface to the scene 
const planeGeometry = new THREE.PlaneGeometry(100, 100, 100);
const planeMaterial = new THREE.MeshToonMaterial({
  color: 0x00ff23,
  emissive: 0x122201,
  side: THREE.DoubleSide
});

const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.x = Math.PI / 2;
plane.position.y = -1;
scene.add(plane);

// Creating Orbit Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.1;
controls.rotateSpeed = 2.5;

camera.position.set(10, 10, 10);
controls.update();

let isJumping = false;
let jumpStartTime;
const jumpDuration = 2.0;
const jumpHeight = 10.0;
const jumpSpeed = jumpHeight / jumpDuration;

let isSwimming = false;
let swimStartTime;
const swimDuration = 2.0;
const swimHeight = 10.0;
const swimSpeed = swimHeight / swimDuration;

// Instantiate a loader
const loader = new GLTFLoader();

const arm001RGroup = new THREE.Group();
const arm002RGroup = new THREE.Group();
const arm003RGroup = new THREE.Group();
const arm001LGroup = new THREE.Group();
const arm002LGroup = new THREE.Group();
const arm003LGroup = new THREE.Group();
const leg001RGroup = new THREE.Group();
const leg002RGroup = new THREE.Group();
const leg003RGroup = new THREE.Group();
const leg001LGroup = new THREE.Group();
const leg002LGroup = new THREE.Group();
const leg003LGroup = new THREE.Group();
const spineGroup = new THREE.Group();
const headGroup = new THREE.Group();

const models = [
  'models/arm_001_L.glb',
  'models/arm_001_R.glb',
  'models/arm_002_L.glb',
  'models/arm_002_R.glb',
  'models/arm_003_L.glb',
  'models/arm_003_R.glb',
  'models/head.glb',
  'models/leg_001_L.glb',
  'models/leg_001_R.glb',
  'models/leg_002_L.glb',
  'models/leg_002_R.glb',
  'models/leg_003_L.glb',
  'models/leg_003_R.glb',
  'models/spine.glb',
  'models/spine_001.glb'
];

// Load a glTF resource
models.forEach((model) => {
  loader.load(model, function (gltf) {

    const arm = gltf.scene;
    const armName = model.split('/').pop().split('.')[0];

    gltf.scene.traverse((o) => {
      if (o.isMesh) o.material = material;
    });

    if (armName === 'arm_001_L') {
      arm001LGroup.add(arm);
    } else if (armName === 'arm_002_L') {
      arm002LGroup.add(arm);
    } else if (armName === 'arm_003_L') {
      arm003LGroup.add(arm);
    } else if (armName === 'arm_001_R') {
      arm001RGroup.add(arm);
    } else if (armName === 'arm_002_R') {
      arm002RGroup.add(arm);
    } else if (armName === 'arm_003_R') {
      arm003RGroup.add(arm);
    } else if (armName === 'leg_001_L') {
      leg001LGroup.add(arm);
    } else if (armName === 'leg_002_L') {
      leg002LGroup.add(arm);
    } else if (armName === 'leg_003_L') {
      leg003LGroup.add(arm);
    } else if (armName === 'leg_001_R') {
      leg001RGroup.add(arm);
    } else if (armName === 'leg_002_R') {
      leg002RGroup.add(arm);
    } else if (armName === 'leg_003_R') {
      leg003RGroup.add(arm);
    } else if (armName === 'head') {
      headGroup.add(arm);
    } else if (armName === 'spine') {
      spineGroup.add(arm);
    } else if (armName === 'spine_001') {
      spineGroup.add(arm);
    }

    arm002LGroup.add(arm003LGroup);
    arm001LGroup.add(arm002LGroup);
    arm002RGroup.add(arm003RGroup);
    arm001RGroup.add(arm002RGroup);
    leg002LGroup.add(leg003LGroup);
    leg001LGroup.add(leg002LGroup);
    leg002RGroup.add(leg003RGroup);
    leg001RGroup.add(leg002RGroup);
    spineGroup.add(headGroup);
    spineGroup.add(arm001LGroup);
    spineGroup.add(arm001RGroup);
    spineGroup.add(leg001LGroup);
    spineGroup.add(leg001RGroup);

    scene.add(spineGroup);

    arm003LGroup.position.set(0.71, -0.57, -0.22);
    arm002LGroup.position.set(0.85, -1.2, -0.4);
    arm001LGroup.position.set(0.15, 3.25, 0.85);

    arm003RGroup.position.set(-0.71, -0.57, -0.22);
    arm002RGroup.position.set(-0.85, -1.2, -0.4);
    arm001RGroup.position.set(-0.15, 3.25, 0.85);

    leg003LGroup.position.set(-0.94, -0.46, -3.05);
    leg002LGroup.position.set(1.97, -0.12, 1.59);
    leg001LGroup.position.set(0.39, 1.38, -2.11);

    leg003RGroup.position.set(0.94, -0.46, -3.05);
    leg002RGroup.position.set(-1.97, -0.12, 1.59);
    leg001RGroup.position.set(-0.39, 1.38, -2.11);

    headGroup.position.set(0, 2.8, 1.29);

    function animate() {
      requestAnimationFrame(animate);
      // cube.rotation.x += 0.01;
      // cube.rotation.y += 0.01;
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(devicePixelRatio);
      controls.update();

      renderer.render(scene, camera);
    }

    function updateJumpAnimation() {
      if (!isJumping) return;
      const elapsed = (Date.now() - jumpStartTime) / 500.0;
      if (elapsed >= jumpDuration || spineGroup.position.y < 0) {
        isJumping = false;
        spineGroup.position.y = 0;
        return;
      }

      const height = jumpSpeed * elapsed - 0.5 * jumpSpeed * elapsed * elapsed;
      spineGroup.position.y = height;
      spineGroup.position.z += jumpSpeed * 0.02;

      leg001LGroup.rotation.x = -0.2 * (jumpSpeed * elapsed - 0.5 * jumpSpeed * elapsed * elapsed);
      leg001RGroup.rotation.x = -0.2 * (jumpSpeed * elapsed - 0.5 * jumpSpeed * elapsed * elapsed);
      leg001LGroup.rotation.y = 0.5 * (jumpSpeed * elapsed - 0.5 * jumpSpeed * elapsed * elapsed);
      leg001RGroup.rotation.y = -0.5 * (jumpSpeed * elapsed - 0.5 * jumpSpeed * elapsed * elapsed);
      leg002LGroup.rotation.y = -0.5 * (jumpSpeed * elapsed - 0.5 * jumpSpeed * elapsed * elapsed);
      leg002RGroup.rotation.y = 0.5 * (jumpSpeed * elapsed - 0.5 * jumpSpeed * elapsed * elapsed);
      leg003LGroup.rotation.y = 0.5 * (jumpSpeed * elapsed - 0.5 * jumpSpeed * elapsed * elapsed);
      leg003RGroup.rotation.y = -0.5 * (jumpSpeed * elapsed - 0.5 * jumpSpeed * elapsed * elapsed);

      arm001LGroup.rotation.x = 0.1 * (jumpSpeed * elapsed - 0.5 * jumpSpeed * elapsed * elapsed);
      arm001RGroup.rotation.x = 0.1 * (jumpSpeed * elapsed - 0.5 * jumpSpeed * elapsed * elapsed);
      arm001LGroup.rotation.y = -0.5 * (jumpSpeed * elapsed - 0.5 * jumpSpeed * elapsed * elapsed);
      arm001RGroup.rotation.y = 0.5 * (jumpSpeed * elapsed - 0.5 * jumpSpeed * elapsed * elapsed);
      arm003LGroup.rotation.y = 0.5 * (jumpSpeed * elapsed - 0.5 * jumpSpeed * elapsed * elapsed);
      arm003RGroup.rotation.y = -0.5 * (jumpSpeed * elapsed - 0.5 * jumpSpeed * elapsed * elapsed);

      setTimeout(() => { updateJumpAnimation(); }, 10);
    }

    function updateSwimAnimation() {
      if (!isSwimming) return;
      const elapsed = (Date.now() - swimStartTime) / 500.0;
      if (elapsed >= swimDuration) {
        isSwimming = false;
        spineGroup.position.y = 0;
        return;
      }

      spineGroup.position.z += swimSpeed * 0.02;

      leg001LGroup.rotation.x = 0.03 * swimSpeed;
      leg001RGroup.rotation.x = 0.03 * swimSpeed;
      leg001LGroup.rotation.y = 0.7 + 0.5 * (swimSpeed * elapsed - 0.5 * swimSpeed * elapsed * elapsed);
      leg001RGroup.rotation.y = -0.7 - 0.5 * (swimSpeed * elapsed - 0.5 * swimSpeed * elapsed * elapsed);
      leg002LGroup.rotation.y = -0.7 - 0.5 * (swimSpeed * elapsed - 0.5 * swimSpeed * elapsed * elapsed);
      leg002RGroup.rotation.y = 0.7 + 0.5 * (swimSpeed * elapsed - 0.5 * swimSpeed * elapsed * elapsed);
      leg003LGroup.rotation.y = 1 + 0.5 * (swimSpeed * elapsed - 0.5 * swimSpeed * elapsed * elapsed);
      leg003RGroup.rotation.y = -1 - 0.5 * (swimSpeed * elapsed - 0.5 * swimSpeed * elapsed * elapsed);

      arm001LGroup.rotation.x = -0.1 * swimSpeed;
      arm001RGroup.rotation.x = -0.1 * swimSpeed;
      arm003LGroup.rotation.x = -0.15 * swimSpeed;
      arm003RGroup.rotation.x = -0.15 * swimSpeed;
      arm001LGroup.rotation.y = -0.3 - 0.5 * (swimSpeed * elapsed - 0.5 * swimSpeed * elapsed * elapsed);
      arm001RGroup.rotation.y = 0.3 + 0.5 * (swimSpeed * elapsed - 0.5 * swimSpeed * elapsed * elapsed);
      arm003LGroup.rotation.y = 0.3 + 0.5 * (swimSpeed * elapsed - 0.5 * swimSpeed * elapsed * elapsed);
      arm003RGroup.rotation.y = -0.3 - 0.5 * (swimSpeed * elapsed - 0.5 * swimSpeed * elapsed * elapsed);

      setTimeout(() => { updateSwimAnimation(); }, 10);
    }

    document.addEventListener('keydown', function (event) {
      if (event.key === 'ArrowDown' && event.shiftKey) {
        spineGroup.rotation.x += .01;
      }

      else if (event.key === 'ArrowUp' && event.shiftKey) {
        spineGroup.rotation.x -= .01;
      }

      else if (event.key === 'ArrowLeft' && event.shiftKey) {
        spineGroup.rotation.z -= .01;
      }

      else if (event.key === 'ArrowRight' && event.shiftKey) {
        spineGroup.rotation.z += .01;
      }

      else if (event.key === 'ArrowDown') {
        spineGroup.position.z -= .01;
      }

      else if (event.key === 'ArrowUp') {
        spineGroup.position.z += .01;
      }

      else if (event.key === 'ArrowLeft') {
        spineGroup.position.x += .01;
      }

      else if (event.key === 'ArrowRight') {
        spineGroup.position.x -= .01;
      }

      else if (event.key === 'w') {
        arm001LGroup.rotation.y -= 0.001;
        arm001RGroup.rotation.y += 0.001;
        arm003LGroup.rotation.y += 0.0004;
        arm003RGroup.rotation.y -= 0.0004;

        if (arm001RGroup.rotation.y >= 1.5) {
          arm001LGroup.rotation.y = 0;
          arm001RGroup.rotation.y = 0;
          arm003LGroup.rotation.y = 0;
          arm003RGroup.rotation.y = 0;
        }
      }

      else if (event.key === 's') {
        leg001LGroup.rotation.y += 0.001;
        leg001RGroup.rotation.y -= 0.001;
        leg002LGroup.rotation.y -= 0.0012;
        leg002RGroup.rotation.y += 0.0012;
        leg003LGroup.rotation.y += 0.0014;
        leg003RGroup.rotation.y -= 0.0014;

        if (leg001LGroup.rotation.y >= 1.5) {
          leg001LGroup.rotation.y = 0;
          leg001RGroup.rotation.y = 0;
          leg002LGroup.rotation.y = 0;
          leg002RGroup.rotation.y = 0;
          leg003LGroup.rotation.y = 0;
          leg003RGroup.rotation.y = 0;
        }
      }

      else if (event.key === 'a') {
        headGroup.rotation.y += 0.001;
        if (headGroup.rotation.y >= 0.8) {
          headGroup.rotation.y = 0;
        }
      }

      else if (event.key === 'd') {
        headGroup.rotation.y -= 0.001;
        if (headGroup.rotation.y <= -0.8) {
          headGroup.rotation.y = 0;
        }
      }

      else if (event.key === 'j' && !isJumping) {
        isJumping = true;
        jumpStartTime = Date.now();
        updateJumpAnimation();
      }

      else if (event.key === 'q' && !isSwimming) {
        isSwimming = true;
        swimStartTime = Date.now();
        updateSwimAnimation();
      }
    });

    if (WebGL.isWebGLAvailable()) {

      // Initiate function or other initializations here
      animate();

    } else {

      const warning = WebGL.getWebGLErrorMessage();
      document.getElementById('container').appendChild(warning);

    }

  }, // called while loading is progressing
    function (xhr) {

      console.log((xhr.loaded / xhr.total * 100) + '% loaded');

    }, function (error) {

      console.error(error);

    });
});