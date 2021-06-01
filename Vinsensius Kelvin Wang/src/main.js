import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.112.1/build/three.module.js';
import {GUI} from 'https://cdn.jsdelivr.net/npm/three@0.112.1/examples/jsm/libs/dat.gui.module.js';
import {Sky} from 'https://cdn.jsdelivr.net/npm/three@0.112.1/examples/jsm/objects/Sky.js';
import {game} from './game.js';
import {graphics} from './graphics.js';
import {math} from './math.js';
import {noise} from './noise.js';
import {spline} from './spline.js';

import {OrbitControls} from 'https://cdn.jsdelivr.net/npm/three@0.112.1/examples/jsm/controls/OrbitControls.js';

/* Unused Assets (Was aiming for making auto-generated forest)

//Variables for blade mesh
var joints = 5;
var w_ = 0.12;
var h_ = 1;

//http://www.euclideanspace.com/maths/algebra/realNormedAlgebra/quaternions/code/index.htm
function multiplyQuaternions(q1, q2){
  x =  q1.x * q2.w + q1.y * q2.z - q1.z * q2.y + q1.w * q2.x;
  y = -q1.x * q2.z + q1.y * q2.w + q1.z * q2.x + q1.w * q2.y;
  z =  q1.x * q2.y - q1.y * q2.x + q1.z * q2.w + q1.w * q2.z;
  w = -q1.x * q2.x - q1.y * q2.y - q1.z * q2.z + q1.w * q2.w;
  return new THREE.Vector4(x, y, z, w);
}

var instanced_geometry = new THREE.InstancedBufferGeometry();
instanced_geometry.index = 20;
instanced_geometry.attributes.position = base_geometry.attributes.position;
instanced_geometry.attributes.uv = base_geometry.attributes.uv;

//Patch side length
var width = 1000;

//Number of blades
var num_instances = 50000;
var num_tree = 150;

// Each instance has its own data for position, rotation and scale
var offsets = [];
var orientations = [];
var stretches = [];
var halfRootAngleSin = [];
var halfRootAngleCos = [];

//Temp variables
var quaternion_0 = new THREE.Vector4();
var quaternion_1 = new THREE.Vector4();
var x, y, z, w;

//The min and max angle for the growth direction (in radians)
var min = -0.25;
var max =  0.25;

//For each instance of the grass blade
for (var i = 0; i < num_instances; i++){
  //Offset of the roots
  x = Math.random() * width - width/2;
  z = Math.random() * width - width/2;
  y = 0;
  offsets.push( x, y, z);

  //Define random growth directions
  //Rotate around Y
  var angle = Math.PI - Math.random() * (2 * Math.PI);
  halfRootAngleSin.push(Math.sin(0.5*angle));
  halfRootAngleCos.push(Math.cos(0.5*angle));

  var RotationAxis = new THREE.Vector3(0, 1, 0);
  var x = RotationAxis.x * Math.sin(angle / 2.0);
  var y = RotationAxis.y * Math.sin(angle / 2.0);
  var z = RotationAxis.z * Math.sin(angle / 2.0);
  var w = Math.cos(angle / 2.0);
  quaternion_0.set( x, y, z, w).normalize();

  //Rotate around X
  angle = Math.random() * (max - min) + min;
  RotationAxis = new THREE.Vector3(1, 0, 0);
  x = RotationAxis.x * Math.sin(angle / 2.0);
  y = RotationAxis.y * Math.sin(angle / 2.0);
  z = RotationAxis.z * Math.sin(angle / 2.0);
  w = Math.cos(angle / 2.0);
  quaternion_1.set( x, y, z, w).normalize();

  //Combine rotations to a single quaternion
  quaternion_0 = multiplyQuaternions(quaternion_0, quaternion_1);

  //Rotate around Z
  angle = Math.random() * (max - min) + min;
  RotationAxis = new THREE.Vector3(0, 0, 1);
  x = RotationAxis.x * Math.sin(angle / 2.0);
  y = RotationAxis.y * Math.sin(angle / 2.0);
  z = RotationAxis.z * Math.sin(angle / 2.0);
  w = Math.cos(angle / 2.0);
  quaternion_1.set( x, y, z, w).normalize();

  //Combine rotations to a single quaternion
  quaternion_0 = multiplyQuaternions(quaternion_0, quaternion_1);

  orientations.push(quaternion_0.x, quaternion_0.y, quaternion_0.z, quaternion_0.w);

  //Define variety in height
  if(i < num_instances/3){
      stretches.push(Math.random() * 1.8);
  }else{
      stretches.push(Math.random());
  }

  var offsetAttribute = new THREE.InstancedBufferAttribute( new Float32Array( offsets ), 3);
var stretchAttribute = new THREE.InstancedBufferAttribute( new Float32Array( stretches ), 1);
var halfRootAngleSinAttribute = new THREE.InstancedBufferAttribute( new Float32Array( halfRootAngleSin ), 1);
var halfRootAngleCosAttribute = new THREE.InstancedBufferAttribute( new Float32Array( halfRootAngleCos ), 1);
var orientationAttribute = new THREE.InstancedBufferAttribute( new Float32Array( orientations ), 4);

instanced_geometry.addAttribute( 'offset', offsetAttribute);
instanced_geometry.addAttribute( 'orientation', orientationAttribute);
instanced_geometry.addAttribute( 'stretch', stretchAttribute);
instanced_geometry.addAttribute( 'halfRootAngleSin', halfRootAngleSinAttribute);
instanced_geometry.addAttribute( 'halfRootAngleCos', halfRootAngleCosAttribute);

//Get alpha map and blade texture
var texture =  loader.load( './materials/blade_diffuse.jpg' );
var alphaMap =  loader.load( './materials/blade_alpha.jpg' );

//Define the material, specifying attributes, uniforms, shaders etc.
var material = new THREE.RawShaderMaterial( {
    uniforms: {
        map: { value: texture},
        alphaMap: { value: alphaMap},
        time: {type: 'float', value: 0}
    },
    vertexShader: document.getElementById( 'vertex-shader' ).textContent,
    fragmentShader: document.getElementById( 'fragment-shader' ).textContent,
    side: THREE.DoubleSide
} );
}*/

//creates the whole app instance
let _APP = null;

//designates the height of the tissue
class HeightGenerator {
  constructor(generator, position, minRadius, maxRadius) {
    this._position = position.clone();
    this._radius = [minRadius, maxRadius];
    this._generator = generator;
  }

  Get(x, y) {
    const distance = this._position.distanceTo(new THREE.Vector2(x, y));
    let normalization = 1.0 - math.sat(
        (distance - this._radius[0]) / (this._radius[1] - this._radius[0]));
    normalization = normalization * normalization * (3 - 2 * normalization);

    return [this._generator.Get(x, y), normalization];
  }
}

//creates flared corner inside the tissue
class FlaredCornerHeightGenerator {
  constructor() {
  }

  Get(x, y) {
    if (x == -250 && y == 250) {
      return [128, 1];
    }
    return [0, 1];
  }
}

//creates the various noise and terrain hills inside the tissue
class BumpHeightGenerator {
  constructor() {
  }

  Get(x, y) {
    const dist = new THREE.Vector2(x, y).distanceTo(new THREE.Vector2(0, 0));

    let h = 1.0 - math.sat(dist / 250.0);
    h = h * h * h * (h * (h * 6 - 15) + 10);

    return [h * 128, 1];
  }
}

//maps out the height modification and allows the GUI to modify them
class Heightmap {
  constructor(params, img) {
    this._params = params;
    this._data = graphics.GetImageData(img);
  }

  //creates getter for all of the position of pixels
  Get(x, y) {
    const _GetPixelAsFloat = (x, y) => {
      const position = (x + this._data.width * y) * 4;
      const data = this._data.data;
      return data[position] / 255.0;
    }

  // Bilinear filter
    const offset = new THREE.Vector2(-250, -250);
    const dimensions = new THREE.Vector2(500, 500);

    const xf = 1.0 - math.sat((x - offset.x) / dimensions.x);
    const yf = math.sat((y - offset.y) / dimensions.y);
    const w = this._data.width - 1;
    const h = this._data.height - 1;

    const x1 = Math.floor(xf * w);
    const y1 = Math.floor(yf * h);
    const x2 = math.clamp(x1 + 1, 0, w);
    const y2 = math.clamp(y1 + 1, 0, h);

    const xp = xf * w - x1;
    const yp = yf * h - y1;

    const p11 = _GetPixelAsFloat(x1, y1);
    const p21 = _GetPixelAsFloat(x2, y1);
    const p12 = _GetPixelAsFloat(x1, y2);
    const p22 = _GetPixelAsFloat(x2, y2);

    const px1 = math.lerp(xp, p11, p21);
    const px2 = math.lerp(xp, p12, p22);

    return math.lerp(yp, px1, px2) * this._params.height;
  }
}

//Premade Colors for the project
const _WHITE = new THREE.Color(0x808080);
const _OCEAN = new THREE.Color(0xd9d592);
const _BEACH = new THREE.Color(0xd9d592);
const _SNOW = new THREE.Color(0xFFFFFF);
const _FOREST_TROPICAL = new THREE.Color(0x4f9f0f);
const _FOREST_TEMPERATE = new THREE.Color(0x2b960e);
const _FOREST_BOREAL = new THREE.Color(0x29c100);

//class for creating terrain
class TerrainChunk {
  constructor(params) {
    this._params = params;
    this._Init(params);
  }

  //initialization of class
  _Init(params) {
    const size = new THREE.Vector3(
        params.width * params.scale, 0, params.width * params.scale);

        //initialization of plane tissue
    this._plane = new THREE.Mesh(
        new THREE.PlaneGeometry(size.x, size.z, 128, 128),
        new THREE.MeshStandardMaterial({
            wireframe: false,
            color: 0xFFFFFF,
            side: THREE.FrontSide,
            vertexColors: THREE.VertexColors,
        }));
    this._plane.position.add(params.offset);
    this._plane.castShadow = false;
    this._plane.receiveShadow = true;
    params.group.add(this._plane);

    const _colourLerp = (t, p0, p1) => {
      const c = p0.clone();

      return c.lerpHSL(p1, t);
    };
    this._colourSpline = [
      new spline.LinearSpline(_colourLerp),
      new spline.LinearSpline(_colourLerp)
    ];

    this.Rebuild();
  }

  //method for returning white color
  _ChooseColour(x, y, z) {
    return _WHITE;
  }

  //rebuilds all colors and offset after integration
  Rebuild() {
    const colours = [];
    const offset = this._params.offset;
    for (let v of this._plane.geometry.vertices) {
      const heightPairs = [];
      let normalization = 0;
      v.z = 0;
      for (let gen of this._params.heightGenerators) {
        heightPairs.push(gen.Get(v.x + offset.x, v.y + offset.y));
        normalization += heightPairs[heightPairs.length-1][1];
      }

      if (normalization > 0) {
        for (let h of heightPairs) {
          v.z += h[0] * h[1] / normalization;
        }
      }

      colours.push(this._ChooseColour(v.x + offset.x, v.z, v.y + offset.y));
    }

    for (let f of this._plane.geometry.faces) {
      const vs = [f.a, f.b, f.c];

      const vertexColours = [];
      for (let v of vs) {
        vertexColours.push(colours[v]);
      }
      f.vertexColors = vertexColours;
    }
    this._plane.geometry.elementsNeedUpdate = true;
    this._plane.geometry.verticesNeedUpdate = true;
    this._plane.geometry.computeVertexNormals();
  }
}

//generates the terrain chunks individually
class TerrainChunkManager {
  constructor(params) {
    this._chunkSize = 500;
    this._Init(params);
  }

  _Init(params) {
    this._InitNoise(params);
    this._InitBiomes(params);
    this._InitTerrain(params);
  }

  _InitNoise(params) {
    //default intiialization of tissue
    params.guiParams.noise = {
      octaves: 6,
      persistence: 0.707,
      lacunarity: 1.8,
      exponentiation: 4.5,
      height: 300.0,
      scale: 800.0,
      noiseType: 'perlin',
      seed: 1
    };

    const onNoiseChanged = () => {
      for (let k in this._chunks) {
        this._chunks[k].chunk.Rebuild();
      }
    };

    //allows gui to manage the terrain chunk
    const noiseRollup = params.gui.addFolder('Terrain Modification');
    noiseRollup.add(params.guiParams.noise, "noiseType", ['simplex', 'perlin', 'rand']).onChange(
        onNoiseChanged);
    noiseRollup.add(params.guiParams.noise, "scale", 1.0, 4096.0).onChange(
        onNoiseChanged);
    noiseRollup.add(params.guiParams.noise, "octaves", 11, 20, 1).onChange(
        onNoiseChanged);
    noiseRollup.add(params.guiParams.noise, "persistence", 0.25, 1.0).onChange(
        onNoiseChanged);
    noiseRollup.add(params.guiParams.noise, "lacunarity", 0.01, 4.0).onChange(
        onNoiseChanged);
    noiseRollup.add(params.guiParams.noise, "exponentiation", 0.1, 10.0).onChange(
        onNoiseChanged);
    noiseRollup.add(params.guiParams.noise, "height", 0, 512).onChange(
        onNoiseChanged);

    this._noise = new noise.Noise(params.guiParams.noise);
  }

  //initialize the biome parameters
  _InitBiomes(params) {
    params.guiParams.biomes = {
      octaves: 2,
      persistence: 0.5,
      lacunarity: 2.0,
      exponentiation: 3.9,
      scale: 2048.0,
      noiseType: 'perlin',
      seed: 2,
      exponentiation: 1,
      height: 1
    };

    const onNoiseChanged = () => {
      for (let k in this._chunks) {
        this._chunks[k].chunk.Rebuild();
      }
    };

    this._biomes = new noise.Noise(params.guiParams.biomes);
  }

  //initialize the terrain materials
  _InitTerrain(params) {
    params.guiParams.terrain= {
      wireframe: false,
      //color: FFFFFF
    };


    this._group = new THREE.Group()
    this._group.rotation.x = -Math.PI / 2;
    params.scene.add(this._group);

    //creation of wireframe
    const terrainRollup = params.gui.addFolder('Terrain Frame');
    terrainRollup.add(params.guiParams.terrain, "wireframe").onChange(() => {
      for (let k in this._chunks) {
        this._chunks[k].chunk._plane.material.wireframe = params.guiParams.terrain.wireframe;
      }
    });

    //tried implementing color modification
    
    /*const colorRollup = params.gui.addFolder('Color Modification');
    colorRollup.add(params.guiParams.terrain, 'color').onChange(() => {
      for (let k in this._chunks) {
        this._chunks[k].chunk._plane.color = params.guiParams.terrain.color;
      }
    });*/

    this._chunks = {};
    this._params = params;

    const w = 0;

    for (let x = -w; x <= w; x++) {
      for (let z = -w; z <= w; z++) {
        this._AddChunk(x, z);
      }
    }
  }

  _Key(x, z) {
    return x + '.' + z;
  }

  //adds the correct chunks and offsets to the project
  _AddChunk(x, z) {
    const offset = new THREE.Vector2(x * this._chunkSize, z * this._chunkSize);
    const chunk = new TerrainChunk({
      group: this._group,
      offset: new THREE.Vector3(offset.x, offset.y, 0),
      scale: 1,
      width: this._chunkSize,
      biomeGenerator: this._biomes,
      heightGenerators: [new HeightGenerator(this._noise, offset, 100000, 100000 + 1)],
    });

    const k = this._Key(x, z);
    const edges = [];
    for (let xi = -1; xi <= 1; xi++) {
      for (let zi = -1; zi <= 1; zi++) {
        if (xi == 0 || zi == 0) {
          continue;
        }
        edges.push(this._Key(x + xi, z + zi));
      }
    }

    this._chunks[k] = {
      chunk: chunk,
      edges: edges
    };
  }

  //sets the height map by calling the height generator to the chunk
  SetHeightmap(img) {
    const heightmap = new HeightGenerator(
        new Heightmap(this._params.guiParams.heightmap, img),
        new THREE.Vector2(0, 0), 250, 300);

    for (let k in this._chunks) {
      this._chunks[k].chunk._params.heightGenerators.unshift(heightmap);
      this._chunks[k].chunk.Rebuild();
    }
  }

  Update(timeInSeconds) {
  }
}

//generates the sky modification
class TerrainSky {
  constructor(params) {
    this._Init(params);
  }

  //allows modification using parameters of the sky
  _Init(params) {
    this._sky = new Sky();
    this._sky.scale.setScalar(10000);
    params.scene.add(this._sky);

    params.guiParams.sky = {
      turbidity: 10.0,
      rayleigh: 2,
      mieCoefficient: 0.005,
      mieDirectionalG: 0.8,
      luminance: 1,
    };

    //determined by inclination and azimuth of the brightness of sun and darkness of the sky
    params.guiParams.sun = {
      inclination: 0.31,
      azimuth: 0.25,
    };

    const onShaderChange = () => {
      for (let k in params.guiParams.sky) {
        this._sky.material.uniforms[k].value = params.guiParams.sky[k];
      }
      for (let k in params.guiParams.general) {
        this._sky.material.uniforms[k].value = params.guiParams.general[k];
      }
    };

    const onSunChange = () => {
      var theta = Math.PI * (params.guiParams.sun.inclination - 0.5);
      var phi = 2 * Math.PI * (params.guiParams.sun.azimuth - 0.5);

      const sunPosition = new THREE.Vector3();
      sunPosition.x = Math.cos(phi);
      sunPosition.y = Math.sin(phi) * Math.sin(theta);
      sunPosition.z = Math.sin(phi) * Math.cos(theta);

      this._sky.material.uniforms['sunPosition'].value.copy(sunPosition);
    };

    //adds gui for the user to change
    const sunRollup = params.gui.addFolder('Day & Night');
    sunRollup.add(params.guiParams.sun, "inclination", 0.0, 1.0).onChange(
        onSunChange);
    sunRollup.add(params.guiParams.sun, "azimuth", 0.0, 1.0).onChange(
        onSunChange);

    onShaderChange();
    onSunChange();
  }

  Update(timeInSeconds) {
  }
}

//intiializes everything and demos it inside the project
class ProceduralTerrain_Demo extends game.Game {
  constructor() {
    super();
  }

  _OnInitialize() {
    this._controls = this._CreateControls();
    this._CreateGUI();

    this._entities['_terrain'] = new TerrainChunkManager({
      scene: this._graphics.Scene,
      gui: this._gui,
      guiParams: this._guiParams,
    });

    this._entities['_sky'] = new TerrainSky({
      scene: this._graphics.Scene,
      gui: this._gui,
      guiParams: this._guiParams,
    });
    this._LoadBackground();
  }

  _CreateGUI() {
    this._guiParams = {
      general: {
      },
    };
    this._gui = new GUI();
    this._gui.close();
  }

  _CreateControls() {
    const controls = new OrbitControls(
        this._graphics._camera, this._graphics._threejs.domElement);
    controls.target.set(0, 50, 0);
    controls.object.position.set(475, 345, 900);
    controls.update();
    return controls;
  }

  _LoadBackground() {
  }

  _OnStep(timeInSeconds) {
  }
}


function _Main() {
  _APP = new ProceduralTerrain_Demo();
}

_Main();
