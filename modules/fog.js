import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.174.0/build/three.module.js';

export function setupFog(scene) {
    scene.fog = new THREE.FogExp2(0x000000, 0.05);
}
