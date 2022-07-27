const canvasSketch = require('canvas-sketch');
const random = require ('canvas-sketch-util/random');
const math = require ('canvas-sketch-util/math');
const TweakPane = require('tweakpane');

const settings = {
  dimensions: [ 1080, 1080 ],
  animation: true,
};

const params = {
  cols: 10,
  rows: 10,
  scaleMin: 1,
  scaleMax: 30,
  freq: 0.001,
  amp: 0.2,
  frame: 0,
  animate: true,
  lineCap: 'butt',
  color: '#000',
}

const sketch = () => {
  return ({ context, width, height, frame }) => {
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);

    const cols = params.cols;
    const rows = params.rows;
    const totalCells = cols * rows;

    const gridw = 0.8 * width;
    const gridh = 0.8 * height;
    const cellh = gridh / rows;
    const cellw = gridw / cols;
    const gapX = (width - gridw) * 0.5;
    const gapY = (height - gridh) * 0.5;
    
    for(let i = 0; i < totalCells; i++){
      const col = i % cols;
      const row = Math.floor(i / cols);

      const x = col * cellw;
      const y = row * cellh;
      const w = cellw * 0.8;
      const h = cellh * 0.8;

      const f = params.animate ? frame : params.frame;

      //const n = random.noise2D(x + frame * 10, y, params.freq);
      const n = random.noise3D(x, y, f * 10, params.freq);
      

      const angle = n * Math.PI * params.amp;
      // const scale = (n+1) / 2 * 30;
      // const scale = (n * 0.5 + 0.5) * 30;
      const scale = math.mapRange(n, -1, 1, params.scaleMin, params.scaleMax);


      context.save();
      context.translate(x,y);
      context.translate(gapX,gapY);
      context.translate(cellw * 0.5, cellh * 0.5);
      context.rotate(angle);

      context.lineWidth = scale;
      context.lineCap = params.lineCap;

      context.beginPath();
      context.moveTo(w * -0.5, 0);
      context.lineTo(w * 0.5, 0);
      context.strokeStyle = params.color;
      context.stroke()


      context.restore();
    }
  };
};

const createPane = () => {
  const pane = new TweakPane.Pane();
  let folder;
  
  
  folder = pane.addFolder({title: 'Grid'});
  folder.addInput(params, 'lineCap', {
    options: {
      butt: 'butt',
      round: 'round',
      square: 'square',
    }
  })
  folder.addInput(params, 'cols', {min: 2, max: 50, step: 1})
  folder.addInput(params, 'rows', {min: 2, max: 50, step: 1})
  folder.addInput(params, 'scaleMin', {min: 1, max: 100})
  folder.addInput(params, 'scaleMax', {min: 1, max: 100})
  folder.addInput(params, 'color')
  
  folder = pane.addFolder({title: 'Noise'});
  folder.addInput(params, 'freq', {min: 0.001, max: 0.01});
  folder.addInput(params, 'amp', {min: 0, max: 1});
  folder.addInput(params, 'animate');
  folder.addInput(params, 'frame', {min: 0, max: 999});

}

createPane();
canvasSketch(sketch, settings);
