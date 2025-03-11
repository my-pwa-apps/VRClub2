import * as THREE from 'three';

export function setupLasers(scene) {
    // Create a reusable laser geometry
    const points = [];
    points.push(new THREE.Vector3(-10, 0, 0));
    points.push(new THREE.Vector3(0, 10, 0));
    points.push(new THREE.Vector3(10, 0, 0));
    const laserGeometry = new THREE.BufferGeometry().setFromPoints(points);
    
    // Create laser materials with different colors for variety
    const laserMaterials = [
        new THREE.LineBasicMaterial({ color: 0x00ff00 }), // Green
        new THREE.LineBasicMaterial({ color: 0xff0000 }), // Red
        new THREE.LineBasicMaterial({ color: 0x0000ff })  // Blue
    ];
    
    // Laser emitters and beams (pre-create the beams to avoid creating new objects every frame)
    const laserEmitters = [];
    const laserBeams = [];
    
    for (let i = 0; i < 10; i++) {
        // Create emitter (position only)
        const emitter = new THREE.Object3D();
        emitter.position.set(Math.random() * 50 - 25, Math.random() * 10, Math.random() * 50 - 25);
        laserEmitters.push(emitter);
        scene.add(emitter);
        
        // Create beam attached to this emitter (reuse these objects)
        const material = laserMaterials[i % laserMaterials.length];
        const laserBeam = new THREE.Line(laserGeometry, material);
        laserBeam.position.copy(emitter.position);
        laserBeams.push(laserBeam);
        scene.add(laserBeam);
    }

    // Function to animate lasers
    function animateLasers() {
        const time = Date.now() * 0.001;
        
        laserEmitters.forEach((emitter, index) => {
            // Update emitter rotation
            emitter.rotation.y = time * (index % 2 === 0 ? 1 : -1);
            
            // Update corresponding laser beam
            const laserBeam = laserBeams[index];
            laserBeam.position.copy(emitter.position);
            laserBeam.rotation.copy(emitter.rotation);
            
            // Add some variation to the beams
            laserBeam.scale.y = 1 + Math.sin(time * 2 + index) * 0.3;
            
            // Toggle visibility occasionally for strobe effect
            if (Math.random() > 0.95) {
                laserBeam.visible = !laserBeam.visible;
            }
        });
    }

    // Add the animate function to the scene's userData for animation loop access
    scene.userData.animateLasers = animateLasers;
}
