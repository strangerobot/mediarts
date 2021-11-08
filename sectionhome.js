//Bug fixes and optimisation
// https://www.py4u.net/discuss/335084
//feature to add https://b-g.github.io/p5-matter-examples/12-attractor/

//sketch for HOME PAGE
//detectmobile device
var detector = new MobileDetect(window.navigator.userAgent);
var mobile = false;

//matterjs setup
Matter.use('matter-attractors');
const Engine = Matter.Engine;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Body = Matter.Body;
const Events = Matter.Events;
const Composite = Matter.Composite;
const Mouse = Matter.Mouse;
const MouseConstraint = Matter.MouseConstraint;
const Constraint = Matter.Constraint;
const Runner = Matter.Runner;
const Composites = Matter.Composites;

const drawBodies = Helpers.drawBodies;

const drawBody = Helpers.drawBody;
const drawMouse = Helpers.drawMouse;
const drawSprites = Helpers.drawSprites;

var dragBody = null;
let attractor;
let boxes;

var runner = Runner.create({
  isFixed: false,
  //simulation refreshrate
  //delta: 1000 / 240
});

//// engine is the simulation
let engine, world, mconst, mousebox, mouse;
let bounds;
let mX, mY;
let cursorimg, usercursorimg;

var colors = ["#FFC47F", "#C3A0FF", "#FFBBAD", "#F5B6ED", "#F0FFAE"], currentcolor = 2;
var wallcollider = 0x0001,
  mousecollider = 0x0002,
  othercollider = 0x0004;
//objects

//width and height
let w, h;

function setup() {
  //setting canvas size
  const canvas = createCanvas(windowWidth, windowHeight);
  canvas.position(0, 0);
  canvas.id('sketch');
  w = windowWidth;
  h = windowHeight;
  // frameRate(120);
  // create an engine
  engine = Engine.create();
  world = engine.world;
  currentcolor = Math.floor(Math.random() * colors.length);

  cursorimg = loadImage('cursor.png');
  usercursorimg = loadImage('cursor_main.png');
  pixelDensity(1);


  // Populate objects and start simulation
  enginesetup();
}

function mobilechecker() {

  if (navigator.userAgent.match(/Android/i)
    || navigator.userAgent.match(/webOS/i)
    || navigator.userAgent.match(/iPhone/i)
    || navigator.userAgent.match(/iPad/i)
    || navigator.userAgent.match(/iPod/i)
    || navigator.userAgent.match(/BlackBerry/i)
    || navigator.userAgent.match(/Windows Phone/i))
    mobile = true;

}

function windowResized() {
  //redraw the canvas;
  if (!mobile) {
    resizeCanvas(windowWidth, windowHeight);
    w = windowWidth;
    h = windowHeight;
    currentcolor = Math.floor(Math.random() * colors.length);
    //reset engine
    enginesetup();
    pixelDensity(1);
  }
}

function draw() {
  clear();
  background(0, 0);
  fill(0);

  //updatemouse();
  //fill(255,0,0);

  noStroke();
  fill(255, 170);


  updatemouse();
  //physics from matterjs
  drawBody(bounds);
  //vertex drawing of bounds in p5
  beginShape();
  for (var j = 0; j < 8; j++)
    vertex(bounds.vertices[j].x, bounds.vertices[j].y);
  endShape(CLOSE);
  


  stroke(255, 200);
  drawSprites(boxes.bodies, cursorimg);
  // drawBodies(boxes.bodies);

  //drawSprite(attractor,usercursorimg),
  console.log(bounds.force.x);
  fill(0,255);
  drawBody(titlebox);
  fill(255, 200);
  stroke(0, 200);
  strokeWeight(0.5);
  drawBody(text1box);
  drawBody(text2box);


  noStroke();
  fill(255, 255);
  drawBody(attractor);
}
//console.log(mousebox);

function mousePressed() {
  currentcolor = Math.floor(Math.random() * colors.length);

}


function enginesetup() {
  //resets the world and engine

  World.clear(world);
  Engine.clear(engine);

  //adds the bodies
  setbodies();

  //runs the engine
  engine.world.gravity.scale = 0;
  Runner.run(runner, engine);
}

//adds bodies to the world
function setbodies() {
  //objects

  //bounds

  bottom = Bodies.rectangle((w / 2)+64, h, w-128, 2, { isStatic: true });
  left = Bodies.rectangle(2+64, h / 2, 2, h, { isStatic: true });
  right = Bodies.rectangle(w - 2, h / 2, 2, h, { isStatic: true });
  roof = Bodies.rectangle((w / 2)+64, 0, w-128, 2, { isStatic: true });

  //make a compound object

  parts = [];
  pad = 0.04 * w;
  parts.push(
    Bodies.rectangle((w / 2)+64, h - pad, w- 128- pad * 2, 1, { isStatic: false }),
    Bodies.rectangle(pad+64, h / 2, 1, h - pad * 2, { isStatic: false }),
    Bodies.rectangle(w- pad, h / 2, 1, h - pad * 2, { isStatic: false }),
    Bodies.rectangle((w / 2)+64, pad, w - 128- pad * 2, 1, { isStatic: false })
  );


  //1000001 is a hack to not attract
  bounds = Body.create({
    parts, frictionAir: 0.02, friction: 0.1, mass: 300, inertia: 100000, isStatic: false, collisionFilter: {
      category: wallcollider
    }
  });
  //boundsconstraints

  boundsconst1 = Constraint.create({
    bodyA: bounds,
    pointB: { x: w / 2, y: h / 2 },
    length: 0,
    stiffness: 0.0001,
    damping: 0.005
  });



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
  //mconst = MouseConstraint.create(engine, options);
  mX = 100;
  mY = 100;





  // World.add(world, [mconst]);

  attractor = Bodies.circle(400, 400, 50, {
    isStatic: false, mass: 90, friction: 0.2, collisionFilter: {
      category: mousecollider,
      mask: mousecollider | othercollider
    },
    plugin: {
      attractors: [
        function (bodyA, bodyB) {
          var force = {
            x: (bodyA.position.x - bodyB.position.x) * 1.5e-7 + random(-5, 5) * 1.5e-4,
            y: (bodyA.position.y - bodyB.position.y) * 1.5e-7 + + random(-5, 5) * 1.5e-4,
          };

          // apply force to both bodies
          Body.applyForce(bodyA, bodyA.position, Matter.Vector.neg(force));
          Body.applyForce(bodyB, bodyB.position, force);
        }
      ]
    }
  });
  World.add(engine.world, attractor);

  // add boxes
  // xx, yy, columns, rows, columnGap, rowGap
  if (mobile)
    cursornumber = 10;
  else
    cursornumber = 3;

  boxes = Composites.stack(width / 2, height / 2, cursornumber, cursornumber, width / 100, height / 100, function (x, y) {
    var rand = random(0.6, 2);
    return Bodies.rectangle(x, y, 15, 25, {
      mass: 0.5, restitution: 0.1, frictionAir: 0.01, friction: 0.2, collisionFilter: {
        category: othercollider
      }
    });
  });
  World.add(engine.world, boxes);


  //add other boxes
  ///title box, gets the center value titlepos.top+titlepos.bottom)/2
  titlepos = getdivbox("title0").rect;

  titlebox = Bodies.rectangle((titlepos.left + titlepos.right) / 2, (titlepos.top + titlepos.bottom) / 2, titlepos.width * 1.15, titlepos.height * 1.4, {
    
    frictionAir: 0.02, friction: 0.1, mass: 30, inertia: 100000, isStatic: false, collisionFilter: {
      category: wallcollider
    } });

  titleconst = Constraint.create({
    bodyA: titlebox,
    pointB: { x: (titlepos.left + titlepos.right) / 2, y: (titlepos.top + titlepos.bottom) / 2 },
    length: 3,
    stiffness: 0.001,
    damping: 0.05
  });
  World.add(engine.world, [titlebox, titleconst]);

  ///textboxes

  text1pos = getdivbox("text1").rect;
  console.log(text1pos);

  text1box = Bodies.rectangle((text1pos.left +text1pos.right) / 2, (text1pos.top + text1pos.bottom) / 2, text1pos.width * 1.1, text1pos.height * 1.3, {
    
    frictionAir: 0.02, friction: 0.1, mass: 30000, inertia: 1000000, isStatic: false, collisionFilter: {
      category: wallcollider
    } });

    text1const = Constraint.create({
    bodyA: text1box,
    pointB: { x: (text1pos.left + text1pos.right) / 2, y: (text1pos.top + text1pos.bottom) / 2 },
    length: 0,
    stiffness: 0.001,
    damping: 0.05
  });
  World.add(engine.world, [text1box, text1const]);

  //box 2

  
  text2pos = getdivbox("text2").rect;
  console.log(text2pos);

  text2box = Bodies.rectangle((text2pos.left +text2pos.right) / 2, (text2pos.top + text2pos.bottom) / 2, text2pos.width*1.1 , text2pos.height * 1.2, {
    
    frictionAir: 0.02, friction:0, mass: 3000, inertia: 1000000, isStatic: false, collisionFilter: {
      category: wallcollider
    } });

    text2const = Constraint.create({
    bodyA: text2box,
    pointB: { x: (text2pos.left + text2pos.right) / 2, y: (text2pos.top + text2pos.bottom) / 2 },
    length: 0,
    stiffness: 0.01,
    damping: 0.05
  });
  World.add(engine.world, [text2box, text2const]);
  


}

function updatemouse() {
  // smoothly move the attractor body towards the mouse
  Body.translate(attractor, {
    x: (mouseX - attractor.position.x) * 0.15,
    y: (mouseY - attractor.position.y) * 0.15
  });
}

//optimisation

Matter.Events.on(engine, "beforeUpdate", function (event) {
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

Matter.Events.on(mouseConstraint, "startdrag", function (event) {
  dragBody = event.body;
});



function getdivbox(text) {

  var element = document.getElementById(text);
  //console.log(element);
  rect = element.getBoundingClientRect();
  //console.log(rect.left, rect.top, rect.right, rect.bottom);

  return { rect };
}