var jet = document.getElementById("jet");
var board = document.getElementById("board");
var start = new Audio("/audio/startgame.mp3");
var tiefighter = new Audio("/audio/tiefighter.mp3");
var game = new Audio("/audio/game-music.wav");


if (typeof game.loop == 'boolean') {
    game.loop = true;
}
else {
    game.addEventListener('ended', function () {
        this.currentTime = 0;
        this.play();
    }, false);
}
start.play();
tiefighter.play();
game.play();


window.addEventListener("keydown", (e) => {
    var left = parseInt(window.getComputedStyle(jet).getPropertyValue("left"));
    if (e.key == "ArrowLeft" && left > 0) {
        jet.style.left = left - 20 + "px";
    }

    else if (e.key == "ArrowRight" && left <= 960) {
        jet.style.left = left + 20 + "px";
    }

    if ((e.key == "ArrowUp" || e.code === 'Space')) {
        if (e.repeat) { return }
        var missile = document.createElement("div");
        missile.classList.add("missiles");
        board.appendChild(missile);
        document.getElementById('missileblast').cloneNode(true).play();

        var shootMissile = setInterval(() => {
            var enemies = document.getElementsByClassName("enemies");

            for (var i = 0; i < enemies.length; i++) {
                var enemy = enemies[i];
                var num = setMissileDamage(1, 50)
                if (enemy != undefined) {
                    var enemyBound = enemy.getBoundingClientRect();
                    var missileBound = missile.getBoundingClientRect();

                    if (
                        missileBound.left >= enemyBound.left &&
                        missileBound.right <= enemyBound.right &&
                        missileBound.top <= enemyBound.top &&
                        missileBound.bottom <= enemyBound.bottom
                    ) {
                        missile.parentElement.removeChild(missile);
                        if (num > 40) {
                            enemy.parentElement.removeChild(enemy);
                            document.getElementById('explode').cloneNode(true).play();
                            document.getElementById("points").innerHTML =
                                parseInt(document.getElementById("points").innerHTML) + 10;
                        }
                    }
                }
            }
            var missileBottom = parseInt(
                window.getComputedStyle(missile).getPropertyValue("bottom")
            );

            if (missileBottom >= 980) {
                clearInterval(shootMissile);
                missile.parentElement.removeChild(missile);

            }

            missile.style.left = left + "px";
            missile.style.bottom = missileBottom + 2 + "px";
        });
    }
    if (e.key == "Enter") {
        if (e.repeat) { return; }
        var laser = document.createElement("div");
        laser.classList.add("lasers");
        board.appendChild(laser);
        document.getElementById('laserblast').cloneNode(true).play();

        var shootLaser = setInterval(() => {
            var enemies = document.getElementsByClassName("enemies");

            for (var i = 0; i < enemies.length; i++) {
                var enemy = enemies[i];
                if (enemy != undefined) {
                    var enemyBound = enemy.getBoundingClientRect();
                    var laserBound = laser.getBoundingClientRect();

                    if (
                        laserBound.left >= enemyBound.left &&
                        laserBound.right <= enemyBound.right &&
                        laserBound.top <= enemyBound.top &&
                        laserBound.bottom <= enemyBound.bottom
                    ) {
                        laser.parentElement.removeChild(laser);
                        document.getElementById('explode').cloneNode(true).play();
                        enemy.parentElement.removeChild(enemy);
                        document.getElementById("points").innerHTML =
                            parseInt(document.getElementById("points").innerHTML) + 10;
                    }
                }
            }
            var laserBottom = parseInt(
                window.getComputedStyle(laser).getPropertyValue("bottom")
            );

            if (laserBottom >= 980) {
                clearInterval(shootLaser);
                laser.parentElement.removeChild(laser);

            }

            laser.style.left = left + "px";
            laser.style.bottom = laserBottom + 1 + "px";
        });
    }
});

var generateEnemies = setInterval(() => {
    var enemy = document.createElement("div");
    enemy.classList.add("enemies");
    var enemyLeft = parseInt(window.getComputedStyle(enemy).getPropertyValue("left"));
    enemy.style.left = Math.floor(Math.random() * 920) + "px";
    board.appendChild(enemy);
}, 1500);

var moveEnemies = setInterval(() => {
    var enemies = document.getElementsByClassName("enemies");

    if (enemies != undefined) {
        for (var i = 0; i < enemies.length; i++) {
            var enemy = enemies[i];
            var enemyTop = parseInt(window.getComputedStyle(enemy).getPropertyValue("top")
            );

            if (enemyTop >= 940) {
                document.getElementById('gameover').play();
             
                clearInterval(moveEnemies);
                var playAgain = window.confirm("Game over!\n Your score: " + document.getElementById("points").innerHTML + " points" + "\nPlay again?")
                if (playAgain) {
                    window.location.reload();
                }
                else {
                    window.location.replace('menu.html')
                }
            }
            enemy.style.top = enemyTop + 250 + "px";
        }
    }

}, 950);

function restartGame() {
    var restart = window.confirm('Game paused \n Restart game?')
    if (restart) {
        window.location.reload();
    }
}

function pauseGame() {
    var resume = window.confirm('Game paused \n Resume game?')
    if (resume) {

    }
}

function setMissileDamage(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
