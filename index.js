
window.onload = async () => {

    const video = document.getElementById('camera')
    const photos = document.getElementById('photos')

    // ===== NOVO =====

    // carregar modelos do face-api
    async function carregarModelos() {

        await faceapi.nets.tinyFaceDetector.loadFromUri('./models')

        await faceapi.nets.faceLandmark68TinyNet.loadFromUri('./models')

        console.log('Modelos carregados')
    }

    // imagens dos filtros
    const filtros = {
        chapeu: 'assets/chapeu.png',
        bigode: 'assets/bigode.png',
        gravata: 'assets/gravata.png',

        oculos: 'assets/oculos.png',
        careca: 'assets/careca.png'
    }

    // =================

    async function startCamera() {

        try {

            const stream = await navigator.mediaDevices.getUserMedia({ video: true })

            video.srcObject = stream

        } catch (error) {

            alert('erro ao acessar a câmera ' + error.message)
        }

    }

    async function capturarPhoto(efeito) {

        const photo = document.createElement('canvas')

        photo.width = video.videoWidth
        photo.height = video.videoHeight

        const context = photo.getContext('2d')

        //Ajuste na posicao da foto tirada da camera

        context.translate(photo.width, 0)
        context.scale(-1, 1)

        switch (efeito) {

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

        // ===== NOVO =====

        // detectar rosto
        const detections = await faceapi
            .detectSingleFace(
                photo,
                new faceapi.TinyFaceDetectorOptions()
            )
            .withFaceLandmarks(true)

        // se detectar rosto
        if (detections) {

            const landmarks = detections.landmarks






            // ===== CARECA =====

            if (efeito === 'careca') {

                const olhoEsquerdo = landmarks.getLeftEye()[0]
                const olhoDireito = landmarks.getRightEye()[3]

                const distanciaOlhos =
                    olhoDireito.x - olhoEsquerdo.x

                const larguraCareca = distanciaOlhos * 3.0

                const alturaCareca = larguraCareca * 1.0

                const centroX =
                    (olhoEsquerdo.x + olhoDireito.x) / 2

                const centroY =
                    (olhoEsquerdo.y + olhoDireito.y) / 2

                const angulo = Math.atan2(
                    olhoDireito.y - olhoEsquerdo.y,
                    olhoDireito.x - olhoEsquerdo.x
                )

                const img = new Image()

                img.src = filtros.careca

                img.onload = () => {

                    context.save()

                    context.translate(
                        centroX,
                        centroY - distanciaOlhos * 1.3
                    )

                    context.rotate(angulo)

                    context.drawImage(
                        img,
                        -larguraCareca / 2,
                        -alturaCareca / 2,
                        larguraCareca,
                        alturaCareca
                    )

                    context.restore()

                    photos.appendChild(photo)
                }

                return
            }




            // ===== OCULOS =====

            if (efeito === 'oculos') {

                const olhoEsquerdo = landmarks.getLeftEye()[0]
                const olhoDireito = landmarks.getRightEye()[3]

                const larguraOculos =
                    (olhoDireito.x - olhoEsquerdo.x) * 3.0

                const alturaOculos = larguraOculos / 1.0

                const centroX =
                    (olhoEsquerdo.x + olhoDireito.x) / 2

                const centroY =
                    (olhoEsquerdo.y + olhoDireito.y) / 2

                const angulo = Math.atan2(
                    olhoDireito.y - olhoEsquerdo.y,
                    olhoDireito.x - olhoEsquerdo.x
                )

                const img = new Image()

                img.src = filtros.oculos

                img.onload = () => {

                    context.save()

                    context.translate(centroX, centroY)

                    context.rotate(angulo)

                    context.drawImage(
                        img,
                        -larguraOculos / 2,
                        -alturaOculos / 2,
                        larguraOculos,
                        alturaOculos
                    )

                    context.restore()

                    photos.appendChild(photo)
                }

                return
            }

            // ===== CHAPEU =====

            if (efeito === 'chapeu') {

                const olhoEsquerdo = landmarks.getLeftEye()[0]

                const img = new Image()

                img.src = filtros.chapeu

                img.onload = () => {



                    const olhoEsquerdo = landmarks.getLeftEye()[0]
                    const olhoDireito = landmarks.getRightEye()[3]

                    // distância entre olhos
                    const distanciaOlhos =
                        olhoDireito.x - olhoEsquerdo.x

                    const larguraChapeu = distanciaOlhos * 2.5

                    const alturaChapeu = larguraChapeu * 0.8

                    const centroX =
                        (olhoEsquerdo.x + olhoDireito.x) / 2

                    const centroY =
                        (olhoEsquerdo.y + olhoDireito.y) / 2

                    const angulo = Math.atan2(
                        olhoDireito.y - olhoEsquerdo.y,
                        olhoDireito.x - olhoEsquerdo.x
                    )

                    context.save()

                    context.translate(
                        centroX,
                        centroY - distanciaOlhos
                    )

                    context.rotate(angulo)

                    context.drawImage(
                        img,
                        -larguraChapeu / 2,
                        -alturaChapeu / 2,
                        larguraChapeu,
                        alturaChapeu
                    )

                    context.restore()





                    photos.appendChild(photo)
                }

                return
            }

            // ===== BIGODE =====

            if (efeito === 'bigode') {

                const nariz = landmarks.getNose()[3]

                const img = new Image()

                img.src = filtros.bigode

                img.onload = () => {

                    const boca = landmarks.getMouth()

                    const cantoEsquerdo = boca[0]
                    const cantoDireito = boca[6]

                    // largura baseada na boca
                    const larguraBigode = cantoDireito.x - cantoEsquerdo.x + 40

                    const alturaBigode = larguraBigode / 2

                    // angulo do rosto
                    const angulo = Math.atan2(
                        cantoDireito.y - cantoEsquerdo.y,
                        cantoDireito.x - cantoEsquerdo.x
                    )

                    context.save()

                    context.translate(nariz.x, nariz.y + 20)

                    context.rotate(angulo)

                    context.drawImage(
                        img,
                        -larguraBigode / 2,
                        -alturaBigode / 2,
                        larguraBigode,
                        alturaBigode
                    )

                    context.restore()

                    photos.appendChild(photo)
                }

                return
            }

            // ===== GRAVATA =====

            if (efeito === 'gravata') {

                const jaw = landmarks.getJawOutline()

                const centro = jaw[8]

                const img = new Image()

                img.src = filtros.gravata

                img.onload = () => {

                    context.drawImage(
                        img,
                        centro.x - 70,
                        centro.y + 40,
                        140,
                        180
                    )

                    photos.appendChild(photo)
                }

                return
            }
        }

        // =================

        photos.appendChild(photo)

    }

    // ===== NOVO =====

    carregarModelos()

    startCamera()

    window.capturarPhoto = capturarPhoto

}