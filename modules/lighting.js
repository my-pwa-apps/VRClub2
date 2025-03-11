import * as THREE from 'three';

export function setupLighting(scene) {
    // Ambient light (dimmer for club atmosphere)
    const ambientLight = new THREE.AmbientLight(0x111111);
    scene.add(ambientLight);

    // Moving spotlights attached to truss
    const trussSpotlights = [];
    const colors = [0xff0000, 0x00ff00, 0x0000ff, 0xff00ff, 0xffff00, 0x00ffff];
    
    // Create spotlights for each truss position
    const spotPositions = [
        { x: -15, z: -10 }, { x: 15, z: -10 },
        { x: -15, z: 10 }, { x: 15, z: 10 },
        { x: -15, z: 0 }, { x: 15, z: 0 }
    ];

    spotPositions.forEach((pos, index) => {
        const spotlight = new THREE.SpotLight(
            colors[index % colors.length],
            1.5, // intensity
            30, // distance
            Math.PI / 6, // angle
            0.5, // penumbra
            1 // decay
        );
        
        spotlight.position.set(pos.x, 9, pos.z);
        spotlight.castShadow = true;
        
        // Improve shadow quality
        spotlight.shadow.mapSize.width = 1024;
        spotlight.shadow.mapSize.height = 1024;
        spotlight.shadow.camera.near = 0.5;
        spotlight.shadow.camera.far = 30;
        
        // Create visible cone for the spotlight
        const spotGeometry = new THREE.ConeGeometry(2, 4, 32);
        const spotMaterial = new THREE.MeshBasicMaterial({
            color: colors[index % colors.length],
            transparent: true,
            opacity: 0.1,
            side: THREE.DoubleSide
        });
        const spotCone = new THREE.Mesh(spotGeometry, spotMaterial);
        spotCone.position.copy(spotlight.position);
        spotCone.rotation.x = Math.PI;
        
        scene.add(spotlight);
        scene.add(spotCone);
        
        // Group spotlight and cone together
        trussSpotlights.push({
            light: spotlight,
            cone: spotCone,
            basePosition: { ...pos },
            phase: (index * Math.PI) / 3 // Offset each spotlight's phase
        });
    });

    // Accent lights on the walls
    const wallLights = [];
    for (let x = -20; x <= 20; x += 10) {
        for (const z of [-24, 24]) {
            const wallLight = new THREE.PointLight(0xffaa44, 0.3, 8, 2);
            wallLight.position.set(x, 5, z);
            scene.add(wallLight);
            wallLights.push(wallLight);
        }
    }

    // UV/Black lights for glow effects
    const blackLights = [];
    for (let i = 0; i < 4; i++) {
        const blackLight = new THREE.RectAreaLight(0x6600ff, 0.5, 4, 1);
        blackLight.position.set(
            Math.cos(i * Math.PI/2) * 20,
            8,
            Math.sin(i * Math.PI/2) * 20
        );
        blackLight.lookAt(0, 0, 0);
        scene.add(blackLight);
        blackLights.push(blackLight);
    }

    // Function to animate lights
    function animateLights() {
        const time = Date.now() * 0.001; // Slower movement
        
        // Animate truss spotlights
        trussSpotlights.forEach((spot, index) => {
            // Calculate movement pattern
            const xOffset = Math.sin(time + spot.phase) * 5;
            const zOffset = Math.cos(time * 0.5 + spot.phase) * 5;
            
            // Update spotlight position
            spot.light.position.x = spot.basePosition.x + xOffset;
            spot.light.position.z = spot.basePosition.z + zOffset;
            
            // Update cone position
            spot.cone.position.copy(spot.light.position);
            
            // Rotate spotlight target
            const targetX = Math.sin(time * 0.7 + spot.phase) * 15;
            const targetZ = Math.cos(time * 0.3 + spot.phase) * 15;
            spot.light.target.position.set(targetX, 0, targetZ);
            
            // Animate colors for dance music sync
            const hue = (time * 0.1 + index * 0.2) % 1;
            spot.light.color.setHSL(hue, 1, 0.5);
            spot.cone.material.color.setHSL(hue, 1, 0.5);
        });

        // Animate wall lights
        wallLights.forEach((light, i) => {
            light.intensity = 0.3 + Math.sin(time * 2 + i) * 0.2;
        });

        // Ensure all spotlight targets are updated
        trussSpotlights.forEach(spot => {
            scene.add(spot.light.target);
        });
    }

    // Add the animate function to the scene's userData for animation loop access
    scene.userData.animateLights = animateLights;
}
