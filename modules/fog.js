import * as THREE from 'three';

export function setupFog(scene) {
    scene.fog = new THREE.FogExp2(0x000000, 0.05);
}
