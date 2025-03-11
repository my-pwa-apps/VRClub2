class Game {
    constructor() {
        this.init();
    }

    async init() {
        await this.createScene();
    }

    async createScene() {
        // ...existing code...
        new ManannanSystem();
        // ...existing code...
    }
}

// ...existing code...

document.addEventListener('DOMContentLoaded', () => {
    new Game();
});
