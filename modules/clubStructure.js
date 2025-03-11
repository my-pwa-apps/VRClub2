import * as THREE from 'three';

export function setupClubStructure(scene) {
    // Reflective dancefloor with improved materials
    const floorGeometry = new THREE.PlaneGeometry(50, 50, 50, 50); // Added segments for better reflection
    const floorMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x111111, 
        metalness: 0.9, 
        roughness: 0.1,
        envMapIntensity: 1.5
    });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    // Create grid pattern on floor
    const gridHelper = new THREE.GridHelper(50, 20, 0x000000, 0x333333);
    gridHelper.position.y = 0.01;
    scene.add(gridHelper);

    // Textured walls with bump mapping
    const wallGeometry = new THREE.BoxGeometry(50, 10, 1);
    const wallMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x333333, 
        metalness: 0.3, 
        roughness: 0.8,
        bumpScale: 0.02
    });
    
    // Create walls with acoustic panels
    const panelSize = 2;
    const panelGeometry = new THREE.BoxGeometry(panelSize, panelSize, 0.2);
    const panelMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x222222, 
        metalness: 0.1, 
        roughness: 0.9 
    });

    function createWallWithPanels(position, rotation) {
        const wall = new THREE.Mesh(wallGeometry, wallMaterial);
        wall.position.copy(position);
        wall.rotation.y = rotation;
        wall.receiveShadow = true;
        scene.add(wall);

        // Add acoustic panels
        for (let x = -20; x < 20; x += 3) {
            for (let y = 2; y < 8; y += 3) {
                const panel = new THREE.Mesh(panelGeometry, panelMaterial);
                panel.position.copy(position);
                panel.rotation.y = rotation;
                
                // Offset from wall
                const offset = new THREE.Vector3(x, y, 0);
                if (rotation !== 0) {
                    offset.applyAxisAngle(new THREE.Vector3(0, 1, 0), rotation);
                }
                panel.position.add(offset);
                
                scene.add(panel);
            }
        }
    }

    // Create walls with acoustic panels
    createWallWithPanels(new THREE.Vector3(0, 5, -25), 0);
    createWallWithPanels(new THREE.Vector3(0, 5, 25), Math.PI);
    createWallWithPanels(new THREE.Vector3(-25, 5, 0), Math.PI / 2);
    createWallWithPanels(new THREE.Vector3(25, 5, 0), -Math.PI / 2);

    // Ceiling with improved material
    const ceilingGeometry = new THREE.PlaneGeometry(50, 50);
    const ceilingMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x111111, 
        metalness: 0.5, 
        roughness: 0.7 
    });
    const ceiling = new THREE.Mesh(ceilingGeometry, ceilingMaterial);
    ceiling.rotation.x = Math.PI / 2;
    ceiling.position.y = 10;
    ceiling.receiveShadow = true;
    scene.add(ceiling);

    // Truss system
    function createTrussSegment(length) {
        const trussGroup = new THREE.Group();
        
        // Main beams
        const beamGeo = new THREE.CylinderGeometry(0.1, 0.1, length, 8);
        const beamMat = new THREE.MeshStandardMaterial({ 
            color: 0x888888, 
            metalness: 0.8, 
            roughness: 0.2 
        });
        
        // Create four main corner beams
        const positions = [
            { x: 0.5, z: 0.5 }, { x: -0.5, z: 0.5 },
            { x: 0.5, z: -0.5 }, { x: -0.5, z: -0.5 }
        ];
        
        positions.forEach(pos => {
            const beam = new THREE.Mesh(beamGeo, beamMat);
            beam.position.set(pos.x, 0, pos.z);
            beam.rotation.x = Math.PI / 2;
            trussGroup.add(beam);
        });

        // Create cross braces
        const braceLength = Math.sqrt(2);
        const braceGeo = new THREE.CylinderGeometry(0.05, 0.05, braceLength, 8);
        
        for (let i = 0; i < length; i += 1) {
            const brace1 = new THREE.Mesh(braceGeo, beamMat);
            const brace2 = new THREE.Mesh(braceGeo, beamMat);
            
            brace1.position.y = i - length/2;
            brace2.position.y = i - length/2;
            
            brace1.rotation.x = Math.PI/4;
            brace2.rotation.x = -Math.PI/4;
            
            trussGroup.add(brace1, brace2);
        }
        
        return trussGroup;
    }

    // Create main truss grid
    const trussGrid = new THREE.Group();
    
    // Create horizontal trusses
    const horizontalTruss1 = createTrussSegment(40);
    horizontalTruss1.position.set(0, 9, -10);
    trussGrid.add(horizontalTruss1);
    
    const horizontalTruss2 = createTrussSegment(40);
    horizontalTruss2.position.set(0, 9, 10);
    trussGrid.add(horizontalTruss2);
    
    // Create perpendicular trusses
    const verticalTruss1 = createTrussSegment(20);
    verticalTruss1.rotation.y = Math.PI/2;
    verticalTruss1.position.set(-15, 9, 0);
    trussGrid.add(verticalTruss1);
    
    const verticalTruss2 = createTrussSegment(20);
    verticalTruss2.rotation.y = Math.PI/2;
    verticalTruss2.position.set(15, 9, 0);
    trussGrid.add(verticalTruss2);

    scene.add(trussGrid);
    scene.userData.trussGrid = trussGrid; // Store reference for animations

    // Enhanced DJ booth with more detail
    const boothBase = new THREE.BoxGeometry(5, 2, 3);
    const boothTop = new THREE.BoxGeometry(4.5, 0.1, 2.8);
    const boothMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x444444, 
        metalness: 0.8, 
        roughness: 0.2 
    });
    const boothTopMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x666666, 
        metalness: 0.9, 
        roughness: 0.1 
    });
    
    const booth = new THREE.Mesh(boothBase, boothMaterial);
    const boothSurface = new THREE.Mesh(boothTop, boothTopMaterial);
    booth.position.set(0, 1, -20); // Moved to back of club
    boothSurface.position.set(0, 2, -20);
    booth.castShadow = true;
    booth.receiveShadow = true;
    scene.add(booth);
    scene.add(boothSurface);

    // LED screens with emissive materials
    const screenGeometry = new THREE.PlaneGeometry(10, 5);
    const screenMaterial = new THREE.MeshBasicMaterial({ 
        color: 0x000000,
        emissive: 0x222222,
        emissiveIntensity: 0.5
    });

    const screen1 = new THREE.Mesh(screenGeometry, screenMaterial);
    screen1.position.set(0, 5, -24.5);
    scene.add(screen1);

    const screen2 = screen1.clone();
    screen2.position.set(0, 5, 24.5);
    screen2.rotation.y = Math.PI;
    scene.add(screen2);

    const screen3 = screen1.clone();
    screen3.rotation.y = Math.PI / 2;
    screen3.position.set(-24.5, 5, 0);
    scene.add(screen3);

    const screen4 = screen3.clone();
    screen4.position.set(24.5, 5, 0);
    screen4.rotation.y = -Math.PI / 2;
    scene.add(screen4);
}
