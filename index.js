// Get the canvas and its context
const canvas = document.getElementById('rainCanvas');
const ctx = canvas.getContext('2d');

// Set canvas size to match the window
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Raindrop properties
const raindrops = [];
const splashes = [];
const raindropCount = 1000;

// Generate random raindrop positions
for (let i = 0; i < raindropCount; i++) {
    const colors = [
        'rgb(113, 117, 120)',
        'rgb(147, 177, 199)',
        'rgb(78, 89, 128)'
    ];
    raindrops.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        length: Math.random() * 15 + 5,
        width: 2, // Set width for rectangular shape
        speed: Math.random() * 5 + 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        trailHeight: Math.random() * 20 + 20
    });
}

// Function to draw a single raindrop with rounded tips and blended trail
function drawRaindrop(raindrop) {
    // Create a gradient for the trail that blends into the raindrop
    const gradient = ctx.createLinearGradient(
        raindrop.x,
        raindrop.y - raindrop.trailHeight,
        raindrop.x,
        raindrop.y + raindrop.length
    );
    gradient.addColorStop(0, 'rgba(173, 216, 230, 0)');
    gradient.addColorStop(0.7, raindrop.color.replace('rgb', 'rgba').replace(')', ', 0.5)'));
    gradient.addColorStop(1, raindrop.color.replace('rgb', 'rgba').replace(')', ', 0.8)'));

    // Draw the trail
    ctx.beginPath();
    ctx.strokeStyle = gradient;
    ctx.lineWidth = raindrop.width;
    ctx.moveTo(raindrop.x, raindrop.y - raindrop.trailHeight);
    ctx.lineTo(raindrop.x, raindrop.y);
    ctx.stroke();

    // Draw the rectangular raindrop with rounded tips
    ctx.beginPath();
    ctx.fillStyle = raindrop.color;
    ctx.moveTo(raindrop.x - raindrop.width / 2, raindrop.y);
    ctx.lineTo(raindrop.x - raindrop.width / 2, raindrop.y + raindrop.length - raindrop.width / 2);
    ctx.quadraticCurveTo(raindrop.x, raindrop.y + raindrop.length, raindrop.x + raindrop.width / 2, raindrop.y + raindrop.length - raindrop.width / 2);
    ctx.lineTo(raindrop.x + raindrop.width / 2, raindrop.y);
    ctx.closePath();
    ctx.fill();
}

// Function to draw a splash with oval rippling effect
function drawSplash(splash) {
    ctx.beginPath();
    ctx.ellipse(splash.x, splash.y, splash.radius * 1.5, splash.radius, 0, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(173, 216, 230, ${splash.opacity})`;
    ctx.lineWidth = 2;
    ctx.stroke();
}

// Function to update raindrop positions
function updateRaindrops() {
    for (let i = 0; i < raindrops.length; i++) {
        const raindrop = raindrops[i];
        raindrop.y += raindrop.speed;

        // Create a splash and reset raindrop if it reaches the splash zone
        const splashZone = canvas.height * (Math.random() * 0.05 + 0.95);
        if (raindrop.y > splashZone) {
            splashes.push({
                x: raindrop.x,
                y: splashZone,
                radius: 0,
                maxRadius: Math.random() * 5 + 5,
                opacity: 1,
                fadeSpeed: Math.random() * 0.01 + 0.005,
                growthSpeed: Math.random() * 0.05 + 0.02
            });
            raindrop.y = -raindrop.length;
            raindrop.x = Math.random() * canvas.width;
        }
    }
}

// Function to update splashes with rippling effect
function updateSplashes() {
    for (let i = splashes.length - 1; i >= 0; i--) {
        const splash = splashes[i];
        splash.radius += splash.growthSpeed;
        splash.opacity -= splash.fadeSpeed;

        // Remove the splash if it becomes fully transparent or exceeds its max radius
        if (splash.opacity <= 0 || splash.radius > splash.maxRadius) {
            splashes.splice(i, 1);
        }
    }
}

// Animation loop
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas

    // Draw and update all raindrops
    for (let i = 0; i < raindrops.length; i++) {
        drawRaindrop(raindrops[i]);
    }
    updateRaindrops();

    // Draw and update all splashes
    for (let i = 0; i < splashes.length; i++) {
        drawSplash(splashes[i]);
    }
    updateSplashes();

    requestAnimationFrame(animate); // Loop the animation
}

// Start the animation
animate();

// Handle window resize
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});
