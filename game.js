/*

  A platformer game made by Leander Christensen powered by Crafty.js
  Version: ALPHA

*/

//Initilize variables
var height = 600;
var width = 1000;
var cheat = false;
var canMove = true;
var highScore = 0;
var maxScore = 100000; //Max possible score
var lives = 3;
var score = 0;
var level = 1;
var savedScore = 0;
var firstTime;
var player;
var livesText;
var scoreText;
var border;
var noRepeat;
var userLevel;
var userScore;
var moveRight;

function getCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for(var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

//Load audio
var deathSound = new Audio('audio/Tech-11.wav');

//Load user progress
if (document.cookie.length > 0) {
  if (document.cookie.indexOf("level") > -1 && document.cookie.indexOf("score") > -1) {
    if (Number(getCookie("level")) > 1) {
      console.log("User save data detected!");
      userLevel = Number(getCookie("level"));
      userScore = Number(getCookie("score"));
      userLives = Number(getCookie("lives"));
      console.log("Saved level: " + userLevel);
      console.log("Saved score: " + userScore);
      console.log("Saved lives: " + userLives);

    }
  }
  if (document.cookie.indexOf("highScore") > -1) {
    if (Number(getCookie("highScore")) > 0) {
      highScore = Number(getCookie("highScore"));
      console.log("Saved high score: " + highScore);
    }
  }
}

//Main menu
Crafty.defineScene("menu", function() {
  Crafty.background("#161616");
  if (userLevel > 1) {
    Crafty.e("HTML, Mouse")
      .attr({ w: 700, h: 83, x: 325, y: 90 })
      .append("<h1 id='title'>Platformer Game <span id='beta'> BETA</span></h1>");
    Crafty.e("HTML, Mouse")
      .attr({ w: 300, h: 83, x: 350, y: 200 })
      .append("<button class='menubutton' id='continuebutton'>CONTINUE</button>")
      .bind('Click', function(MouseEvent){
        level = userLevel;
        score = userScore;
        lives = userLives;
        Crafty.enterScene("intro");
      });
      Crafty.e("HTML, Mouse")
      .attr({ w: 300, h: 83, x: 350, y: 300 })
      .append("<button class='menubutton' id='newgamebutton'>NEW GAME</button>")
      .bind('Click', function(MouseEvent){
        level = 1;
        score = 0;
        Crafty.enterScene("intro");
      });
      Crafty.e("HTML, Mouse")
      .attr({ w: 300, h: 83, x: 350, y: 400 })
      .append("<button class='menubutton' id='aboutbutton'>ABOUT</button>")
      .bind('Click', function(MouseEvent){
        Crafty.enterScene("about");
      });
  } else {
    Crafty.e("HTML, Mouse")
      .attr({ w: 700, h: 83, x: 325, y: 125 })
      .append("<h1 id='title'>Platformer Game <span id='beta'> BETA</span></h1>");
    Crafty.e("HTML, Mouse")
      .attr({ w: 300, h: 83, x: 350, y: 250 })
      .append("<button class='menubutton' id='playbutton'>PLAY</button>")
      .bind('Click', function(MouseEvent){
        Crafty.enterScene("intro");
      });
    Crafty.e("HTML, Mouse")
      .attr({ w: 300, h: 83, x: 350, y: 350 })
      .append("<button class='menubutton' id='aboutbutton'>ABOUT</button>")
      .bind('Click', function(MouseEvent){
        Crafty.enterScene("about");
      });
  }
  Crafty.e("2D, DOM, Text, Mouse")
    .attr({ w: 500, h: 110, x: 765, y: 570 })
    .text("Leander Christensen")
    .textFont({ size: "24px" })
    .unselectable()
    .textColor("#FFFFFF");
  //If highscore is defined, display it
  if (highScore > 0) {
    Crafty.e("2D, DOM, Text, Mouse")
      .attr({ w: 420, h: 110, x: 8, y: 570 })
      .text("HIGH SCORE: " + bigNumber(highScore))
      .textFont({ size: "24px" })
      .unselectable()
      .textColor("#FFFFFF");
  }
});

//About screen
Crafty.defineScene("about", function() {
  Crafty.background("#161616");
  Crafty.e("HTML, Mouse")
    .attr({ w: 300, h: 175, x: 350, y: 100 })
    .append("<div id='about'><h1 id='abouttitle'>About</h1><p id='abouttext'>Made by Leander Christensen<br>Powered by Crafted.js<br>Sound effects: 99Sounds and Introspectral</p></div>");
  Crafty.e("HTML, Mouse")
    .attr({ w: 300, h: 83, x: 350, y: 295 })
    .append("<button class='menubutton' id='moregames'>MORE GAMES</button>")
    .bind('Click', function(MouseEvent){
      window.open("https://leanderchristensen.com/games/",'_blank');
    });
  Crafty.e("HTML, Mouse")
    .attr({ w: 300, h: 83, x: 350, y: 395 })
    .append("<button class='menubutton' id='backbutton'>BACK</button>")
    .bind('Click', function(MouseEvent){
      Crafty.enterScene("menu");
    });
  Crafty.e("2D, DOM, Text, Mouse")
    .attr({ w: 500, h: 110, x: 765, y: 570 })
    .text("Leander Christensen")
    .textFont({ size: "24px" })
    .unselectable()
    .textColor("#FFFFFF");
  //If highscore is defined, display it
  if (highScore > 0) {
    Crafty.e("2D, DOM, Text, Mouse")
      .attr({ w: 420, h: 110, x: 8, y: 570 })
      .text("HIGH SCORE: " + bigNumber(highScore))
      .textFont({ size: "24px" })
      .unselectable()
      .textColor("#FFFFFF");
  }
});

//Gameover screen
Crafty.defineScene("gameover", function() {
  Crafty.background("#161616");
  canMove = true;
  console.log("Game Over!");
  console.log("Score: " + score);
  Crafty.e("2D, DOM, Text")
    .attr({ w: 500, h: 500, x: 260, y: 190 })
    .text("Game Over!")
    .textFont({ size: "72px" })
    .unselectable()
    .textColor("#FFFFFF");
  Crafty.e("2D, DOM, Text")
    .attr({ w: 650, h: 500, x: 260, y: 270 })
    .text("Score: " + score)
    .textFont({ size: "72px" })
    .unselectable()
    .textColor("#FFFFFF");
  //Give new highscore
  if (score > highScore && score <= maxScore) {
    Crafty.e("2D, DOM, Text")
      .attr({ w: 750, h: 500, x: 260, y: 350 })
      .text("New high score!")
      .textFont({ size: "72px" })
      .unselectable()
      .textColor("#FFFFFF");
    highScore = score;
    document.cookie = "highScore=" + highScore + "; expires=Sat, 01 Jan 2050 12:00:00 UTC";
    console.log("New high score!");
  }
  level = 1;
  lives = 3;
  score = 0;
  userLevel = 1;
  userScore = 0;
  userLives = 3;
  document.cookie = "level=" + level + "; expires=Sat, 01 Jan 2050 12:00:00 UTC";
  document.cookie = "score=" + score + "; expires=Sat, 01 Jan 2050 12:00:00 UTC";
  document.cookie = "lives=" + lives + "; expires=Sat, 01 Jan 2050 12:00:00 UTC";
  sleep(5000).then(() => {
    Crafty.enterScene("menu");
  });
});

//Level transition screen
Crafty.defineScene("intro", function() {
  Crafty.background("#161616");
  Crafty.e("2D, DOM, Text")
    .attr({ w: 500, h: 500, x: 365, y: 228 })
    .text("Level " + level)
    .textFont({ size: "72px" })
    .unselectable()
    .textColor("#FFFFFF");
  sleep(3000).then(() => {
    switch (level) {
      case 1:
        document.cookie = "level=" + level + "; expires=Sat, 01 Jan 2050 12:00:00 UTC";
        document.cookie = "score=" + score + "; expires=Sat, 01 Jan 2050 12:00:00 UTC";
        document.cookie = "lives=" + lives + "; expires=Sat, 01 Jan 2050 12:00:00 UTC";
        Crafty.enterScene("levelone");
        break;
      case 2:
        document.cookie = "level=" + level + "; expires=Sat, 01 Jan 2050 12:00:00 UTC";
        document.cookie = "score=" + score + "; expires=Sat, 01 Jan 2050 12:00:00 UTC";
        document.cookie = "lives=" + lives + "; expires=Sat, 01 Jan 2050 12:00:00 UTC";
        Crafty.enterScene("leveltwo");
        break;
      case 3:
        document.cookie = "level=" + level + "; expires=Sat, 01 Jan 2050 12:00:00 UTC";
        document.cookie = "score=" + score + "; expires=Sat, 01 Jan 2050 12:00:00 UTC";
        document.cookie = "lives=" + lives + "; expires=Sat, 01 Jan 2050 12:00:00 UTC";
        Crafty.enterScene("levelthree");
        break;
    }
  });
});

//Level 1
Crafty.defineScene("levelone", function() {
  console.log("Level 1");
  noRepeat = true;
  canMove = true;
  document.getElementById("game").style.backgroundColor = "#66e0ff";
  //Crafty.e("2D, Canvas, Image")
  //  .attr({ w: 1920, h: 500, x: 0, y: 300 })
  //  .image("images/landscape.png");
  //Sun
  Crafty.e('2D, Canvas, Color').attr({x: 75, y: 75, w: 50, h: 50}).color('yellow');
  //Ground
  Crafty.e('Floor, Collision, 2D, Canvas, Color, solid').attr({x: 0, y: height-20, w: 1000, h: 20}).color('green');
  //Platforms
  Crafty.e('Floor, Collision, 2D, Canvas, Color, solid').attr({x: 67, y: 430, w: 125, h: 20}).color('black');
  Crafty.e('Floor, Collision, 2D, Canvas, Color, solid').attr({x: 266, y: 280, w: 250, h: 20}).color('black');
  Crafty.e('Floor, Collision, 2D, Canvas, Color, solid').attr({x: 817, y: 280, w: 125, h: 20}).color('black');
  Crafty.e('Floor, Collision, 2D, Canvas, Color, solid').attr({x: 606, y: 430, w: 125, h: 20}).color('black');
  Crafty.e('Floor, Collision, 2D, Canvas, Color, solid').attr({x: 610, y: 120, w: 125, h: 20}).color('black');
  //Door
  Crafty.e('2D, Canvas, Color, Door').attr({x: 648, y: 35, w: 48, h: 85}).color('brown');
  //Enemy
  enemy = Crafty.e('Collision, 2D, Canvas, Color, enemy').attr({x: 266, y: 240, w: 48, h: 40}).color('grey');
  moveRight = true;
  if (firstTime) {
    enemyPatrol(266, 468);
    firstTime = false;
  }
  //World borders
  Crafty.e('Collision, 2D, Canvas, solid').attr({x: -1, y: 0, w: 1, h: height});
  Crafty.e('Collision, 2D, Canvas, solid').attr({x: width, y: 0, w: 1, h: height});
  player = Crafty.e('2D, Canvas, Collision, Color, Twoway, Gravity')
    .attr({x: 462, y: height-75, w: 38, h: 75})
    .collision([0, 0, 0, 75, 38, 75, 0, 75])
    .bind('Moved', function(evt) {
      //Hitbox
      var hitDatas, hitData;
      if ((hitDatas = this.hit('solid'))) {
        hitData = hitDatas[0];
        this.x -= hitData.overlap * hitData.normal.x;
        this.y -= hitData.overlap * hitData.normal.y;
      }
      if ((hitDatas = this.hit('enemy'))) {
        if (cheat) {
          this.y = 0;
        } else {
        if (noRepeat) {
          noRepeat = false;
          lives--;
          livesText.text("Lives: " + lives);
          canMove = false;
          player.w = 0;
          deathAnimation();
          sleep(3000).then(() => {
            if (lives <= 0) {
              Crafty.enterScene("gameover");
            } else {
              Crafty.enterScene("levelone");
            }
          });
        }
        }
      }
      if ((hitDatas = this.hit('Door'))) {
        level = 2;
        Crafty.enterScene("intro");
      }
    })
    .color('#F00')
    .twoway(200)
    .gravity('Floor');
  livesText = Crafty.e("2D, DOM, Text")
    .attr({ w: 200, h: 50, x: 20, y: 5 })
    .text("Lives: " + lives)
    .textFont({ size: "24px" })
    .unselectable()
    .textColor("#FFFFFF");
  scoreText = Crafty.e("2D, DOM, Text")
    .attr({ w: 200, h: 50, x: 20, y: 30 })
    .text("Score: " + score)
    .textFont({ size: "24px" })
    .unselectable()
    .textColor("#FFFFFF");
});

//Make the enemy patrol the platform it's standing on
function enemyPatrol(left, right) {
  if (enemy.x <= left) {
    moveRight = true;
  } else if (enemy.x >= right) {
    moveRight = false;
  }
  if (moveRight) {
    enemy.x++;
  } else {
    enemy.x--;
  }
  setTimeout(function() {
    enemyPatrol(left, right);
  }, 20);
}

//Level 2
Crafty.defineScene("leveltwo", function() {
  if (canMove) {
    console.log("Level 2");
  }
  noRepeat = true;
  canMove = true;
  document.getElementById("game").style.backgroundColor = "#66e0ff";
  Crafty.e("2D, Canvas, Image")
    .attr({ w: 1920, h: 500, x: 0, y: 300 })
    .image("images/landscape.png");
  Crafty.e("2D, DOM, Text, solidText")
    .attr({ w: 800, h: 400, x: 2200, y: 200 })
    .text("More coming soon ...")
    .textFont({ size: "72px" })
    .unselectable()
    .textColor("#FFFFFF");
  //Sun
  Crafty.e('2D, Canvas, Color').attr({x: 75, y: 75, w: 50, h: 50}).color('yellow');
  //Ground
  Crafty.e('Floor, Collision, 2D, Canvas, Color, solid').attr({x: 0, y: height-20, w: 2200, h: 20}).color('green');
  //Platforms
  Crafty.e('Floor, Collision, 2D, Canvas, Color, solid').attr({x: 1067, y: 430, w: 125, h: 20}).color('black');
  Crafty.e('Floor, Collision, 2D, Canvas, Color, solid').attr({x: 1266, y: 280, w: 250, h: 20}).color('black');
  Crafty.e('Floor, Collision, 2D, Canvas, Color, solid').attr({x: 1817, y: 280, w: 125, h: 20}).color('black');
  Crafty.e('Floor, Collision, 2D, Canvas, Color, solid').attr({x: 1606, y: 430, w: 125, h: 20}).color('black');
  Crafty.e('Floor, Collision, 2D, Canvas, Color, solid').attr({x: 1610, y: 120, w: 125, h: 20}).color('black');
  //Left world border
  border = Crafty.e('Collision, 2D, Canvas, solid').attr({x: -1, y: 0, w: 1, h: height});
  player = Crafty.e('2D, Canvas, Collision, Color, Twoway, Gravity')
    .attr({x: 200, y: height-75, w: 38, h: 75})
    .collision([0, 0, 0, 75, 38, 75, 0, 75])
    .bind('Moved', function(evt) {
      //Hitbox
      var hitDatas, hitData;
      if ((hitDatas = this.hit('solid'))) {
        hitData = hitDatas[0];
        this.x -= hitData.overlap * hitData.normal.x;
        this.y -= hitData.overlap * hitData.normal.y;
      }
      //Sidescrolling
      if (this.x > 475 && canMove) {
        Crafty("solid").each(function() {
            this.x -= 5;
        });
        Crafty("solidText").each(function() {
            this.x -= 5;
        });
        Crafty("Image").each(function() {
            this.x -= 1;
        });
        player.x = 475;
      } else if (this.x < 474 && border.x < -1 && canMove) {
        Crafty("solid").each(function() {
            this.x += 5;
        });
        Crafty("solidText").each(function() {
            this.x += 5;
        });
        Crafty("Image").each(function() {
            this.x += 1;
        });
        player.x = 475;
      }
      //Check if player is under map
      if (this.y > height) {
        if (cheat) {
          this.y = 0;
        } else {
        if (noRepeat) {
          noRepeat = false;
          lives--;
          livesText.text("Lives: " + lives);
          canMove = false;
          deathAnimation();
          sleep(3000).then(() => {
            if (lives <= 0) {
              Crafty.enterScene("gameover");
            } else {
              Crafty.enterScene("leveltwo");
            }
          });
        }
        }
      }
    })
    .color('#F00')
    .twoway(200)
    .gravity('Floor');
  livesText = Crafty.e("2D, DOM, Text")
    .attr({ w: 200, h: 50, x: 20, y: 5 })
    .text("Lives: " + lives)
    .textFont({ size: "24px" })
    .unselectable()
    .textColor("#FFFFFF");
  scoreText = Crafty.e("2D, DOM, Text")
    .attr({ w: 200, h: 50, x: 20, y: 30 })
    .text("Score: " + score)
    .textFont({ size: "24px" })
    .unselectable()
    .textColor("#FFFFFF");
});

//Death animation (background color blink) and deathsound
function deathAnimation() {
  deathSound.play();
  sleep(100).then(() => {
    document.body.style.backgroundColor = "#cc0000";
    sleep(100).then(() => {
      document.body.style.backgroundColor = "#161616";
      sleep(100).then(() => {
        document.body.style.backgroundColor = "#cc0000";
        sleep(100).then(() => {
          document.body.style.backgroundColor = "#161616";
        });
      });
    });
  });
}

//Convert big numbers like 5555555 to 5,555,555
function bigNumber(num) {
  if (typeof num != "number") {
    return num;
  }
  if (num < 1000) {
    return num.toString();
  }
  if (num > Number.MAX_SAFE_INTEGER-1) {
    return "ERROR";
  }
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

//Sleep function
function sleep (time) {
  return new Promise((resolve) => setTimeout(resolve, time));
} //sleep(1000).then(() => { });

//When finished loading, create canvas and enter menu
window.onload = function () {
  document.getElementById("loading").style.display = "none";
  Crafty.init(width,height, document.getElementById("game"));
  firstTime = true;
  Crafty.enterScene("menu");
  document.body.style.cursor = "default";
}
