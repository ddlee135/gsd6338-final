//global variables
var particles = [];
var n = 0;
var colors = [];
var xAxis = 550;
var yAxis = 550;
var target = -1;

//for text
let font, fontsize = 15;

//for timer
var timerValue = 0;

//for the simulation start
var mode;

function preload() {
  font = loadFont('Avenir LT35-Light.ttf');
}


function setup() {
  mode = 0;
  //canvas size
  createCanvas(xAxis, yAxis + 150);

  //font setup
  textFont(font);
  textSize(fontsize);
  textAlign(LEFT);

  //timer setup
  setInterval(timeIt, 1000);

  //particle setup
  for (let h = 1; h < width / 30; h++) {
    for (let v = 1; v < (height - 150) / 30; v++) {
      let x = h * 30;
      let y = v * 30;
      let r = 10;
      let b = new Particle(x, y, r);
      particles.push(b);
    }
  }

  target = getRandomTarget(particles.length);
  // particles[target].infected = true;
  // particles[target].infectedTimer = Date.now() + 5000;
  // console.log("Person # " + target + " is contracted with unknown virus");

}


function getRandomTarget(population) {
  return (Math.random() * (population)).toFixed(0);
}


function draw() {



  //for entry sequence
  clear();
  if (mode == 0) {
    background(255);
    textAlign(CENTER);
    let intro = 'Nearly a year into the coronavirus pandemic, the official global death toll has exceeded 1.56 million with nearly 70 million confirmed cases around the globe.  Due to exponential viral spread, the delay in action was devastating. In the wake of the US response, 117,858 Americans have died in the 4 months following the first 15 confirmed local cases. Despite the continuous effort by the public health officials to prepare and deliver vaccines, 3,000 people just have lost their lives to COVID-19 on a single day this week in the United States. Had American leaders taken the early and decisive measures as our allied countries, how many of those COVID-19 cases and deaths have been prevented?'
    let instruction = 'Here, you will be testing how ones prompt and decisive action can prevent both the number of cases and deaths. CLICK on the neutral particles represented in grey color to have them immuned from the rapidly spreading contagious disease.'
    text(intro, width - (width - 80), height * 0.15, width * 0.7, height * 0.7);
    text(instruction, width - (width - 80), height * 0.6, width * 0.7, height * 0.7);
    text('Press enter to start', width / 2, height * 0.85)
  }

  if (mode == 1) {

    //background color
    background(255);

    //text
    textAlign(LEFT, CENTER);
    drawWords(width * 0.02);
    
    let infectedCount = 0, 
        deceasedCount = 0, 
        neutralCount = 0,
        vaccinatedCount = 0;
    
    //Start of the contagion
    
    particles[target].infected = true;
  particles[target].infectedTimer = Date.now() + 5000;
  //console.log("Person # " + target + " is contracted with unknown virus");
    
    
    
    //overall particles
    for (var i = 0; i < particles.length; i++) {
      particles[i].show();

      //Action for infected particles
      if (particles[i].infected) {
        infectedCount++;

        //infection color display
        particles[i].changeColor(200, 10, 10, 90);
        particles[i].move(3.5);

        let iw = map(i, 0, i, 5, width/i);
        fill(225, 50, 50, 90);
        // rect(100, height - 75, iw, 10);

        //notification for infected particle
        //console.log("Person #" + i + " is infected" );


        //recovering particles
        if (Date.now() > particles[i].infectedTimer) {
          particles[i].changeColor(0);
          particles[i].infected = false;
          particles[i].infectedTimer = 0;

          //deceased particles
          let probability = 0.10;
          let r = random(0, 1);
          if (r < probability) {
            particles[i].dead = true;
            console.log("Person #" + i + " just DIED");
            
          }
        }
      }

      //Action for vaccinated particles
      else if (particles[i].vaccinated) {
        vaccinatedCount++;
        particles[i].changeColor(125, 200, 245, 90);
      }
      else
        {
          neutralCount++;
        }

      //when you hover over a particle for an action
      if (particles[i].contains(mouseX, mouseY)) {
        particles[i].changeColor(20, 200, 20, 90);
      }

      //movement changes in dead particle
      if (particles[i].dead == true) {
        particles[i].changeColor(50, 50, 50);
        particles[i].move(0);
        deceasedCount++;

      } else if (particles[i].dead == false) {
        particles[i].move(2);
      }

      //spread of infection & duration
      for (let other of particles) {
        if (particles[i] !== other && particles[i].intersect(other) && particles[i].infected) {
          if (!other.vaccinated && !other.dead) {
            other.infected = true;
            other.infectedTimer = Date.now() + 3500;
          }
        }
      }
    }

    //neutral statistics
    // var n = (particles[i]);
    let nw = map(neutralCount, 0, particles.length, 0, width * 0.75);
    fill(200);
    rect(100, height - 100, nw, 10);

    //infected statistics
    let iw = map(infectedCount, 0, particles.length, 0, width * 0.75);
    fill(225, 50, 50, 90);
    rect(100, height - 75, iw, 10);


    //deceased statistics
    let vw = map(deceasedCount, 0, particles.length, 0, width * 0.75);
    fill(50);
    rect(100, height - 50, vw, 10);

    //vaccinated statistics
    let dw = map(vaccinatedCount, 0, particles.length, 0, width * 0.75);
    fill(155, 200, 215, 90);
    rect(100, height - 25, dw, 10);


    //timer constraints & actions
    if (timerValue >= 1) {
      fill(0)
      textAlign(RIGHT);
      text("Day " + timerValue, width*0.98, height - 120);
    }

    if (timerValue <= 2) {
      fill(0)
      textAlign(CENTER);
      text('This is how it begins', width / 2, (height / 2) - 50);
    }
  }
}
//end of draw function

function mousePressed() {

  for (let p = 0; p < particles.length; p++) {

    if (particles[p].contains(mouseX, mouseY)) {

      // You can only vaccinate someone healthy
      if (!particles[p].infected && !particles[p].dead) {
        console.log("Person #" + p + " is vaccinated");
        particles[p].vaccinated = true;
      } else {
        console.log("You cannot vaccinate infected!")
      }
    }
  }
}

function keyPressed() {
  if (keyCode === ENTER) {
    mode = 1;
  }
}


function drawWords(x) {

  fill(0);
  text('Statistics', x, height - 120);

  fill(75);
  text('Neutral', x, height - 95);
  text('Infected', x, height - 70);
  text('Deceased', x, height - 45);
  text('Vaccinated', x, height - 20);
}

function timeIt() {
  if (mode == 1) {
    if (timerValue >= 0) {
      timerValue++;
    }
  }
}




class Particle {

  constructor(x, y, r) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.brightness = 0;
    this.infected = false;
    this.infectedTimer = 0;
    this.vaccinated = false;
    this.dead = false;

  }

  //change particle color
  changeColor(r, g, b, op) {
    fill(r, g, b, op);
    noStroke();
    ellipse(this.x, this.y, this.r * 2, this.r * 2);
  }

  //oscillate particles
  move(n) {
    // Ensure population stays within the boundary set by the x, y axis & ocillation criteria
    this.x = Math.max(0, Math.min(xAxis, this.x += random(-n, n)));
    this.y = Math.max(0, Math.min(yAxis, this.y += random(-n, n)));
  }

  //Response when particles intersect
  intersect(other) {
    let d = dist(this.x, this.y, other.x, other.y);
    return (d < this.r + other.r);
  }

  //for mouse hovering response
  contains(px, py) {
    let d = dist(px, py, this.x, this.y);
    if (d < this.r) {
      return true;
    } else {
      return false;
    }
  }

  //show particles
  show() {
    stroke(220);
    strokeWeight(1);
    noStroke();
    var col = {
      r: 0,
      g: 0,
      b: 0
    }
    col.r = random(100, 100);
    col.g = random(100, 100);
    col.b = random(100, 100);
    fill(col.r, col.g, col.b, 20);
    ellipse(this.x, this.y, this.r * 2);
  }

}
