// Arreglos para diferentes tipos de objetos en el juego
let sunflowr = [];
let lanzaguisantes = [];
let repetidora = [];
let nuez = [];
let patatapum = [];
let zombie = { eat: null, walk: null }; // Objeto para definir los estados de los zombies
let zombieFlag = { eat: null, walk: null };
let zombieBucket = { eat: [], walk: [] };
let zombieCone = { eat: [], walk: [] };
let floor = null; // Variable para el suelo
let grass1 = null,
    grass2 = null;
let lawnmower = null;
let sol = null;
let nivel = [
    [10, 15, 20], // Nivel 1: número de zombies por fila
    [25, 30, 35], // Nivel 2: número de zombies por fila
    [25, 30, 35], // Nivel 3: número de zombies por fila
];
class Sol {
    constructor(x, y) {
        this.finish = y + 50; // Altura final que el sol alcanzará
        this.x = x;
        this.y = y;
    }
    mostrar() {
        image(sol, this.x, this.y, 40, 40); // Muestra la imagen del sol
        if (this.y <= this.finish) {
            this.y++;
        }
    }
}
class Podadora {
    constructor(x, y, img) {
        this.x = x;
        this.y = y;
        this.isColision = false; // Estado de colisión con los zombies
        this.velocidad = 5; // Velocidad de movimiento de la podadora
        this.img = img; // Imagen de la podadora
    }
    mostrar() {
        if (this.isColision) {
            this.x += this.velocidad;
        }
        image(this.img, this.x, this.y, width_, height_ - 50); // Muestra la imagen de la podadora
    }
    colision(zombie) {
        // Verifica colisiones con los zombies
        for (let z of zombie) {
            if (dist(this.x, this.y, z.x, z.y) < width_ - 50) {
                z.vida = 0; // Elimina el zombie
                this.isColision = true; // Marca que hubo una colisión
            }
        }
    }
}
class Plantas {
    constructor(x, y, columna, fila, img, width_ = 50, height_ = 60, vida = 5) {
        this.x = x - width_ / 2; // Posición X ajustada
        this.y = y - height_ / 2; // Posición Y ajustada
        this.velocidad = 7; // Velocidad de disparo de proyectiles
        this.proyectiles = []; // Arreglo para proyectiles disparados por la planta
        this.rango = width; // Rango de detección de zombies
        this.width_ = width_; // Ancho de la planta
        this.height_ = height_; // Alto de la planta
        this.vida = vida; // Vida de la planta
        this.currentImg = 0; // Índice de la imagen actual
        this.img = img; // Arreglo de imágenes de la planta
        this.columna = columna; // Columna en el tablero de juego
        this.fila = fila; // Fila en el tablero de juego
    }
    mostrar() {
        // Actualiza la imagen de la planta en función del tiempo
        if (frameCount % 12 == 0) {
            this.currentImg++;
        }
        if (this.currentImg >= this.img.length - 1) {
            this.currentImg = 0;
        }
        // Muestra los proyectiles y la imagen de la planta
        this.proyectiles.forEach((proyectil) => {
            fill("#91ce2d");
            circle(proyectil.x, proyectil.y + 25, 25); // Dibuja el proyectil
        });
        image(
            this.img[this.currentImg],
            this.x,
            this.y,
            this.width_,
            this.height_
        );
    }
    shot() {
        // Añade un nuevo proyectil a la lista de proyectiles
        this.proyectiles.push({ x: this.x + 30, y: this.y });
    }
    actualizarProyectiles(zombies) {
        for (let i = 0; i < this.proyectiles.length; i++) {
            this.proyectiles[i].x += this.velocidad;
        }
        this.proyectiles = this.proyectiles.filter(
            (proyectil) => proyectil.x < width
        );
        // Verifica si los proyectiles colisionan con los zombies
        for (let j = 0; j < zombies.length; j++) {
            for (let i = 0; i < this.proyectiles.length; i++) {
                if (
                    this.proyectiles[i].x >= zombies[j].x &&
                    this.proyectiles[i].x <= zombies[j].x + 50 &&
                    this.proyectiles[i].y >= zombies[j].y &&
                    this.proyectiles[i].y <= zombies[j].y + 100
                ) {
                    zombies[j].vida--; // Reduce la vida del zombie
                    this.proyectiles.splice(i, 1); // Elimina el proyectil que colisionó
                    break;
                }
            }
        }
    }
    detectarZombies(zombies) {
        // Detecta zombies dentro del rango de la planta
        for (let z of zombies) {
            let distanciaX = Math.abs(this.x - z.x);
            let distanciaY = Math.abs(this.y - z.y);
            if (distanciaX < this.rango && distanciaY < 50) {
                if (frameCount % 90 === 0) {
                    this.shot(); // Dispara si el tiempo es el adecuado
                }
                break;
            }
        }
    }
}
class Sunflowr extends Plantas {
    constructor(x, y, columna, fila, img, width_, height_) {
        super(x, y, columna, fila, img, width_, height_);
        this.velocidad = 0; // La velocidad es 0 porque el Sunflowr no se mueve
        this.ultimoSol = millis(); // Tiempo de la última generación de sol
        this.currentImg = 0; // Índice de la imagen actual
    }
    mostrar() {
        // Muestra la imagen actual del Sunflowr si está definida
        if (this.img[this.currentImg] !== undefined) {
            image(
                this.img[this.currentImg],
                this.x,
                this.y,
                this.width_,
                this.height_
            );
        }
        // Cicla las imágenes del Sunflowr
        if (this.currentImg >= this.img.length - 1) {
            this.currentImg = 0;
        }
        if (frameCount % 12 == 0) {
            this.currentImg++;
        }
        if (millis() - this.ultimoSol >= 1000 * 20) {
            this.generarSol();
            this.ultimoSol = millis(); // Actualiza el tiempo de la última generación
        }
        // Muestra los proyectiles que son sol
        this.proyectiles.forEach((s) => {
            image(sol, s.x, s.y, 40, 40); // Dibuja un sol cuadrado
        });
    }
    generarSol() {
        // Genera un nuevo sol con una posición aleatoria dentro de la planta
        let x = this.x + random(this.width_);
        let y = this.y + random(this.height_);
        this.proyectiles.push({ x: x - 20, y: y - 20, tiempoVida: millis() });
    }
    detectarZombies(zombies) {} // Método no implementado
    actualizarProyectiles(zombies) {} // Método no implementado
}
class Nuez extends Plantas {
    constructor(x, y, columna, fila, img, width_, height_) {
        super(x, y, columna, fila, img, width_, height_);
        this.vida = 40; // Vida inicial de la Nuez
        this.currentImg = 0; // Índice de la imagen actual
    }
    mostrar() {
        // Muestra la imagen actual de la Nuez si está definida
        if (this.img[this.currentImg] !== undefined) {
            image(
                this.img[this.currentImg],
                this.x,
                this.y,
                this.width_,
                this.height_
            );
        }
        if (this.vida == Math.floor(this.vida * 0.8)) {
            this.currentImg = 1;
        } else if (this.vida == Math.floor(this.vida * 0.5)) {
            this.currentImg = 2;
        }
    }
    detectarZombies(zombies) {} // Método no implementado
    actualizarProyectiles(zombies) {} // Método no implementado
}
class Patatapum extends Plantas {
    constructor(x, y, columna, fila, img, width_, height_) {
        super(x, y, columna, fila, img, width_, height_);
        this.isActive = false; // Estado de activación de la Patatapum
        this.activationTime = millis() + 13000; // Tiempo en el que la Patatapum se activará
        this.currentImg = 0; // Índice de la imagen actual
    }
    mostrar() {
        image(
            this.img[this.currentImg],
            this.x,
            this.y,
            this.width_,
            this.height_
        );
    }
    detectarZombies(zombies) {
        // Activa la Patatapum después de su tiempo de activación
        if (millis() >= this.activationTime) {
            this.isActive = true;
            this.currentImg = 1; // Cambia a la imagen activa
        }
        if (this.isActive) {
            // Revisa la colisión con los zombies
            for (const z of zombies) {
                if (dist(this.x, this.y, z.x, z.y) < 40) {
                    z.vida = 0; // Elimina al zombie
                    map.mapa[this.fila][this.columna] = false; // Actualiza el mapa
                    let index = plantas.indexOf(this);
                    plantas.splice(index, 1); // Elimina la Patatapum de la lista de plantas
                }
            }
        }
    }
    actualizarProyectiles(zombies) {} // Método no implementado
}
class Repetidora extends Plantas {
    constructor(x, y, columna, fila, img, width_, height_) {
        super(x, y, columna, fila, img, width_, height_);
        this.vida = 10; // Vida inicial de la Repetidora
        this.lastShotTime = 0; // Tiempo del último disparo
        this.shotCounter = 0; // Contador de disparos
    }
    shot() {
        // Dispara un proyectil y luego otro después de 100 ms
        this.proyectiles.push({ x: this.x + 30, y: this.y });
        setTimeout(() => {
            this.proyectiles.push({ x: this.x + 30, y: this.y });
        }, 100);
    }
}
class Zombie {
    constructor(x, y, imgWalk, imgEat) {
        this.x = x;
        this.y = y;
        this.velocidad = 0.5; // Velocidad de movimiento del zombie
        this.vida = 10; // Vida inicial del zombie
        this.currentImg = 0; // Índice de la imagen actual
        this.imgWalk = imgWalk; // Imagen del zombie caminando
        this.imgEat = imgEat; // Imagen del zombie comiendo
        this.img = imgWalk; // Imagen actual del zombie
    }
    mostrar() {
        // Muestra la imagen actual del zombie
        image(this.img, this.x, this.y, width_ - 20, height_ - 20);
    }
    mover() {
        // Mueve el zombie hacia la izquierda
        this.x -= this.velocidad;
    }
    colision(plantas) {
        // Revisa si el zombie colisiona con alguna planta
        for (let p of plantas) {
            if (dist(this.x, this.y, p.x, p.y) < 30) {
                this.img = this.imgEat; // Cambia a la imagen de comer
                if (frameCount % 60 == 0) {
                    p.blinking = true; // Activa el parpadeo de la planta
                    p.vida--;
                    setTimeout(() => {
                        p.blinking = false; // Desactiva el parpadeo después de 1 segundo
                    }, 1000);
                }
                return true; // Indica que hubo colisión
            }
        }
        this.img = this.imgWalk; // Cambia a la imagen de caminar si no hay colisión
        return false; // Indica que no hubo colisión
    }
}
class ZombieBucket extends Zombie {
    constructor(x, y, imgWalk, imgEat) {
        super(x, y, imgWalk, imgEat);
        this.vida = 40; // Vida inicial del ZombieBucket
        this.currentImg = 0; // Índice de la imagen actual
    }
    mostrar() {
        if (this.img[this.currentImg] !== undefined) {
            image(
                this.img[this.currentImg],
                this.x,
                this.y,
                width_ - 20,
                height_ - 20
            );
        }
        // Cambia la imagen del ZombieBucket según la vida restante
        if (this.vida == 30) {
            this.currentImg = 1;
        } else if (this.vida == 20) {
            this.currentImg = 2;
        } else if (this.vida == 10) {
            this.currentImg = 3;
        }
    }
}
class ZombieCone extends Zombie {
    constructor(x, y, imgWalk, imgEat) {
        super(x, y, imgWalk, imgEat);
        this.vida = 30; // Vida inicial del ZombieCone
        this.currentImg = 0; // Índice de la imagen actual
    }
    mostrar() {
        if (this.img[this.currentImg] !== undefined) {
            image(
                this.img[this.currentImg],
                this.x,
                this.y,
                width_ - 20,
                height_ - 20
            );
        }
        // Cambia la imagen del ZombieCone según la vida restante
        if (this.vida == 23) {
            this.currentImg = 1;
        } else if (this.vida == 15) {
            this.currentImg = 2;
        } else if (this.vida == 10) {
            this.currentImg = 3;
        }
    }
}
class Maps {
    constructor() {
        // Inicializa el mapa con valores falsos
        this.mapa = Array(5)
            .fill(false)
            .map(() => Array(9).fill(false));
    }
    draw() {
        fill(150); // Color de fondo
        // Dibuja el suelo en el mapa
        for (let i = 0; i < 5; i++) {
            image(floor, 0, height_ * i, width_, height_);
        }
        // Dibuja el césped en el mapa según las posiciones
        this.mapa.map((col, i) => {
            col.map((row, j) => {
                let grass = null;
                // Alterna entre dos tipos de césped dependiendo de la posición
                if (i % 2 == 0) {
                    grass = j % 2 == 0 ? grass1 : grass2;
                } else {
                    grass = j % 2 == 0 ? grass2 : grass1;
                }
                image(grass, width_ + width_ * j, height_ * i, width_, height_);
            });
        });
    }
}
let plantas = [];
let zombies = [];
let podadoras = [];
let soles = [];
let map = new Maps();
var height_;
var width_;
let seleccionado = null;
let tiempoRecarga = 0;
let contadorSoles = 300;
let marcadorSoles;
let perdiste = false;
let zombieP = null;
let finish = false;
document.addEventListener("DOMContentLoaded", () => {
    marcadorSoles = document.querySelector(".soles"); // Obtiene el elemento del DOM para el marcador de soles
});
function preload() {
    for (let i = 1; i <= 6; i++) {
        sunflowr.push(loadImage(`plants/sunflowr/${i}.png`));
    }
    for (let i = 1; i <= 8; i++) {
        lanzaguisantes.push(loadImage(`plants/lanzaguisantes/${i}.png`));
    }
    for (let i = 1; i <= 5; i++) {
        repetidora.push(loadImage(`plants/repetidora/${i}.png`));
    }
    for (let i = 1; i <= 3; i++) {
        nuez.push(loadImage(`plants/nuez/${i}.png`));
    }
    for (let i = 1; i <= 2; i++) {
        patatapum.push(loadImage(`plants/patatapum/${i}.png`));
    }
    zombie.walk = loadImage("./zombie.png");
    zombie.eat = loadImage("./zombies/zombie/zombie-eat.png");
    zombieFlag.eat = loadImage("./zombies/zombieFlag/zombieFlag-eat.png");
    zombieFlag.walk = loadImage("./zombies/zombieFlag/zombieFlag-walk.png");
    for (let i = 1; i <= 3; i++) {
        zombieBucket.walk.push(
            loadImage(`./zombies/zombieBucket/walk/${i}.png`)
        );
        zombieBucket.eat.push(
            loadImage(`./zombies/zombieBucket/eat/${i}.png`)
        );
        zombieCone.walk.push(
            loadImage(`./zombies/zombieCone/walk/${i}.png`)
        );
        zombieCone.eat.push(loadImage(`./zombies/zombieCone/eat/${i}.png`));
    }
    zombieBucket.walk.push(loadImage(`./zombies/zombie/zombie-walk.png`));
    zombieBucket.eat.push(loadImage(`./zombies/zombie/zombie-eat.png`));
    zombieCone.walk.push(loadImage(`./zombies/zombie/zombie-walk.png`));
    zombieCone.eat.push(loadImage(`./zombies/zombie/zombie-eat.png`));
    sol = loadImage("./sol.png");
    grass1 = loadImage("./grass1.jpg");
    grass2 = loadImage("./grass2.jpg");
    floor = loadImage("./floor.jpg");
    lawnmower = loadImage("./lawnmower.png");
}
function setup() {
    createCanvas(window.innerWidth - 100, window.innerHeight); // Crea el lienzo para el juego
    height_ = height / 5; // Calcula la altura de cada celda
    width_ = width / 10; // Calcula el ancho de cada celda
    // Inicializa las podadoras en el mapa
    for (let i = 0; i < 5; i++) {
        podadoras.push(new Podadora(0, height_ * i + 30, lawnmower));
    }
    generarZombies(); // Genera zombies al iniciar el juego
}
function draw() {
    if (finish) {
        fill(0);
        textSize(100);
        text("Haz Ganado", width_ * 4, height_ * 3 - 30);
    } else if (!perdiste) {
        background(0);
        map.draw();
        if (tiempoRecarga > 0) {
            tiempoRecarga--;
        }
        if (frameCount % (60 * 7) == 0) {
            let x = Math.floor(random(width_, width - width_ * 3));
            let y = Math.floor(random(height_ * 2));
            soles.push(new Sol(x, y));
        }
        for (let p of plantas) {
            p.detectarZombies(zombies);
            p.actualizarProyectiles(zombies);
            p.mostrar();
            if (p instanceof Sunflowr) {
                // Elimina los proyectiles del Sunflowr que han existido por más de 15 segundos
                for (let i = p.proyectiles.length - 1; i >= 0; i--) {
                    let s = p.proyectiles[i];
                    if (millis() - s.tiempoVida >= 15000) {
                        p.proyectiles.splice(i, 1);
                    }
                }
            }
            // Elimina plantas cuya vida sea 0
            if (p.vida <= 0) {
                let index = plantas.indexOf(p);
                map.mapa[p.fila][p.columna] = false;
                plantas.splice(index, 1);
            }
        }
        // Muestra y actualiza los zombies
        for (let z of zombies) {
            if (z.x <= 0) {
                perdiste = true;
                z.imgEat = zombie.eat;
                zombieP = z; // Guarda el zombie que causó la pérdida
            }
            z.mostrar();
            if (!z.colision(plantas)) {
                z.mover();
            }
            if (z.vida <= 0) {
                let index = zombies.indexOf(z);
                zombies.splice(index, 1);
            }
        }
        // Muestra las podadoras y verifica colisiones
        if (podadoras) {
            for (let po of podadoras) {
                po.mostrar();
                po.colision(zombies);
                if (po.x > width) {
                    let index = podadoras.indexOf(po);
                    podadoras.splice(index, 1);
                }
            }
        }
        for (let s of soles) {
            s.mostrar();
        }
        marcadorSoles.innerText = contadorSoles; // Actualiza el marcador de soles
        actualizarRonda(); // Actualiza la ronda actual
        // Muestra la ronda actual
        fill(0); // Color del texto
        textSize(20); // Tamaño del texto
        text("Ronda: " + nivelActual, width - 200, 100); // Muestra el número de la ronda
    } else {
        // Si el juego ha terminado con pérdida
        fill(0); // Color de fondo
        textSize(100); // Tamaño del texto
        text("Perdiste", width_ * 4, height_ * 3 - 30); // Mensaje de pérdida
        circle(zombieP.x + width_ / 2, zombieP.y + height_ / 2, width_ * 1.5); // Dibuja un círculo alrededor del zombie que causó la pérdida
        zombieP.img = zombie.eat; // Cambia la imagen del zombie a "comer"
        zombieP.mostrar(); // Muestra el zombie
    }
}
function mouseClicked() {
    if (mouseX < 0 || mouseX > width || mouseY < 0 || mouseY > height) {
        return; // Sale de la función si el clic está fuera del área válida
    }
    for (let s of soles) {
        if (s instanceof Sol) {
            // Verifica si el clic está cerca del sol (dentro de un radio de 40)
            if (dist(mouseX, mouseY, s.x, s.y) < 40) {
                let index = soles.indexOf(s); // Encuentra el índice del sol en el array
                contadorSoles += 50; // Incrementa el contador de soles
                soles.splice(index, 1); // Elimina el sol del array
                return; // Sale de la función después de recolectar el sol
            }
        }
    }
    for (let p of plantas) {
        if (p instanceof Sunflowr) {
            for (let i = 0; i < p.proyectiles.length; i++) {
                let sol = p.proyectiles[i];
                let distancia = dist(mouseX, mouseY, sol.x + 20, sol.y + 20);
                // Verifica si el clic está cerca del proyectil (dentro de un radio de 20)
                if (distancia < 20) {
                    contadorSoles += 50; // Incrementa el contador de soles
                    p.proyectiles.splice(i, 1); // Elimina el proyectil del array
                    return; // Sale de la función después de recolectar el proyectil
                }
            }
        }
    }
    if (seleccionado && tiempoRecarga <= 0 && mouseX > width_) {
        let fila = Math.floor(mouseY / height_); // Calcula la fila en la que se hizo clic
        let columna = Math.floor(mouseX / width_); // Calcula la columna en la que se hizo clic
        // Verifica si ya hay una planta en la casilla seleccionada
        if (map.mapa[fila][columna]) {
            return; // No permite colocar una nueva planta si la casilla ya está ocupada
        }
        let x = columna * width_ + width_ / 2; // Calcula la posición x de la planta
        let y = fila * height_ + height_ / 2; // Calcula la posición y de la planta
        let planta;
        // Dependiendo del tipo de planta seleccionada, crea una nueva instancia
        switch (seleccionado) {
            case "sunflowr":
                if (contadorSoles >= 50) {
                    // Verifica si hay suficientes soles
                    planta = new Sunflowr(
                        x,
                        y,
                        columna,
                        fila,
                        sunflowr,
                        width_ - 50,
                        height_ - 50
                    );
                    tiempoRecarga = 90; // Establece el tiempo de recarga para esta planta
                    contadorSoles -= 50; // Descuenta los soles
                    deseleccionar(); // Deselecciona la planta
                } else {
                    deseleccionar(); // Deselecciona la planta si no hay suficientes soles
                    return;
                }
                break;
            case "lanzaguisantes":
                if (contadorSoles >= 100) {
                    planta = new Plantas(
                        x,
                        y,
                        columna,
                        fila,
                        lanzaguisantes,
                        width_ - 50,
                        height_ - 50
                    );
                    tiempoRecarga = 60;
                    contadorSoles -= 100;
                    deseleccionar();
                } else {
                    deseleccionar();
                    return;
                }
                break;
            case "repetidora":
                if (contadorSoles >= 200) {
                    planta = new Repetidora(
                        x,
                        y,
                        columna,
                        fila,
                        repetidora,
                        width_ - 50,
                        height_ - 50
                    );
                    tiempoRecarga = 90;
                    contadorSoles -= 200;
                    deseleccionar();
                } else {
                    deseleccionar();
                    return;
                }
                break;
            case "patatapum":
                if (contadorSoles >= 25) {
                    planta = new Patatapum(
                        x,
                        y,
                        columna,
                        fila,
                        patatapum,
                        width_ - 50,
                        height_ - 50
                    );
                    tiempoRecarga = 90;
                    contadorSoles -= 25;
                    deseleccionar();
                } else {
                    deseleccionar();
                    return;
                }
                break;
            case "nuez":
                if (contadorSoles >= 50) {
                    planta = new Nuez(
                        x,
                        y,
                        columna,
                        fila,
                        nuez,
                        width_ - 50,
                        height_ - 50
                    );
                    tiempoRecarga = 90;
                    contadorSoles -= 50;
                    deseleccionar();
                } else {
                    deseleccionar();
                    return;
                }
                break;
        }
        plantas.push(planta); // Agrega la nueva planta al array de plantas
        map.mapa[fila][columna] = true; // Marca la casilla del mapa como ocupada
    }
}
// Actualiza la planta seleccionada cuando cambia la selección en el DOM
document.addEventListener("change", (e) => {
    seleccionado = e.target.value; // Establece la planta seleccionada
});
let rondaActual = 0; // Número de la ronda actual
let nivelActual = 0; // Número del nivel actual
let contadorZombies = 0; // Contador de zombies generados en la ronda actual
function generarZombies() {
    let numZombies = nivel[nivelActual][rondaActual];
    function generarZombie() {
        let z = null;
        let fila = Math.floor(random(5)); // Elige una fila aleatoria entre 0 y 4
        if (contadorZombies == 0) {
            z = new Zombie(
                width,
                fila * height_,
                zombieFlag.walk,
                zombieFlag.eat
            );
        } else {
            let zRandom = Math.floor(random(10));
            console.log(zRandom); // Imprime el número aleatorio para depuración
            if ((zRandom == 1 || zRandom == 2) && nivelActual > 1) {
                // Genera un ZombieBucket si el número aleatorio es 1 o 2 y el nivel es mayor a 1
                z = new ZombieBucket(
                    width,
                    fila * height_,
                    zombieBucket.walk,
                    zombieBucket.eat
                );
            } else if (
                (zRandom == 3 || zRandom == 4 || zRandom == 5) &&
                nivelActual > 0
            ) {
                // Genera un ZombieCone si el número aleatorio es 3, 4 o 5 y el nivel es mayor a 0
                z = new ZombieCone(
                    width,
                    fila * height_,
                    zombieCone.walk,
                    zombieCone.eat
                );
            } else {
                // Genera un Zombie estándar en otros casos
                z = new Zombie(width, fila * height_, zombie.walk, zombie.eat);
            }
        }
        zombies.push(z); // Agrega el zombie al array de zombies
        contadorZombies++; // Incrementa el contador de zombies generados
        if (contadorZombies < numZombies) {
            let retraso = random(3000, 10000); // Rango de retraso entre 3 y 10 segundos
            setTimeout(generarZombie, retraso);
        }
    }
    generarZombie(); // Inicia el proceso de generación de zombies
}
function actualizarRonda() {
    if (zombies.length === 0) {
        rondaActual++; // Avanza a la siguiente ronda
        contadorZombies = 0; // Reinicia el contador de zombies
        if (rondaActual >= nivel[nivelActual].length) {
            rondaActual = 0; // Reinicia la ronda para el siguiente nivel
            nivelActual++; // Avanza al siguiente nivel
            let card = document.querySelector(`.hidden${nivelActual}`);
            if (card) {
                card.classList.remove(`hidden${nivelActual}`); // Muestra el nuevo nivel
            }
        }
        if (nivelActual >= nivel.length) {
            finish = true; // Termina el juego
        } else {
            // Programa la generación de zombies para el inicio de la siguiente ronda
            setTimeout(generarZombies, 4000); // Retraso de 4 segundos antes de iniciar la generación de zombies
        }
    }
}
document.addEventListener("DOMContentLoaded", () => {
    let radios = document.querySelectorAll('input[type="radio"]');
    radios.forEach((radio) => {
        radio.addEventListener("change", function () {
            document
                .querySelectorAll(".plantsContainer div")
                .forEach((card) => {
                    card.classList.remove("selected");
                });
            if (this.checked) {
                this.closest("div").classList.add("selected");
            }
        });
    });
});
function deseleccionar() {
    let checkedInput = document.querySelector('input[name="plantas"]:checked');
    checkedInput.closest("div").classList.remove("selected");
    checkedInput.checked = false; // Desmarca el radio button
    seleccionado = null; // Resetea la variable de planta seleccionada
}
