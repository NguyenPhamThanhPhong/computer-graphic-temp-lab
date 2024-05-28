import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls';
import dat from 'dat';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
let CLEAR_COLOR = 'rgb(120, 120, 120)'
let POINT_LIGHT_NAME = 'pointLight';
let SPOT_LIGHT_NAME = 'spotLight';
let AMBIENT_LIGHT_NAME = 'ambientLight';
let DIRECTIONAL_LIGHT_NAME = 'directionalLight';

// cái này được bổ sung để hiển thị trục tọa độ (nhìn dễ hơn)
function setupAxes() {
    const axesHelper = new THREE.AxesHelper(60);
    return axesHelper;
}
// cái này giúp view cái mặt phẳng đáy
function setupGrid() {
    const size = 100;
    const divisions = 100;
    const gridHelper = new THREE.GridHelper(size, divisions);
    return gridHelper;
}
//tạo object cube
function createCube(w, h, d) {
    const geometry = new THREE.BoxGeometry(w, h, d);
    const material = new THREE.MeshPhongMaterial({ color: CLEAR_COLOR });
    const cube = new THREE.Mesh(geometry, material);
    cube.castShadow = true;
    // cube.position.y = cube.geometry.parameters.height / 2;
    return cube;
}
//tạo mặt phẳng (plane)
function createPlane(size) {
    const geometry = new THREE.PlaneGeometry(size, size);
    const material = new THREE.MeshPhongMaterial({ color: CLEAR_COLOR, side: THREE.DoubleSide });
    const plane = new THREE.Mesh(geometry, material);
    plane.rotation.x = Math.PI / 2;
    plane.position.y = 0.5;
    plane.receiveShadow = true;
    return plane;
}

function createPointLight(intensity) {
    var light = new THREE.PointLight(0xffffff, intensity);
    light.name = POINT_LIGHT_NAME;
    light.castShadow = true;
    return light;
}
function createSpotLight(intensity) {
    var light = new THREE.SpotLight(0xffffff, intensity);
    light.castShadow = true;
    light.name = SPOT_LIGHT_NAME;
    light.shadow.bias = 0.001;
    light.shadow.mapSize.width = 2048;
    light.shadow.mapSize.height = 2048;
    return light;
}

function createDirectionalLight(intensity) {
    var light = new THREE.DirectionalLight(0xffffff, intensity);
    light.name = DIRECTIONAL_LIGHT_NAME;
    light.castShadow = true;
    light.position.z = 8;
    // light.shadow.bias = 0.001;
    // light.shadow.mapSize.width = 2048;
    // light.shadow.mapSize.height = 2048;
    return light;
}

function loadmodel(scene) {
    const loader = new GLTFLoader();
    loader.load('./roller-coaster/rollercoaster_diorama_cartoon_style.glb', function (gltf) {
        let model = gltf.scene;
        // model.scale.set(2, 2, 2);
        // model.position.set(0, 5, 0);
        scene.add(model);
    }, undefined, function (error) {
        console.error(error);
    });

    loader.load('./gas-station/scene.gltf', function (gltf) {
        let model = gltf.scene;
        model.scale.set(0.3, 0.3, 0.3);
        model.position.set(0, 5, 0);
      scene.add(model);
    }, undefined, function (error) {
      console.error(error);
    });

    // loader.load('./modern-city/scene.gltf', function (gltf) {
    //     let model = gltf.scene;
    //     model.children[0].scale.set(0.001, 0.001, 0.001);
    //     console.log(model);
    //     model.position.set(0, 5, 0);
    //     scene.add(model.children[0]);
    // }, undefined, function (error) {
    //     console.error(error);
    // });

    // loader.load('./mega-city/scene.gltf', function (gltf) {
    //     let model = gltf.scene;
    //     let modelChildren = model.children[0].children[0].children[0];
    //     // modelChildren.scale.set(1, 1, 1);
    //     // model.children[0].scale.set(0.1, 0.1, 0.1);
    //     console.log(modelChildren.children);
    //     modelChildren.position.set(0,10, 0);
    //     scene.add(modelChildren);
    // }, undefined, function (error) {
    //     console.error(error);
    // });

}

function createAmbientLight(intensity) {
    var light = new THREE.AmbientLight('rgb(255,30,50)', intensity);
    light.name = AMBIENT_LIGHT_NAME;
    return light;
}

function createSphere() {
    let geometry = new THREE.SphereGeometry(0.2, 24, 24);
    let material = new THREE.MeshBasicMaterial({ color: 0xffffff });
    let sphere = new THREE.Mesh(geometry, material);
    return sphere;
}
function getBoxGrid(amount, separationMultilipher) {
    var group = new THREE.Group();
    for (var i = 0; i < amount; i++) {
        var obj = createCube(1, 1, 1);
        obj.position.x = i * separationMultilipher;
        obj.position.y = obj.geometry.parameters.height / 2;
        group.add(obj);
        for (var j = 1; j < amount; j++) {
            var obj = obj.clone();
            obj.position.z = j * separationMultilipher;
            group.add(obj);
        }
    }
    group.position.x = -(separationMultilipher * (amount - 1)) / 2;
    group.position.z = -(separationMultilipher * (amount - 1)) / 2;
    return group;
}

//tổng hợp việc tạo & add vào scene
function addSceneItems(scene) {

    const plane = createPlane(20);
    plane.name = 'plane-01';


    let PointLight = createPointLight(1);
    PointLight.position.y = 1.5;
    PointLight.add(createSphere());

    let spotLight = createSpotLight(1);
    let spot_light_sphere = createSphere();
    spotLight.position.y = 2;
    spotLight.add(spot_light_sphere);

    let directionalLight = createDirectionalLight(1);
    directionalLight.position.y = 2;

    let group = getBoxGrid(10, 1.5);

    let ambientLight = createAmbientLight(0.5);
    ambientLight.position.y = 2;
    ambientLight.position.x = -5;
    ambientLight.position.z = -5;
    ambientLight.add(createSphere());

    scene.add(loadmodel(scene));

    const axishelper = setupAxes();
    const gridHelper = setupGrid();

    scene.add(axishelper);
    scene.add(PointLight);
    scene.add(spotLight);
    scene.add(directionalLight);
    scene.add(ambientLight);
    scene.add(plane);
    scene.add(group);
    scene.add(gridHelper);

}

function enableFog(scene) {
    scene.fog = new THREE.FogExp2(0xffffff, 0.1)
}
function addDatGui(scene) {
    var gui = new dat.GUI();

    // Add controllers to the Point Light folder
    let addPointLightControllers = function () {
        var my_light = scene.getObjectByName(POINT_LIGHT_NAME);
        var pointLightFolder = gui.addFolder('Point Light');
        pointLightFolder.add(my_light, 'intensity', 0, 10).name('Intensity');
        pointLightFolder.add(my_light.position, 'x', -10, 10).name('Position X');
        pointLightFolder.add(my_light.position, 'y', 0, 10).name('Position Y');
        pointLightFolder.add(my_light.position, 'z', -10, 10).name('Position Z');
        pointLightFolder.open();

    }

    // Add controllers to the Spot Light folder
    let addSpotLightControllers = function () {
        var my_spot_light = scene.getObjectByName(SPOT_LIGHT_NAME);
        var spotLightFolder = gui.addFolder('Spot Light');
        spotLightFolder.add(my_spot_light, 'intensity', 0, 10).name('Intensity');
        spotLightFolder.add(my_spot_light.position, 'y', 0, 10).name('Position Y');
        spotLightFolder.add(my_spot_light.position, 'x', -10, 10).name('Position X');
        spotLightFolder.add(my_spot_light.position, 'z', -10, 10).name('Position Z');
        spotLightFolder.add(my_spot_light, 'penumbra', 0, 1).name('Penumbra');
        spotLightFolder.open();
    }

    let addDirectionalLightControllers = function () {
        var my_directional_light = scene.getObjectByName(DIRECTIONAL_LIGHT_NAME);
        var directionalLightFolder = gui.addFolder('Directional Light');
        directionalLightFolder.add(my_directional_light, 'intensity', 0, 10).name('Intensity');
        directionalLightFolder.add(my_directional_light.position, 'y', 0, 10).name('Position Y');
        directionalLightFolder.add(my_directional_light.position, 'x', -10, 10).name('Position X');
        directionalLightFolder.add(my_directional_light.position, 'z', -10, 10).name('Position Z');
        directionalLightFolder.open();
    }

    let addAmbientLightControllers = function () {
        var my_ambient_light = scene.getObjectByName(AMBIENT_LIGHT_NAME);
        var ambientLightFolder = gui.addFolder('Ambient Light');
        ambientLightFolder.add(my_ambient_light, 'intensity', 0, 10).name('Intensity');
        ambientLightFolder.add(my_ambient_light.position, 'y', 0, 10).name('Position Y');
        ambientLightFolder.add(my_ambient_light.position, 'x', -10, 10).name('Position X');
        ambientLightFolder.add(my_ambient_light.position, 'z', -10, 10).name('Position Z');
        ambientLightFolder.open();
    }

    addPointLightControllers();
    addSpotLightControllers();
    addDirectionalLightControllers();
    addAmbientLightControllers();


    // Optionally, you can open the folders by default
}



function init() {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);

    camera.position.set(-15, 15, 0);
    camera.lookAt(0, 0, 0);



    const renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(CLEAR_COLOR);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;

    document.getElementById('webgl').appendChild(renderer.domElement);
    addSceneItems(scene);
    addDatGui(scene);

    let directionalLight = scene.getObjectByName(DIRECTIONAL_LIGHT_NAME);
    let helper = new THREE.CameraHelper(directionalLight.shadow.camera);
    scene.add(helper);

    const orbit = new OrbitControls(camera, renderer.domElement);
    orbit.update();


    let animate = function () {
        requestAnimationFrame(animate);

        renderer.render(scene, camera);
    };
    animate();

}


init();


