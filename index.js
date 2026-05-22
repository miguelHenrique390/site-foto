const video = document.getElementById('camera')
const photos = document.getElementById('photos')

async function startCamera() {
try {
    const stream = await navigator.mediaDevices.getUserMedia({ video:true})
    video.srcObject = stream
} catch(error) {
    alert('erro ao acessar a câmera '  + error.message)
}

}

function capturarPhoto(efeito) { 
    const photo = document.createElement('canvas')
    photo.width = video.videoWidth
    photo.height = video.videoHeight
    const context = photo.getContext('2d')

    //Ajuste na posicao da foto tirada da camera

    context.translate(photo.width, 0)
    context.scale(-1, 1)

    switch(efeito) {
        case 'cinza':
            context.filter = 'grayscale(100%)'
            break;
        case 'antiga':
            context.filter = 'sepia(100%)'
            break
         case 'desfoque':
            context.filter = 'blur(3px)'
            break
        case 'brilho':
            context.filter = 'brightness(250%)'
            break
        case 'saturacao':
            context.filter = 'saturate(200%)'
            break
        case 'opacidade':
            context.filter = 'opacity(10%)'
            break
        case 'inverter':
            context.scale(1, -1)
            context.translate(0, -photo.height)
            break
    }
    
    context.drawImage(video, 0, 0, photo.width, photo.height)
    photos.appendChild(photo)

}

startCamera()