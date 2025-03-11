import * as THREE from 'three';

export function setupClubStructure(scene) {
    const floorGeometry = new THREE.PlaneGeometry(50, 50);
    const floorMaterial = new THREE.MeshStandardMaterial({ color: 0x111111, metalness: 0.8, roughness: 0.2 });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    const wallGeometry = new THREE.BoxGeometry(50, 10, 1);
    const wallMaterial = new THREE.MeshStandardMaterial({ color: 0x333333, metalness: 0.5, roughness: 0.7 });
    const wall1 = new THREE.Mesh(wallGeometry, wallMaterial);
    wall1.position.set(0, 5, -25);
    scene.add(wall1);

    const wall2 = wall1.clone();
    wall2.position.set(0, 5, 25);
    scene.add(wall2);

    const wall3 = wall1.clone();
    wall3.rotation.y = Math.PI / 2;
    wall3.position.set(-25, 5, 0);
    scene.add(wall3);

    const wall4 = wall3.clone();
    wall4.position.set(25, 5, 0);
    scene.add(wall4);

    const ceilingGeometry = new THREE.PlaneGeometry(50, 50);
    const ceilingMaterial = new THREE.MeshStandardMaterial({ color: 0x222222, metalness: 0.5, roughness: 0.7 });
    const ceiling = new THREE.Mesh(ceilingGeometry, ceilingMaterial);
    ceiling.rotation.x = Math.PI / 2;
    ceiling.position.y = 10;
    scene.add(ceiling);
}
