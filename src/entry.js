/**
 * entry.js
 * 
 * This is the first file loaded. It sets up the Renderer, 
 * Scene and Camera. It also starts the render loop and 
 * handles window resizes.
 * 
 */

// import { WebGLRenderer, PerspectiveCamera, Scene, Vector3 } from 'three';
var THREE = require('three');
require('three-fly-controls')(THREE);
// import { FlyControls } from 'three-fly-controls';
import SeedScene from './objects/Scene.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera();
const renderer = new THREE.WebGLRenderer({antialias: true});
const seedScene = new SeedScene();

// scene
scene.add(seedScene);

// camera
camera.position.set(6,3,-10);
camera.lookAt(new THREE.Vector3(0,0,0));
var controls = new THREE.FlyControls( camera , renderer.domElement);
// controls = new OrbitControls(camera, renderer.domElement);
// controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
// controls.dampingFactor = 0.25;
// controls.screenSpacePanning = false;
// controls.minDistance = 100;
// controls.maxDistance = 500;
// controls.maxPolarAngle = Math.PI / 2;

// renderer
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setClearColor(0x7ec0ee, 1);

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
// var isMouseDown = false;
// var onMouseDownPosition = {};
// document.addEventListener( 'mousemove', onDocumentMouseMove, false );
// document.body.addEventListener("mousedown", function(event) {
//   isMouseDown = true
//   onMouseDownPosition.x = event.clientX;
//   onMouseDownPosition.y = event.clientY;
// }, false);
// document.body.addEventListener("mouseup", function(event) {
//   isMouseDown = false
// }, false);

// function render() {
//   renderer.render(scene, camera);
// }
// function onDocumentMouseMove( event ) { // this gets hoisted, move this to a separate file to make cleaner
//   console.log('event received: ', event);
//   event.preventDefault();

//   if ( isMouseDown ) {
//       theta = - ( ( event.clientX - onMouseDownPosition.x ) * 0.5 )
//               + onMouseDownTheta;
//       phi = ( ( event.clientY - onMouseDownPosition.y ) * 0.5 )
//             + onMouseDownPhi;
//       phi = Math.min( 180, Math.max( 0, phi ) );

//       camera.position.x = radious * Math.sin( theta * Math.PI / 360 )
//                           * Math.cos( phi * Math.PI / 360 );
//       camera.position.y = radious * Math.sin( phi * Math.PI / 360 );
//       camera.position.z = radious * Math.cos( theta * Math.PI / 360 )
//                           * Math.cos( phi * Math.PI / 360 );
//       camera.updateMatrix();
//   }

//   mouse3D = projector.unprojectVector(
//       new THREE.Vector3(
//           ( event.clientX / renderer.domElement.width ) * 2 - 1,
//           - ( event.clientY / renderer.domElement.height ) * 2 + 1,
//           0.5
//       ),
//       camera
//   );
//   ray.direction = mouse3D.subSelf( camera.position ).normalize();
//   interact();
//   render();
// }