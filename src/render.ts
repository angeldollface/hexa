/*
HEXA by Alexander Abraham, a.k.a. "Angel Dollface".
Licensed under the MIT license.
*/

// Standard three.js import.
import * as THREE from 'three';

// Importing the GLTF 2.0 loader.
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

// Importing the shader for object glow-up.
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';

// Importing the "composer" to slap a filter on our scene.
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';

// Importing the filter.
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

// Importing the environment for rendering, lighting, etc.
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment';

// A function to render our models.
export function renderModel(
    modelURL: string,
    symbolName: string
): void {

    // We make a new three.js scene.
    let scene: THREE.Scene = new THREE.Scene();

    // We make a new camera. Something has
    // to look at our scene.
    let camera: THREE.PerspectiveCamera = new THREE.PerspectiveCamera(
        90, // Angle.
        window.innerWidth/window.innerHeight, // FOV.
        0.01,
        1000
    );

    // Used to be: 020201

    // Setting the background color.
    scene.background = new THREE.Color(0x000000);

    // Something has to render our scene.
    // We use the "standard" WebGL renderer.
    var renderer = new THREE.WebGLRenderer(
        {
          antialias: true
        }
    );

    // We set the width of and height of the renderer.
    renderer.setSize(window.innerWidth, window.innerHeight);

    // We add the renderer to the document.
    document.body.appendChild(renderer.domElement);

    // We make a new environment to render the scene in.
    // Courtesy of Don McCurdy.
    const environment = new RoomEnvironment();

    // Not sure what this does.
    const pmremGenerator = new THREE.PMREMGenerator( renderer );

    // A shader?
    const renderScene = new RenderPass( scene, camera );

    // Parameters for making named objects emit light.
    const params = {
        exposure: 0,
        bloomStrength: 2,
        bloomThreshold: 0,
        bloomRadius: 0.5
    };

    const fog : THREE.Fog = new THREE.Fog(new THREE.Color(0xFF7BAC), 1, 10)

    scene.fog = fog;

    // A shader to make individual meshes glow up. (Pillars on the corners.)
	const bloomPass = new UnrealBloomPass(
        new THREE.Vector2(
            window.innerWidth, 
            window.innerHeight
        ), 
        1.5, 
        0.4, 
        0.85
    );
	bloomPass.threshold = params.bloomThreshold;
    bloomPass.strength = params.bloomStrength;
	bloomPass.radius = params.bloomRadius;


    // We use a composer instead of the standard renderer
    // and add relevant data, because the shader is a "filter"
    // on the scene.
    var composer = new EffectComposer( renderer );
	composer.addPass( renderScene );
	composer.addPass( bloomPass );

    // Loading a GIF in.

    // And generate the scene from an environment.
    scene.environment = pmremGenerator.fromScene( environment ).texture;

    // Since the model is external we need to load it in.
    // For this we use the GLTF 2.0 loader three.js gives us.
    var loader = new GLTFLoader();

    // Empty variable to
    // populate with the mesh from the loaded model.
    let obj: any;
    let sign: any;

    // Closure to load a model from a path (remote or local).
    loader.load(
        modelURL,
        function(gltf){

          // Main model.
          obj = gltf.scene;

          // Model size.
          gltf.scene.scale.set( 1, 1, 1 );
          
          // Model pos.
          gltf.scene.position.x = 0;                   
          gltf.scene.position.y = 0;
          gltf.scene.position.z = 0;   
          gltf.scene.rotation.y = 0; 

          // We add it to our scene...
          scene.add(gltf.scene);

          // ...and populate our variables with different
          // objects.
          sign = gltf.scene.getObjectByName(symbolName);

          // We fetch one of the corner pillars from the
          // GLTF model and set whether it can emit light,
          // what color that light should be and how strong
          // the emission should be. Same for the other three.

          // Lighting up the light arch right at the front.
          sign.material.wireframe = true;
          sign.material.emissive = new THREE.Color(0xEA1573);
          sign.material.emissiveIntensity = 1;

          // We call the animation function
          // otherwise nothing happens.
          animate();

        }
    );

    // We set up the camera position.
    camera.position.set(0,1.5,4);

    // And animate the whole scene
    // recursively.
    const animate = () => {

        // Adding an event listener to resize
        // the scene for different devices.
        window.addEventListener(
            'resize', 
            resize 
        );

        // Re-renders the scene on
        // every frame bounce.
        composer.render();

        // We want some movement
        // so we animate the moon 
        // by rotating it on the Z-Axis.
        sign.rotation.z -= 0.015;
        
        // The "frame bounce".
        requestAnimationFrame(animate);
    }

    // Defining a nested function to adjust some renderer
    // and camera settings.
    const resize = () => {
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        composer.setSize(window.innerWidth, window.innerHeight);
    }

    const blinkLights = () => {
        if (
            sign.material.emissiveIntensity === 0
        ){
            sign.material.emissiveIntensity = 2.5;
        }
        else {
            sign.material.emissiveIntensity = 0;
        }
    }
    
}

export default renderModel;