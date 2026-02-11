import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// Configuração da Cena
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 60, 20);

// Configuração do Renderizador
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

// Material do Dragão (Wireframe preto com transparência)
const dragonMat = new THREE.MeshBasicMaterial({
    color: 0x000000,
    wireframe: true,
    transparent: true,
    opacity: 0.15
});

let dragon;
const loader = new GLTFLoader();

// Carregamento do modelo
loader.load('./chinese_dragon.glb', (gltf) => {
    dragon = gltf.scene;
    dragon.traverse(n => {
        if (n.isMesh) n.material = dragonMat;
    });
    resizeDragon();
    scene.add(dragon);
}, undefined, (error) => {
    console.error('Erro ao carregar o modelo:', error);
});

// Função para ajustar o tamanho e posição do dragão (Responsivo)
function resizeDragon() {
    if (!dragon) return;
    const isMobile = window.innerWidth < 480;
    const targetSize = isMobile ? 40 : 80;

    const box = new THREE.Box3().setFromObject(dragon);
    const size = box.getSize(new THREE.Vector3());
    const scale = targetSize / Math.max(size.x, size.y, size.z);

    dragon.scale.set(scale, scale, scale);

    const center = box.getCenter(new THREE.Vector3());
    dragon.position.set(0, 0, 0);
    dragon.position.sub(center.multiplyScalar(scale));
}

// Controles de órbita
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.autoRotate = true;
controls.autoRotateSpeed = 0.4;
controls.enablePan = false; // Desativa mover com botão direito

// Loop de animação
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}
animate();

// Ajuste de janela (Resize)
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    resizeDragon();
});