let mandelbrotShader

let maxIter = 1500

let minReal = -2.5
let maxReal = 1
let minImag = -1
let maxImag = 1

let targetReal = -0.743643887037151
let targetImag = 0.131825904205330

let autoZoom = false
let zoomSpeed = 0.98

function preload() {
  mandelbrotShader = loadShader("shader.vert", "shader.frag")
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight)
}

function setup() {
  // Criando o canvas com o tamanho total da janela
  createCanvas(windowWidth, windowHeight, WEBGL)
  pixelDensity(1)
  noStroke()

  let aspect = width / height

  minReal = -2.5
  maxReal = 1.0

  let realRange = maxReal - minReal
  let imagRange = realRange / aspect

  minImag = -imagRange / 2.0
  maxImag = imagRange / 2.0
}

function draw() {
  background(0) // Garante limpeza de frame

  //* manter proporção correta
  let aspect = width / height
  let realRange = maxReal - minReal
  let imagRange = realRange / aspect

  if (autoZoom) {
    realRange *= zoomSpeed
    imagRange = realRange / aspect

    minReal = targetReal - realRange / 2
    maxReal = targetReal + realRange / 2

    minImag = targetImag - imagRange / 2
    maxImag = targetImag + imagRange / 2
  }

  shader(mandelbrotShader)

  // Enviando os uniforms (u_maxIter agora é enviado sempre para evitar tela preta)
  mandelbrotShader.setUniform("u_maxIter", float(maxIter)) 
  mandelbrotShader.setUniform("u_resolution", [width, height])
  mandelbrotShader.setUniform("u_minReal", minReal)
  mandelbrotShader.setUniform("u_maxReal", maxReal)
  mandelbrotShader.setUniform("u_minImag", minImag)
  mandelbrotShader.setUniform("u_maxImag", maxImag)
  mandelbrotShader.setUniform("u_time", millis() / 1000.0)

  // Desenha o retângulo cobrindo toda a área WEBGL
  plane(width, height)
}

function keyPressed() {

  // Z liga/desliga zoom
  if (key === 'z' || key === 'Z') {
    autoZoom = !autoZoom
  }

  // ↑ deixa zoom mais cinematográfico (mais lento)
  if (keyCode === UP_ARROW) {
    zoomSpeed *= 0.98
  }

  // ↓ deixa mais rápido
  if (keyCode === DOWN_ARROW) {
    zoomSpeed *= 1.02
  }

  // R resetar
  if (key === 'r' || key === 'R') {
    minReal = -2.5
    maxReal = 1
    minImag = -1
    maxImag = 1
  }
}
