// ----------------------- GLOBAL CONST -------------------
const offsetXpos = -600;
const offsetYpos = -3200;
const aspectRatioGlobal = 30; // Aspect ratio modified origianl
let speed = 3;
let blinkSpeed = 5;
let lastKey = "w";
const collisionsMap = [];
const boundariesArray = [];
let attackDirection = 1;

let moving = true;

const backgroundImage = new Image();
const playerIdle = new Image();
const playerRunningRight = new Image();
const playerRunningLeft = new Image();
const playerAttackRight = new Image();
const playerAttackLeft = new Image();

backgroundImage.src = "Tiles/finalMapTile.png";
playerIdle.src = "img/character/playerIdle.png";
playerRunningRight.src = "img/character/playerRunning.png";
playerRunningLeft.src = "img/character/playerRunningLeft.png";
playerAttackRight.src = "img/character/playerAttackRight.png";
playerAttackLeft.src = "img/character/playerAttackLeft.png";

// ----------------------- CLASSES -------------------
class Boundary {
  constructor(x, y) {
    this.aspectRatio = aspectRatioGlobal; // size of each tile
    this.x = x;
    this.y = y;
    this.width = this.aspectRatio;
    this.height = this.aspectRatio;
  }
  draw(ctx) {
    ctx.fillStyle = "rgba(255,50,0,0.5)"; // color&opacity of boundaries if drawn

    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}

class Sprite {
  constructor(x, y, image, frames, sprites = []) {
    this.x = x;
    this.y = y;
    this.image = image;
    this.ctx;
    this.frames = frames; // max different sprites in case there is an animation
    this.elapsed = 0;
    this.frameLoop = 0; // initial sprite
    this.image.onload = () => {
      this.width = this.image.width / this.frames;
      this.height = this.image.height;
    };
    this.sprites = sprites;
  }
  draw(ctx) {
    if (this.frames == 1) ctx.drawImage(this.image, this.x, this.y);
    else {
      ctx.drawImage(
        this.image,
        this.frameLoop * this.width,
        0,
        this.image.width / this.frames,
        this.image.height,
        this.x,
        this.y,
        (this.image.width / this.frames) * 2,
        this.image.height * 2
      );
      //console.log(this.frameLoop);
      if (this.frames > 1) this.elapsed++;
      if (this.elapsed % 10 === 0) {
        if (this.frameLoop < this.frames - 1) this.frameLoop++;
        else this.frameLoop = 0;
      }
    }
  }
}

class Attack {
  constructor(image, x, y, size) {
    this.image = image;
    this.x = x;
    this.y = y;
    this.size = size;
  }
  draw(ctx) {
    ctx.drawImage(
      this.image,
      0,
      0,
      this.image.width,
      this.image.height,
      this.x,
      this.y,
      this.image.width,
      this.image.height
    );
  }
}

class Enemy extends Sprite {
  constructor(x, y, image, frames) {
    super(x, y, image, frames);

    this.frames = frames; // max different sprites in case there is an animation
    this.elapsedTimer = 0;
    this.frameLoop = 0; // initial sprite
    this.width = this.image.width;

    this.image.onload = () => {
      this.width = this.image.width / this.frames;
      this.height = this.image.height;
    };
  }
  draw(ctx) {
    ctx.drawImage(
      this.image,
      16 * this.frameLoop,
      0,
      this.image.width / this.frames,
      this.image.height,
      this.x,
      this.y,
      (this.image.width / this.frames) * 2,
      this.image.height * 2
    );
    this.elapsedTimer++;

    if (this.elapsedTimer % 10 == 0) {
      if (this.frameLoop < this.frames - 1) this.frameLoop++;
      else this.frameLoop = 0;
    }
  }
  move(goToX, goToY, enemySpeed, lastkey) {
    switch (lastkey) {
      case "w":
        break;

      default:
        break;
    }

    if (this.x < goToX) this.x += enemySpeed;
    if (this.y < goToY) this.y += enemySpeed;
    if (this.x > goToX) this.x -= enemySpeed;
    if (this.y > goToY) this.y -= enemySpeed;
  }
}

// ----------------------- COLLISIONS -------------------

//collisions is an array declared at collisions.js . Created thanks to Tiled map tool
//100 tiles of width, so we create an array of 100 tiles per row

for (i = 0; i < collisions.length; i += 100) {
  collisionsMap.push(collisions.slice(i, 100 + i));
}
collisionsMap.forEach((collisionsRow, k) => {
  collisionsRow.forEach((collisionBlock, j) => {
    if (collisionBlock === 1025) {
      boundariesArray.push(
        new Boundary(
          j * aspectRatioGlobal + offsetXpos,
          k * aspectRatioGlobal + offsetYpos
        )
      );
    }
  });
});

function rectangularCollisionTest(rectangle1, rectangle2, rect2x, rect2y) {
  return (
    rectangle1.x + rectangle1.width + rectangle1.width / 3 >= rect2x &&
    rectangle1.x + rectangle1.width / 1.5 <= rect2x + rectangle2.width &&
    rectangle1.y <= rect2y + rectangle2.height &&
    rectangle1.y + rectangle1.height * 2 >= rect2y
  );
}
function attackCollisionTest(rectangle1, rectangle2, rect2x, rect2y) {
  return (
    rectangle1.x + rectangle1.width + rectangle1.width >= rect2x &&
    rectangle1.x + rectangle1.width <= rect2x + rectangle2.width &&
    rectangle1.y <= rect2y + rectangle2.height &&
    rectangle1.y + rectangle1.height >= rect2y
  );
}
// ----------------------- EVENTS -------------------

const keys = {
  w: {
    pressed: false,
  },
  s: {
    pressed: false,
  },
  a: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
  space: {
    pressed: false,
  },
  f: {
    pressed: false,
  },
  r: {
    pressed: false,
  },
};
window.addEventListener("click", (event) => {
  mousePosX = event.clientX;
  mousePosY = event.clientY;
  console.log(" Mouse : (" + mousePosX + "," + mousePosY + ")");
});
window.addEventListener("keydown", (e) => {
  switch (e.key) {
    case "w":
      keys.w.pressed = true;

      lastKey = e;
      break;
    case "s":
      keys.s.pressed = true;
      lastKey = e;
      break;
    case "a":
      keys.a.pressed = true;
      lastKey = e;
      break;
    case "d":
      keys.d.pressed = true;
      lastKey = e;
      break;
    case " ":
      keys.space.pressed = true;

      break;
    case "f":
      keys.f.pressed = true;
      lastKey = e;
      break;

    default:
      break;
  }
});

window.addEventListener("keyup", (e) => {
  switch (e.key) {
    case "w":
      keys.w.pressed = false;
      break;
    case "s":
      keys.s.pressed = false;
      break;
    case "a":
      keys.a.pressed = false;
      break;
    case "d":
      keys.d.pressed = false;
      break;
    case " ":
      keys.space.pressed = false;

      break;
    case "f":
      keys.f.pressed = false;
      break;

    default:
      break;
  }
});

// ----------------------- ANIMATION LOOP -------------------

window.onload = () => {
  const myCanvas = document.querySelector("canvas");
  const ctx = myCanvas.getContext("2d");

  // ----------------------- IMAGES -------------------
  const backgroundImage = new Image();
  const playerIdle = new Image();
  const playerRunningRight = new Image();
  const playerRunningLeft = new Image();
  const playerAttackRight = new Image();
  const playerAttackLeft = new Image();
  const attackAnimation = new Image();
  const attackAnimation2 = new Image();
  const attackAnimation3 = new Image();
  const attackAnimation4 = new Image();
  const enemyImage = new Image();
  const enemySlimeImage = new Image();

  backgroundImage.src = "Tiles/finalMapTile.png";
  playerIdle.src = "img/character/playerIdle.png";
  playerRunningRight.src = "img/character/playerRunning.png";
  playerRunningLeft.src = "img/character/playerRunningLeft.png";
  playerAttackRight.src = "img/character/playerAttackRight.png";
  playerAttackLeft.src = "img/character/playerAttackLeft.png";
  attackAnimation.src = "img/character/attack1.png";
  attackAnimation2.src = "img/character/attack2.png";
  attackAnimation3.src = "img/character/attack3.png";
  attackAnimation4.src = "img/character/attack4.png";
  enemyImage.src = "img/Enemies/skel_idle_down.png";
  enemySlimeImage.src = "img/Enemies/slime-orange.png";

  const background = new Sprite(offsetXpos, offsetYpos, backgroundImage, 1);
  const movables = [background, ...boundariesArray];

  const player = new Sprite(
    myCanvas.width / 2 - 288 / 12, // 288 and 240 is the size of the player's image
    myCanvas.height / 2 - 240 / 2,
    playerIdle,
    6,
    {
      sprites: {
        idle: playerIdle,
        runRight: playerRunningLeft,
        runLeft: playerRunningRight,
        attackRight: playerAttackRight,
        attackLeft: playerAttackLeft,
      },
    }
  );
  let attackPositionX = player.x + 100;
  let attackPositionY = player.y - 40;

  const attack = new Attack(
    attackAnimation,
    attackPositionX,
    attackPositionY,
    10
  );
  const attack2 = new Attack(
    attackAnimation2,
    attackPositionX,
    attackPositionY,
    10
  );
  const attack3 = new Attack(
    attackAnimation3,
    attackPositionX,
    attackPositionY,
    10
  );
  const attack4 = new Attack(
    attackAnimation4,
    attackPositionX,
    attackPositionY,
    10
  );

  attacksArray = [attack, attack2, attack3, attack4];
  let elapsedLoop = 0;
  let attackFrame = 0;

  const enemiesArray = [];
  for (i = 0; i < 20; i++) {
    let randX = Math.floor(Math.random() * 2000) - 500;
    let randY = Math.floor(Math.random() * 2000) - 500;
    enemiesArray.push(new Enemy(randX, randY, enemyImage, 6));
    enemiesArray.push(new Enemy(randY, randX, enemySlimeImage, 4));
  }

  //ctx.fillRect(attackPositionX, attackPositionY, attack.width, attck.height);
  ctx.fillStyle = "rgba(255,50,0,0.5)";
  function animationLoop() {
    window.requestAnimationFrame(animationLoop);

    background.draw(ctx);

    player.draw(ctx);

    for (i = 0; i < 40; i++) {
      enemiesArray[i].draw(ctx);
      ctx.fillRect(enemiesArray[i].x, enemiesArray[i].y, 32, 32);
      enemiesArray[i].move(player.x, player.y, 1.5, lastKey.key);

      let rectEnemy = {
        x: enemiesArray[i].x,
        y: enemiesArray[i].y,
        width: 32,
        height: 32,
      };
      let rectAttack = {
        x: attackPositionX,
        y: attackPositionY,
        width: 150,
        height: 125,
      };

      if (
        attackCollisionTest(rectEnemy, rectAttack, rectAttack.x, rectAttack.y)
      ) {
        console.log("CLLISION!!");
        //enemiesArray[i].splice();
      }
    }

    elapsedLoop++;
    ctx.fillRect(attackPositionX, attackPositionY, 150, 125);
    // -------------- CHANGE ATTACK DIRECTION ------------
    switch (lastKey.key) {
      case "w":
        attackPositionX = 475;
        attackPositionY = 0;
        attackDirection = 1;

        break;
      case "s":
        attackPositionX = 475;
        attackPositionY = 250;
        attackDirection = 2;
        break;
      case "a":
        attackPositionX = 300;
        attackPositionY = 125;
        attackDirection = 3;
        break;
      case "d":
        attackPositionX = 650;
        attackPositionY = 125;
        attackDirection = 4;
        break;

      default:
        break;
    }

    //Check collisions attack/enemy here

    // for (i = 0; i < enemiesArray.length; i++) {
    //   for (j = 0; j < attacksArray.length; j++) {
    //     if (
    //       rectangularCollisionTest(enemiesArray[i], player, player.x, player.y)
    //     )
    //       console.log("collision");
    //   }
    // }

    for (i = 0; i < attacksArray.length; i++) {
      attacksArray[i].x = attackPositionX;
      attacksArray[i].y = attackPositionY;
    }
    if (elapsedLoop % 7 === 0) attackFrame++;
    else if (attackFrame > 3) attackFrame = 0;

    if (attacksArray[attackFrame] != null && elapsedLoop > 50)
      attacksArray[attackFrame].draw(ctx);
    if (elapsedLoop > 150) elapsedLoop = 0;

    // ----------------------- CHARACTER MOVEMENT -------------------

    if (keys.w.pressed == true) {
      player.image = playerRunningRight;
      for (i = 0; i < boundariesArray.length; i++) {
        let boundary = boundariesArray[i];

        if (
          rectangularCollisionTest(
            player,
            boundary,
            boundary.x,
            boundary.y + speed // we add speed so we can check the future position, if there is collision
          )
        ) {
          moving = false;
          break;
        } // check if future position is valid
      }
      if (moving == true) {
        // if valid, we let our player move
        movables.forEach((movable) => {
          movable.y += speed;
        });
      } else moving = true;
    }

    if (keys.s.pressed == true) {
      player.image = playerRunningLeft;
      for (i = 0; i < boundariesArray.length; i++) {
        let boundary = boundariesArray[i];

        if (
          rectangularCollisionTest(
            player,
            boundary,
            boundary.x,
            boundary.y - speed
          )
        ) {
          moving = false;
          break;
        }
      }
      if (moving == true) {
        movables.forEach((movable) => {
          movable.y -= speed;
        });
      } else moving = true;
    }

    if (keys.a.pressed == true) {
      player.image = playerRunningLeft;
      for (i = 0; i < boundariesArray.length; i++) {
        let boundary = boundariesArray[i];

        if (
          rectangularCollisionTest(
            player,
            boundary,
            boundary.x + speed,
            boundary.y
          )
        ) {
          moving = false;
          break;
        }
      }
      if (moving == true) {
        movables.forEach((movable) => {
          movable.x += speed;
        });
      } else moving = true;
    }

    if (keys.d.pressed == true) {
      player.image = playerRunningRight;
      for (i = 0; i < boundariesArray.length; i++) {
        let boundary = boundariesArray[i];
        if (
          rectangularCollisionTest(
            player,
            boundary,
            boundary.x - speed,
            boundary.y
          )
        ) {
          moving = false;
          break;
        }
      }
      if (moving == true) {
        movables.forEach((movable) => {
          movable.x -= speed;
        });
      } else moving = true;
    }
    // if (keys.space.pressed == true) {
    //   switch (lastKey.key) {
    //     case "w":
    //       player.image = playerAttackRight;

    //       break;
    //     case "s":
    //       player.image = playerAttackLeft;
    //       break;
    //     case "a":
    //       player.image = playerAttackLeft;
    //       break;
    //     case "d":
    //       player.image = playerAttackRight;
    //       break;

    //     default:
    //       player.image = playerIdle;
    //       break;
    //   }
    // }
  }

  const keys = {
    w: {
      pressed: false,
    },
    s: {
      pressed: false,
    },
    a: {
      pressed: false,
    },
    d: {
      pressed: false,
    },
    space: {
      pressed: false,
    },
    f: {
      pressed: false,
    },
    r: {
      pressed: false,
    },
  };
  window.addEventListener("click", (event) => {
    mousePosX = event.clientX;
    mousePosY = event.clientY;
    console.log(" Mouse : (" + mousePosX + "," + mousePosY + ")");
  });
  window.addEventListener("keydown", (e) => {
    switch (e.key) {
      case "w":
        keys.w.pressed = true;
        lastKey = e;

        break;
      case "s":
        keys.s.pressed = true;
        lastKey = e;
        break;
      case "a":
        keys.a.pressed = true;
        lastKey = e;
        break;
      case "d":
        keys.d.pressed = true;
        lastKey = e;
        break;
      case " ":
        keys.space.pressed = true;

        break;
      case "f":
        keys.f.pressed = true;
        lastKey = e;
        break;

      default:
        break;
    }
  });

  window.addEventListener("keyup", (e) => {
    switch (e.key) {
      case "w":
        keys.w.pressed = false;
        player.image = playerIdle;
        break;
      case "s":
        keys.s.pressed = false;
        player.image = playerIdle;
        break;
      case "a":
        keys.a.pressed = false;
        player.image = playerIdle;
        break;
      case "d":
        keys.d.pressed = false;
        player.image = playerIdle;
        break;
      case " ":
        keys.space.pressed = false;
        //player.image = playerIdle;
        break;
      case "f":
        keys.f.pressed = false;
        player.image = playerIdle;
        break;

      default:
        break;
    }
  });

  //----------------- UNCOMMENT TO DRAW COLLISION WALLS  --------------

  // boundariesArray.forEach((boundary) => {
  //   if (rectangularCollisionTest(player, boundary, boundary.x, boundary.y)) {
  //     console.log("colliding");
  //   }
  //   boundary.draw(ctx);
  // });

  //----------------- UNCOMMENT TO DRAW COLLISION WALLS  --------------

  animationLoop();
};
