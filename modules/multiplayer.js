import * as THREE from 'three';

export function setupMultiplayer(scene) {
    let socket = null;
    const avatars = new Map(); // Track avatars by ID

    function connectWebSocket() {
        if (socket) return; // Prevent multiple connections

        try {
            socket = new WebSocket('wss://example-websocket-server-url');

            socket.onopen = () => {
                console.log('WebSocket connection established');
            };

            socket.onclose = (event) => {
                console.log('WebSocket connection closed:', event.code, event.reason);
                socket = null;
                // Attempt to reconnect after delay
                setTimeout(connectWebSocket, 5000);
            };

            socket.onerror = (error) => {
                console.error('WebSocket error:', error);
            };

            socket.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    handleMessage(data);
                } catch (e) {
                    console.error('Error parsing message:', e);
                }
            };
        } catch (e) {
            console.error('Error creating WebSocket:', e);
            setTimeout(connectWebSocket, 5000);
        }
    }

    function handleMessage(data) {
        switch (data.type) {
            case 'avatarUpdate':
                updateAvatar(data);
                break;
            case 'avatarLeft':
                removeAvatar(data.id);
                break;
            default:
                console.warn('Unknown message type:', data.type);
        }
    }

    function updateAvatar(data) {
        let avatar = avatars.get(data.id);
        
        if (!avatar) {
            // Create new avatar
            avatar = new THREE.Group();
            avatar.name = data.id;
            
            // Simple avatar representation
            const head = new THREE.Mesh(
                new THREE.BoxGeometry(0.3, 0.3, 0.3),
                new THREE.MeshBasicMaterial({ color: Math.random() * 0xffffff })
            );
            head.position.y = 1.6;
            avatar.add(head);

            const body = new THREE.Mesh(
                new THREE.CylinderGeometry(0.2, 0.2, 1.4, 8),
                new THREE.MeshBasicMaterial({ color: Math.random() * 0xffffff })
            );
            body.position.y = 0.7;
            avatar.add(body);
            
            scene.add(avatar);
            avatars.set(data.id, avatar);
        }

        // Update position and rotation with smoothing
        avatar.position.lerp(new THREE.Vector3(data.position.x, data.position.y, data.position.z), 0.3);
        avatar.rotation.set(data.rotation.x, data.rotation.y, data.rotation.z);
    }

    function removeAvatar(id) {
        const avatar = avatars.get(id);
        if (avatar) {
            scene.remove(avatar);
            // Cleanup geometry and materials
            avatar.traverse((obj) => {
                if (obj.geometry) obj.geometry.dispose();
                if (obj.material) obj.material.dispose();
            });
            avatars.delete(id);
        }
    }

    // Function to send avatar updates
    function sendAvatarUpdate() {
        if (!socket || socket.readyState !== WebSocket.OPEN) return;

        const camera = scene.getObjectByType(THREE.PerspectiveCamera);
        if (!camera) return;

        const data = {
            type: 'avatarUpdate',
            id: 'myAvatar',
            position: camera.position.toArray(),
            rotation: new THREE.Euler().setFromQuaternion(camera.quaternion).toArray()
        };
        
        socket.send(JSON.stringify(data));
    }

    // Cleanup function
    function cleanup() {
        if (socket) {
            socket.close();
            socket = null;
        }
        
        // Remove all avatars
        avatars.forEach((avatar, id) => removeAvatar(id));
        avatars.clear();
    }

    // Initialize connection
    connectWebSocket();

    // Add the sendAvatarUpdate function and cleanup to the scene's userData
    scene.userData.sendAvatarUpdate = sendAvatarUpdate;
    scene.userData.cleanupMultiplayer = cleanup;

    // Add cleanup on window unload
    window.addEventListener('beforeunload', cleanup);
}
