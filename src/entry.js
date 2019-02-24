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
import './css/foo.css';

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
let haveInfoDisplayed = false; // global variables are evil

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
    if (!haveInfoDisplayed) {
      haveInfoDisplayed = true;
      let intersection_uuid = intersection.uuid;
      let model_name = uuid_to_model_name[intersection_uuid]
      console.log('model_name: ', model_name);
      console.log('metadata: ', getObjectMetaData(intersection_uuid));
      let metadata = getObjectMetaData(intersection_uuid);
      displayMetadataInDOM(metadata);
    }
  }
  else {
    haveInfoDisplayed = false;
    document.getElementById('info').innerHTML = '';
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
let absolute_text_object = `<div id="info"><div>`;
text_object.innerHTML = absolute_text_object;
document.body.appendChild( text_object );

let lastDisplay = new Date();
function displayMetadataInDOM(metadata) {
  let displayTime = new Date();
  if (displayTime > (lastDisplay.getTime()+4000) ) {
    let templateLiteral = `
    <div class="fade-in" style="width: 100px; border: 2px solid #D9EDFF; transform: translate(618px, -400px) rotate(-37deg);"></div>
    <div class="info-wrapper fade-in">
      <div class="pad-small">
        <a href="${metadata["url"]}" style="text-decoration: none;">
          <h1 class="info-large">
          ${metadata["name"]}<img style="padding-left: 10px; height: 20px;" src="https://www.iconsdb.com/icons/preview/white/external-link-xxl.png"/>
          </h1>
        </a>
      </div>
      <div class="pad-small">
        <div class="info-small">Population: ${metadata["population"]}</div>
      </div>
      <div class="pad-small">
        <div class="info-small">Atmosphere: ${metadata["atmosphere"]}</div>
      </div>
      <div class="pad-small">
        <div class="info-small">Primary Language: ${metadata["primaryLanguage"]}</div>
      </div>
      <div class="pad-small">
        <div class="info-small">Planet diameter: ${metadata["diameter"]}km</div>
      </div>
    </div>
    `;
    document.getElementById('info').innerHTML = templateLiteral;
    lastDisplay = displayTime;
  }
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
    "url": "google.com",
  };
}