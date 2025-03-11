import * as THREE from 'three';

export function setupFog(scene) {
    // Use instanced meshes for better performance
    const smokeCount = 50;
    const fogCount = 100;

    // Procedural smoke using instanced mesh
    const smokeGeometry = new THREE.PlaneGeometry(10, 10);
    const smokeMaterial = new THREE.MeshBasicMaterial({ 
        color: 0x555555, 
        transparent: true, 
        opacity: 0.5,
        depthWrite: false // Improve transparency rendering
    });
    
    const smokeInstanced = new THREE.InstancedMesh(
        smokeGeometry,
        smokeMaterial,
        smokeCount
    );

    const dummy = new THREE.Object3D();
    const positions = [];
    
    for (let i = 0; i < smokeCount; i++) {
        dummy.position.set(
            Math.random() * 50 - 25,
            Math.random() * 10,
            Math.random() * 50 - 25
        );
        dummy.rotation.z = Math.random() * 2 * Math.PI;
        dummy.updateMatrix();
        smokeInstanced.setMatrixAt(i, dummy.matrix);
        positions.push(dummy.position.clone());
    }
    
    scene.add(smokeInstanced);

    // Particle-based fog using instanced mesh
    const fogGeometry = new THREE.SphereGeometry(0.5, 8, 8);
    const fogMaterial = new THREE.MeshBasicMaterial({ 
        color: 0xaaaaaa, 
        transparent: true, 
        opacity: 0.2,
        depthWrite: false
    });
    
    const fogInstanced = new THREE.InstancedMesh(
        fogGeometry,
        fogMaterial,
        fogCount
    );

    const fogPositions = [];
    
    for (let i = 0; i < fogCount; i++) {
        dummy.position.set(
            Math.random() * 50 - 25,
            Math.random() * 10,
            Math.random() * 50 - 25
        );
        dummy.updateMatrix();
        fogInstanced.setMatrixAt(i, dummy.matrix);
        fogPositions.push(dummy.position.clone());
    }
    
    scene.add(fogInstanced);

    // Function to animate fog
    function animateFog() {
        const time = Date.now() * 0.0001;

        // Animate smoke instances
        for (let i = 0; i < smokeCount; i++) {
            dummy.position.copy(positions[i]);
            dummy.rotation.z += 0.01;
            dummy.position.y = Math.sin(time + positions[i].x * 0.01) * 2;
            dummy.updateMatrix();
            smokeInstanced.setMatrixAt(i, dummy.matrix);
        }
        smokeInstanced.instanceMatrix.needsUpdate = true;

        // Animate fog instances
        for (let i = 0; i < fogCount; i++) {
            dummy.position.copy(fogPositions[i]);
            dummy.position.y = Math.sin(time + fogPositions[i].x * 0.01) * 2;
            dummy.updateMatrix();
            fogInstanced.setMatrixAt(i, dummy.matrix);
        }
        fogInstanced.instanceMatrix.needsUpdate = true;
    }

    // Add the animate function to the scene's userData for animation loop access
    scene.userData.animateFog = animateFog;
}
