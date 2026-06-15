// ==================== UTILITY FUNCTIONS ====================
const getStoredGender = () => localStorage.getItem('selectedGender');
const setStoredGender = (gender) => localStorage.setItem('selectedGender', gender);

// ==================== PARTICLE SYSTEM ====================
class ParticleSystem {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
        this.animate();
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.init();
    }

    init() {
        this.particles = [];
        const particleCount = window.innerWidth < 768 ? 30 : 60;
        
        for (let i = 0; i < particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 3 + 1,
                speedX: (Math.random() - 0.5) * 0.5,
                speedY: (Math.random() - 0.5) * 0.5,
                opacity: Math.random() * 0.5 + 0.3
            });
        }
    }

    animate() {
        if (!this.ctx) return;
        
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        for (let particle of this.particles) {
            particle.x += particle.speedX;
            particle.y += particle.speedY;
            
            // Bounce off edges
            if (particle.x > this.canvas.width) particle.x = 0;
            if (particle.x < 0) particle.x = this.canvas.width;
            if (particle.y > this.canvas.height) particle.y = 0;
            if (particle.y < 0) particle.y = this.canvas.height;
            
            this.ctx.fillStyle = `rgba(255, 255, 255, ${particle.opacity})`;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fill();
        }
        
        requestAnimationFrame(() => this.animate());
    }
}

// ==================== CONFETTI SYSTEM ====================
class ConfettiSystem {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        
        this.ctx = this.canvas.getContext('2d');
        this.confetti = [];
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
        this.animate();
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createConfetti(count = 50) {
        for (let i = 0; i < count; i++) {
            this.confetti.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                width: Math.random() * 10 + 5,
                height: Math.random() * 10 + 5,
                speedX: (Math.random() - 0.5) * 8,
                speedY: Math.random() * 5 + 3,
                gravity: 0.2,
                color: ['#ff6b6b', '#4ecdc4', '#ffd93d', '#a8edea', '#ff9a56', '#74b9ff'][Math.floor(Math.random() * 6)],
                rotation: Math.random() * Math.PI * 2,
                rotationSpeed: (Math.random() - 0.5) * 0.1
            });
        }
    }

    animate() {
        if (!this.ctx) return;
        
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.confetti = this.confetti.filter(c => c.y < this.canvas.height);
        
        for (let piece of this.confetti) {
            piece.x += piece.speedX;
            piece.y += piece.speedY;
            piece.speedY += piece.gravity;
            piece.rotation += piece.rotationSpeed;
            
            // Air resistance
            piece.speedX *= 0.99;
            
            this.ctx.save();
            this.ctx.translate(piece.x, piece.y);
            this.ctx.rotate(piece.rotation);
            this.ctx.fillStyle = piece.color;
            this.ctx.fillRect(-piece.width / 2, -piece.height / 2, piece.width, piece.height);
            this.ctx.restore();
        }
        
        requestAnimationFrame(() => this.animate());
    }
}

// ==================== FIREWORKS SYSTEM ====================
class FireworksSystem {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
        this.animate();
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createFireworks(x, y) {
        const colors = ['#ff6b6b', '#667eea', '#ffd93d', '#764ba2', '#ff9a56', '#4ecdc4'];
        
        for (let i = 0; i < 30; i++) {
            const angle = (Math.PI * 2 * i) / 30;
            const speed = Math.random() * 5 + 3;
            
            this.particles.push({
                x: x || this.canvas.width / 2,
                y: y || this.canvas.height / 2,
                speedX: Math.cos(angle) * speed,
                speedY: Math.sin(angle) * speed,
                size: Math.random() * 4 + 2,
                color: colors[Math.floor(Math.random() * colors.length)],
                life: 1,
                maxLife: 1
            });
        }
    }

    animate() {
        if (!this.ctx) return;
        
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.particles = this.particles.filter(p => p.life > 0);
        
        for (let particle of this.particles) {
            particle.x += particle.speedX;
            particle.y += particle.speedY;
            particle.speedY += 0.1; // gravity
            particle.life -= 0.02;
            
            this.ctx.fillStyle = `rgba(${this.hexToRgb(particle.color)}, ${particle.life})`;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fill();
        }
        
        requestAnimationFrame(() => this.animate());
    }

    hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        if (result) {
            const r = parseInt(result[1], 16);
            const g = parseInt(result[2], 16);
            const b = parseInt(result[3], 16);
            return `${r}, ${g}, ${b}`;
        }
        return '255, 255, 255';
    }
}

// ==================== GENDER SELECTION PAGE ====================
function initGenderPage() {
    const boyBtn = document.querySelector('[data-gender="boy"]');
    const girlBtn = document.querySelector('[data-gender="girl"]');

    if (!boyBtn || !girlBtn) return;

    new ParticleSystem('particleCanvas');

    boyBtn.addEventListener('click', () => {
        setStoredGender('boy');
        addClickAnimation(boyBtn);
        setTimeout(() => window.location.href = 'loading.html', 600);
    });

    girlBtn.addEventListener('click', () => {
        setStoredGender('girl');
        addClickAnimation(girlBtn);
        setTimeout(() => window.location.href = 'loading.html', 600);
    });

    function addClickAnimation(btn) {
        btn.style.animation = 'none';
        setTimeout(() => {
            btn.style.animation = 'slideInUp 0.3s ease-out reverse';
        }, 10);
    }
}

// ==================== LOADING PAGE ====================
function initLoadingPage() {
    const gender = getStoredGender() || 'girl';
    new ParticleSystem('loadingParticleCanvas');
    
    const loadingTexts = [
        'Preparing your surprise...',
        'Loading birthday magic...',
        'Almost ready...',
        'Just a moment...'
    ];
    
    let currentTextIndex = 0;
    const loadingTextEl = document.getElementById('loadingText');
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');

    // Change loading text every second
    const textInterval = setInterval(() => {
        currentTextIndex = (currentTextIndex + 1) % loadingTexts.length;
        if (loadingTextEl) {
            loadingTextEl.style.animation = 'none';
            setTimeout(() => {
                if (loadingTextEl) {
                    loadingTextEl.textContent = loadingTexts[currentTextIndex];
                    loadingTextEl.style.animation = 'fadeInOut 1s ease-in-out';
                }
            }, 50);
        }
    }, 1000);

    // Progress bar animation
    let progress = 0;
    const progressInterval = setInterval(() => {
        progress += Math.random() * 25;
        if (progress > 95) progress = 95;
        
        if (progressFill) progressFill.style.width = progress + '%';
        if (progressText) progressText.textContent = Math.round(progress) + '%';
    }, 300);

    // Redirect after 5 seconds
    setTimeout(() => {
        clearInterval(textInterval);
        clearInterval(progressInterval);
        
        if (progressFill) progressFill.style.width = '100%';
        if (progressText) progressText.textContent = '100%';
        
        setTimeout(() => {
            window.location.href = 'birthday.html';
        }, 500);
    }, 5000);
}

// ==================== BIRTHDAY PAGE ====================
function initBirthdayPage() {
    const gender = getStoredGender() || 'girl';
    const body = document.body;

    // Apply theme
    if (gender === 'boy') {
        body.classList.add('boy-theme');
        const msg = document.getElementById('birthdayMessage');
        if (msg) {
            msg.textContent = 'Wishing you strength, happiness, success, and endless adventures. Have an amazing birthday!';
        }
    } else {
        body.classList.add('girl-theme');
    }

    // Initialize all systems
    new FireworksSystem('fireworksCanvas');
    initCountdown();
    initGiftBox();
    initSpinWheel();
    initQuiz();
    initMemoryWall();
    initGallery();
    initFireworksButton();
    initAudioControl();
    initSecretButton();
    initFloaters();
    startConfetti();
}

// ==================== COUNTDOWN ====================
function initCountdown() {
    const countdownNumber = document.getElementById('countdownNumber');
    if (!countdownNumber) return;

    let count = 10;
    
    const interval = setInterval(() => {
        count--;
        countdownNumber.textContent = count;
        countdownNumber.style.animation = 'none';
        
        setTimeout(() => {
            countdownNumber.style.animation = 'countdownPulse 1s ease-in-out';
        }, 10);

        if (count === 0) {
            clearInterval(interval);
            triggerConfettiExplosion();
            countdownNumber.textContent = '🎉';
        }
    }, 1000);
}

// ==================== GIFT BOX ====================
function initGiftBox() {
    const giftBox = document.getElementById('giftBox');
    const giftMessage = document.getElementById('giftMessage');
    const giftText = document.getElementById('giftText');

    if (!giftBox) return;

    const surprises = [
        '🎂 Your birthday cake is waiting!',
        '🎁 You deserve all the best things!',
        '⭐ You shine brighter than any star!',
        '💝 Your smile makes the world better!',
        '🌟 You are one of a kind!'
    ];

    let isOpened = false;

    giftBox.addEventListener('click', () => {
        if (isOpened) return;
        isOpened = true;

        giftBox.classList.add('opened');
        giftBox.style.animation = 'giftOpen 0.8s ease-out';

        setTimeout(() => {
            const randomIndex = Math.floor(Math.random() * surprises.length);
            giftText.textContent = surprises[randomIndex];
            giftMessage.style.display = 'block';
            triggerConfettiExplosion();
        }, 400);
    });
}

// ==================== SPIN WHEEL ====================
function initSpinWheel() {
    const spinButton = document.getElementById('spinButton');
    const spinWheel = document.getElementById('spinWheel');
    const spinResult = document.getElementById('spinResult');
    const resultText = document.getElementById('resultText');

    if (!spinButton) return;

    const rewards = [
        'More Happiness',
        'Unlimited Luck',
        'Success',
        'Love',
        'Money',
        'Friendship'
    ];

    let isSpinning = false;

    spinButton.addEventListener('click', () => {
        if (isSpinning) return;
        isSpinning = true;
        spinButton.disabled = true;
        spinResult.style.display = 'none';

        const randomRotation = Math.random() * 360 + 720; // At least 2 full rotations
        const currentRotation = parseInt(spinWheel.style.transform.match(/\d+/)?.[0] || 0);
        const newRotation = currentRotation + randomRotation;

        spinWheel.style.transform = `rotate(${newRotation}deg)`;
        spinWheel.classList.add('spinning');

        setTimeout(() => {
            spinWheel.classList.remove('spinning');
            const normalizedRotation = newRotation % 360;
            const segmentIndex = Math.floor((360 - normalizedRotation) / 60) % 6;
            
            resultText.textContent = rewards[segmentIndex];
            spinResult.style.display = 'block';
            
            triggerConfettiExplosion();
            
            isSpinning = false;
            spinButton.disabled = false;
        }, 4000);
    });
}

// ==================== QUIZ ====================
function initQuiz() {
    const quizContainer = document.getElementById('quizContainer');
    if (!quizContainer) return;

    const questions = [
        {
            question: "What's your favorite color?",
            options: ['Red', 'Blue', 'Yellow', 'Pink']
        },
        {
            question: "What's your favorite food?",
            options: ['Pizza', 'Cake', 'Tacos', 'Sushi']
        },
        {
            question: "What's your favorite hobby?",
            options: ['Reading', 'Gaming', 'Sports', 'Music']
        }
    ];

    let currentQuestion = 0;
    const answers = [];

    function displayQuestion() {
        if (currentQuestion >= questions.length) {
            showQuizResult();
            return;
        }

        const question = questions[currentQuestion];
        const quizCard = quizContainer.querySelector('.quiz-card');
        if (!quizCard) return;

        quizCard.innerHTML = `
            <h3 id="quizQuestion">${question.question}</h3>
            <div class="quiz-options" id="quizOptions"></div>
        `;

        const optionsContainer = document.getElementById('quizOptions');
        question.options.forEach((option, index) => {
            const btn = document.createElement('button');
            btn.className = 'quiz-option';
            btn.textContent = option;
            btn.addEventListener('click', () => {
                answers[currentQuestion] = option;
                btn.classList.add('selected');
                setTimeout(() => {
                    currentQuestion++;
                    displayQuestion();
                }, 500);
            });
            optionsContainer.appendChild(btn);
        });
    }

    function showQuizResult() {
        const resultDiv = document.getElementById('quizResult');
        const resultText = document.getElementById('quizResultText');

        const wishes = [
            `Your favorite ${answers[0]?.toLowerCase()} looks amazing on you! Hope your birthday is filled with as much joy as the color ${answers[0]?.toLowerCase()}.`,
            `Your love for ${answers[1]?.toLowerCase()} shows your great taste! Here's hoping your birthday is as sweet as your favorite food!`,
            `${answers[2]} is an amazing hobby! Keep doing what you love and have the best birthday ever!`,
            `You're a remarkable person with incredible taste! Make this birthday unforgettable!`
        ];

        const randomWish = wishes[Math.floor(Math.random() * wishes.length)];
        resultText.textContent = randomWish;
        resultDiv.style.display = 'block';
    }

    displayQuestion();
}

// ==================== MEMORY WALL ====================
function initMemoryWall() {
    const memoryForm = document.getElementById('memoryForm');
    const memoryInput = document.getElementById('memoryInput');
    const memoryWall = document.getElementById('memoryWall');

    if (!memoryForm) return;

    // Load existing wishes
    const existingWishes = JSON.parse(localStorage.getItem('birthdayWishes') || '[]');
    existingWishes.forEach(wish => addWishCard(wish, memoryWall));

    memoryForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const wish = memoryInput.value.trim();
        if (!wish) return;

        existingWishes.push(wish);
        localStorage.setItem('birthdayWishes', JSON.stringify(existingWishes));

        addWishCard(wish, memoryWall);
        memoryInput.value = '';
        memoryInput.focus();
    });

    function addWishCard(wish, container) {
        const card = document.createElement('div');
        card.className = 'memory-card';
        card.textContent = wish;
        container.appendChild(card);
    }
}

// ==================== GALLERY ====================
function initGallery() {
    const galleryGrid = document.getElementById('galleryGrid');
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightboxImage');
    const lightboxClose = document.getElementById('lightboxClose');

    if (!galleryGrid) return;

    const emojis = ['🎂', '🎈', '🎁', '🎉', '🎊', '⭐', '💝', '🎀', '🌟', '💫', '🎆', '🎇'];
    
    emojis.forEach((emoji) => {
        const item = document.createElement('div');
        item.className = 'gallery-item';
        item.textContent = emoji;
        item.style.cursor = 'pointer';
        
        item.addEventListener('click', () => {
            lightboxImage.textContent = emoji;
            lightboxImage.style.fontSize = '10rem';
            lightbox.classList.add('active');
        });
        
        galleryGrid.appendChild(item);
    });

    lightboxClose.addEventListener('click', () => {
        lightbox.classList.remove('active');
    });

    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            lightbox.classList.remove('active');
        }
    });
}

// ==================== FIREWORKS BUTTON ====================
function initFireworksButton() {
    const fireworksBtn = document.getElementById('fireworksBtn');
    const fireworksCanvas = document.getElementById('fireworksCanvas');

    if (!fireworksBtn) return;

    const fireworks = new FireworksSystem('fireworksCanvas');

    fireworksBtn.addEventListener('click', () => {
        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                const x = Math.random() * window.innerWidth;
                const y = Math.random() * (window.innerHeight * 0.6);
                fireworks.createFireworks(x, y);
            }, i * 200);
        }
        triggerConfettiExplosion();
    });
}

// ==================== AUDIO CONTROL ====================
function initAudioControl() {
    const audioControl = document.getElementById('audioControl');
    const birthdayAudio = document.getElementById('birthdayAudio');

    if (!audioControl) return;

    // Create a simple birthday tune using Web Audio API
    createBirthdayAudio();

    audioControl.addEventListener('click', () => {
        if (birthdayAudio.paused) {
            birthdayAudio.play().catch(e => console.log('Autoplay prevented'));
            audioControl.classList.remove('muted');
        } else {
            birthdayAudio.pause();
            audioControl.classList.add('muted');
        }
    });

    // Try to autoplay
    birthdayAudio.play().catch(e => {
        audioControl.classList.add('muted');
    });
}

function createBirthdayAudio() {
    // This creates a simple silent audio - in production, replace with actual audio file
    const audio = document.getElementById('birthdayAudio');
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();

    oscillator.connect(gain);
    gain.connect(audioContext.destination);

    // Birthday tune notes (simplified)
    const notes = [
        { freq: 440, time: 0.5 },
        { freq: 440, time: 0.5 },
        { freq: 494, time: 1 },
        { freq: 440, time: 1 },
        { freq: 587, time: 1 },
        { freq: 523, time: 2 }
    ];

    // Note: In production, use an actual audio file instead
    // This is just a placeholder
}

// ==================== SECRET BUTTON ====================
function initSecretButton() {
    const secretButton = document.getElementById('secretButton');
    if (!secretButton) return;

    setTimeout(() => {
        secretButton.style.display = 'block';
    }, 20000); // Show after 20 seconds

    secretButton.addEventListener('click', () => {
        alert('You are awesome! 🎉\n\nYou found the secret surprise!');
        triggerConfettiExplosion();
    });
}

// ==================== FLOATERS (Hearts & Stars) ====================
function initFloaters() {
    const container = document.getElementById('floatersContainer');
    if (!container) return;

    function createFloater() {
        const floater = document.createElement('div');
        floater.className = 'floater ' + (Math.random() > 0.5 ? 'heart' : 'star');
        floater.textContent = Math.random() > 0.5 ? '❤️' : '⭐';
        floater.style.left = Math.random() * 100 + '%';
        floater.style.top = Math.random() * 100 + '%';
        floater.style.setProperty('--tx', (Math.random() - 0.5) * 100 + 'px');

        container.appendChild(floater);

        setTimeout(() => floater.remove(), 5000);
    }

    // Create floaters periodically
    setInterval(createFloater, 2000);
}

// ==================== CONFETTI ====================
function startConfetti() {
    const confettiContainer = document.getElementById('confettiContainer');
    if (!confettiContainer) return;

    function createConfettiPiece() {
        const piece = document.createElement('div');
        piece.className = 'confetti-piece';
        piece.style.left = Math.random() * 100 + '%';
        piece.style.top = '0px';
        piece.textContent = ['🎉', '🎊', '🎈', '⭐', '💝'][Math.floor(Math.random() * 5)];
        piece.style.fontSize = Math.random() * 20 + 20 + 'px';
        piece.style.position = 'fixed';
        piece.style.pointerEvents = 'none';
        piece.style.zIndex = 40;
        piece.style.animation = `floatAndFade ${Math.random() * 3 + 3}s linear forwards`;

        confettiContainer.appendChild(piece);

        setTimeout(() => piece.remove(), 6000);
    }

    // Create confetti periodically
    const interval = setInterval(createConfettiPiece, 300);

    // Stop after 30 seconds
    setTimeout(() => clearInterval(interval), 30000);
}

function triggerConfettiExplosion() {
    const confettiContainer = document.getElementById('confettiContainer');
    if (!confettiContainer) return;

    for (let i = 0; i < 30; i++) {
        setTimeout(() => {
            const piece = document.createElement('div');
            piece.className = 'confetti-piece';
            piece.style.left = Math.random() * 100 + '%';
            piece.style.top = '50%';
            piece.textContent = ['🎉', '🎊', '🎈', '⭐', '💝', '🎁', '🎂'][Math.floor(Math.random() * 7)];
            piece.style.fontSize = Math.random() * 30 + 30 + 'px';
            piece.style.position = 'fixed';
            piece.style.pointerEvents = 'none';
            piece.style.zIndex = 40;
            piece.style.animation = `floatAndFade 2.5s ease-out forwards`;

            confettiContainer.appendChild(piece);

            setTimeout(() => piece.remove(), 2500);
        }, i * 30);
    }
}

// ==================== INITIALIZE PAGE ====================
document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('[data-gender]')) {
        initGenderPage();
    } else if (document.querySelector('.loading-page')) {
        initLoadingPage();
    } else if (document.querySelector('.birthday-page')) {
        initBirthdayPage();
    }
});

// ==================== SMOOTH PAGE TRANSITIONS ====================
document.addEventListener('beforeunload', () => {
    document.body.style.opacity = '0.7';
    document.body.style.transition = 'opacity 0.3s ease-out';
});

// Prevent back button
window.addEventListener('popstate', (e) => {
    e.preventDefault();
});
