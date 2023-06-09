const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');

const separationSlider = document.getElementById('separation')
const alignmentSlider = document.getElementById('alignment')
const cohesionSlider = document.getElementById('cohesion')
const rangeSlider = document.getElementById('visionRange')

let rangeVision = parseFloat(rangeSlider.value);
let separationForce = parseFloat(separationSlider.value);
let aligmentForce = parseFloat(alignmentSlider.value);
let cohesionForce = parseFloat(cohesionSlider.value)
let circleRadius = 25

const Boids = [];
const Obstacles = [];
const margin = 150;
const numBoids = 250;
const drawTrail = true;
const tailRange = 50
const maxSpeed = 5;
const force = 0.2;

//Menu settings

separationSlider.addEventListener('input', function(){
    separationForce = parseFloat(separationSlider.value);
    document.getElementById('sep').innerHTML = 'Separation: ' + separationSlider.value
})

alignmentSlider.addEventListener('input', function(){
    aligmentForce = parseFloat(alignmentSlider.value);
    document.getElementById('ali').innerHTML = 'Aliginment: ' + alignmentSlider.value
})

cohesionSlider.addEventListener('input', function(){
    cohesionForce = parseFloat(cohesionSlider.value);
    document.getElementById('coh').innerHTML = 'Cohesion: ' + cohesionSlider.value
})

rangeSlider.addEventListener('input', function(){
    rangeVision = parseFloat(rangeSlider.value);
    document.getElementById('vRan').innerHTML = 'Vision Range: ' + rangeSlider.value
})

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
        this.rgb = [Math.random() * 255, Math.random() * 255, Math.random() * 255]
        this.adaptive = [Math.random() * numBoids]
    }

    update(Array, Obstacles) {
        this.avoidObstacles(Obstacles)
        this.addTrace()
        this.separation(Array)
        this.alignment(Array)
        this.cohesion(Array)
        this.speedControl()
        this.moveAndColide()
        this.recolor(Array)
    }

    moveAndColide(){

        if(this.x < margin){
            this.vx += force;
        }
        if(this.x > canvas.width - margin){
            this.vx -= force;
        }
        this.x += this.vx;

        if(this.y < margin){
            this.vy += force;
        }
        if(this.y > canvas.height - margin){
            this.vy -= force;
        }
        this.y += this.vy;
    }

    speedControl(){
        const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
        if(speed >= maxSpeed){
            this.vx = (this.vx / speed) * maxSpeed;
            this.vy = (this.vy / speed) * maxSpeed;
        }
    }

    avoidObstacles(Obstacles){
        let sumX = 0,
            sumY = 0,
            count = 0;

        for(const circle of Obstacles){
            const dx = this.x - circle.x;
            const dy = this.y - circle.y;
            const d = Math.sqrt(dx*dx + dy*dy)

            if( d < rangeVision + circle.radius ){
                sumX += dx / d;
                sumY += dy / d;
                count++;
            }
        }

        if(count > 0){
            let angle = Math.atan2(sumY, sumX);
            this.vx += Math.cos(angle) * 0.4;
            this.vy += Math.sin(angle) * 0.4;
        }
    }

    separation(Boids){
        let sumX = 0, 
            sumY = 0, 
            count = 0;

        for(const boid of Boids){
            let d = getDistance(this.x, this.y, boid.x, boid.y);
            if(d !== 0 && d < rangeVision){
                let dx = this.x - boid.x;
                let dy = this.y - boid.y;
                let dsq = dx*dx + dy*dy;

                if(dsq > 0){
                    sumX += dx / dsq;
                    sumY += dy / dsq;
                    count++;
                }
            }
        }

        if(count > 0){
            let angle = Math.atan2(sumY, sumX);
            this.vx += Math.cos(angle) * separationForce;
            this.vy += Math.sin(angle) * separationForce;
        }
    }

    alignment(Boids){
        let sumX = 0, 
            sumY = 0, 
            count = 0;

        for(const boid of Boids){
            let d = getDistance(this.x, this.y, boid.x, boid.y);
            if(d !== 0 && d < rangeVision){
                sumX += boid.vx;
                sumY += boid.vy;
                count++;
            }
        }

        if(count > 0){
            let avgX = sumX / count;
            let avgY = sumY / count;
            let angle = Math.atan2(avgY, avgX);
            this.vx += Math.cos(angle) * aligmentForce;
            this.vy += Math.sin(angle) * aligmentForce;
        }
    }

    cohesion(Boids){
        let sumX = 0, 
        sumY = 0, 
        count = 0;

        for(const boid of Boids){
            let d = getDistance(this.x, this.y, boid.x, boid.y);
            if(d !== 0 && d < rangeVision){
                sumX += boid.x;
                sumY += boid.y;
                count++;
            }
        }

        //centro de massa

        if(count > 0 ){
            let centerX = sumX / count;
            let centerY = sumY / count;

            let dx = centerX - this.x;
            let dy = centerY - this.y;

            let angle = Math.atan2(dy,dx);
            this.vx += Math.cos(angle) * cohesionForce;
            this.vy += Math.sin(angle) * cohesionForce;
        }
    }

    recolor(Boids){
        let r = 0, 
            g = 0, 
            b = 0, 
            count = 0;

        for(const boid of Boids){
            let d = getDistance(this.x, this.y, boid.x, boid.y);
            if(d !== 0 && d < rangeVision/2){
                r += boid.rgb[0];
                g += boid.rgb[1];
                b += boid.rgb[2];
                count++;
            }
        }

        if(count > 0 && this.adaptive > 3){
            let rgb = [
                r / count,
                g / count,
                b / count
            ]

            this.rgb = rgb;
        }
    }

    draw(canvas){
        canvas.translate(this.x, this.y);
        canvas.rotate(Math.atan2(this.vy, this.vx));
        canvas.translate(-this.x, -this.y);
        canvas.fillStyle = 'rgb('+this.rgb[0]+','+this.rgb[1]+','+this.rgb[2]+')'
        canvas.beginPath();
        canvas.moveTo(this.x, this.y);
        canvas.lineTo(this.x - 15, this.y + 5);
        canvas.lineTo(this.x - 15, this.y - 5);
        canvas.lineTo(this.x, this.y);
        canvas.fill();
        canvas.setTransform(1,0,0,1,0,0);

        if(drawTrail){
            canvas.strokeStyle = 'rgb('+this.rgb[0]+','+this.rgb[1]+','+this.rgb[2]+')';
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

//Função para adcionar obtaculos na tela

class Obstacle{
    constructor(x, y, r){
        this.x = x;
        this.y = y;
        this.radius = r;
    }

    draw(canvas){
        canvas.beginPath();
        canvas.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        canvas.fillStyle = 'grey';
        canvas.fill();
        canvas.closePath();
    }
}


//Funções auxiliares

function getRandomNUmber(min, max){
    return Math.random() * (max - min) + min;
}

function getDistance(x1,y1,x2,y2){
    let dx = x1 - x2;
    let dy = y1 - y2;
    return Math.sqrt(dx*dx + dy*dy)
}

//Adicionar boids ao array

for(let i = 0; i < numBoids; i++){
    const x = getRandomNUmber(0, canvas.width );
    const y = getRandomNUmber(0, canvas.height );
    Boids.push(new Boid(x, y));
}

//Adcionar obstaculos no canvas

function canvasClick(event){
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    Obstacles.push(new Obstacle(x, y, circleRadius))
}

canvas.addEventListener('click', canvasClick)
//Adcionar boids no canvas

function animate(){
    context.clearRect(0, 0, canvas.width, canvas.height);

    for(let boid of Boids){
        boid.update(Boids, Obstacles);
        boid.draw(context);
    }

    for(let obs of Obstacles){
        obs.draw(context)
    }


    requestAnimationFrame(animate)

}

requestAnimationFrame(animate)