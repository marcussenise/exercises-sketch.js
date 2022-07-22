const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');


const settings = {
  dimensions: [ 1080, 1080 ],
  animate: true,
};

// const animate = () => {
//   console.log('domestika');
//   requestAnimationFrame(animate);
// }

// animate();

const sketch = ({ context, width, height }) => {
  const agents = [];

  for(let i=0; i<400; i++){
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
    
    // for (let i = 0; i< agents.length; i++){
    //   const agent = agents[i];

    //   for(let j = 0; j<agents.length; j++){
    //     const other = agents[j];

    //     context.beginPath();
    //     context.moveTo(agent.pos.x, agent.pos.y);
    //     context.lineTo(other.pos.x, other.pos.y);
    //     context.stroke();
    //   }
    // }
      
    agents.forEach(agent => {
      agent.update();
      agent.draw(context);
      agent.bounce(width, height);
    });
    
  };
};

canvasSketch(sketch, settings);

class Vector{
  constructor(x, y){
    this.x = x;
    this.y = y;
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