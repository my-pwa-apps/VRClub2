import * as THREE from 'three';

export function setupLasers(scene) {
    const laserMaterial = new THREE.LineBasicMaterial({ color: 0x00ff00 });
    const points = [];
    points.push(new THREE.Vector3(-10, 0, 0));
    points.push(new THREE.Vector3(0, 10, 0));
    points.push(new THREE.Vector3(10, 0, 0));
    const laserGeometry = new THREE.BufferGeometry().setFromPoints(points);
    const laser = new THREE.Line(laserGeometry, laserMaterial);
    scene.add(laser);

    // Laser emitters
    const laserEmitters = [];
    for (let i = 0; i < 10; i++) {
        const emitter = new THREE.Object3D();
        emitter.position.set(Math.random() * 50 - 25, Math.random() * 10, Math.random() * 50 - 25);
        laserEmitters.push(emitter);
        scene.add(emitter);
    }

    // Function to animate lasers
    function animateLasers() {
        const time = Date.now() * 0.001;
        laserEmitters.forEach((emitter, index) => {
            emitter.rotation.y = time * (index % 2 === 0 ? 1 : -1);
            const laserBeam = new THREE.Line(laserGeometry, laserMaterial.clone());
            laserBeam.position.copy(emitter.position);
            laserBeam.rotation.copy(emitter.rotation);
            scene.add(laserBeam);
        });
    }

    // Add the animate function to the scene's userData for animation loop access
    scene.userData.animateLasers = animateLasers;
}
