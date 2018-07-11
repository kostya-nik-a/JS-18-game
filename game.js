'use strict';

//Реализовать базовые классы игры: Vector, Actor и Level.
const ACTOR = 'actor', LAVA = 'lava', FIREBALL = 'fireball', COIN = 'coin', PLAYER = 'player', WALL = 'wall', FIRERAIN = 'firerain';

const GAME_OBJECTS = {
    'x': WALL,
    '!': LAVA,
    '@': PLAYER,
    'o': COIN,
    '=': FIREBALL,
    '|': FIREBALL,
    'v': FIRERAIN
}

const STATIC_GAME_OBJECTS = {
    'x': WALL,
    '!': LAVA
}

/*
Вектор
Необходимо реализовать класс Vector, который позволит контролировать расположение объектов в двумерном пространстве и управлять их размером и перемещением.
*/

class Vector {
    /*Конструктор:
    Принимает два аргумента — координаты по оси X и по оси Y, числа, по умолчанию 0.
    Создает объект со свойствами x и y, равными переданным в конструктор координатам.
    */
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }

    /* Метод plus
     Принимает один аргумент — вектор, объект Vector.
     Если передать аргумент другого типа, то бросает исключение.
     Можно прибавлять к вектору только вектор типа Vector.
     Создает и возвращает новый объект типа Vector, координаты которого будут суммой
     соответствующих координат суммируемых векторов.
     */
    plus(vector) {
        if (!(vector instanceof Vector)) {
            throw new Error('Объект не существует или не является объектом класса Vector');
        }

        return new Vector(this.x + vector.x, this.y + vector.y);
    }

    /* Метод times
     Принимает один аргумент — множитель, число.
     Создает и возвращает новый объект типа Vector, координаты которого будут равны соответствующим координатам исходного вектора, умноженным на множитель.
     */
    times(multiplier) {
        return new Vector(this.x * multiplier, this.y * multiplier);
    }
}

/*const start = new Vector(30, 50);
const moveTo = new Vector(5, 10);
const finish = start.plus(moveTo.times(2));

console.log(`Исходное расположение: ${start.x}:${start.y}`);
console.log(`Текущее расположение: ${finish.x}:${finish.y}`);*/



/*
 Движущийся объект
 Необходимо реализовать класс Actor, который позволит контролировать все движущиеся объекты на игровом поле и контролировать их пересечение.
*/

class Actor {
/* Конструктор
 Принимает три аргумента: расположение, объект типа Vector, размер, тоже объект типа Vector и скорость, тоже объект типа Vector.
 Все аргументы необязательные.
 По умолчанию создается объект с координатами 0:0, размером 1x1 и скоростью 0:0.
 Если в качестве первого, второго или третьего аргумента передать не объект типа Vector, то конструктор должен бросить исключение.

 Свойства
 Должно быть определено свойство pos, в котором размещен Vector.
 Должно быть определено свойство size, в котором размещен Vector.
 Должно быть определено свойство speed, в котором размещен Vector.

*/
    constructor(position = new Vector(0, 0), size = new Vector(1, 1), speed = new Vector(0, 0)) {
        if (!(position instanceof Vector) || !(size instanceof Vector) || !(speed instanceof Vector)) {
            throw new Error('Объект не существует или не является объектом класса Vector');
        }

        this.pos = position;
        this.size = size;
        this.speed = speed;

    }

// Должен быть определен метод act, который ничего не делает.
    act() {

    }

// Должны быть определены свойства только для чтения left, top, right, bottom, в которых установлены границы объекта по осям X и Y с учетом его расположения и размера.
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
// Должен иметь свойство type — строку со значением actor, только для чтения.

    get type() {
        return ACTOR;
    }

 /*Метод isIntersect
 Метод проверяет, пересекается ли текущий объект с переданным объектом, и если да, возвращает true, иначе – false.
 Принимает один аргумент — движущийся объект типа Actor. Если передать аргумент другого типа или вызвать без аргументов, то метод бросает исключение.
 Если передать в качестве аргумента этот же объект, то всегда возвращает false. Объект не пересекается сам с собой.
 Объекты, имеющие смежные границы, не пересекаются.*/

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
/* Пример кода
 const items = new Map();
 const player = new Actor();
 items.set('Игрок', player);
 items.set('Первая монета', new Actor(new Vector(10, 10)));
 items.set('Вторая монета', new Actor(new Vector(15, 5)));

 function position(item) {
 return ['left', 'top', 'right', 'bottom']
 .map(side => `${side}: ${item[side]}`)
 .join(', ');
 }

 function movePlayer(x, y) {
 player.pos = player.pos.plus(new Vector(x, y));
 }

 function status(item, title) {
 console.log(`${title}: ${position(item)}`);
 if (player.isIntersect(item)) {
 console.log(`Игрок подобрал ${title}`);
 }
 }

 items.forEach(status);
 movePlayer(10, 10);
 items.forEach(status);
 movePlayer(5, -5);
 items.forEach(status);
 */

/*
Игровое поле
Объекты класса Level реализуют схему игрового поля конкретного уровня, контролируют все движущиеся объекты на нём и реализуют логику игры.
Уровень представляет собой координатное поле, имеющее фиксированную ширину и высоту.

    Сетка уровня представляет собой координатное двумерное поле, представленное двумерным массивом.
    Первый массив — строки игрового поля;
    индекс этого массива соответствует координате Y на игровом поле. Элемент с индексом 5 соответствует строке с координатой Y, равной 5.
    Вложенные массивы, расположенные в элементах массива строк, представляют ячейки поля. Индекс этих массивов соответствует координате X.
    Например, элемент с индексом 10, соответствует ячейке с координатой X, равной 10.

Так как grid — это двумерный массив, представляющий сетку игрового поля, то, чтобы узнать, что находится в ячейке с координатами X=10 и Y=5 (10:5),
необходимо получить значение grid[5][10]. Если значение этого элемента равно undefined, то эта ячейка пуста. Иначе там будет строка, описывающая препятствие.
Например, wall — для стены и lava — для лавы. Отсюда вытекает следующий факт: все препятствия имеют целочисленные размеры и координаты.
*/

class Level {
    /*   Конструктор
     Принимает два аргумента: сетку игрового поля с препятствиями, массив массивов строк, и список движущихся объектов, массив объектов Actor. Оба аргумента необязательные.

     Свойства
     Имеет свойство grid — сетку игрового поля. Двумерный массив строк.
     Имеет свойство actors — список движущихся объектов игрового поля, массив объектов Actor.
     Имеет свойство player — движущийся объект, тип которого — свойство type — равно player. Игорок передаётся с остальными движущимися объектами.
     Имеет свойство height — высоту игрового поля, равное числу строк в сетке из первого аргумента.
     Имеет свойство width — ширину игрового поля, равное числу ячеек в строке сетки из первого аргумента.
     При этом, если в разных строках разное число ячеек, то width будет равно максимальному количеству ячеек в строке.
     Имеет свойство status — состояние прохождения уровня, равное null после создания.
     Имеет свойство finishDelay — таймаут после окончания игры, равен 1 после создания. Необходим, чтобы после выигрыша или проигрыша игра не завершалась мгновенно.
     */
    constructor(grid = [], actors = []) {
        this.grid = grid;
        this.actors = actors;
        this.player = this.actors.find(actor => actor.type === PLAYER);
        this.height = grid.length;
        this.width = grid.reduce(((max, arr) => (arr.length > max) ? arr.length : max), 0);
        this.status = null;
        this.finishDelay = 1;
    }

     /*Метод isFinished
     Определяет, завершен ли уровень. Не принимает аргументов.
     Возвращает true, если свойство status не равно null и finishDelay меньше нуля.
    */

     isFinished() {
        return this.status !== null && this.finishDelay <0;
    }

     /*Метод actorAt
     Определяет, расположен ли какой-то другой движущийся объект в переданной позиции, и если да, вернёт этот объект.
     Принимает один аргумент — движущийся объект, Actor. Если не передать аргумент или передать не объект Actor, метод должен бросить исключение.
     Возвращает undefined, если переданный движущийся объект не пересекается ни с одним объектом на игровом поле.
     Возвращает объект Actor, если переданный объект пересекается с ним на игровом поле. Если пересекается с несколькими объектами, вернет первый.
    */

    actorAt(objectActor) {
        if (!(objectActor instanceof Actor) || !objectActor) {
            throw new Error('Объект не существует или не является объектом класса Actor');
        }

        return this.actors.find(obj => obj.isIntersect(objectActor));
    }

     /*Метод obstacleAt
     Аналогично методу actorAt определяет, нет ли препятствия в указанном месте. Также этот метод контролирует выход объекта за границы игрового поля.
     Так как движущиеся объекты не могут двигаться сквозь стены, то метод принимает два аргумента: положение, куда собираемся передвинуть объект, вектор Vector,
     и размер этого объекта, тоже вектор Vector.
     Если первым и вторым аргументом передать не Vector, то метод бросает исключение.
     Вернет строку, соответствующую препятствию из сетки игрового поля, пересекающему область, описанную двумя переданными векторами, либо undefined,
     если в этой области препятствий нет.
     Если описанная двумя векторами область выходит за пределы игрового поля, то метод вернет строку lava, если область выступает снизу. И вернет wall в остальных случаях.
     Будем считать, что игровое поле слева, сверху и справа огорожено стеной и снизу у него смертельная лава.
    */
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
                if (this.grid[y][x] === WALL || this.grid[y][x] === LAVA) {
                    return this.grid[y][x];
                }
            }
        }
    }

     /* Метод removeActor
     Метод удаляет переданный объект с игрового поля. Если такого объекта на игровом поле нет, не делает ничего.
     Принимает один аргумент, объект Actor. Находит и удаляет его.
    */

    removeActor(objectActor) {
        if ( !objectActor || !(objectActor instanceof Actor) ) {
            return;
        }

        let indexOfActorObject = this.actors.indexOf(objectActor);
        if (indexOfActorObject !== -1) {
            this.actors.splice(indexOfActorObject, 1);
        }
    }

     /* Метод noMoreActors
     Определяет, остались ли еще объекты переданного типа на игровом поле.
     Принимает один аргумент — тип движущегося объекта, строка.
     Возвращает true, если на игровом поле нет объектов этого типа (свойство type). Иначе возвращает false.
    */

    noMoreActors(typeOfObject) {
        if (this.actors.find(el => el.type === typeOfObject)) {
            return false;
        }

        return true;
    }

     /* Метод playerTouched
     Один из ключевых методов, определяющий логику игры. Меняет состояние игрового поля при касании игроком каких-либо объектов или препятствий.
     Если состояние игры уже отлично от null, то не делаем ничего, игра уже и так завершилась.
     Принимает два аргумента. Тип препятствия или объекта, строка. Движущийся объект, которого коснулся игрок, — объект типа Actor, необязательный аргумент.
     Если первым аргументом передать строку lava или fireball, то меняем статус игры на lost (свойство status). Игрок проигрывает при касании лавы или шаровой молнии.
     Если первым аргументом передать строку coin, а вторым — объект монеты, то необходимо удалить эту монету с игрового поля.
     Если при этом на игровом поле не осталось больше монет, то меняем статус игры на won. Игрок побеждает, когда собирает все монеты на уровне.
     Отсюда вытекает факт, что уровень без монет пройти невозможно.
     */

    playerTouched(typeofObject, object) {
        if (this.status !== null) {
            return;
        }
        if (typeofObject === LAVA || typeofObject === FIREBALL) {
            this.status = 'lost';
        }
        if ( (typeofObject === COIN) && (object.type === COIN) ) {
            this.removeActor(object);
                if (this.noMoreActors(COIN)) {
                    this.status = 'won';
                }
        }
    }
}

/*    Пример кода
const grid = [
    [undefined, undefined],
    ['wall', 'wall']
];

function MyCoin(title) {
    this.type = 'coin';
    this.title = title;
}
MyCoin.prototype = Object.create(Actor);
MyCoin.constructor = MyCoin;

const goldCoin = new MyCoin('Золото');
const bronzeCoin = new MyCoin('Бронза');
const player = new Actor();
const fireball = new Actor();

const level = new Level(grid, [ goldCoin, bronzeCoin, player, fireball ]);

level.playerTouched('coin', goldCoin);
level.playerTouched('coin', bronzeCoin);

if (level.noMoreActors('coin')) {
    console.log('Все монеты собраны');
    console.log(`Статус игры: ${level.status}`);
}

const obstacle = level.obstacleAt(new Vector(1, 1), player.size);
if (obstacle) {
    console.log(`На пути препятствие: ${obstacle}`);
}

const otherActor = level.actorAt(player);
if (otherActor === fireball) {
    console.log('Пользователь столкнулся с шаровой молнией');
}
Результат выполнения:

    Все монеты собраны
Статус игры: won
На пути препятствие: wall
Пользователь столкнулся с шаровой молнией
*/


/*Парсер уровня
Объект класса LevelParser позволяет создать игровое поле Level из массива строк по следующему принципу:

    Каждый элемент массива соответствует строке в сетке уровня.
    Каждый символ строки соответствует ячейке в сетке уровня.
    Символ определяет тип объекта или препятствия.
    Индекс строки и индекс символа определяют исходные координаты объекта или координаты препятствия.
    Символы и соответствующие им препятствия и объекты игрового поля:

    x — стена, препятствие
! — лава, препятствие
@ — игрок, объект
o — монетка, объект
= — движущаяся горизонтально шаровая молния, объект
| — движущаяся вертикально шаровая молния, объект
v — огненный дождь, объект
Обратите внимание, что тут слово «символ» означает букву, цифру или знак, которые используются в строках,
а не тип данных Symbol.
*/

class LevelParser {
    /* Конструктор
    Принимает один аргумент — словарь движущихся объектов игрового поля, объект,
    ключами которого являются символы из текстового представления уровня,
    а значениями — конструкторы, с помощью которых можно создать новый объект.
    */

    constructor(dictionary = {}) {
        this.dictionary = dictionary;
    }

    /* Метод actorFromSymbol
    Принимает символ, строка. Возвращает конструктор объекта по его символу, используя словарь.
    Если в словаре не нашлось ключа с таким символом, вернет undefined.
    */

    actorFromSymbol(symbol) {
        if (symbol && this.dictionary) {
            return this.dictionary[symbol];
        }
    }

    /*Метод obstacleFromSymbol
    Аналогично принимает символ, строка. Возвращает строку, соответствующую символу препятствия.
    Если символу нет соответствующего препятствия, то вернет undefined.
    Вернет wall, если передать x.
    Вернет lava, если передать !.
    Вернет undefined, если передать любой другой символ.
    */

    obstacleFromSymbol(symbol) {
        if (symbol) {
            return STATIC_GAME_OBJECTS[symbol];
        }
    }

    /* Метод createGrid
    Принимает массив строк и преобразует его в массив массивов,
    в ячейках которого хранится либо строка, соответствующая препятствию, либо undefined.
    Движущиеся объекты не должны присутствовать на сетке.
    */

    createGrid(arrayStr) {
        return arrayStr.map(function(noMoveArray) {
            return [...noMoveArray].map(el => STATIC_GAME_OBJECTS[el]);
        });
    }

    /* Метод createActors
    Принимает массив строк и преобразует его в массив движущихся объектов,
    используя для их создания классы из словаря.
    Количество движущихся объектов в результирующем массиве должно быть равно количеству символов
    объектов в массиве строк.
    Каждый объект должен быть создан с использованием вектора, определяющего его положение
    с учетом координат, полученных на основе индекса строки в массиве (Y) и индекса символа в
    строке (X).
    Для создания объекта должен быть использован класс из словаря, соответствующий символу.
    При этом, если этот класс не является наследником Actor, то такой символ игнорируется,
    и объект не создается.
    */

    createActors(arrayStr) {
        let self = this;
        return arrayStr.reduce(function(previewElement, currentElement, Y) {
            [...currentElement].forEach(function(cell, X) {
                if (cell) {
                    let constructor = self.actorFromSymbol(cell);

                    if (constructor && typeof(constructor) === 'function') {
                        let objectActor = new constructor(new Vector(X, Y));

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

    /*Метод parse
    Принимает массив строк, создает и возвращает игровое поле, заполненное препятствиями и движущимися объектами, полученными на основе символов и словаря.
    */

    parse(arrayStr) {
        return new Level(this.createGrid(arrayStr), this.createActors(arrayStr));
    }
}

/* Пример использования
const plan = [
    ' @ ',
    'x!x'
];

const actorsDict = Object.create(null);
actorsDict['@'] = Actor;

const parser = new LevelParser(actorsDict);
const level = parser.parse(plan);

level.grid.forEach((line, y) => {
    line.forEach((cell, x) => console.log(`(${x}:${y}) ${cell}`));
});

level.actors.forEach(actor => console.log(`(${actor.pos.x}:${actor.pos.y}) ${actor.type}`));
Результат выполнения кода:

(0:0) undefined
(1:0) undefined
(2:0) undefined
(0:1) wall
(1:1) lava
(2:1) wall
(1:0) actor*/

/* Шаровая молния
 Класс Fireball станет прототипом для движущихся опасностей на игровом поле.
 Он должен наследовать весь функционал движущегося объекта Actor.
*/
class Fireball extends Actor {
    /*Конструктор
     Принимает два аргумента: координаты, объект Vector и скорость, тоже объект Vector.
     Оба аргумента необязательные. По умолчанию создается объект с координатами 0:0 и скоростью 0:0.
     */
    constructor(position = new Vector(0,0), speed = new Vector(0,0)) {
        let size = new Vector(1,1);
        super(position, size, speed);
    }

    /*Свойства
     Созданный объект должен иметь свойство type со значением fireball. Это свойство только для чтения.
     Также должен иметь размер 1:1 в свойстве size, объект Vector.
     */
     get type() {
        return FIREBALL;
     }

     /* Метод getNextPosition
     Создает и возвращает вектор Vector следующей позиции шаровой молнии. Это функция времени.
     И как в школьной задаче, новая позиция — это текущая позиция плюс скорость,
     умноженная на время. И так по каждой из осей.
     Принимает один аргумент, время, число. Аргумент необязательный, по умолчанию равен 1.
    */
    getNextPosition(time=1) {
        return new Vector(this.pos.x + this.speed.x * time, this.pos.y + this.speed.y * time);
    }

     /*Метод handleObstacle
     Обрабатывает столкновение молнии с препятствием. Не принимает аргументов. Ничего не возвращает.
     Меняет вектор скорости на противоположный. Если он был 5:5, то после должен стать -5:-5.
    */
    handleObstacle() {
        this.speed = this.speed.times(-1);
    }

     /*
     Метод act
     Обновляет состояние движущегося объекта.
     Принимает два аргумента. Первый — время, число, второй — игровое поле, объект Level.
     Метод ничего не возвращает. Но должен выполнить следующие действия:

     Получить следующую позицию, используя время.
     Выяснить, не пересечется ли в следующей позиции объект с каким-либо препятствием.
     Пересечения с другими движущимися объектами учитывать не нужно.
     Если нет, обновить текущую позицию объекта.
     Если объект пересекается с препятствием, то необходимо обработать это событие.
     При этом текущее положение остается прежним.
     */
    act(time, grid) {
        let nextPosition = this.getNextPosition(time);
        if (grid.obstacleAt(nextPosition, this.size)) {
            this.handleObstacle();
        } else {
            this.pos = nextPosition;
        }
    }
}
 /*Пример использования
 const time = 5;
 const speed = new Vector(1, 0);
 const position = new Vector(5, 5);

 const ball = new Fireball(position, speed);

 const nextPosition = ball.getNextPosition(time);
 console.log(`Новая позиция: ${nextPosition.x}: ${nextPosition.y}`);

 ball.handleObstacle();
 console.log(`Текущая скорость: ${ball.speed.x}: ${ball.speed.y}`);
 Результат работы кода:

 Новая позиция: 10: 5
 Текущая скорость: -1: 0
*/

/*Горизонтальная шаровая молния
Вам необходимо самостоятельно реализовать класс HorizontalFireball.
Он будет представлять собой объект, который движется по горизонтали со скоростью 2 и
при столкновении с препятствием движется в обратную сторону.
Конструктор должен принимать один аргумент — координаты текущего положения, объект Vector.
И создавать объект размером 1:1 и скоростью, равной 2 по оси X.
*/
class HorizontalFireball extends Fireball {
    constructor(position = new Vector(1,1)) {
        let speed = new Vector(2,0);
        super(position, speed);
    }
}
/*Вертикальная шаровая молния
Вам необходимо самостоятельно реализовать класс VerticalFireball.
Он будет представлять собой объект, который движется по вертикали со скоростью 2 и
при столкновении с препятствием движется в обратную сторону.
Конструктор должен принимать один аргумент: координаты текущего положения, объект Vector.
И создавать объект размером 1:1 и скоростью, равной 2 по оси Y.
*/
class VerticalFireball extends Fireball {
    constructor(position = new Vector(1,1)) {
        let speed = new Vector(0,2);
        super(position, speed);
    }
}
/*
Огненный дождь
Вам необходимо самостоятельно реализовать класс FireRain.
Он будет представлять собой объект, который движется по вертикали со скоростью 3 и
при столкновении с препятствием начинает движение в том же направлении из исходного положения,
которое задано при создании.
Конструктор должен принимать один аргумент — координаты текущего положения, объект Vector.
И создавать объект размером 1:1 и скоростью, равной 3 по оси Y.
*/
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

/* Монета
Класс Coin реализует поведение монетки на игровом поле.
Чтобы привлекать к себе внимание, монетки должны постоянно подпрыгивать в рамках своей ячейки.
Класс должен наследовать весь функционал движущегося объекта Actor.
*/
class Coin extends Actor {
    /*Конструктор
     Принимает один аргумент — координаты положения на игровом поле, объект Vector.
     Созданный объект должен иметь размер 0,6:0,6. А его реальные координаты должны отличаться
     от тех, что переданы в конструктор, на вектор 0,2:0,1.

     Свойства
     Также объект должен иметь следующие свойства:
     Скорость подпрыгивания, springSpeed, равная 8;
     Радиус подпрыгивания, springDist, равен 0.07;
     Фаза подпрыгивания, spring, случайное число от 0 до 2π.
     */
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
    //Свойство type созданного объекта должно иметь значение coin.
     get type() {
         return COIN;
     }
     /* Метод updateSpring
     Обновляет фазу подпрыгивания. Это функция времени.
     Принимает один аргумент — время, число, по умолчанию 1.
     Ничего не возвращает. Обновляет текущую фазу spring, увеличив её на скорость springSpeed,
     умноженную на время.
    */
    updateSpring(time =1) {
        this.spring += this.springSpeed * time;
    }

     /* Метод getSpringVector
     Создает и возвращает вектор подпрыгивания. Не принимает аргументов.
     Так как подпрыгивание происходит только по оси Y, то координата X вектора всегда равна нулю.
     Координата Y вектора равна синусу текущей фазы, умноженному на радиус.
    */
    getSpringVector() {
        return new Vector(0, Math.sin(this.spring) * this.springDist)
    }

     /* Метод getNextPosition
     Обновляет текущую фазу, создает и возвращает вектор новой позиции монетки.
     Принимает один аргумент — время, число, по умолчанию 1.
     Новый вектор равен базовому вектору положения, увеличенному на вектор подпрыгивания.
     Увеличивать нужно именно базовый вектор положения, который получен в конструкторе,
     а не текущий.
    */
    getNextPosition(time = 1) {
        this.updateSpring(time);
        return this.startPos.plus(this.getSpringVector());
    }

     /* Метод act
     Принимает один аргумент — время. Получает новую позицию объекта и задает её как текущую.
     Ничего не возвращает.
     */
     act(time) {
         this.pos = this.getNextPosition(time);
     }
}

/*Игрок
Класс Player содержит базовый функционал движущегося объекта, который представляет игрока
на игровом поле. Должен наследовать возможности Actor.
*/
class Player extends Actor {
    /*
     Конструктор
     Принимает один аргумент — координаты положения на игровом поле, объект Vector.
     Созданный объект, реальное положение которого отличается от того, что передано в конструктор,
     на вектор 0:-0,5. Имеет размер 0,8:1,5. И скорость 0:0.
     */
    constructor(position) {
        if (!position) {
            position = new Vector(0, 0);
        }

        position = position.plus(new Vector(0, -0.5));
        let size = new Vector(0.8, 1.5);
        let speed = new Vector(0, 0);
        super(position, size, speed);

    }

    /*Свойства
     Имеет свойство type, равное player.
     */
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
