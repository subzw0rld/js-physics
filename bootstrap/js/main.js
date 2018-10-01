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
canvasElement.setAttribute('width', innerWidth);
canvasElement.setAttribute('height', innerHeight);
var context = canvasElement.getContext('2d');

function DrawingObject() {
}

DrawingObject.prototype.drawCircle = function (x, y, radius, color) {
    context.beginPath();
    context.arc(x, y, radius, 0, Math.PI * 2);
    context.fillStyle = this.color;
    context.fill();
    context.closePath();

}

function init() {
    
}

function animate() {
    requestAnimationFrame(animate);
}

init();
animate();