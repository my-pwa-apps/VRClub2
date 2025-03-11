import * as THREE from 'three';

export function setupAudioSync(scene) {
    // Create an AudioListener and add it to the camera
    const listener = new THREE.AudioListener();
    scene.add(listener);

    // Create a global audio source
    const sound = new THREE.Audio(listener);

    // Create audio analyzer
    const analyser = new THREE.AudioAnalyser(sound, 32);

    // Setup visualizer elements
    const visualizerGeometry = new THREE.BoxGeometry(0.5, 1, 0.5);
    const visualizerMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    
    const visualizers = [];
    const visualizerCount = 16;
    
    for (let i = 0; i < visualizerCount; i++) {
        const visualizer = new THREE.Mesh(visualizerGeometry, visualizerMaterial.clone());
        visualizer.position.set(
            Math.cos(i / visualizerCount * Math.PI * 2) * 10,
            0,
            Math.sin(i / visualizerCount * Math.PI * 2) * 10
        );
        visualizers.push(visualizer);
        scene.add(visualizer);
    }

    // Function to update visualizer based on audio data
    function updateVisualizers() {
        if (!analyser) return;
        
        const data = analyser.getFrequencyData();
        
        for (let i = 0; i < visualizerCount; i++) {
            const value = data[i] / 256;
            visualizers[i].scale.y = value * 10 + 0.1;
            visualizers[i].material.color.setHSL(value, 0.8, 0.5);
        }
    }

    // Function for beat detection
    function detectBeat() {
        const data = analyser.getFrequencyData();
        const bass = data.slice(0, 5).reduce((a, b) => a + b, 0) / 5;
        if (bass > 200) {
            // Trigger beat reaction
            scene.userData.onBeat();
        }
    }

    // Function for ambient bass vibrations
    function ambientBassVibrations() {
        const data = analyser.getFrequencyData();
        const bass = data.slice(0, 5).reduce((a, b) => a + b, 0) / 5;
        scene.children.forEach((child) => {
            if (child.isMesh) {
                child.position.y = Math.sin(Date.now() * 0.01) * (bass / 256);
            }
        });
    }

    // Add the update functions to the scene's userData for animation loop access
    scene.userData.updateAudio = updateVisualizers;
    scene.userData.detectBeat = detectBeat;
    scene.userData.ambientBassVibrations = ambientBassVibrations;

    // Button to start audio (needed due to browser autoplay policies)
    const startButton = document.createElement('button');
    startButton.textContent = 'Start Audio';
    startButton.style.position = 'absolute';
    startButton.style.bottom = '10px';
    startButton.style.left = '10px';
    startButton.style.zIndex = '100';
    startButton.addEventListener('click', function() {
        if (sound.isPlaying) {
            sound.pause();
            startButton.textContent = 'Resume Audio';
        } else {
            sound.play();
            startButton.textContent = 'Pause Audio';
        }
    });
    document.body.appendChild(startButton);

    console.log('Audio synchronization setup completed');
}
