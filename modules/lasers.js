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
        new THREE.LineBasicMaterial({ color: 0x00ff00, transparent: true, opacity: 0.8 }), // Green
        new THREE.LineBasicMaterial({ color: 0xff0000, transparent: true, opacity: 0.8 }), // Red
        new THREE.LineBasicMaterial({ color: 0x0000ff, transparent: true, opacity: 0.8 })  // Blue
    ];
    
    // Laser emitters and beams
    const laserEmitters = [];
    const activeBeams = new Set(); // Track active beams for cleanup
    
    // Create emitters
    for (let i = 0; i < 10; i++) {
        const emitter = new THREE.Object3D();
        emitter.position.set(Math.random() * 50 - 25, Math.random() * 10, Math.random() * 50 - 25);
        laserEmitters.push(emitter);
    }

    // Function to animate lasers
    function animateLasers() {
        const time = Date.now() * 0.001;
        
        // Remove old beams that have faded out
        activeBeams.forEach(beam => {
            if (beam.material.opacity <= 0) {
                scene.remove(beam);
                activeBeams.delete(beam);
                beam.geometry.dispose();
                beam.material.dispose();
            }
        });
        
        // Update or create new beams
        laserEmitters.forEach((emitter, index) => {
            // Update emitter rotation
            emitter.rotation.y = time * (index % 2 === 0 ? 1 : -1);
            
            // Only create new beam occasionally
            if (Math.random() > 0.95) {
                const material = laserMaterials[index % laserMaterials.length].clone();
                material.opacity = 0.8; // Start fully visible
                
                const laserBeam = new THREE.Line(laserGeometry, material);
                laserBeam.position.copy(emitter.position);
                laserBeam.rotation.copy(emitter.rotation);
                laserBeam.userData.creationTime = time; // Store creation time
                
                scene.add(laserBeam);
                activeBeams.add(laserBeam);
            }
        });
        
        // Fade out existing beams
        activeBeams.forEach(beam => {
            const age = time - beam.userData.creationTime;
            if (age > 0.5) { // Start fading after 0.5 seconds
                beam.material.opacity = Math.max(0, beam.material.opacity - 0.02);
            }
        });
    }

    // Add the animate function to the scene's userData for animation loop access
    scene.userData.animateLasers = animateLasers;
}
