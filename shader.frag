precision highp float;

uniform vec2 u_resolution;
uniform float u_minReal;
uniform float u_maxReal;
uniform float u_minImag;
uniform float u_maxImag;
uniform float u_maxIter;

varying vec2 vTexCoord;

#define MAX_ITER 1500

vec3 nasaGradient(float t) {
    vec3 deepBlue = vec3(0.02, 0.05, 0.15);
    vec3 nebulaBlue = vec3(0.1, 0.3, 0.8);
    vec3 spacePurple = vec3(0.4, 0.1, 0.6);
    vec3 starWhite = vec3(1.0, 0.95, 0.85);

    if (t < 0.4)
        return mix(deepBlue, nebulaBlue, t / 0.4);
    else if (t < 0.75)
        return mix(nebulaBlue, spacePurple, (t - 0.4) / 0.35);
    else
        return mix(spacePurple, starWhite, (t - 0.75) / 0.25);
}

void main() {

    // Coordenadas normalizadas 0 → 1
    vec2 uv = vTexCoord;

    // Converter para plano complexo
    float a = mix(u_minReal, u_maxReal, uv.x);
    float b = mix(u_minImag, u_maxImag, uv.y);

    // z começa em 0
    float real = 0.0;
    float imag = 0.0;

    int iter = 0;

    for (int i = 0; i < MAX_ITER; i++) {

        if (float(i) > u_maxIter) break;

        float tempReal = real * real - imag * imag + a;
        imag = 2.0 * real * imag + b;
        real = tempReal;

        if (real * real + imag * imag > 4.0) {
            iter = i;
            break;
        }

        iter = i;
    }

    // Interior do conjunto = preto
    if (float(iter) >= u_maxIter - 1.0) {
        gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
        return;
    }

    // Smooth coloring
    float mag = real * real + imag * imag;
    float log_zn = log(mag) / 2.0;
    float nu = log(log_zn / log(2.0)) / log(2.0);

    float smoothIter = float(iter) + 1.0 - nu;
   // aumenta as bandas fractais naturais
   smoothIter *= 2.5;   // <-- controla intensidade
   
   float t = smoothIter / u_maxIter;
   t = pow(t, 1.2); // deixa as cores finais mais escuras
   vec3 color = nasaGradient(t);

    gl_FragColor = vec4(color, 1.0);
}
