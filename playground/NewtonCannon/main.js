var canvas = document.getElementById('drawingContainer');
var context = canvas.getContext('2d');
var trailCanvas = document.getElementById('trailCanvas');
var trailCtx = trailCanvas.getContext('2d');
var earthRadius = 6371000;   // meters
var mountainHeight = earthRadius * 0.165;  // chosen to match image
var x = 0, y = earthRadius + mountainHeight;
var newtonG = 6.67e-11,
    earthMass = 5.97e24,
    dt = 5,
    r,
    acceleration = newtonG * earthMass,
    vx = 6000,
    vy = 0;
var pixelX, pixelY;
var metersPerPixel = earthRadius / (0.355 * canvas.width);

//Slider based animation
var speedSlider = document.getElementById('speedSlider');
var speedValue = document.getElementById('speedValue');
// var fireBtn = document.getElementById('fireCannonBtn');
var initFire = false;

function showSpeed() {
    speedValue.innerHTML = speedSlider.value;
    vx = Number(speedSlider.value);
}

function reset() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    trailCtx.clearRect(0, 0, canvas.width, canvas.height);
    x = 0;
    y = earthRadius + mountainHeight;
    vy = 0;
}

function fireCannon() {
    reset();
    initFire = !initFire;
}

function drawProjectile(x, y, radius, color) {
    context.clearRect(0, 0, canvas.width, canvas.height);
    pixelX = canvas.width / 2 + x / metersPerPixel;
    pixelY = canvas.height / 2 - y / metersPerPixel;

    context.beginPath();
    context.arc(pixelX, pixelY, radius, 0, 2 * Math.PI);
    
    context.fillStyle = color;
    context.fill();

    trailCtx.fillStyle = "black";
    trailCtx.fillRect(pixelX - 0.5, pixelY - 0.5, 1, 1);
    context.closePath();
}

function animate() {
    requestAnimationFrame(animate);
    r = Math.sqrt(x * x + y * y);

    if (r > earthRadius && initFire) {
        acceleration = newtonG * earthMass / (r * r);
        var ax = -acceleration * x / r;
        var ay = -acceleration * y / r;
        vx += ax * dt;
        vy += ay * dt;
        var lastX = x;
        x += vx * dt;
        y += vy * dt;
        if (!((lastX < 0) && (x >= 0))) {
            drawProjectile(x, y, 5, "red");
        }
    }

    if(r <= earthRadius) {
        reset();
    }
}
animate();
showSpeed();