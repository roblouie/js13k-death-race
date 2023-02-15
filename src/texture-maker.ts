import { textureLoader } from '@/engine/renderer/texture-loader';
import { Material } from '@/engine/renderer/material';
import { doTimes } from '@/engine/helpers';
import { toImage } from '@/engine/svg-maker/converters';
import { noiseImageReplacement } from '@/engine/new-new-noise';
import { NewNoiseType } from '@/engine/svg-maker/filters';

const resolution = 128;

const canvas = new OffscreenCanvas(128, 128);
const drawContext = canvas.getContext('2d')!;

// *********************
// Dirt Path
// *********************
export async function drawDirtPath() {
  return toImage(noiseImageReplacement(128, 33, 1 / 16, 4, NewNoiseType.Fractal, '#525200', '#804b10', 1));
}

// *********************
// Grass
// *********************
async function drawGrass() {
  const earthGrassBuilder = noiseImageReplacement(128, 12, 1 / 32, 3, NewNoiseType.Fractal, '#007002', '#009303', 1);
  const earthGrass = await toImage(earthGrassBuilder);

  const purgatoryPlantsBuilder = noiseImageReplacement(128, 12, 1 / 32, 3, NewNoiseType.Fractal, '#45835a', '#66b47f', 1);
  const purgatoryPlants = await toImage(purgatoryPlantsBuilder);

  return { earthGrass, purgatoryPlants };
}

// *********************
// Water
// *********************
export async function drawWater() {
  const waterBuilder = noiseImageReplacement(128, 12, 1 / 64, 1, NewNoiseType.Turbulence, '#030eaf', '#3264ff', 1);
  const water = await toImage(waterBuilder);

  const lakeTexture = textureLoader.load_(water);
  lakeTexture.textureRepeat.set(6, 6);

  return new Material({texture: lakeTexture, isTransparent: true, color: '#fffc'});
}

// *********************
// Rocks
// *********************
export async function drawRocks() {
  const earthRocksBuilder = noiseImageReplacement(128, 23, 1 / 64, 2, NewNoiseType.Turbulence, '#929292', '#82826e', 1);
  const earthRocks = await toImage(earthRocksBuilder);

  const underworldRocksBuilder = noiseImageReplacement(128, 23, 1 / 64, 2, NewNoiseType.Turbulence, '#3f4d62', '#82826e', 1);
  const underworldRocks = await toImage(underworldRocksBuilder);

  drawContext.drawImage(underworldRocks, 0, 0);
  drawContext.globalCompositeOperation = 'source-over';
  drawContext.fillStyle = '#333';
  drawContext.scale(1, -0.7);
  drawContext.textAlign = 'center';
  drawContext.font = '70px Times New Roman';
  drawContext.fillText('RIP', 64, -40);
  const tombstoneFront = mainImageData();

  const purgatoryRocksBuilder = noiseImageReplacement(128, 23, 1 / 64, 2, NewNoiseType.Turbulence, '#833700', '#4d1d00', 1);
  const purgatoryRocks = await toImage(purgatoryRocksBuilder);

  const purgatoryFloorBuilder = noiseImageReplacement(128, 23, 1 / 64, 2, NewNoiseType.Turbulence, '#4d1d00', '#833700', 1);
  const purgatoryFloor = await toImage(purgatoryFloorBuilder);

  return { earthRocks, underworldRocks, purgatoryRocks, purgatoryFloor, tombstoneFront };
}

// *********************
// Tree Barks
// *********************
export async function drawTreeBarks() {
  const earthBark = await toImage(noiseImageReplacement(128, 33, 1 / 64, 2, NewNoiseType.Turbulence, '#933d02', '#4d1d00', 1));
  const purgatoryBark = await toImage(noiseImageReplacement(128, 33, 1 / 64, 2, NewNoiseType.Turbulence, '#320600', '#4d1d00', 1));
  const underworldBark = await toImage(noiseImageReplacement(128, 33, 1 / 64, 2, NewNoiseType.Turbulence, '#9a9a9a', '#4d1d00', 1));

  return { earthBark, underworldBark, purgatoryBark };
}


export const truckColor = '#333';

// *********************
// Truck Cab Top
// *********************
export function drawTruckCabTop() {
  clearWith(truckColor);
  drawContext.fillStyle = 'black';
  drawContext.fillRect(10, 55, 108, 20);
  drawContext.textAlign = 'center';
  drawContext.font = '35px sans-serif';
  drawContext.fillText('💀', 64, 115);
  return mainImageData();
}

// *********************
// Truck Cab Front
// *********************
export function drawTruckCabFront() {
  clearWith(truckColor);
  drawContext.fillStyle = 'black';
  drawContext.textAlign = 'center';
  drawContext.font = '35px sans-serif';
  drawContext.save();
  drawContext.scale(0.6, 1);
  drawContext.fillText('⚪', 32, 105);
  drawContext.fillText('⚪', 180, 105);
  drawContext.restore();

  doTimes(5, index => {
    drawContext.fillRect(42 + index * 10, 10, 5, 60);
  });
  return mainImageData();
}

// *********************
// Truck Cab Side
// *********************
export function drawTruckCabSide(isRight: boolean) {
  clearWith(truckColor);
  drawContext.textAlign = 'center';
  drawContext.font = '45px sans-serif';
  drawContext.save();
  drawContext.scale(0.6, -1);
  drawContext.fillText('🦴', isRight ? 52 : 152, -40);
  drawContext.scale(-1, 1);
  drawContext.fillText('🦴', isRight ? -52 : -152, -40);
  drawContext.restore();
  return mainImageData();
}


// *********************
// Truck Cab Rear
// *********************
export function drawTruckCabRear() {
  clearWith(truckColor);
  return mainImageData();
}


// *********************
// Underworld Path
// *********************
export function drawUnderworldPath() {
  return toImage(noiseImageReplacement(128, 8, 0.03, 1, NewNoiseType.Turbulence, '#009b1a', '#0e3454', 3));
}


function drawUnderworldGround() {
  return toImage(noiseImageReplacement(128, 8, 0.03, 1, NewNoiseType.Turbulence, '#000522', '#0e3454', 3));
}

export async function newDrawSky(fromColor: string, toColor: string, seed: number, frequency: number | [number, number], octals: number, colorScale = 1) {
  const sidesOfSkybox = [];
  const image = await toImage(noiseImageReplacement(256, seed, frequency, octals, NewNoiseType.Fractal, fromColor, toColor, colorScale));
  for (let i = 0; i < 6; i++) {
    sidesOfSkybox.push(image);
  }

  return sidesOfSkybox;
}


// *********************
// Drop Off Point
// *********************
function drawDropoff() {
  return toImage(noiseImageReplacement(128, 100, 1 / 32, 2, NewNoiseType.Fractal, '#0000', '#fff', 1));
}


// *********************
// Underworld Water
// *********************
function drawUnderworldWater() {
  return toImage(noiseImageReplacement(128, 10, 1/64, 1, NewNoiseType.Turbulence, '#90ca6c', '#2d9f52', 1));
}

export const materials: {[key: string]: Material} = {};
export const skyboxes: {[key: string]: TexImageSource[]} = {};

export async function populateSkyboxes() {
  skyboxes.earthSky = await newDrawSky('#fff', '#00f',9, 0.01, 5, 1.8);
  skyboxes.purgatorySky = await newDrawSky('#c1597e', '#e8671c', 100,1/128, 1, 2);
  skyboxes.underworldSky = await newDrawSky('#180625', '#3c1163', 100, 1/128, 6, 1);
}

export async function populateMaterials() {
  const dirtPath = new Material({texture: textureLoader.load_(await drawDirtPath())})
  dirtPath.texture?.textureRepeat.set(16, 16);
  materials.dirtPath = dirtPath;

  const { earthGrass, purgatoryPlants } = await drawGrass();
  const floorTexture = textureLoader.load_(earthGrass);
  floorTexture.textureRepeat.x = 12; floorTexture.textureRepeat.y = 12;
  materials.grass = new Material({texture: floorTexture});

  materials.purgatoryGrass = new Material({texture: textureLoader.load_(purgatoryPlants) });
  materials.purgatoryGrass.color = [1.0, 0.8, 0.8, 1.0];

  const treeTexture = textureLoader.load_(earthGrass);
  treeTexture.textureRepeat.set(2, 2);
  materials.treeLeaves = new Material({texture: treeTexture });


  materials.lake = await drawWater();

  materials.tire = new Material({ color: '#000'});
  materials.wheel = new Material({ color: '#888'});

  const underworldPathTexture = textureLoader.load_(await drawUnderworldPath());
  underworldPathTexture.textureRepeat.x = 60; underworldPathTexture.textureRepeat.y = 60;
  materials.underworldPath = new Material({texture: underworldPathTexture});

  const underworldGroundTexture = textureLoader.load_(await drawUnderworldGround());
  underworldGroundTexture.textureRepeat.x = 60; underworldGroundTexture.textureRepeat.y = 60;
  materials.underworldGround = new Material({texture: underworldGroundTexture});

  const { earthRocks, underworldRocks, purgatoryRocks, purgatoryFloor, tombstoneFront } = await drawRocks();
  materials.underworldRocks = new Material({texture: textureLoader.load_(underworldRocks)});
  materials.marble = new Material({texture: textureLoader.load_(earthRocks)});
  materials.purgatoryRocks = new Material({texture: textureLoader.load_(purgatoryRocks)});
  materials.purgatoryFloor = new Material({texture: textureLoader.load_(purgatoryFloor)});
  materials.purgatoryFloor.texture?.textureRepeat.set(12, 12);

  materials.tombstoneFront = new Material({texture: textureLoader.load_(tombstoneFront)});

  materials.chassis = new Material({color: truckColor});
  materials.truckCabTop = new Material({texture: textureLoader.load_(drawTruckCabTop())});
  materials.truckCabFront = new Material({texture: textureLoader.load_(drawTruckCabFront())});
  materials.truckCabRightSide = new Material({texture: textureLoader.load_(drawTruckCabSide(true))});
  materials.truckCabLeftSide = new Material({texture: textureLoader.load_(drawTruckCabSide(false))});
  materials.truckCabRear = new Material({texture: textureLoader.load_(drawTruckCabRear())});


  const { underworldBark, earthBark, purgatoryBark } = await drawTreeBarks();
  materials.underworldBark = new Material({texture: textureLoader.load_(underworldBark)});
  materials.purgatoryBark = new Material({texture: textureLoader.load_(purgatoryBark)});
  materials.wood = new Material({texture: textureLoader.load_(earthBark)});

  materials.dropOff = new Material({texture: textureLoader.load_(await drawDropoff())});

  materials.spiritMaterial = new Material({ texture: materials.marble.texture, color: '#fff9', isTransparent: true });
  materials.spiritMaterial.emissive = [1.4, 1.4, 1.4, 1.0];

  const underworldWaterTexture = textureLoader.load_(await drawUnderworldWater());
  underworldWaterTexture.textureRepeat.x = 10; underworldWaterTexture.textureRepeat.y = 10;
  materials.underworldWater = new Material({texture: underworldWaterTexture, isTransparent: true, color: '#fffc'});

  materials.underworldGrassMaterial = new Material({isTransparent: true, color: '#00D9FFBA'});

  textureLoader.bindTextures();
}

function mainImageData() {
  return drawContext.getImageData(0, 0, resolution, resolution);
}

function clearWith(color: string) {
  drawContext.resetTransform();
  drawContext.clearRect(0, 0, resolution, resolution);
  drawContext.globalCompositeOperation = 'source-over';
  drawContext.filter = 'none';
  drawContext.fillStyle = color;
  drawContext.fillRect(0, 0, resolution, resolution);
}
