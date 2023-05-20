const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
const Boids = [];
const abruptCurveForce = 0.7;
const margin = 30;
const numBoids = 100;
const drawTrail = true;
const tailRange = 100

//Resizable Canvas

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

window.addEventListener('resize', resizeCanvas);

resizeCanvas();

//Definido a classe boids
class Boid{
    constructor(x, y){
        this.x = x;
        this.y = y;
        this.vx = Math.random() * 2 - 1;
        this.vy = Math.random() * 2 - 1;
        this.history = [];
    }

    update() {
        this.addTrace()
        this.moveAndColide()
    }

    moveAndColide(){
        if(this.x < margin){
            this.vx *= -1.1;
        }
        if(this.x > canvas.width - margin){
            this.vx *= -1.1;
        }
        this.x += this.vx;

        if(this.y < margin){
            this.vy *= -1.;
        }
        if(this.y > canvas.height - margin){
            this.vy *= -1.1;
        }
        this.y += this.vy;
    }

    draw(canvas){
        canvas.translate(this.x, this.y);
        canvas.rotate(Math.atan2(this.vy, this.vx));
        canvas.translate(-this.x, -this.y);
        canvas.fillStyle = '#56A0D4';
        canvas.beginPath();
        canvas.moveTo(this.x, this.y);
        canvas.lineTo(this.x - 15, this.y + 5);
        canvas.lineTo(this.x - 15, this.y - 5);
        canvas.lineTo(this.x, this.y);
        canvas.fill();
        canvas.setTransform(1,0,0,1,0,0);

        if(drawTrail){
            canvas.strokeStyle = '#56A0D4';
            canvas.beginPath();
            canvas.moveTo(this.history[0][0], this.history[0][1]);
            for (const point of this.history){
                canvas.lineTo(point[0],point[1])
            }
            canvas.stroke();
        }
    }

    addTrace(){
        
        if(this.history.length < tailRange){
            let newArray = this.history.slice(-(tailRange - 2))
            newArray.push([this.x,this.y])
            this.history = newArray
        }
    }
}

//Funções auxiliares

function getRandomNUmber(min, max){
    return Math.random() * (max - min) + min;
}

//Adicionar boids ao array

for(let i = 0; i < numBoids; i++){
    const x = getRandomNUmber(margin, canvas.width - margin);
    const y = getRandomNUmber(margin, canvas.height - margin);
    Boids.push(new Boid(x, y));
}

//Adcionar boids no canvas

function animate(){
    context.clearRect(0, 0, canvas.width, canvas.height);

    for(let boid of Boids){
        boid.update();
        boid.draw(context);
    }
    console.log(Boids)

    requestAnimationFrame(animate)
}

animate()