import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.174.0/build/three.module.js';

export function setupLasers(scene) {
    const laserMaterial = new THREE.LineBasicMaterial({ color: 0x00ff00 });
    const points = [];
    points.push(new THREE.Vector3(-10, 0, 0));
    points.push(new THREE.Vector3(0, 10, 0));
    points.push(new THREE.Vector3(10, 0, 0));
    const laserGeometry = new THREE.BufferGeometry().setFromPoints(points);
    const laser = new THREE.Line(laserGeometry, laserMaterial);
    scene.add(laser);
}
