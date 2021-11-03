// Benedikt Groß
// Example is based on examples from: http://brm.io/matter-js/, https://github.com/shiffman/p5-matter

const Engine = Matter.Engine;
const Render = Matter.Render;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Mouse = Matter.Mouse;
const MouseConstraint = Matter.MouseConstraint;

const drawBody = Helpers.drawBody;
const drawMouse = Helpers.drawMouse;

let engine;
let boxA;
let boxB;
let ball;
let ground,leftwall,rightwall,roof;
let w,h;

function setup() {
  const canvas = createCanvas(windowWidth, windowHeight);
  w=windowWidth;
  h=windowHeight;
  // create an engine
  engine = Engine.create();

  // create two boxes and a ground
  boxA = Bodies.rectangle(200, 200, 80, 80);
  boxB = Bodies.rectangle(100, 50, w-300, h-300);
  ball = Bodies.circle(100, 50, 40);
  ground = Bodies.rectangle(w/2, h-10, w, 100, {
    isStatic: true
  });
  leftwall = Bodies.rectangle(20, h/2, 100, h, {
    isStatic: true
  });
  
    rightwall = Bodies.rectangle(w-20, h/2, 100, h, {
    isStatic: true
  });
    roof = Bodies.rectangle(w/2, 10, w, 100, {
    isStatic: true
  });
  World.add(engine.world, [boxA, boxB, ball, ground,leftwall,rightwall,roof]);

  // setup mouse
  let mouse = Mouse.create(canvas.elt);
  let mouseParams = {
    mouse: mouse,
    constraint: { stiffness: 0.05, angularStiffness: 0 }
  };
  mouseConstraint = MouseConstraint.create(engine, mouseParams);
  mouseConstraint.mouse.pixelRatio = pixelDensity();
  World.add(engine.world, mouseConstraint);

  // run the engine
  Engine.run(engine);
}

function windowResized() {

  canvas = resizeCanvas(windowWidth, windowHeight);
    w=windowWidth;
  h=windowHeight;
  
    ground = Bodies.rectangle(w/2, h-10, w, 100, {
    isStatic: true
  });
  leftwall = Bodies.rectangle(20, h/2, 100, h, {
    isStatic: true
  });
  
    rightwall = Bodies.rectangle(w-20, h/2, 100, h, {
    isStatic: true
  });
    roof = Bodies.rectangle(w/2, 10, w, 100, {
    isStatic: true
  });
  
   World.add(engine.world, [ground,leftwall,rightwall,roof]);
}


function draw() {
  background(0);

  noStroke();
  fill(255);
  drawBody(boxA);
  drawBody(boxB);
  drawBody(ball);
  
  fill(128);
  drawBody(ground);
  drawBody(leftwall);
    drawBody(rightwall);
drawBody(roof);

  drawMouse(mouseConstraint);
}
