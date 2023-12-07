class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 2 + 1;
    }

    draw() {
        const transparency = 0.1; // Set transparency
        ctx.fillStyle = `rgba(255, 255, 255, ${transparency})`;
        ctx.beginPath();

        // let randomOffset = (Math.random() - 0.5) * 5;
        // // Update this.y with the random offset
        // this.y += randomOffset;

        ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
        ctx.fill();
    }

    update() {
        if (this.size > 0) {
            this.size += .05;
        }
    }

    reset(x, y) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 2 + 1;
    }

}

class WanderBoat {
    constructor(x, y, radius, speed, backgroundImage, boatImage) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.speed = speed;
        this.wanderAngle = 0;
        this.backgroundImage = backgroundImage;
        this.boatImage = boatImage;
        this.particles = [];
        this.numParticles = 30; // Adjust the number of particles
        this.boatWidth = this.radius * 4; // Set boat width based on the Boat's diameter
        this.boatHeight = (this.boatWidth / this.boatImage.width) * this.boatImage.height;
        this.createParticles();
    }

    createParticles() {
        for (let i = 0; i < this.numParticles; i++) {
            this.particles.push(new Particle(this.x, this.y));
        }
    }

    drawBackground() {
        ctx.drawImage(this.backgroundImage, 0, 0, canvas.width, canvas.height);
    }

    drawBoat() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.wanderAngle);
        ctx.drawImage(this.boatImage, -this.boatWidth / 2, -this.boatHeight / 2, this.boatWidth, this.boatHeight);

        ctx.restore();

    }

    drawParticles() {
        for (const particle of this.particles) {
            particle.draw();
        }
    }

    updateParticles() {
        for (const particle of this.particles) {
            if (particle.size > 6) {
                particle.reset(this.x, this.y);
            } else {
                particle.update();
            }
        }
    }

    update() {
        // Implement wander steering behavior
        this.updateParticles();
        const wanderOffset = this.speed;
        const changeFactor = 0.02; // Adjust the change factor for smoother direction change
        const steeringDistance = 160; // Distance from the boundary to start steering
        const maxSteeringAngle = 0.05; // Maximum steering angle

        this.wanderAngle += (Math.random() * 2 - 1) * changeFactor;

        const wanderX = this.x + wanderOffset * Math.cos(this.wanderAngle);
        const wanderY = this.y + wanderOffset * Math.sin(this.wanderAngle);

        // Check if close to the boundary to start steering
        if (
            this.x < steeringDistance ||
            canvas.width - this.x < steeringDistance ||
            this.y < steeringDistance ||
            canvas.height - this.y < steeringDistance
        ) {
            const angleToCenter = Math.atan2(canvas.height / 2 - this.y, canvas.width / 2 - this.x);
            const steeringAngle = angleToCenter - this.wanderAngle;

            // Limit the steering influence
            this.wanderAngle += Math.min(maxSteeringAngle, Math.max(-maxSteeringAngle, steeringAngle));
        }

        // Apply normal wandering behavior
        this.x += (wanderX - this.x) * 0.1;
        this.y += (wanderY - this.y) * 0.1;

        // Keep the Boat within the canvas
        this.x = Math.max(this.radius, Math.min(canvas.width - this.radius, this.x));
        this.y = Math.max(this.radius, Math.min(canvas.height - this.radius, this.y));

        // Update particles

    }
}