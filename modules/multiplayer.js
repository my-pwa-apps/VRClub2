import * as THREE from 'three';

export function setupMultiplayer(scene) {
    // Placeholder for multiplayer setup
    console.log('Multiplayer setup not implemented yet.');

    // WebSocket connection
    const socket = new WebSocket('wss://example-websocket-server-url');

    socket.onopen = () => {
        console.log('WebSocket connection established');
    };

    socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        // Handle avatar updates
        if (data.type === 'avatarUpdate') {
            const avatar = scene.getObjectByName(data.id);
            if (avatar) {
                avatar.position.set(data.position.x, data.position.y, data.position.z);
                avatar.rotation.set(data.rotation.x, data.rotation.y, data.rotation.z);
            } else {
                // Load new avatar
                loadAvatar(data.id, data.url);
            }
        }
    };

    function loadAvatar(id, url) {
        const loader = new THREE.GLTFLoader();
        loader.load(url, (gltf) => {
            const avatar = gltf.scene;
            avatar.name = id;
            scene.add(avatar);
        });
    }

    // Function to send avatar updates
    function sendAvatarUpdate() {
        const avatar = scene.getObjectByName('myAvatar');
        if (avatar) {
            const data = {
                type: 'avatarUpdate',
                id: 'myAvatar',
                position: avatar.position,
                rotation: avatar.rotation
            };
            socket.send(JSON.stringify(data));
        }
    }

    // Add the sendAvatarUpdate function to the scene's userData for animation loop access
    scene.userData.sendAvatarUpdate = sendAvatarUpdate;
}
