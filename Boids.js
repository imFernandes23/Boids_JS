let boidsVec = []
let numBoids = 100

function initBoids(boids){
    let  newArray = []
    for(let i = 0; i < boids; i++){
        newArray = createBoids(newArray,null)
    }
    return newArray
}

window.addEventListener('load', () => {
    boidsVec = initBoids(numBoids)
    const  env = document.getElementById('enviroment');
    for(let i = 0; i < numBoids; i ++){
        const boid  = document.createElement('div');
        boid.classList.add('boid')
        boid.style.left = boidsVec[i].posi[0] + 'px';
        boid.style.top = boidsVec[i].posi[1] + 'px';
        const dir = document.createElement('div')
        dir.classList.add('boid-dir')
        dir.style.transform = 'rotate(' + boidsVec[i].direction + 'deg)'
        env.appendChild(boid)
        boid.appendChild(dir)
    }
})

function createBoids (Array, Posis) {
    let newArray = [],
        Posi = [],
        velocity = [
            Math.random() * 2 - 1,
            Math.random() * 2 - 1
        ],
        direction = getDirection(velocity)


    if(Posis === null){
        Posi = [
            Math.round(Math.random() * window.innerWidth),
            Math.round(Math.random() * window.innerHeight)
        ]
    }else{
        Posi = Posis
    }
    
    return newArray = [...Array, {
        posi: Posi,
        velocity: velocity,
        history: [],
        direction : direction,
    }]
}

function getDirection(velocity){
    const ang_rad = Math.atan2(velocity[1],velocity[0]);
    let ang_deg = ang_rad * 180 / Math.PI;


    return Math.round(ang_deg);
}

