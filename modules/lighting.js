import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.174.0/build/three.module.js';

export function setupLighting(scene) {
    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);

    const spotLight = new THREE.SpotLight(0xffffff);
    spotLight.position.set(15, 40, 35);
    spotLight.castShadow = true;
    scene.add(spotLight);

    const pointLight = new THREE.PointLight(0xff0000, 1, 100);
    pointLight.position.set(0, 10, 0);
    scene.add(pointLight);
}
