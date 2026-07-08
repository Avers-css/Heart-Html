const canvas = document.getElementById('heartCanvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const textToDisplay = "I love you";
const particles = [];
const particleCount = 200; // Количество надписей в контуре сердца

// Математическая формула для получения точек сердца
function getHeartPoint(t) {
    const scale = Math.min(canvas.width, canvas.height) * 0.022; 
    const x = 16 * Math.pow(Math.sin(t), 3);
    const y = 13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t);
    return {
        x: x * scale,
        y: -y * scale
    };
}

class Particle {
    constructor(targetX, targetY) {
        // Начальная точка появления "змейки" — центр экрана
        this.x = canvas.width / 2;
        this.y = canvas.height / 2;
        
        this.targetX = targetX;
        this.targetY = targetY;
        
        this.speed = 0.04; // Скорость движения частиц к своим местам
        this.baseFontSize = 10 + Math.random() * 6;
        this.fontSize = this.baseFontSize;
        
        this.alpha = 0; 
        this.maxAlpha = 0.4 + Math.random() * 0.6;
        this.active = false; 
    }

    activate() {
        this.active = true;
    }

    update(pulseScale) {
        if (!this.active) return;

        // Плавное проявление прозрачности
        if (this.alpha < this.maxAlpha) {
            this.alpha += 0.05;
        }

        // Вычисление конечной точки с учетом пульсации
        const currentTargetX = canvas.width / 2 + this.targetX * pulseScale;
        const currentTargetY = canvas.height / 2 + this.targetY * pulseScale;

        // Плавная интерполяция движения к цели
        this.x += (currentTargetX - this.x) * this.speed;
        this.y += (currentTargetY - this.y) * this.speed;
        
        this.fontSize = this.baseFontSize * pulseScale;
    }

    draw() {
        if (!this.active) return;
        
        ctx.fillStyle = `rgba(255, 75, 140, ${this.alpha})`; // Розовый цвет текста
        ctx.font = `${this.fontSize}px Arial, sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(textToDisplay, this.x, this.y);
    }
}

// Генерируем точки сердца по кругу (от 0 до 2*PI)
for (let i = 0; i < particleCount; i++) {
    const t = (i / particleCount) * Math.PI * 2;
    const point = getHeartPoint(t);
    particles.push(new Particle(point.x, point.y));
}

let activeIndex = 0;
const spawnSpeed = 1; // Скорость выхода змейки (сколько частиц открывать за кадр)
let time = 0;

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Поочередно активируем частицы, создавая эффект змейки
    if (activeIndex < particles.length) {
        for (let i = 0; i < spawnSpeed; i++) {
            if (activeIndex < particles.length) {
                particles[activeIndex].activate();
                activeIndex++;
            }
        }
    }

    // Рассчитываем пульсацию
    time += 0.05;
    const pulseScale = 1 + 0.07 * Math.sin(time);

    // Обновляем и рисуем активные частицы
    particles.forEach(p => {
        p.update(pulseScale);
        p.draw();
    });

    requestAnimationFrame(animate);
}

animate();
