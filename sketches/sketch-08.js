const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');

const settings = {
  dimensions: [ 1800, 1140 ],
};

let text = 'A';
let fontSize = 1200;
let fontFamily = 'serif';
const typeCanvas = document.createElement('canvas');
const typeContext = typeCanvas.getContext('2d');
let image, manager;


const sketch = ({context, width, height}) => {
  const cell = 10;
  const cols = Math.floor(width /cell);
  const rows = Math.floor(height / cell);
  const numCells = cols * rows;
  
  //180 columns e 114 rows
  typeCanvas.width = cols;
  typeCanvas.height = rows;
  
  return ({ context, width, height }) => {

    typeContext.fillRect(0, 0, cols, rows);
    //typeContext.fillStyle = 'black';
    
    typeContext.drawImage(image, 0, 0, cols, rows);
    
    const imgData = typeContext.getImageData(0, 0, cols, rows).data;
    
    context.textBaseline = 'middle';
    context.textAlign = 'center';

    //FÓRMULA PRA ENCONTRAR COLUNAS E LINHAS EM UMA GRADE:

    for(let i = 0; i< numCells; i++){
      const col = i % cols;
      const row = Math.floor(i/cols);


      const x = col * cell + random.range(-cell, cell) * 0.5;
      const y = row * cell + random.range(-cell, cell) * 0.5;
     
     // Como o RGBA tem 4 canais, i (deve ser o 1° canal) * 4
     const r = imgData[i*4] + 0;
     const g = imgData[i*4] + 1;
     const b = imgData[i*4] + 2;
     const a = imgData[i*4] + 3;
     
     const glyph = getGlyph(r);

     context.font = `${cell}px ${fontFamily}`;
    
    context.save();
    context.translate(x, y);
    context.translate(cell * 0.5, cell * 0.5);
    context.font = `${cell * 2}px ${fontFamily}`;
    if(Math.random() < 0.1) context.font = `${cell * 3}px ${fontFamily}`;
    context.fillStyle = colorGlyph(glyph);
    context.fillText(glyph,0 ,0);
    context.restore();
    }
  }
}

const colorGlyph = (glyph) => {

    switch(glyph){
      case '':
        return 'red';
      case 'l':
        return 'green';
      case ';':
        return 'yellow';
      case'°':
      return 'yellow'
      case '.':
        return 'yellow';
      case '-':
        return 'yellow';
      case '+':
        return 'yellow';
      case 'l':
        return 'yellow';
      case '✝':
        return 'red';
      }
}
      


const getGlyph = (v) => {
  /* v is de luminance of the input pixel, ranging from 0 to 1 */
  //const glyphs = '_+◼⚫=/'.split('');
  
  if(v< 50) return '✝';
  if(v< 75) return 'l';
  if(v< 100) return '.';
  if(v< 125) return '°';
  if (v< 150) return '.';
  if (v< 175) return '\\';
  if (v== 255) return '';
  if (v< 275) return '.';
  // else return random.pick(glyphs);

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
  image = await loadImage('./assets/bozo.jpg');
  manager = await canvasSketch(sketch, settings); 
}

start();