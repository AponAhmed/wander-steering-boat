class WanderCircle {
    constructor(x, y, radius, speed, wanderRadius) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.speed = speed;
        this.wanderRadius = wanderRadius;
        this.wanderAngle = 0;
    }

    drawArrow() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.wanderAngle);

        const arrowLength = 20;
        const arrowWidth = 8;

        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(arrowLength, -arrowWidth / 2);
        ctx.lineTo(arrowLength, arrowWidth / 2);
        ctx.closePath();

        ctx.fillStyle = 'blue';
        ctx.fill();

        ctx.restore();
    }

    update() {
        // Implement wander steering behavior
        const wanderOffset = 20;
        const changeFactor = 0.03; // Adjust the change factor for smoother direction change
        const steeringDistance = 50; // Distance from the boundary to start steering
        const maxSteeringAngle = 0.1; // Maximum steering angle

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

        // Keep the circle within the canvas
        this.x = Math.max(this.radius, Math.min(canvas.width - this.radius, this.x));
        this.y = Math.max(this.radius, Math.min(canvas.height - this.radius, this.y));
    }
}

const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');

const circle = new WanderCircle(200, 200, 20, 2, 50);

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    circle.drawArrow();
}

function animate() {
    circle.update();
    draw();
    requestAnimationFrame(animate);
}

// Initial setup
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

animate();