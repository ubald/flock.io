uniform samplerCube map;
varying vec3 vDomeMap;

void main() {
    gl_FragColor = textureCube(map, vDomeMap);
}