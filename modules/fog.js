import * as THREE from 'three';

export function setupFog(scene) {
    // Procedural smoke
    const smokeParticles = [];
    const smokeGeometry = new THREE.PlaneGeometry(10, 10);
    const smokeMaterial = new THREE.MeshBasicMaterial({ color: 0x555555, transparent: true, opacity: 0.5 });
    for (let i = 0; i < 50; i++) {
        const smoke = new THREE.Mesh(smokeGeometry, smokeMaterial);
        smoke.position.set(Math.random() * 50 - 25, Math.random() * 10, Math.random() * 50 - 25);
        smoke.rotation.z = Math.random() * 2 * Math.PI;
        smokeParticles.push(smoke);
        scene.add(smoke);
    }

    // Particle-based fog
    const fogParticles = [];
    const fogGeometry = new THREE.SphereGeometry(0.5, 8, 8);
    const fogMaterial = new THREE.MeshBasicMaterial({ color: 0xaaaaaa, transparent: true, opacity: 0.2 });
    for (let i = 0; i < 100; i++) {
        const fog = new THREE.Mesh(fogGeometry, fogMaterial);
        fog.position.set(Math.random() * 50 - 25, Math.random() * 10, Math.random() * 50 - 25);
        fogParticles.push(fog);
        scene.add(fog);
    }

    // Function to animate fog
    function animateFog() {
        const time = Date.now() * 0.0001;
        smokeParticles.forEach((smoke) => {
            smoke.rotation.z += 0.01;
            smoke.position.y = Math.sin(time + smoke.position.x * 0.01) * 2;
        });
        fogParticles.forEach((fog) => {
            fog.position.y = Math.sin(time + fog.position.x * 0.01) * 2;
        });
    }

    // Add the animate function to the scene's userData for animation loop access
    scene.userData.animateFog = animateFog;
}
