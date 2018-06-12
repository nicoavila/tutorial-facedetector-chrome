var preview = document.querySelector('.imagen_container');
var context = preview.getContext('2d');

// Maneja el archivo seleccionado
function manejaArchivo(files) {  
  for (file of files) {
    if (file.type.match(/image\/*/)) {
      let reader = new FileReader();
      reader.onload = function(e) {
        let image = new Image();
        image.onload = function() {
          context.drawImage(image,0,0);
          detectaRostros(image);
        }
        image.src = e.target.result;
      }
      reader.readAsDataURL(file);
    } 
  }
}

// Detecta rostros y los landmarks en él
function detectaRostros(image) {
  let faceDetector = new FaceDetector({fastMode: false});
  faceDetector.detect(image).then(function(rostros) {
    rostros.forEach(function(rostro){
      dibujaCaracteristicas(rostro);
    });
  });
}

// Dibuja las caracteristicas en el canvas
function dibujaCaracteristicas(caracteristicas) {
  context.fillStyle = 'cyan';
  context.strokeStyle = 'cyan';
  context.rect(caracteristicas.boundingBox.x, caracteristicas.boundingBox.y, caracteristicas.boundingBox.width, caracteristicas.boundingBox.height);
  context.fillText('rostro', caracteristicas.boundingBox.x, caracteristicas.boundingBox.y - 5);
  context.stroke();
  caracteristicas.landmarks.forEach(function(caracteristica){
    let tipo = '';
    switch(caracteristica.type) {
      case 'eye': tipo = 'ojo'; break;
      case 'mouth': tipo = 'boca'; break;
      case 'nose': tipo = 'nariz'; break;
    }
    
    context.fillText(tipo, caracteristica.location.x + 5, caracteristica.location.y + 5);
    context.beginPath();
    context.arc(caracteristica.location.x, caracteristica.location.y, 3, 0, Math.PI * 2, true);
    context.fill();
  });
}