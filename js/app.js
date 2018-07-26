// TODO: ensure that bugs don't completely respawn on every gem collection
// - ensure that the you need x gems before you can run to the water to excape.
// - add a story
// - add a key

//specifies numbers of enemies in game
var enemyNumbers = 1;
var ENEMY_START_POS_LEFT = -100;

//specify 'blocks' for x and y positions of objects
var YGRID = createXorYGrid(11, 'Y'); //up and down
var XGRID = createXorYGrid(11, 'X'); //left and right

//specifies player start position
var PLAYER_START_X = XGRID[5];
var PLAYER_START_Y = YGRID[11];

//specifies maximum right position of enemies
var ENEMY_MAX_X = XGRID[11];

var MAXGEMS = 100;
//holding variables used to calculate positions of
//player and enemies on grid
var xNum = XGRID.indexOf(PLAYER_START_X);
var yNum = YGRID.indexOf(PLAYER_START_Y);
var gemCount = 0;
var lives = 3;



//wins counter variable
var WINS = 1;

// Enemies our player must avoid
var Enemy = function() {
    //specifies a random Y position for each enemy on board
    //This is limited to the stone space only
    this.y = setEnemyYPosition(YGRID)

    //starts eneies x position off of the game board
    this.x = ENEMY_START_POS_LEFT;
    this.sprite = 'images/enemy-bug.png';
    //specifies a random speed for each enemy
    this.speed = setRandEnemySpeed(500, 150)

};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {

    //resets enemy x position when its x parameter == ENEMY_MAX_X
    if (this.x > ENEMY_MAX_X) {
        this.x = ENEMY_START_POS_LEFT;
        //new random y position when x is reset
        this.y = setEnemyYPosition(YGRID);
    }

    this.x = calCulateEnemyXPosChange(this, dt);

    if (this.x > ENEMY_MAX_X - 2) {
        var enemyYpos = allEnemies.indexOf(this);
        if (allEnemies.length > enemyNumbers) {
            console.log("allEnemies length: " + allEnemies.length);
            allEnemies.splice(enemyYpos, 1);
        }
    }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Enemy.prototype.checkCollisions = function() {
    var self = this;

    //loop to check for collisions between each enemy and the player
    for (var i = 0; i < XGRID.length; i++) {

        //is statement uses a margin of error so that the browser doesn't have to
        //be exact to the point on positions of players and enemies.
        if ((self.x > (XGRID[i] - 60)) && (self.x < (XGRID[i] + 30)) && (player.x === XGRID[i]) && (self.y === player.y)) {
            player.reset();

            //alert that you've lost and a reset of wins counter.
            appendMessage("You lose, try again!");
            gemCount = 0;
            allEnemies = [];
            enemyNumbers = 1;
            createEnemies(enemyNumbers)

        }

    }

};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.

var Gem = function() {
    this.possibleImg = ['images/Gem Green.png', 'images/Gem Orange.png', 'images/Gem Blue.png'];
    this.x = setGemXPosition(XGRID);
    this.y = setGemYPosition(YGRID);
    this.sprite = this.possibleImg[Math.floor(Math.random() * (2 - 0 + 1)) + 0];
    this.width = 101;
    this.height = 150;
    this.value = function(sprite) {
        if (this.sprite == this.possibleImg[0]) {
            return 5;
        } else if (this.sprite == this.possibleImg[1]) {
            return 10;
        } else {
            return 15;
        }
    }

};

Gem.prototype.checkCollisions = function() {
    var self = this;
    //loop to check for collisions between each enemy and the gem
    for (var i = 0; i < XGRID.length; i++) {
        if ((self.x > (XGRID[i] - 60)) && (self.x < (XGRID[i] + 30)) && (player.x === XGRID[i]) && (self.y === player.y)) {
            gemCount = gemCount + this.value(this.sprite);
            if(gemCount >= MAXGEMS){
                appendMessage("You have collected 100 Gems YOU WIN!!!");
                player.reset();
                self.reset();
                gemCount = 0;
                allEnemies = []
                createEnemies(1);
            } else {
                appendMessage("Great job you have collected " + gemCount + " gem points!", true);
                self.reset();
            }

        }

    }
}

Gem.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y, this.width, this.height);
};

Gem.prototype.reset = function() {
    this.x = setGemXPosition(XGRID);
    this.y = setEnemyYPosition(YGRID);
    this.sprite = this.possibleImg[Math.floor(Math.random() * (2 - 0 + 1)) + 0];
}

var Player = function(startX, startY) {
    //player start position
    this.x = startX;
    this.y = startY;

    //player sprite image
    this.sprite = 'images/char-boy.png';
};

//checks whether player has reached the water and resets game
// also increments the wins counter and alerts play to win.
Player.prototype.update = function() {
    var self = this;
    if (self.y == -10) {
        setTimeout(function() {
            appendMessage("Back to the grass keep going!");
            self.y = PLAYER_START_Y;
            yNum = YGRID.indexOf(PLAYER_START_Y);
        }, 200);
    }

};

//method to reset player positions
Player.prototype.reset = function() {
    this.x = PLAYER_START_X;
    this.y = PLAYER_START_Y;
    xNum = XGRID.indexOf(PLAYER_START_X);
    yNum = YGRID.indexOf(PLAYER_START_Y);

};

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

//method to handle keyboard input and set boundries on
//player range.
Player.prototype.handleInput = function(keyPress) {
    var xGridLen = XGRID.length - 2;
    var yGridLen = YGRID.length - 1;

    if (keyPress == 'left') {
        xNum = xNum - 1;
        if (xNum <= 0) {
            xNum = 0;
        }
        this.x = XGRID[xNum];
    } else if (keyPress == 'up') {
        yNum = yNum - 1;
        this.y = YGRID[yNum];

    } else if (keyPress == 'right') {
        xNum = xNum + 1;
        if (xNum > xGridLen) {
            xNum = xGridLen;
        }
        console.log("x num: " + xNum);
        this.x = XGRID[xNum];

    } else if (keyPress == 'down') {
        yNum = yNum + 1;
        if (yNum > yGridLen) {
            yNum = yGridLen;
        }
        console.log("y num: " + yNum);
        this.y = YGRID[yNum];

    } else {
        appendMessage("please use arrow keys");
    }
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

//array to hold enemies.
var allEnemies = [];

//creates a new player object
var player = new Player(PLAYER_START_X, PLAYER_START_Y);
var greenGem = new Gem();
//instantiated createEnemies method is passed enemyNumbers
//to create set number of enemy objects
createEnemies(enemyNumbers);

// This listens for key presses and sends the keys to your
// Player.handleInput() method.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});

// -------- helper functions -------
//helper function to create enemies and push them into allEnemies array.
function createEnemies(x) {
    for (var i = 0; i < x; i++) {
        allEnemies.push(new Enemy());
    }
};

function createXorYGrid(num, XorY) {
    if (XorY == 'X') {
        var xArray = [0];
        var addPx = 101;
        for (var i = 0; i < num; i++) {
            xArray.push(xArray[i] + addPx);
        }
        return xArray;
    } else if (XorY == 'Y') {
        var yArray = [-10];
        var addPx = 83;
        for (var i = 0; i < num; i++) {
            yArray.push(yArray[i] + addPx);
        }
        return yArray;
    } else {
        console.log('createXorYGrid function error: wrong parameter added', 'second param needs to be eith "X" or "Y".');
    }
}

function setEnemyYPosition(yGrid) {
    return yGrid[(Math.floor(Math.random() * (yGrid.length - 3)) + 1)];
}

function setGemYPosition(yGrid) {
    return yGrid[(Math.floor(Math.random() * (yGrid.length - 3)) + 1)];
}

function setGemXPosition(xGrid) {
    return xGrid[(Math.floor(Math.random() * (xGrid.length - 3)) + 1)];
}

function setRandEnemySpeed(upper, lower) {
    return Math.floor((Math.random() * upper) + lower);
};

function calCulateEnemyXPosChange(enObj, deltaTime) {
    return enObj.x + Math.floor((enObj.speed * deltaTime));
}

function appendMessage(message, changeLevel) {
    console.log(message);
    var toAddTo = document.getElementsByClassName('messages');
    toAddTo[0].textContent = message;
    if (changeLevel) {
        levelUp();
    }
}

function levelUp() {
    enemyNumbers = enemyNumbers + 1;
    setTimeout(function(){
        createEnemies(1);
    }, 700);

}

// prevents window moving on arrow keypresses
window.addEventListener("keydown", function(e) {
    // space and arrow keys
    if ([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
        e.preventDefault();
    }
}, false);
