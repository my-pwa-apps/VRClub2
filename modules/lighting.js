import * as THREE from 'three';

export function setupLighting(scene) {
    // Ambient light
    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);

    // Spotlights
    const spotLight1 = new THREE.SpotLight(0xffffff);
    spotLight1.position.set(15, 40, 35);
    spotLight1.castShadow = true;
    scene.add(spotLight1);

    const spotLight2 = new THREE.SpotLight(0xffffff);
    spotLight2.position.set(-15, 40, -35);
    spotLight2.castShadow = true;
    scene.add(spotLight2);

    // Strobe lights
    const strobeLight = new THREE.PointLight(0xff0000, 1, 100);
    strobeLight.position.set(0, 10, 0);
    scene.add(strobeLight);

    // Volumetric lighting
    const volumetricLight = new THREE.PointLight(0x00ff00, 1, 100);
    volumetricLight.position.set(0, 20, 0);
    scene.add(volumetricLight);

    // Soft shadows
    const shadowLight = new THREE.DirectionalLight(0xffffff, 1);
    shadowLight.position.set(0, 50, 0);
    shadowLight.castShadow = true;
    scene.add(shadowLight);

    // Function to animate lights
    function animateLights() {
        const time = Date.now() * 0.0005;
        spotLight1.position.x = Math.sin(time * 0.7) * 30;
        spotLight1.position.z = Math.cos(time * 0.7) * 30;
        spotLight2.position.x = Math.cos(time * 0.3) * 30;
        spotLight2.position.z = Math.sin(time * 0.3) * 30;
        strobeLight.intensity = Math.abs(Math.sin(time * 10));
    }

    // Add the animate function to the scene's userData for animation loop access
    scene.userData.animateLights = animateLights;
}
