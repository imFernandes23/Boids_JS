

export function InitBoids (N) {
    let ArrayBoids = []

    for(let i = 0; i < N; i++){
        ArrayBoids.push({
            posi: [
                Math.round(Math.random() * window.innerWidth),
                Math.round(Math.random() * window.innerHeight)
            ],
            velocity: [ getRandomDir(), getRandomDir()],
            direction: 0,
        })
    }

    return ArrayBoids
}

function getRandomDir(){
    return Math.random() * 2 - 1
}



export function UpdateFrame (Array, Start, Separation, Aligment, Cohesion) {
    if(Start === true){

    let newArray = []

    Array.forEach((item, index) => {
        let getEnviroment = getNewPosition(item.posi,item.velocity)
        let position = [getEnviroment[0], getEnviroment[1]];
        let velocity = [getEnviroment[2], getEnviroment[3]];
        let direction = getDirection(item.velocity)
        let errorForce = 1000 * Math.random()
        let errorForce2 = 1000 * Math.random()


        if(Separation === true){
            let sepVeloc = separation(Array, item);
            velocity[0] += sepVeloc[0];
            velocity[1] += sepVeloc[1];
        }

        if(Aligment === true && errorForce > 500){
            let aligVeloc = aligment(Array, item)
            velocity[0] += aligVeloc[0];
            velocity[1] += aligVeloc[1];
        }

        if(Cohesion === true && errorForce2 > 500){
            let cohVeloc = cohesion(Array, item)
            velocity[0] += cohVeloc[0];
            velocity[1] += cohVeloc[1];
        }

        velocity = velocityControl(2.5, velocity)
        newArray.push({ 
            posi: position,
            velocity: velocity,
            direction: direction
        })
        
    })


    
    return newArray
    }else{
        return Array;
    }
    

}

function velocityControl(val, veloc){
    let velocity = veloc
    if(veloc[0] > val){
        veloc[0] = 1 ;
    }else if(veloc[0] < (-1 * val)){
        veloc[0] = (-1 )
    }
    if(veloc[1] > val){
        veloc[1] = 1  ;
    }else if(veloc[1] < (-1 * val)){
        veloc[1] = (-1)
    }

    return velocity;
}


function getNewPosition(posi, velo){
    let x = 0
    let y = 0
    let vx = velo[0]
    let vy = velo[1]

    if(posi[0] > window.innerWidth+20){
       x = -20
 
    }else if(posi[0] < -20){
        x = window.innerWidth+20

    }else{
        x = posi[0] + velo[0]
    }

    if(posi[1] > window.innerHeight+20){
        y = -20

    }else if(posi[1] < -20){
        y = window.innerHeight+20

    }else{
        y = posi[1] + velo[1]
    }

    return [x,y, vx, vy]
}

function getDirection(velo){
    const ang_rad = Math.atan2(velo[1],velo[0]);
    let ang_deg = ang_rad * 180 / Math.PI;


    return Math.round(ang_deg);
}

function separation(ArrayBoids, Boid){
    let sumX = 0; // soma das diferenças em x
    let sumY = 0; // soma das diferenças em y
    let count = 0; // boids vizinhos
    let vx = 0;
    let vy = 0;

    ArrayBoids.forEach((item) => {
        let d = dist(Boid.posi[0],Boid.posi[1],item.posi[0],item.posi[1]);

        if(d !== 0 && d < 50){
            let dx = Boid.posi[0] - item.posi[0];
            let dy = Boid.posi[1] - item.posi[1];
            let dsq = dx*dx + dy*dy;

            if(dsq > 0){
                sumX += dx / dsq;
                sumY += dy / dsq;
                count++;
            }
        }
    })

    if(count > 0){
        let angle = Math.atan2(sumY,sumX); //angulo em radianos que evita colisáo
        vx = Math.cos(angle) * 0.1; //velocidade em X para evitar colisão
        vy = Math.sin(angle) * 0.1; //velocidade em Y que evita colisão
    }

    return [vx,vy]
}

function dist(x1,y1,x2,y2){
    let dx = x1 - x2;
    let dy = y1 - y2;
    return Math.sqrt(dx*dx + dy*dy)
}

function aligment(ArrayBoids, Boid){
    let sumX = 0; //soma das velocidades em X
    let sumY = 0; //soma das velocidades em y
    let count = 0; //boids nas proximidades
    let VelocidadeX = 0; //velocidade nescessária para gerar alinhamento em X
    let VelocidadeY = 0; //velocidade nescessária para gerar alinhamento em Y


    ArrayBoids.forEach((item) => { 
        let d = dist(Boid.posi[0],Boid.posi[1],item.posi[0],item.posi[1]);
        if(d !== 0 && d < 80){ //se o boid for um vizinho em um raio de 60 pixels e não for ele mesmo
            sumX += item.velocity[0];
            sumY += item.velocity[1];
            count++
        }
    })

    if(count > 0){
        let avgX = sumX / count;
        let avgY = sumY / count;
        let angle = Math.atan2(avgY,avgX) ;
        VelocidadeX = Math.cos(angle) * 0.1;
        VelocidadeY = Math.sin(angle) * 0.1;
    }

    return [VelocidadeX, VelocidadeY]
}

function cohesion(ArrayBoids, Boid){
    let sumX = 0; // soma das posiçoes em X
    let sumY = 0; //soma das posiçoes em Y
    let count = 0; // soma dos boida na área
    let accCohX = 0;
    let accCohY = 0;

    ArrayBoids.forEach((item) => {
        let d = dist(Boid.posi[0],Boid.posi[1],item.posi[0],item.posi[1]);
        if( d < 150){
            sumX += item.posi[0];
            sumY += item.posi[1];
            count++;
        }
    })

    if(count > 0){
        let centerX = sumX / count; //centro de massa em X
        let centerY = sumY / count; //centro de massa em Y

        let dx = centerX - Boid.posi[0] ;
        let dy = centerY - Boid.posi[1] ;

        let angle = Math.atan2(dy,dx) 
        accCohX = Math.cos(angle) * 0.1;
        accCohY = Math.sin(angle) * 0.1;

    }

    return [accCohX,accCohY]
}
