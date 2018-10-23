var Util = {
    randomFromRange: function (min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    },

    randomColor: function() {
        var colorArr = ['#201E50', '#525B76', '#CC2936', '#E9D758', '#39466B', '#993E5B', '#1B3022'];
        return colorArr[this.randomFromRange(0, colorArr.length)];
    },

    calculateDistance: function (x1, y1, x2, y2) {
        var xDist = (x2 - x1);
        var yDist = (y2 - y1);

        return Math.sqrt(Math.pow(xDist, 2) + Math.pow(yDist, 2));
    }
}
var canvas = document.getElementById('drawCanvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var context = canvas.getContext('2d');
var particles=[], particleCount = 50, particleVelocity = 0.05, distanceFromCenter=[], mouse = {x: 0, y: 0}, variance = 10;

window.addEventListener('mousemove', function(event) {
    mouse.x = event.clientX;
    mouse.y = event.clientY;
});


var particle = function (x, y, radius, color) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.radians = Math.random() * Math.PI * 2;
    this.distanceFromCenter = Util.randomFromRange(50, 120);
    this.mousePreviousPosition = {x: x, y: y};
    this.update = function() {
        var lastPoint = {x: this.x, y: this.y};
        this.radians += particleVelocity;
        
        //For the drag effect
        this.mousePreviousPosition.x += (mouse.x - this.mousePreviousPosition.x) * 0.05;
        this.mousePreviousPosition.y += (mouse.y - this.mousePreviousPosition.y) * 0.05;
        this.x = this.mousePreviousPosition.x + Math.cos(this.radians) * this.distanceFromCenter;
        this.y = this.mousePreviousPosition.y + Math.sin(this.radians) * this.distanceFromCenter;

        this.draw(lastPoint);
    }

    this.draw = function(lastPoint) {
        context.beginPath();
        context.strokeStyle = this.color;
        context.lineWidth = this.radius;
        context.moveTo(lastPoint.x, lastPoint.y);
        context.lineTo(this.x, this.y);
        context.stroke();
        context.closePath();
    }
}

function init() {
    for (var i = 0; i < particleCount; i++) {
        particles.push(new particle(canvas.width/2, canvas.height/2, Util.randomFromRange(1, 5), Util.randomColor()));
    }
}

function animate() {
    requestAnimationFrame(animate);6
    // context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = 'rgba(255, 255, 255, 0.05)';
    context.fillRect(0, 0, canvas.width, canvas.height);
    
    for(var i=0; i < particles.length; i++) {
        var particle = particles[i];
        // var props = particle.properties();
        // props.radians += particleVelocity;
        // props.lastPoint = {x: props.x, y: props.y};
        // props.x = mouse.x + Math.cos(props.radians) * distanceFromCenter[i].x;
        // props.y = mouse.y + Math.sin(props.radians) * distanceFromCenter[i].y;
        particle.update();
    }
}

init();
animate();