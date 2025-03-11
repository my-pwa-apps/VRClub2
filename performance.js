function setupPerformanceOptimizations(scene) {
    if (!(scene instanceof THREE.Scene)) {
        console.error("Invalid scene object");
        return;
    }

    const object = scene.getObjectByType(THREE.Mesh);
    if (object) {
        // ...existing code...
    }
}