/**
 * entry.js
 *
 * This is the first file loaded. It sets up the Renderer,
 * Scene and Camera. It also starts the render loop and
 * handles window resizes.
 *
 */

// import { WebGLRenderer, PerspectiveCamera, Scene, Vector3 } from 'three'; // other import method easier?
var THREE = require('three');
require('three-fly-controls')(THREE);
import SeedScene from './objects/Scene.js';


const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera();
const renderer = new THREE.WebGLRenderer({antialias: true});
const seedScene = new SeedScene();

const FBXLoader = require('three-fbx-loader');
const loader = new FBXLoader();

// In an attempt to catch what was going wrong, I surrounded the entire troubling function in a try/catch block.
// This was unsucessful, but caused no problems on its own so I left it in.
try
{
  // onprogress function for the loader, pulled out of the method and into a const for readability.
  const onprogress = function(p)
  {
    console.log("progress");
  }
  // Onerror for loader. Also pulled out of the method.
  const onerror = function(e) {
    console.error(e);
  }
  // Onload. This is being called, and the mesh si being added to the scene, but nothing is displaying.
  const onload = function (mesh) {
    // Console logging the mesh, I found it was actually a group containing a mesh.
    // This SHOULDN'T cause problems but seems to cause a "Uncaught TypeError: uvScaleMap.updateMatrix is not a function"
    console.log(mesh);
    // Create a three object3d and add the MESH from the group to it. Basically converting group to a object3d
    // Sidenote: pardon the smartass variable name.
    const comeonworkalready = new THREE.Object3D(mesh.children[0]);
    // Just some parameters. Don't need these but also don't not need them.
    //comeonworkalready.positionX = 2;
    //comeonworkalready.scale.set(2,2,2);
    // Attempt at adding the object to seedscene. Unsuccessful.
    //seedScene.add( comeonworkalready );
    // Adding the object3d to the scene and praying it renders. It doesnt.
    scene.add(comeonworkalready);
    // Console logging the entire scene for convenience.
    console.log(scene);
  }
  // Run loader.load.
  loader.load('./src/objects/Planet/Planet.fbx', onload, onprogress, onerror);

}
catch(e)
{
  console.log(e);
}

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

