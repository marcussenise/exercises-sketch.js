const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');
const math = require('canvas-sketch-util/math');
const TweakPane = require('tweakpane');



const settings = {
  dimensions: [ 1080, 1080 ],
  animate: true,
};


const params = {
  elements: 25,
  dist: 200,
}

const sketch = ({ context, width, height }) => {
  const agents = [];
  

  for(let i=0; i<25; i++){
    const x = random.range(0, width);
    const y = random.range(0, height);
    const cor1 = random.range(0, 255).toFixed(0);
    const cor2 = random.range(0, 255).toFixed(0);
    const cor3 = random.range(0, 255).toFixed(0);
    agents.push(new Agent(x, y, cor1, cor2, cor3)) 
  }

  return ({ context, width, height }) => {
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);


    for (let i = 0; i< params.elements; i++){
      const agent = agents[i];
      const dist = params.dist;
      
      for(let j = (i+1); j<agents.length; j++){
        const other = agents[j];
        
        const dist = agent.pos.getDistance(other.pos);
        
        if(dist > params.dist) continue;
        
        context.lineWidth = math.mapRange(dist, 0, 200, 12, 1);
        
        context.beginPath();
        context.moveTo(agent.pos.x, agent.pos.y);
        context.lineTo(other.pos.x, other.pos.y);
        context.strokeStyle = "black";
        context.stroke();
      }
    }
    
    agents.forEach(agent => {
      agent.update();
      agent.draw(context);
      // agent.bounce(width, height);
      agent.wrap(width, height);
    });
    
  };
};

const createPane = () => {
  const pane = new TweakPane.Pane();
  let folder;

  folder = pane.addFolder({title: 'Elements'});

  folder.addInput(params, 'elements',{min: 3, max: 30, step: 1})
  folder.addInput(params, 'dist',{min: 100, max: 500, step: 1})
}

createPane();
canvasSketch(sketch, settings);

class Vector{
  constructor(x, y){
    this.x = x;
    this.y = y;
  }
  
  getDistance(v){
    const dx = this.x - v.x;
    const dy = this.y - v.y;
    return Math.sqrt(dx * dx + dy * dy)
  }
}

class Agent{
  constructor(x, y, cor1, cor2, cor3){
    this.pos = new Vector(x, y);
    this.radius = random.range(0, 20);
    this.cor1 = cor1;
    this.cor2 = cor2;
    this.cor3 = cor3;
    this.vel = new Vector(random.range(-1, 1), random.range(-1, 1));
  }

  bounce(width, height){
    if(this.pos.x <= 0 || this.pos.x >= width) this.vel.x *= -1;
    if(this.pos.y <= 0 || this.pos.y >= height) this.vel.y *= -1;
  }
  
  wrap(width, height){
    if(this.pos.x > width) this.pos.x = 0;
    if(this.pos.x < 0) this.pos.x = width;
    if(this.pos.y > height) this.pos.y = 0;
    if(this.pos.y < 0) this.pos.y = height;
  }
  

  update(){
    this.pos.x += this.vel.x;
    this.pos.y += this.vel.y;
  }

  draw(context){
    context.fillStyle = 'rgb('+ this.cor1 +','+ this.cor2 +','+ this.cor3+')';
    context.save();
    context.translate(this.pos.x, this.pos.y)
    context.beginPath();
    context.arc(0, 0, this.radius, 0, Math.PI*2);
    context.fill();

    context.restore();
  }
}