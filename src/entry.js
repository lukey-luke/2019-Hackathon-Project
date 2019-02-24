/**
 * entry.js
 * 
 * This is the first file loaded. It sets up the Renderer, 
 * Scene and Camera. It also starts the render loop and 
 * handles window resizes.
 * 
 */

var THREE = require('three');
require('three-fly-controls')(THREE);
import SeedScene from './objects/Scene.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera();
const renderer = new THREE.WebGLRenderer({antialias: true});
const seedScene = new SeedScene();

const uuid_to_model_name = {
  "44B13A6C-7AEA-4EB2-8CA1-5608584CFF47": "land",
  "598453FB-59C1-4A8B-95CD-17961CEABC50":"flower",
}
const collisionDetector = new THREE.Raycaster();
collisionDetector.near = 0;
collisionDetector.far = 5;
const straight_vec = new THREE.Vector2( 0, 0 );

// scene
scene.add(seedScene);

// camera
camera.position.set(6,3,-10);
camera.lookAt(new THREE.Vector3(0,0,0));
var controls = new THREE.FlyControls( camera , renderer.domElement);

// renderer
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setClearColor(0x041320, 1);

// render loop
const onAnimationFrameHandler = (timeStamp) => {
  collisionDetector.setFromCamera(straight_vec, camera);
  let intersections = collisionDetector.intersectObjects(seedScene.children, true);
  if (intersections.length) {
    let intersection = intersections[0].object;
    if (intersection.parent) {
      intersection = intersection.parent;
    }
    let intersection_uuid = intersection.uuid;
    let model_name = uuid_to_model_name[intersection_uuid]
    console.log('model_name: ', model_name);
    console.log('metadata: ', getObjectMetaData(intersection_uuid));
    let metadata = getObjectMetaData(intersection_uuid);
    displayMetadataInDOM(metadata);
  }
  renderer.render(scene, camera);
  controls.update();
  seedScene.update && seedScene.update(timeStamp);
  window.requestAnimationFrame(onAnimationFrameHandler);
}
window.requestAnimationFrame(onAnimationFrameHandler);

// resize
const windowResizeHanlder = () => { 
  const { innerHeight, innerWidth } = window;
  renderer.setSize(innerWidth, innerHeight);
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
};
windowResizeHanlder();
window.addEventListener('resize', windowResizeHanlder);

// dom
document.body.style.margin = 0;
document.body.appendChild( renderer.domElement );

let text_object = document.createElement('div');
// text_object.setAttribute("id", "info");
let absolute_text_object = `<div id="info" style="color: white; position: absolute; top: 10px; width: 100%; text-align: center; z-index: 100; display:block;">
                            <div>`;
text_object.innerHTML = absolute_text_object;
document.body.appendChild( text_object );

function displayMetadataInDOM(metadata) {
  let templateLiteral = `
    <h1>${metadata["name"]}</h1>
    <h2>${metadata["population"]}</h2>
    <h3>${metadata["atmosphere"]}</h3>
    <h4>${metadata["primaryLanguage"]}</h4>
    <h5>${metadata["diameter"]}</h5>
  `;
  console.log('templateLiteral: ', templateLiteral);
  document.getElementById('info').innerHTML = templateLiteral;
  //code
}

function printSceneObjects() {
  seedScene.children.forEach(function (elem) {
    console.log('elem: ', elem);
    console.log('elem.position: ', elem.position);
  });
}

function getObjectMetaData(uuid) {
  // planet name
  // planet population
  // planet atmosphere
  // planet primary language
  // planet diameter
  return {
    "name": "Endor",
    "population": 30000000,
    "atmosphere": "breathable",
    "primaryLanguage": "Ewokese",
    "diameter": 4900,
  };
}