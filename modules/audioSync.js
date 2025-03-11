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

    // Load audio file (using a royalty-free track from an open source)
    const audioLoader = new THREE.AudioLoader();
    
    // Track loading status
    let audioLoaded = false;
    
    // Try to load audio from a CDN
    audioLoader.load(
        'https://cdn.jsdelivr.net/gh/mrdoob/three.js@master/examples/sounds/376737_Skullbeatz___Bad_Cat_Maste.mp3',
        function(buffer) {
            sound.setBuffer(buffer);
            sound.setLoop(true);
            sound.setVolume(0.5);
            audioLoaded = true;
            console.log('Audio loaded successfully');
        },
        function(xhr) {
            console.log('Audio loading: ' + (xhr.loaded / xhr.total * 100) + '%');
        },
        function(err) {
            console.error('Audio loading error:', err);
            // Create a fallback oscillator as audio source if loading fails
            const oscillator = listener.context.createOscillator();
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(440, listener.context.currentTime);
            
            const gainNode = listener.context.createGain();
            gainNode.gain.setValueAtTime(0.1, listener.context.currentTime);
            
            oscillator.connect(gainNode);
            sound.setNodeSource(gainNode);
            oscillator.start();
            audioLoaded = true;
        }
    );

    // Function to update visualizer based on audio data
    function updateVisualizers() {
        if (!analyser || !audioLoaded) return;
        
        const data = analyser.getFrequencyData();
        
        for (let i = 0; i < visualizerCount; i++) {
            const value = data[i % data.length] / 256;
            visualizers[i].scale.y = value * 10 + 0.1;
            visualizers[i].material.color.setHSL(value, 0.8, 0.5);
        }
    }

    // Function for beat detection
    function detectBeat() {
        if (!analyser || !audioLoaded) return false;
        
        const data = analyser.getFrequencyData();
        const bass = data.slice(0, 5).reduce((a, b) => a + b, 0) / 5;
        
        if (bass > 200) {
            // Trigger visual effects on beat
            triggerBeatEffects();
            return true;
        }
        return false;
    }
    
    // Visual effects to trigger on beat
    function triggerBeatEffects() {
        // Flash the floor
        scene.traverse((object) => {
            if (object.isMesh && object.position.y < 0.1) {
                // Temporarily brighten floor material
                if (object.material.originalColor === undefined) {
                    object.material.originalColor = object.material.color.clone();
                }
                object.material.color.set(0xFFFFFF);
                
                // Reset after a short delay
                setTimeout(() => {
                    if (object.material.originalColor) {
                        object.material.color.copy(object.material.originalColor);
                    }
                }, 100);
            }
        });
    }

    // Function for ambient bass vibrations
    function ambientBassVibrations() {
        if (!analyser || !audioLoaded) return;
        
        const data = analyser.getFrequencyData();
        const bass = data.slice(0, 5).reduce((a, b) => a + b, 0) / 5;
        const bassIntensity = bass / 256 * 0.05; // Scale down for subtle effect
        
        // Apply subtle movement to specific objects based on bass
        scene.traverse((child) => {
            if (child.isMesh && child.userData.respondsToBass) {
                child.position.y += Math.sin(Date.now() * 0.003) * bassIntensity;
            }
        });
    }

    // Combined audio update function for the animation loop
    function updateAudio() {
        updateVisualizers();
        detectBeat();
        ambientBassVibrations();
    }

    // Add the update function to the scene's userData for animation loop access
    scene.userData.updateAudio = updateAudio;
    scene.userData.onBeat = triggerBeatEffects;

    // Button to start audio (needed due to browser autoplay policies)
    const startButton = document.createElement('button');
    startButton.textContent = 'Start Audio';
    startButton.style.position = 'absolute';
    startButton.style.bottom = '10px';
    startButton.style.left = '10px';
    startButton.style.padding = '10px';
    startButton.style.zIndex = '100';
    startButton.addEventListener('click', function() {
        if (!audioLoaded) {
            startButton.textContent = 'Loading Audio...';
            return;
        }
        
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
