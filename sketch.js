
// 4th of July 2022
// United Stated of America
//concept and programming by Marlon Barrios Solano

let group = [];  // our particle system 
  
let settings = {
  damping: 0.97,
  bg_alpha: 19, // background
  stroke_alpha: 30, // foreground
  gravity: 0.07,
  lifespan: 450,
}
  
let gui; 

// Create a new canvas to match the browser size
function setup() {
  createCanvas(windowWidth, windowHeight);
  rectMode(CENTER); 

  background(250, settings.bg_alpha);
}

// On window resize, update the canvas size
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  background(255);
}

function createAgent(x=0, y=0, vx=0, vy=0) {
  let temp = {
    position: new p5.Vector(x, y),
    velocity: new p5.Vector(vx, vy),
    acceleration: new p5.Vector(),
    lifespan: settings.lifespan,
  }
  return temp; 
}

// Main render loop 
function draw() {
  // Fill in the background
  background(255, settings.bg_alpha);
 fill( 117 , 0 , 0, settings.stroke_alpha);
 let newGuy = createAgent(width/2, 150, 
  random(-1, 1), random(-1, 1)); 
group.push(newGuy);
  // stroke(random(255), 0 , 0, settings.stroke_alpha);
  
  let gravity = new p5.Vector(0, settings.gravity);
  
  // create new agents over time 
  if (mouseIsPressed) { 
  let newGuy = createAgent(mouseX, mouseY, 
                            random(-1, 1), random(-1, 1)); 
    group.push(newGuy);
  }
  
  // iterate of the group array and update/render all the agents
  for (let agent of group) {  
    move(agent); // do this first
    twitch(agent);
    applyForce(agent, gravity);
    render(agent);
  }
  
  // draw lines connecting the agents 
  stroke( 117,0 , 0, settings.stroke_alpha);
  for (let i=0; i < group.length; i++) {
     for (let j=i; j < group.length; j++) {
       if (i != j) {
          let x1 = group[i].position.x;
          let y1 = group[i].position.y; 
          let x2 = group[j].position.x; 
          let y2 = group[j].position.y; 
          let d = dist(x1, y1, x2, y2);
          if (d > 25 && d < 50) {
            line(x1, y1, x2, y2);
          }
       }
       
     } 
  }
  
  // get rid of dead weight
  cleanUp(group);
   
  // display the number of active agents
  fill(1,87, 174); 
  
  textSize(20);
  textureMode(CENTER);
  text('4th of July 2022', width/2 + 30, 185);
  text('United States of America', width/2 + 30 , 160);

  textSize(15);

}

function render(agent) { 
  push();
  translate(agent.position.x, agent.position.y);
  rotate(agent.velocity.heading());
  //let alpha = map(agent.lifespan, 0, 300, 0, 255);
  stroke( 117,0 , 0, settings.stroke_alpha);
  ellipse(0, 0, 10, 5);  // square
  pop();
}

function move(agent) { 
  agent.velocity.add(agent.acceleration);
  agent.velocity.mult(settings.damping);
  agent.position.add(agent.velocity); 
  agent.acceleration.mult(0); // zero the acceleration 
  agent.lifespan--;
}

function applyForce(agent, force) {
  agent.acceleration.add(force);
}

function twitch(agent) {  
  agent.velocity.rotate(random(-0.02, 0.02));
}

function cleanUp(group) { 
  for (let i=group.length-1; i >= 0; i--) {
    let agent = group[i];
    // || --> OR 
    if (isAgentInsideBox(agent, -50, -50, width+100, height+100) == false
        || agent.lifespan <= 0) { 
      // get rid of this agent 
      group.splice(i, 1); // remove 1 object starting at index i
    }
  }
}

function isAgentInsideBox(agent, x, y, w, h) {
  let ax = agent.position.x; 
  let ay = agent.position.y;
  // && --> AND 
  if (ax > x && ax < x+w && ay > y && ay < y+h) return true;
  else return false;
}