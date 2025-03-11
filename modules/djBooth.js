import * as THREE from 'three';

export function setupDJBooth(scene) {
    const boothGeometry = new THREE.BoxGeometry(5, 2, 3);
    const boothMaterial = new THREE.MeshStandardMaterial({ color: 0x444444, metalness: 0.8, roughness: 0.2 });
    const booth = new THREE.Mesh(boothGeometry, boothMaterial);
    booth.position.set(0, 1, 0);
    scene.add(booth);

    // Sliders and buttons for controlling visuals, music, and lighting
    const controls = document.createElement('div');
    controls.style.position = 'absolute';
    controls.style.bottom = '10px';
    controls.style.left = '10px';
    controls.style.zIndex = '100';

    const slider1 = document.createElement('input');
    slider1.type = 'range';
    slider1.min = '0';
    slider1.max = '100';
    slider1.value = '50';
    slider1.addEventListener('input', (event) => {
        const value = event.target.value;
        // Adjust visuals based on slider value
        booth.material.color.setHSL(value / 100, 0.8, 0.5);
    });
    controls.appendChild(slider1);

    const button1 = document.createElement('button');
    button1.textContent = 'Toggle Music';
    button1.addEventListener('click', () => {
        // Toggle music playback
        const audio = scene.userData.audio;
        if (audio.isPlaying) {
            audio.pause();
        } else {
            audio.play();
        }
    });
    controls.appendChild(button1);

    document.body.appendChild(controls);
}
