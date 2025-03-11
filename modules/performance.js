import * as THREE from 'three';
import { KTX2Loader } from 'three/examples/jsm/loaders/KTX2Loader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import Stats from 'three/examples/jsm/libs/stats.module.js';

export function setupPerformanceOptimizations(scene, renderer) {
    // Initialize performance monitoring
    const stats = new Stats();
    stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
    document.body.appendChild(stats.dom);
    
    // Position stats panel in VR-friendly location
    stats.dom.style.position = 'absolute';
    stats.dom.style.top = '0px';
    stats.dom.style.left = 'auto';
    stats.dom.style.right = '0px';

    // Create distance-based LOD groups for complex objects
    function createLODObject(position) {
        const lod = new THREE.LOD();
        
        // High detail (close range)
        const highGeo = new THREE.BoxGeometry(1, 1, 1, 8, 8, 8);
        const highMat = new THREE.MeshStandardMaterial({ color: 0xff0000 });
        const highMesh = new THREE.Mesh(highGeo, highMat);
        lod.addLevel(highMesh, 0);
        
        // Medium detail (mid range)
        const medGeo = new THREE.BoxGeometry(1, 1, 1, 4, 4, 4);
        const medMesh = new THREE.Mesh(medGeo, highMat);
        lod.addLevel(medMesh, 15);
        
        // Low detail (far range)
        const lowGeo = new THREE.BoxGeometry(1, 1, 1, 2, 2, 2);
        const lowMesh = new THREE.Mesh(lowGeo, highMat);
        lod.addLevel(lowMesh, 30);
        
        lod.position.copy(position);
        return lod;
    }

    // Create LOD objects at strategic points
    const lodObjects = [];
    for (let i = 0; i < 10; i++) {
        const pos = new THREE.Vector3(
            Math.random() * 40 - 20,
            Math.random() * 8,
            Math.random() * 40 - 20
        );
        const lodObj = createLODObject(pos);
        scene.add(lodObj);
        lodObjects.push(lodObj);
    }

    // Setup occlusion culling (simple implementation)
    const occlusionCuller = {
        camera: null,
        frustum: new THREE.Frustum(),
        objects: new Set(),
        
        init(camera) {
            this.camera = camera;
        },
        
        addObject(object) {
            this.objects.add(object);
            object.userData.wasVisible = true;
        },
        
        update() {
            if (!this.camera) return;
            
            // Update frustum
            this.frustum.setFromProjectionMatrix(
                new THREE.Matrix4().multiplyMatrices(
                    this.camera.projectionMatrix,
                    this.camera.matrixWorldInverse
                )
            );
            
            // Check each object
            this.objects.forEach(object => {
                if (!object.geometry.boundingSphere) {
                    object.geometry.computeBoundingSphere();
                }
                
                const sphere = object.geometry.boundingSphere.clone();
                sphere.applyMatrix4(object.matrixWorld);
                
                const visible = this.frustum.intersectsSphere(sphere);
                
                // Only update visibility if it changed
                if (visible !== object.userData.wasVisible) {
                    object.visible = visible;
                    object.userData.wasVisible = visible;
                }
            });
        }
    };

    // Initialize occlusion culling with camera
    const camera = scene.getObjectByType(THREE.PerspectiveCamera);
    if (camera) {
        occlusionCuller.init(camera);
    }

    // Add objects for occlusion culling
    scene.traverse(object => {
        if (object.isMesh && object !== scene) {
            occlusionCuller.addObject(object);
        }
    });

    // Texture management
    const textureLoader = new THREE.TextureLoader();
    const loadingManager = new THREE.LoadingManager();
    const textureCache = new Map();

    function loadTexture(url, onLoad) {
        if (textureCache.has(url)) {
            onLoad(textureCache.get(url));
            return;
        }

        textureLoader.load(url, texture => {
            // Apply texture optimizations
            texture.generateMipmaps = true;
            texture.minFilter = THREE.LinearMipMapLinearFilter;
            texture.magFilter = THREE.LinearFilter;
            texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
            
            textureCache.set(url, texture);
            onLoad(texture);
        });
    }

    // Memory management
    function disposeObject(object) {
        if (object.geometry) {
            object.geometry.dispose();
        }

        if (object.material) {
            if (Array.isArray(object.material)) {
                object.material.forEach(material => disposeMaterial(material));
            } else {
                disposeMaterial(object.material);
            }
        }
    }

    function disposeMaterial(material) {
        Object.keys(material).forEach(prop => {
            if (!material[prop]) return;
            if (material[prop].isTexture) {
                material[prop].dispose();
            }
        });
        material.dispose();
    }

    // Function to optimize performance during runtime
    function optimizePerformance() {
        stats.begin();

        // Update LOD objects
        lodObjects.forEach(lod => {
            if (camera) {
                const distance = camera.position.distanceTo(lod.position);
                lod.update(camera);
            }
        });

        // Update occlusion culling
        occlusionCuller.update();

        stats.end();
    }

    // Enhanced cleanup function
    function cleanup() {
        // Remove stats panel
        if (stats.dom && stats.dom.parentNode) {
            stats.dom.parentNode.removeChild(stats.dom);
        }

        // Dispose of all cached textures
        textureCache.forEach(texture => texture.dispose());
        textureCache.clear();

        // Dispose of all geometries and materials
        scene.traverse(object => {
            disposeObject(object);
        });
    }

    // Add functions to scene's userData
    scene.userData.optimizePerformance = optimizePerformance;
    scene.userData.cleanupPerformance = cleanup;
    scene.userData.loadTexture = loadTexture;
    scene.userData.stats = stats; // Store reference for external access
}
