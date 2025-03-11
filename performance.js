function setupPerformanceOptimizations(scene) {
    if (!(scene instanceof THREE.Scene)) {
        console.error("Invalid scene object");
        return;
    }

    const object = scene.getObjectByProperty('type', 'Mesh');
    if (object) {
        // ...existing code...
    }
}