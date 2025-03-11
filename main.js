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
    
    renderer = new THREE.WebGLRenderer({ 
        antialias: true,
        powerPreference: 'high-performance',
        alpha: false
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.xr.enabled = true;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    
    document.body.appendChild(renderer.domElement);
    document.body.appendChild(VRButton.createButton(renderer));

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 1.6, 0);
    controls.update();

    camera.position.set(0, 1.6, 5);
    
    // Setup separate composers for VR and non-VR
    const renderPass = new RenderPass(scene, camera);
    
    // Main composer for non-VR
    composer = new EffectComposer(renderer);
    composer.addPass(renderPass);
    
    const bloomPass = new UnrealBloomPass(
        new THREE.Vector2(window.innerWidth, window.innerHeight),
        1.0,
        0.4,
        0.85
    );
    composer.addPass(bloomPass);
    
    // Store references for cleanup
    scene.userData.composer = composer;
    scene.userData.bloomPass = bloomPass;
    scene.userData.renderPass = renderPass;

    // VR mode handling
    renderer.xr.addEventListener('sessionstart', function () {
        renderer.setPixelRatio(1);
        bloomPass.strength = 0.7;
    });

    renderer.xr.addEventListener('sessionend', function () {
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        bloomPass.strength = 1.0;
    });

    // Setup components
    setupClubStructure(scene);
    setupLighting(scene);
    setupLasers(scene);
    setupFog(scene);
    setupDJBooth(scene);
    setupMultiplayer(scene);
    setupAudioSync(scene);
    setupPerformanceOptimizations(scene, renderer);

    window.addEventListener('resize', onWindowResize, false);
    
    // Add cleanup function
    window.addEventListener('beforeunload', cleanup);
}

function cleanup() {
    // Cleanup composers and passes
    if (scene.userData.composer) {
        scene.userData.composer.dispose();
    }
    if (scene.userData.bloomPass) {
        scene.userData.bloomPass.dispose();
    }
    if (scene.userData.renderPass) {
        scene.userData.renderPass.dispose();
    }
    
    // Cleanup other components
    if (scene.userData.cleanupMultiplayer) {
        scene.userData.cleanupMultiplayer();
    }
    if (scene.userData.cleanupPerformance) {
        scene.userData.cleanupPerformance();
    }
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
    const xrEnabled = renderer.xr.enabled && renderer.xr.isPresenting;
    
    // Update components
    if (scene.userData.updateAudio) scene.userData.updateAudio();
    if (scene.userData.animateLights) scene.userData.animateLights();
    if (scene.userData.animateLasers) scene.userData.animateLasers();
    if (scene.userData.animateFog) scene.userData.animateFog();
    if (scene.userData.sendAvatarUpdate) scene.userData.sendAvatarUpdate();
    if (scene.userData.optimizePerformance) scene.userData.optimizePerformance();
    
    // Render with or without post-processing based on VR state
    if (xrEnabled) {
        renderer.render(scene, camera);
    } else {
        composer.render();
    }
}
