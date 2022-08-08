const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');
const TweakPane = require('tweakpane');

const settings = {
  dimensions: [ 1800, 1140 ],
  //animate: true,
};


let fontFamily = 'serif';
const typeCanvas = document.createElement('canvas');
const typeContext = typeCanvas.getContext('2d');
let image, manager;


const sketch = ({context, width, height}) => {
  const cell = 4;
  const cols = Math.floor(width /cell);
  const rows = Math.floor(height / cell);
  const numCells = cols * rows;
  const PARAMS = {
    glifos: '✈☯'
  };


  const createPane = () => {
    const pane = new TweakPane.Pane();
    pane.addInput(PARAMS, 'glifos').on
    (
      'change', function(e){
        reload();
      }
    )
  }

  createPane();

  const reload = () =>{
    manager.render();
  }

  //180 columns e 114 rows
  typeCanvas.width = cols;
  typeCanvas.height = rows;
  
  return ({ context, width, height }) => {    
    typeContext.drawImage(image, 0, 0, cols, rows);
    
    const imgData = typeContext.getImageData(0, 0, cols, rows).data;
    
    context.fillRect(0,0, width, height);
    context.fillStyle = 'black';
    
    context.textBaseline = 'middle';
    context.textAlign = 'center';
    
    
    //FÓRMULA PRA ENCONTRAR COLUNAS E LINHAS EM UMA GRADE:

    for(let i = 0; i< numCells; i++){
      const col = i % cols;
      const row = Math.floor(i/cols);

   
    //  const x = col * cell;
    //  const y = row * cell;

      const x = col * cell + random.range(-cell, cell) * 0.5;
      const y = row * cell + random.range(-cell, cell) * 0.5;
     
     // Como o RGBA tem 4 canais, i (deve ser o 1° canal) * 4
     const r = imgData[i*4] + 0;
     const g = imgData[i*4] + 1;
     const b = imgData[i*4] + 2;
     const a = imgData[i*4] + 3;
     
     const glyph = getGlyph(r, PARAMS);
      // let glyph = PARAMS.glifos.split(''); 
      // glyph = random.pick(glyph);


     context.font = `${cell}px ${fontFamily}`;
    
      //context.fillStyle = 'blue';
  
     context.save();
     context.translate(x, y);
     context.translate(cell * 0.5, cell * 0.5);
     //context.fillRect(0,0,cell*0.5,cell*0.5);
    //context.font = `40px ${fontFamily}`;
    //  if(Math.random() > 0.5){
       
    // }  
    context.font = `${cell * 2}px ${fontFamily}`;
    if(Math.random() < 0.005) context.font = `${cell * 10}px ${fontFamily}`;
    context.fillStyle = colorGlyph(glyph);
    context.fillText(glyph,0 ,0);
    context.restore();

      
      // context.save();
      // context.translate(x, y);
      // context.translate(cell * 0.5, cell * 0.5);
      // context.fillText(glyph,0, 0);
      // context.fillStyle = colorGlyph(glyph);
      // context.restore();
    }
  }
}

const colorGlyph = (glyph) => {
    switch(glyph){
      case '':
        return 'white';
      case 'l':
        return 'rgb(102, 255, 255)';
      case '♫':
        return 'rgb(255, 204, 153)';
      case'°':
      return 'rgb(192, 192, 192)'
      case '.':
        return 'rgb(0, 102, 102)';
      case '-':
        return 'rgb(0, 51, 0)';
      case '+':
        return 'rgb(204, 204, 0)';
      case '♣':
        return 'rgb(0, 153, 0)';
      case '∑':
        return 'rgb(255, 0, 0)';
        break;
      default:
        return 'darkblue';
      }
}
      


const getGlyph = (v, PARAMS) => {
  /* v is de luminance of the input pixel, ranging from 0 to 1 */  
  let glyph = PARAMS.glifos.split(''); 

  if(v< 50) return random.pick(glyph);
  if(v< 75) return '';
  if(v< 100) return '';
  if(v< 125) return'';
  if (v< 150) return random.pick(glyph);
  if (v< 175) return random.pick(glyph);
  if (v== 255) return random.pick(glyph);
  if (v< 275) return random.pick(glyph);

  // if(v< 50) return '∑';
  // if(v< 75) return '-';
  // if(v< 100) return '.';
  // if(v< 125) return '°';
  // if (v< 150) return '♫';
  // if (v< 175) return '♣';
  // if (v== 255) return '';
  // if (v< 275) return '.';
}

const loadImage = (url) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject();
    img.src = url;
  })
}

const start = async () => {
  // const url = './assets/vangogh.jpg';
  image = await loadImage('./assets/marcus2.jpg');
  manager = await canvasSketch(sketch, settings); 
}

start();
// canvasSketch(sketch, settings);