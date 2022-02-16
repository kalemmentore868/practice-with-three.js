import "./style.css";

import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const scene = new THREE.Scene();

//camera which is the viewer's perspective and can be adjusted
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

//to render graphics to scene
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("#bg"),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight); //make fullscreen

camera.position.setZ(30);
camera.position.setX(-3);

renderer.render(scene, camera);

// to make a 3d object you need geometry, material...then make mesh by combining the two and adding to the scene
const geometry = new THREE.OctahedronGeometry(5, 0); //geometry
const greenMaterial = new THREE.TextureLoader().load("./img/ben-ten-green.jpg");

const material = new THREE.MeshStandardMaterial({
  map: greenMaterial,
});

//Now the mEsh

const oct = new THREE.Mesh(geometry, material);
oct.position.set(-10, -10, 10);

//add shape to scene
scene.add(oct);

//add point lighting
const pointLight = new THREE.PointLight(0xfffff);
pointLight.position.set(5, 5, 5);

//add ambient lighting
const ambientLight = new THREE.AmbientLight(0xffffff);

scene.add(pointLight, ambientLight);

//a lighting helper to show us the position of the light
const lightHelper = new THREE.PointLightHelper(pointLight);

//draw 2d grid along scene
const gridHelper = new THREE.GridHelper(200, 50);

// scene.add(lightHelper, gridHelper);

//make it so you can move around camera by dragging mouse
const controls = new OrbitControls(camera, renderer.domElement);

function addStar() {
  const geometry = new THREE.SphereGeometry(0.25, 24, 24);
  const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
  const star = new THREE.Mesh(geometry, material);

  //make an array of 3 random numbers and make values in array between -100 and 100
  const [x, y, z] = Array(3)
    .fill()
    .map(() => THREE.MathUtils.randFloatSpread(100));

  star.position.set(x, y, z);
  scene.add(star);
}

//make 200 stars
Array(200).fill().forEach(addStar);

//add space-bg image
const spaceTexture = new THREE.TextureLoader().load("./img/space-bg.jpg"); //load image
scene.background = spaceTexture; // make bg

//put me on a shape
const lemTexture = new THREE.TextureLoader().load("./img/propic.jpg");

const lem = new THREE.Mesh(
  new THREE.BoxGeometry(9, 9, 9),
  new THREE.MeshBasicMaterial({ map: lemTexture })
);

const marsTexture = new THREE.TextureLoader().load("./img/colors-wavy.jpg");

const mars = new THREE.Mesh(
  new THREE.SphereGeometry(3, 32, 32),
  new THREE.MeshStandardMaterial({
    map: marsTexture,
  })
);

lem.position.set(0, 10, 0);

mars.position.set(10, -8, -10);

scene.add(lem, mars);

//animate site on scroll
function moveCamera() {
  const t = document.body.getBoundingClientRect().top;

  mars.rotation.x += 0.05;
  mars.rotation.y += 0.075;
  mars.rotation.z += 0.05;

  lem.rotation.y += 0.01;
  lem.rotation.z += 0.01;

  camera.position.z = t * -0.01;
  camera.position.x = t * -0.0002;
  camera.position.y = t * -0.0002;
}

document.body.onscroll = moveCamera;

//this function is more or less a game loop to update the UI
function animate() {
  requestAnimationFrame(animate);

  //make shape rotate
  oct.rotation.x += 0.01;
  oct.rotation.y += 0.005;
  oct.rotation.z += 0.01;

  controls.update();

  renderer.render(scene, camera);
}

animate();
