var Util = {
    randomFromRange: function (min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    },
    calculateDistance: function (x1, y1, x2, y2) {
        var xDist = (x2 - x1);
        var yDist = (y2 - y1);

        return Math.sqrt(Math.pow(xDist, 2) + Math.pow(yDist, 2));
    }
}

var canvasElement = document.getElementById('drawContainer');
var backgroundCanvas = document.getElementById('background');
canvasElement.width = window.innerWidth;
canvasElement.height = window.innerHeight;
backgroundCanvas.width = window.innerWidth;
backgroundCanvas.height = window.innerHeight;

var context = canvasElement.getContext('2d');
var backgroundContext = backgroundCanvas.getContext('2d');
var iceArr = [], iceShatteredParticles = [], shatteredPieces = 8, numIce = 4, g = 1, friction = 0.8, velocity = 1;
var backgroundStars = [];
var ticker = 0;
var randomSpawnRate = 75;
var floorHeight = 60;

function Ice(x, y, radius, color) {
    this.x = x, this.y = y, this.radius = radius, this.color = color;
    this.directionX = (Math.random() - 0.5) * 8;
    this.g = 1;
}

Ice.prototype.draw = function (ctx) {
    if (!ctx) {
        ctx = context;
    }
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    context.shadowColor = '#E3EAEF';
    context.shadowBlur = 20;
    ctx.fill();
    ctx.closePath();
}

Ice.prototype.update = function () {
    this.draw();

    var position = this.y + this.radius + this.g;
    if (position >= canvasElement.height - floorHeight) {
        this.g = -this.g * friction;
        //We need to break the particle the moment it hits the ground
        this.shatter();
    } else {
        this.g += velocity;
    }

    if(this.x + this.radius + this.directionX > canvasElement.width || this.x - this.radius <= 0) {
        this.directionX = -this.directionX * friction;
        this.shatter();
    }

    this.x += this.directionX;
    this.y += this.g;
}

Ice.prototype.shatter = function () {
    this.radius -= 3;
    for (i = 0; i < shatteredPieces; i++) {
        iceShatteredParticles.push(new particle(this.x, this.y, 2, 'rgba(227, 234, 239, 1)'));
    }
}

function particle(x, y, radius, color) {
    Ice.call(this, x, y, radius, color);
    this.g = 0.4;
    this.scatter = { x: Util.randomFromRange(-5, 5), y: Util.randomFromRange(-15, 15) };
    this.ttl = 100;
    this.alpha = 1;
}

particle.prototype.draw = function () {
    context.beginPath();
    context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    context.fillStyle = this.color;
    context.fill();
    context.closePath();
}

particle.prototype.update = function () {
    this.draw();
    var position = this.y + this.radius + this.g;
    if (position >= canvasElement.height - floorHeight) {
        this.scatter.y = -this.scatter.y * friction;
    } else {
        this.scatter.y += this.g;
    }
    this.x += this.scatter.x;
    this.y += this.scatter.y;
    this.ttl--;
    this.alpha -= 1 / this.ttl;
    this.color = this.color.substr(0, this.color.lastIndexOf(',')) + ", " + this.alpha.toFixed(2) + ")'"
}

function createMountainRange(mountainCount, height, color) {
    for (var i = 0; i < mountainCount; i++) {
        var mountainWidth = backgroundCanvas.width / mountainCount;
        backgroundContext.beginPath();
        backgroundContext.moveTo(i * mountainWidth, backgroundCanvas.height);
        backgroundContext.lineTo(i * mountainWidth + mountainWidth, backgroundCanvas.height);
        backgroundContext.lineTo(i * mountainWidth + mountainWidth / 2, backgroundCanvas.height - height);
        backgroundContext.lineTo(i * mountainWidth, backgroundCanvas.height);
        backgroundContext.fillStyle = color;
        backgroundContext.shadowColor = '#333333';
        backgroundContext.shadowBlur = 20;
        backgroundContext.fill();
        backgroundContext.closePath();
    }
}

function createFloor() {
    backgroundContext.fillStyle = '#182028';
    backgroundContext.fillRect(0, backgroundCanvas.height - floorHeight, backgroundCanvas.width, floorHeight);
}

function init() {
    for (var j = 0; j < 150; j++) {
        var x = Math.random() * backgroundCanvas.width;
        var y = Math.random() * backgroundCanvas.height;
        var radius = Math.random() * 5;
        var stars = new Ice(x, y, radius, 'white');
        stars.draw(backgroundContext);
    }

    createMountainRange(1, 900, '#384551');
    createMountainRange(2, 600, '#B7CACC');
    createMountainRange(3, 300, '#92A2A3');
    createFloor();
}

function animate(timer) {
    requestAnimationFrame(animate);
    context.clearRect(0, 0, canvasElement.width, canvasElement.height);

    iceArr.forEach(function (iceParticle, index) {
        iceParticle.update();
        if (iceParticle.radius <= 0) {
            iceArr.splice(index, 1);
        }
    });


    iceShatteredParticles.forEach(function (shatteredParticle, index) {
        shatteredParticle.update();
        if (shatteredParticle.ttl <= 0) {
            iceShatteredParticles.splice(index, 1);
        }
    });

    ticker++;

    if(ticker % randomSpawnRate == 0) {
        var particleSize = 18;
        const x = Math.max(particleSize, Math.random() * (canvasElement.width - particleSize));
        iceArr.push(new Ice(x, -100, particleSize, '#E3EAEF'));
        randomSpawnRate = Util.randomFromRange(75, 200);
    }
}

init();
animate();