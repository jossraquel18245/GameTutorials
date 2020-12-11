let state = 'title';
let cnv;
let points = 0;
let lives = 3;
let w = 600;
let h = 600;
let player = 1;
let coins = [];
let enemies = [];
let behindimage;



//spritesheets and animations
let playerSS;
let playerJSON;
let playerAnimation = [];
let coinImg;
let enemyImg;





function preload() {
  //still images
  //poplayerImg = loadImage('assets/Basketsmall.png');
  //coinImg = loadImage('assets/Applesmall.png');

  //spritesheets
  playerSS = loadImage('assets/Basketspritesheet.png');
  playerJSON = loadJSON('assets/Basketspritesheet.json');
  behindimage = loadImage('assets/treesbackground.png');
  coinImg = loadImage('assets/AppleStill.png');
  enemyImg = loadImage('assets/BombStill.png');

}

function setup() {
  cnv = createCanvas(w, h);
  frameRate(12);


  imageMode(CENTER);
  rectMode(CENTER);

  textFont('monospace');

  //console.log(playerJSON.frames[0].frame);

  let playerFrames = playerJSON.frames;

  for (let i = 0; i < playerFrames.length; i++) {
    let pos = playerFrames[i].frame;
    let img = playerSS.get(pos.x, pos.y, pos.w, pos.h);
    playerAnimation.push(img);
    console.log(playerAnimation);
  }

  player = new Player();

  // coins[0] = new Coin();
  coins.push(new Coin());
  // enemy[0] = new Enemy();
  enemies.push(new Enemy());

}

function draw() {

  switch (state) {
    case 'title':
      title();
      cnv.mouseClicked(titleMouseClicked);
      break;
    case 'level 1':
      level1();
      cnv.mouseClicked(level1MouseClicked);
      break;
    case 'you win':
      youWin();
      cnv.mouseClicked(youWinMouseClicked);
      break;
    case 'game over':
      gameOver();
      cnv.mouseClicked(gameOverMouseClicked);
      break;
    default:
      break;


  }
}

function keyPressed() {
  if (keyCode == LEFT_ARROW) {
    player.direction = 'left'
  } else if (keyCode == RIGHT_ARROW) {
    player.direction = 'right'
  } else if (keyCode == UP_ARROW) {
    player.direction = 'up'
  } else if (keyCode == DOWN_ARROW) {
    player.direction = 'down'
  } else if (key = ' ') {
    player.direction = 'still';
  }
}

function title() {
  background(138, 171, 96);
  textSize(75);
  fill(255);
  textAlign(CENTER);
  text('Fruit Basket', w / 2, h / 5);

  textSize(30);
  text('Click Anywhere To Start!', w / 2, h / 2);
}

function titleMouseClicked() {
  console.log('canvas is Clicked on Title Page');
  state = 'level 1'
}

function level1() {
  background(9, 82, 30);
  image(behindimage, w / 2, h / 2, w, h);
  //text('Click for points', w/2, h - 30);

  if (random(1) <= 0.06) {
    coins.push(new Coin());
  }

  if (random(1) <= 0.07) {
    enemies.push(new Enemy());
  }

  player.display();
  player.move();


  //iterating through coins array to display and move them
  //using for loop
  for (let i = 0; i < coins.length; i++) {
    coins[i].display();
    coins[i].move();
  }

  //iterating through enemies array to display and move them
  for (let i = 0; i < enemies.length; i++) {
    enemies[i].display();
    enemies[i].move();
  }
  // //using forEach
  // coins.forEach(function(coin){
  //   coin.display();
  //   coin.move();
  // })

  // // using for of loop
  // for (let coin of coins){
  //   coin.display();
  //   coin.move();
  // }


  //check for collision with coins, if there is a collision increase points by 1 and splice that coin out of array
  //need to iterate backwards through array
  for (let i = coins.length - 1; i >= 0; i--) {
    if (dist(player.x, player.y, coins[i].x, coins[i].y) <= (player.r + coins[i].r) / 2) {
      points++;
      console.log(points);
      coins.splice(i, 1);
    } else if (coins[i].y > h) {
      coins.splice(i, 1);
      console.log('coin is out of town');
    }
  }



  //check for collision with enemies, if there is a collision increase points by 1 and splice that enemies out of array
  //need to iterate backwards through array this is for enemies
  for (let i = enemies.length - 1; i >= 0; i--) {
    if (dist(player.x, player.y, enemies[i].x, enemies[i].y) <= (player.r + enemies[i].r) / 2) {
      points--;
      console.log(points);
      enemies.splice(i, 1);
    } else if (enemies[i].y > h) {
      enemies.splice(i, 1);
      console.log('enemy is out of town');
    }
  }

  text(`points: ${points}`, w / 4, h - 30);

  //check point values to win or loose the game
  if (points >= 10) {
    state = 'you win';
  } else if (points <= -1) {
    state = 'game over';
  }


}

function level1MouseClicked() {
  // points += 1;
  // console.log('points =' + points);
  //
  // if (points >= 10) {
  //   state = 'YOU WIN';
  // }
}

function youWin() {
  background(255, 212, 23);
  textSize(80);
  stroke(255);
  text('YOU WIN', w / 2, h / 2);

  textSize(30);
  text('Click Anywhere To ReStart!', w / 2, h * 3 / 4);
}

function youWinMouseClicked() {
  state = 'title';
  points = 0;
}

function gameOver() {
  background(186, 0, 0);
  textSize(80);

  //check # of lives
  if (lives >= 0) {

    //displays number of lives left on the screen
    text(`lives left: ${lives}`, w / 2, h / 2);

    textSize(30);
    text('click anywhere to play again', w / 2, h * 3 / 4);
  } else {
    //Game really over
    text('Game Over', w / 2, h / 2);

    textSize(30);
    text('Click Anywhere To ReStart!', w / 2, h * 3 / 4);
  }


}

function gameOverMouseClicked() {
  if (lives >= 0) { //this means they have 0 lives going into it
    lives--; //if you have a life, you lose one!
    state = 'level 1';
  } else {
    state = 'title';
  }
  points = 0;
}
