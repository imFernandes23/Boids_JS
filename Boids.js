
//Definido a classe boids
class Boid{
    constructor(x, y){
        this.x = x;
        this.y = y;
        this.vx = Math.random() * 2 - 1;
        this.vy = Math.random() * 2 - 1;
        this.dir = getDirection(this.vx, this.vy);
        this.history = [];
    }
}

function getDirection(vx, vy){
    const  ang_deg = Math.atan2(vx,vy);
    let ang_deg = ang_rad * 180 / Math.PI;
    return Math.round(ang_deg);
}

//Resizable Canvas
const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

window.addEventListener('resize', resizeCanvas);

resizeCanvas();