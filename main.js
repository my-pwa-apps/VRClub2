import * as THREE from 'three';
import { VRButton } from 'three/examples/jsm/webxr/VRButton.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { setupClubStructure } from './modules/clubStructure.js';
import { setupLighting } from './modules/lighting.js';
import { setupLasers } from './modules/lasers.js';
import { setupFog } from './modules/fog.js';
import { setupDJBooth } from './modules/djBooth.js';
import { setupMultiplayer } from './modules/multiplayer.js';
import { setupAudioSync } from './modules/audioSync.js';
import { setupPerformanceOptimizations } from './modules/performance.js';

let scene, camera, renderer, composer;

init();
animate();

function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.xr.enabled = true;
    document.body.appendChild(renderer.domElement);
    document.body.appendChild(VRButton.createButton(renderer));

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 1.6, 0);
    controls.update();

    composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85);
    composer.addPass(bloomPass);

    setupClubStructure(scene);
    setupLighting(scene);
    setupLasers(scene);
    setupFog(scene);
    setupDJBooth(scene);
    setupMultiplayer(scene);
    setupAudioSync(scene);
    setupPerformanceOptimizations(scene, renderer);

    window.addEventListener('resize', onWindowResize, false);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    composer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    renderer.setAnimationLoop(render);
}

function render() {
    if (scene.userData.updateAudio) {
        scene.userData.updateAudio();
    }
    if (scene.userData.animateLights) {
        scene.userData.animateLights();
    }
    if (scene.userData.animateLasers) {
        scene.userData.animateLasers();
    }
    if (scene.userData.animateFog) {
        scene.userData.animateFog();
    }
    if (scene.userData.sendAvatarUpdate) {
        scene.userData.sendAvatarUpdate();
    }
    if (scene.userData.optimizePerformance) {
        scene.userData.optimizePerformance();
    }
    composer.render();
}
