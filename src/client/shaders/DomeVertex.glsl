attribute vec3 domeMap;
varying vec3 vDomeMap;

void main() {
    vDomeMap = domeMap;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}