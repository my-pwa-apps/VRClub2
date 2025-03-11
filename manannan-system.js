// Define KQ3_COLORS if not already defined
const KQ3_COLORS = {
    red: '#FF0000',
    green: '#00FF00',
    blue: '#0000FF'
};

// ...existing code...

class ManannanSystem {
    constructor() {
        // ...existing code...
        this.startCountdown();
    }

    startCountdown() {
        // ...existing code...
        setInterval(() => {
            // ...existing code...
            this.showMessage();
        }, 1000);
    }

    showMessage() {
        // Ensure KQ3_COLORS is defined
        console.log(KQ3_COLORS.red); // Example usage
        // ...existing code...
    }

    appearManannan() {
        // Define the appearManannan function
        console.log('Manannan appears!');
        // ...existing code...
    }
}

// ...existing code...
