'use strict';

const ACTOR = 'actor',
    WALL = 'wall',
    LAVA = 'lava',
    COIN = 'coin',
    PLAYER = 'player',
    FIREBALL = 'fireball';

const STATIC_GAME_OBJECTS = {
    'x': WALL,
    '!': LAVA
}


class Vector {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }

    plus(vector) {
        if (!(vector instanceof Vector)) {
            throw new Error('Объект не существует или не является объектом класса Vector');
        }

        return new Vector(this.x + vector.x, this.y + vector.y);
    }

    times(multiplier) {
        return new Vector(this.x * multiplier, this.y * multiplier);
    }
}

class Actor {
    constructor(position = new Vector(0, 0), size = new Vector(1, 1), speed = new Vector(0, 0)) {
        if (!(position instanceof Vector) || !(size instanceof Vector) || !(speed instanceof Vector)) {
            throw new Error('Объект не существует или не является объектом класса Vector');
        }

        this.pos = position;
        this.size = size;
        this.speed = speed;

    }

    act() {

    }

    get left() {
        return this.pos.x;
    }

    get top() {
        return this.pos.y;
    }

    get right() {
        return this.pos.x + this.size.x;
    }

    get bottom() {
        return this.pos.y + this.size.y;
    }

    get type() {
        return ACTOR;
    }

    isIntersect(objectActor) {
        if (!(objectActor instanceof Actor) || !objectActor) {
            throw new Error('Объект не существует или не является объектом класса Actor');
        }

        if (objectActor === this) {
            return false;
        }

        return this.left < objectActor.right && this.top < objectActor.bottom && this.right > objectActor.left && this.bottom > objectActor.top;
    }
}

class Level {
    constructor(grid = [], actors = []) {
        this.grid = grid;
        this.actors = actors;
        this.player = this.actors.find(actor => actor.type === PLAYER);
        this.height = grid.length;
        this.width = grid.reduce(((max, arr) => (arr.length > max) ? arr.length : max), 0);
        this.status = null;
        this.finishDelay = 1;
    }

     isFinished() {
        return (this.status !== null && this.finishDelay < 0);
    }

    actorAt(objectActor) {
        if (!(objectActor instanceof Actor) || !objectActor) {
            throw new Error('Объект не существует или не является объектом класса Actor');
        }

        return this.actors.find(actor => actor.isIntersect(objectActor));
    }

    obstacleAt(positionVector, sizeVector) {
        if (!(positionVector instanceof Vector) || !(sizeVector instanceof Vector) || !positionVector || !sizeVector) {
            throw new Error('Объект не существует или не является объектом класса Vector');
        }
        const leftBorder = Math.floor(positionVector.x);
        const topBorder = Math.floor(positionVector.y);
        const rightBorder = Math.ceil(positionVector.x + sizeVector.x);
        const bottomBorder = Math.ceil(positionVector.y + sizeVector.y);

        if (leftBorder < 0 || rightBorder > this.width || topBorder < 0 ) {
            return WALL;
        }

        if (bottomBorder > this.height) {
            return LAVA;
        }

        for (let x = leftBorder; x < rightBorder; x++) {
            for (let y = topBorder; y < bottomBorder; y++) {
                let obstacle = this.grid[y][x];
                if (obstacle) {
                    return obstacle;
                }
            }
        }
    }

    removeActor(objectActor) {
        if ( !objectActor || !(objectActor instanceof Actor) ) {
            return;
        }

        let indexOfActorObject = this.actors.indexOf(objectActor);
        if (indexOfActorObject !== -1) {
            this.actors.splice(indexOfActorObject, 1);
        }
    }

    noMoreActors(typeOfObject) {
        if (this.actors.find(actor => actor.type === typeOfObject)) {
            return false;
        }

        return true;
    }

    playerTouched(typeOfObject, object) {
        if (this.status !== null) {
            return;
        }
        if (typeOfObject === LAVA || typeOfObject === FIREBALL) {
            this.status = 'lost';
        }
        if ( (typeOfObject === COIN) && (object.type === COIN) ) {
            this.removeActor(object);
                if (this.noMoreActors(COIN)) {
                    this.status = 'won';
                }
        }
    }
}

class LevelParser {
    constructor(dictionary = {}) {
        this.dictionary = dictionary;
    }

    actorFromSymbol(symbol) {
        if (symbol && this.dictionary) {
            return this.dictionary[symbol];
        }
    }

    obstacleFromSymbol(symbol) {
        if (symbol) {
            return STATIC_GAME_OBJECTS[symbol];
        }
    }

    createGrid(arrayStr) {
        return arrayStr.map((noMoveArray) => {
            return [...noMoveArray].map(cell => this.obstacleFromSymbol(cell));
        });
    }

    createActors(arrayStr) {
        return arrayStr.reduce((previewElement, currentElement, y) => {
            [...currentElement].forEach((cell, x) => {
                    if (cell) {
                        let constructor = this.actorFromSymbol(cell);

                        if (constructor && typeof(constructor) === 'function') {
                            let objectActor = new constructor(new Vector(x, y));

                            if (objectActor instanceof Actor) {
                                previewElement.push(objectActor);
                            }
                        }
                    }
                }
            );
            return previewElement;
        }, []);
    }

    parse(arrayStr) {
        return new Level(this.createGrid(arrayStr), this.createActors(arrayStr));
    }
}

class Fireball extends Actor {
    constructor(position = new Vector(0,0), speed = new Vector(0,0)) {
        let size = new Vector(1,1);
        super(position, size, speed);
    }

     get type() {
        return FIREBALL;
     }

    getNextPosition(time = 1) {
        return this.pos.plus(this.speed.times(time));
    }

    handleObstacle() {
        this.speed = this.speed.times(-1);
    }

    act(time, grid) {
        let nextPosition = this.getNextPosition(time);
        if (grid.obstacleAt(nextPosition, this.size)) {
            this.handleObstacle();
        } else {
            this.pos = nextPosition;
        }
    }
}

class HorizontalFireball extends Fireball {
    constructor(position = new Vector(1,1)) {
        let speed = new Vector(2,0);
        super(position, speed);
    }
}

class VerticalFireball extends Fireball {
    constructor(position = new Vector(1,1)) {
        let speed = new Vector(0,2);
        super(position, speed);
    }
}

class FireRain extends Fireball {
    constructor(position = new Vector(1,1)) {
        let speed = new Vector(0,3);
        super(position, speed);
        this.firstPosition = position;
    }

    handleObstacle() {
        this.pos = this.firstPosition;
    }
}

class Coin extends Actor {
    constructor(position) {
        if (!position) {
            position = new Vector(0, 0);
        }

        position = position.plus(new Vector(0.2, 0.1));
        let size = new Vector(0.6, 0.6);
        super(position, size);

        this.startPos = position;
        this.springSpeed = 8;
        this.springDist = 0.07;
        this.spring = Math.random() * 2 * Math.PI;
    }

     get type() {
         return COIN;
     }

    updateSpring(time = 1) {
        this.spring += this.springSpeed * time;
    }

    getSpringVector() {
        return new Vector(0, Math.sin(this.spring) * this.springDist)
    }

    getNextPosition(time = 1) {
        this.updateSpring(time);
        return this.startPos.plus(this.getSpringVector());
    }

     act(time) {
         this.pos = this.getNextPosition(time);
     }
}

class Player extends Actor {
    constructor(position) {
        if (!position) {
            position = new Vector(0, 0);
        }

        position = position.plus(new Vector(0, -0.5));
        let size = new Vector(0.8, 1.5);
        let speed = new Vector(0, 0);
        super(position, size, speed);

    }

    get type() {
        return PLAYER;
    }
}

const actorDict = { // словарь парсера
    '@': Player,
    'v': FireRain,
    'o': Coin,
    '=': HorizontalFireball,
    '|': VerticalFireball
};


const parser = new LevelParser(actorDict);

loadLevels()
    .then((res) => {
    runGame(JSON.parse(res), parser, DOMDisplay)
.then(() => alert('Вы выиграли!'))
});
