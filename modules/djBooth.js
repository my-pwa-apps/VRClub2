import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.174.0/build/three.module.js';

export function setupDJBooth(scene) {
    const boothGeometry = new THREE.BoxGeometry(5, 2, 3);
    const boothMaterial = new THREE.MeshStandardMaterial({ color: 0x444444, metalness: 0.8, roughness: 0.2 });
    const booth = new THREE.Mesh(boothGeometry, boothMaterial);
    booth.position.set(0, 1, 0);
    scene.add(booth);
}
