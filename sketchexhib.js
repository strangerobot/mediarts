//Bug fixes and optimisation
// https://www.py4u.net/discuss/335084
//feature to add https://b-g.github.io/p5-matter-examples/12-attractor/

//matterjs setup
const Engine = Matter.Engine;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Body = Matter.Body;
const Events = Matter.Events;
const Composite = Matter.Composite;
const Mouse = Matter.Mouse;
const MouseConstraint = Matter.MouseConstraint;
const Constraint =Matter.Constraint;
const Runner = Matter.Runner;

const drawBody = Helpers.drawBody;
const drawMouse = Helpers.drawMouse;

var dragBody = null;

var runner = Runner.create({
  isFixed: true,
  //simulation refreshrate
  delta: 1000 / 120
});

//// engine is the simulation
let engine, world, mconst, mousebox, mouse;
let bounds;
let mX, mY;

//objects

//width and height
let w, h;

function setup() {
  //setting canvas size
  const canvas = createCanvas(windowWidth, windowHeight);
  canvas.position(0,0);
  canvas.id('sketch');
  w = windowWidth;
  h = windowHeight;
  frameRate(120);
  // create an engine
  engine = Engine.create();
  world = engine.world;

//calculate div positions
  getdivbox();

  // Populate objects and start simulation
  enginesetup();
}

function windowResized() {
  //redraw the canvas;
  resizeCanvas(windowWidth, windowHeight);
  w = windowWidth;
  h = windowHeight;

  //reset engine
    getdivbox();
    enginesetup();
}

function draw() {
  background(255);
  fill(0);
  noStroke();
  fill(255, 0, 0);
  drawBody(boxA);
  //updatemouse();
  fill(0);
  drawBody(bounds);
  fill(255, 255, 0);
  drawBody(mousebox);

  //console.log(mousebox);
  var element=document.getElementById("test");
  //console.log(element);
  rect = element.getBoundingClientRect();
  //console.log(rect.top, rect.left, rect.right, rect.bottom);
  rectwidth=rect.right-rect.left;
  rectheight=rect.bottom-rect.top;
  //console.log(mousebox);
}

function enginesetup() {
  //resets the world and engine

  World.clear(world);
  Engine.clear(engine);

  //adds the bodies
  setbodies();

  //runs the engine
  engine.world.gravity.y = 0;
  Runner.run(runner, engine);
}

//adds bodies to the world
function setbodies() {
  //objects
  var boxoption = {
    angle: 0.2,
    friction: 0.01,
    frictionStatic: 10,
    frictionAir: 0.01,
    mass: 10
  };

  var mouseoption = {
    friction: 0.01,
    frictionAir: 0.01,
    mass: 4
  };

  // boxA = Bodies.rectangle(w / 2, h / 2, w - w / 2, h - h / 2, boxoption);
  boxA = Bodies.circle(w / 2, h / 2, w / 5, boxoption);
  mousebox = Bodies.rectangle(100, 100, 150, 150, mouseoption);
  World.add(world, [boxA]);

  //bounds

  bottom = Bodies.rectangle(w / 2, h, w, 2, { isStatic: true });
  left = Bodies.rectangle(2, h / 2, 2, h, { isStatic: true });
  right = Bodies.rectangle(w - 2, h / 2, 2, h, { isStatic: true });
  roof = Bodies.rectangle(w / 2, 0, w, 2, { isStatic: true });

  //make a compound object

  parts = [];
  // parts.push(
  //   Bodies.rectangle(w / 2, h - 50, w - 100, 1, { isStatic: false }),
  //   Bodies.rectangle(50, h / 2, 1, h - 100, { isStatic: false }),
  //   Bodies.rectangle(w - 50, h / 2, 1, h - 100, { isStatic: false }),
  //   Bodies.rectangle(w / 2, 50, w - 100, 1, { isStatic: false })
  // );

  parts.push(
    Bodies.rectangle(rect.left+(rectwidth/2), rect.top, rectwidth, 1, { isStatic: false }),
    Bodies.rectangle(rect.left+(rectwidth/2), rect.bottom, rectwidth, 1, { isStatic: false }),
    Bodies.rectangle(rect.left, rect.top+(rectheight/2), 1, rectheight, { isStatic: false }),
    Bodies.rectangle(rect.right,rect.top+(rectheight/2), 1,rectheight, { isStatic: false })
  );


  bounds = Body.create({ parts, frictionAir:0.1 ,mass: 1000000, inertia:50000 , isStatic: false, angle: 2 });
  //boundsconstraints

  boundsconst1= Constraint.create({
    bodyA: bounds,
    pointB: { x: rect.left+(rectwidth/2), y:rect.top+(rectheight/2) },
    length: 0,
    stiffness:0.02,
    damping:0.2
  });

  console.log(bounds);

  World.add(world, [bounds, boundsconst1]);
  World.add(world, [bottom, left, right, roof]);

  //mouse

  mouse = Mouse.create(canvas.elt);
  var options = {
    mouse: mouse,
    constraint: {
      stiffness: 0.002,
      damping: 0.1
    }
  };
  mconst = MouseConstraint.create(engine, options);
  mX = 100;
  mY = 100;

  World.add(world, [mousebox, mconst]);
}

function updatemouse() {
  mX = lerp(mX, mouse.position.x, 0.2);
  mY = lerp(mY, mouse.position.y, 0.2);
  Body.setPosition(mousebox, {
    x: mX,
    y: mY
  });
}

function getdivbox()
{

  var element=document.getElementById("test");
  //console.log(element);
  rect = element.getBoundingClientRect();
  //console.log(rect.top, rect.left, rect.right, rect.bottom);
  rectwidth=rect.right-rect.left;
  rectheight=rect.bottom-rect.top;
}

//optimisation

Matter.Events.on(engine, "beforeUpdate", function(event) {
  counter += 0.014;
  if (counter < 0) {
    return;
  }
  var px = 400 + 100 * Math.sin(counter);
  Matter.Body.setVelocity(body, { x: px - body.position.x, y: 0 });
  Matter.Body.setPosition(body, { x: px, y: body.position.y });
  if (dragBody != null) {
    if (dragBody.velocity.x > 12.0) {
      Matter.Body.setVelocity(dragBody, { x: 12, y: dragBody.velocity.y });
    }
    if (dragBody.velocity.y > 12.0) {
      Matter.Body.setVelocity(dragBody, { x: dragBody.velocity.x, y: 12 });
    }
    if (dragBody.positionImpulse.x > 12.0) {
      dragBody.positionImpulse.x = 12.0;
    }
    if (dragBody.positionImpulse.y > 12.0) {
      dragBody.positionImpulse.y = 12.0;
    }
  }
});

Matter.Events.on(mouseConstraint, "startdrag", function(event) {
  dragBody = event.body;
});
