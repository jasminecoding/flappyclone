var gameContainer = document.getElementById('game-container');
var bird = document.getElementById('bird');
var pipeTop = document.getElementById('pipe-top');
var pipeBottom = document.getElementById('pipe-bottom');
var scoreElement = document.createElement('div');
var highScoreElement = document.createElement('div');

var homeScreen = document.getElementById('home-screen');
var playButton = document.getElementById('play-button');

var birdY = 250;
var birdYSpeed = 0;
var pipeX = 800;
var pipeHolePosition = Math.random() * 300 + 150;
var gameOver = false;
var score = 0;
var highScore = localStorage.getItem('highScore') ? localStorage.getItem('highScore') : 0;

var birdFrame = 0;
var birdFrameCounter = 0;

var gameOverMessage = document.getElementById('game-over');
var restartButton = document.getElementById('restart-button');

var jumpSpeed = -15;
var fallSpeed = 1;

var basePipeSpeed = 4;

scoreElement.style.position = 'absolute';
scoreElement.style.top = '10px';
scoreElement.style.left = '10px';
scoreElement.style.fontSize = '20px';
scoreElement.textContent = 'Score: ' + score;
gameContainer.appendChild(scoreElement);

highScoreElement.style.position = 'absolute';
highScoreElement.style.top = '40px';
highScoreElement.style.left = '10px';
highScoreElement.style.fontSize = '20px';
highScoreElement.textContent = 'High Score: ' + highScore;
gameContainer.appendChild(highScoreElement);

var jumpSound = new Audio();
var scoreSound = new Audio('sounds/score.wav');
scoreSound.volume = 1;

// Background Music
var bgMusic = new Audio('sounds/theme2.wav'); // replace with your background music file
bgMusic.volume = 0.2; // Set volume to 30% of maximum volume
bgMusic.loop = true; // loop music
var bgMusicPlayed = false; // flag to indicate whether the bg music has started playing

// Display the home screen at the start of the game
homeScreen.style.display = 'block';

function gameLoop() {
  if (gameOver) {
    return;
  }

  birdYSpeed += fallSpeed;
  birdY += birdYSpeed;

  var pipeSpeed = basePipeSpeed + score / 20;

  pipeX -= pipeSpeed;

  if (pipeX < -100) {
    pipeX = 800;
    pipeHolePosition = Math.random() * 300 + 150;
    if (!gameOver) {
      score++;
      scoreElement.textContent = 'Score: ' + score;
      scoreSound.play();

      if (score > highScore) {
        highScore = score;
        highScoreElement.textContent = 'High Score: ' + highScore;
        localStorage.setItem('highScore', highScore);
      }
    }
  }

  bird.style.top = birdY + 'px';
  pipeTop.style.height = (pipeHolePosition - 150) + 'px';
  pipeTop.style.left = pipeX + 'px';
  pipeBottom.style.height = (600 - pipeHolePosition - 150) + 'px';
  pipeBottom.style.top = (pipeHolePosition + 150) + 'px';
  pipeBottom.style.left = pipeX + 'px';

  birdFrameCounter++;
  if (birdFrameCounter >= 10) {
    bird.style.backgroundPosition = (birdFrame * -80) + 'px 0';
    birdFrame++;
    if (birdFrame >= 3) {
      birdFrame = 0;
    }
    birdFrameCounter = 0;
  }

  var birdRect = bird.getBoundingClientRect();
  var pipeTopRect = pipeTop.getBoundingClientRect();
  var pipeBottomRect = pipeBottom.getBoundingClientRect();

  var birdCollisionRect = {
    top: birdRect.top + 10,
    bottom: birdRect.bottom - 10,
    left: birdRect.left + 10,
    right: birdRect.right - 10
  };

  var pipeTopCollisionRect = {
    bottom: pipeTopRect.bottom - 10,
    left: pipeTopRect.left + 10,
    right: pipeTopRect.right - 10
  };

  var pipeBottomCollisionRect = {
    top: pipeBottomRect.top + 10,
    left: pipeBottomRect.left + 10,
    right: pipeBottomRect.right - 10
  };

  if (
    birdCollisionRect.top <= 0 ||
    birdCollisionRect.bottom >= gameContainer.offsetHeight ||
    (birdCollisionRect.right >= pipeTopCollisionRect.left &&
      birdCollisionRect.left <= pipeTopCollisionRect.right &&
      (birdCollisionRect.top <= pipeTopCollisionRect.bottom || birdCollisionRect.bottom >= pipeBottomCollisionRect.top))
  ) {
    gameOver = true;
    gameOverMessage.style.display = 'block';
    return;
  }

  requestAnimationFrame(gameLoop);
}

// Add a touch event listener
window.addEventListener('touchstart', function(e) {
  if (!gameOver) {
    birdYSpeed = jumpSpeed;
    jumpSound.play();

    if (!bgMusicPlayed) {
      bgMusic.play();
      bgMusicPlayed = true;
    }
  }
});


window.addEventListener('keydown', function(e) {
  if (e.key == ' ' && !gameOver) {
    birdYSpeed = jumpSpeed;
    jumpSound.play();

    if (!bgMusicPlayed) {
      bgMusic.play();
      bgMusicPlayed = true;
    }
  }
});

playButton.addEventListener('click', function() {
  homeScreen.style.display = 'none';
  gameLoop();
});

restartButton.addEventListener('click', function() {
  birdY = 250;
  birdYSpeed = 0;
  pipeX = 800;
  pipeHolePosition = Math.random() * 300 + 150;
  gameOver = false;
  score = 0;
  scoreElement.textContent = 'Score: ' + score;
  gameOverMessage.style.display = 'none';

  gameLoop();
});
