// Initialize Three.js scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('background').appendChild(renderer.domElement);

// Create particles
const geometry = new THREE.BufferGeometry();
const vertices = [];

for (let i = 0; i < 10000; i++) {
    vertices.push(
        Math.random() * 2000 - 1000,
        Math.random() * 2000 - 1000,
        Math.random() * 2000 - 1000
    );
}

geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));

const material = new THREE.PointsMaterial({ color: 0x00ffff, size: 2 });

const particles = new THREE.Points(geometry, material);
scene.add(particles);

camera.position.z = 1000;

// Animation
function animate() {
    requestAnimationFrame(animate);

    particles.rotation.x += 0.001;
    particles.rotation.y += 0.002;

    renderer.render(scene, camera);
}

animate();

// Resize handler
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Scroll animations
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

const sections = gsap.utils.toArray('section');
let currentSection = 0;
let isScrolling = false;

function goToSection(index) {
    if (isScrolling) return;

    isScrolling = true;
    gsap.to(window, {
        duration: 1,
        scrollTo: { y: index * window.innerHeight, autoKill: false },
        ease: 'power2.inOut',
        onComplete: () => {
            currentSection = index;
            updateActiveLink();
            isScrolling = false;
        }
    });
}

// Smooth scroll for navigation links
document.querySelectorAll('nav a').forEach((anchor, index) => {
    anchor.addEventListener('click', (e) => {
        e.preventDefault();
        goToSection(index);
    });
});

// Update active navigation link
function updateActiveLink() {
    document.querySelectorAll('nav a').forEach((link, index) => {
        if (index === currentSection) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// Wheel event for section switching
let wheelTimeout;
window.addEventListener('wheel', (e) => {
    e.preventDefault();
    clearTimeout(wheelTimeout);

    wheelTimeout = setTimeout(() => {
        if (e.deltaY > 0 && currentSection < sections.length - 1) {
            goToSection(currentSection + 1);
        } else if (e.deltaY < 0 && currentSection > 0) {
            goToSection(currentSection - 1);
        }
    }, 5);
}, { passive: false });

// Key event for section switching
window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown' && currentSection < sections.length - 1) {
        goToSection(currentSection + 1);
    } else if (e.key === 'ArrowUp' && currentSection > 0) {
        goToSection(currentSection - 1);
    }
});

// Particle interaction
document.addEventListener('mousemove', (event) => {
    const mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    const mouseY = -(event.clientY / window.innerHeight) * 2 + 1;

    gsap.to(particles.rotation, {
        x: mouseY * 0.5,
        y: mouseX * 0.5,
        duration: 2
    });
});

// Initialize skill progress bars
gsap.utils.toArray('.progress').forEach(progress => {
    gsap.to(progress, {
        width: progress.style.width,
        duration: 1.5,
        ease: 'power2.out',
        scrollTrigger: {
            trigger: progress,
            start: 'top 80%',
            end: 'bottom 20%',
            scrub: 1
        }
    });
});

// Hover effect for interactive elements
const interactiveElements = document.querySelectorAll('.about-item, .language-item, .project, .social-icon');

interactiveElements.forEach(element => {
    element.addEventListener('mouseenter', () => {
        gsap.to(element, {
            scale: 1.05,
            duration: 0.3,
            ease: 'power2.out'
        });
    });

    element.addEventListener('mouseleave', () => {
        gsap.to(element, {
            scale: 1,
            duration: 0.3,
            ease: 'power2.out'
        });
    });
});

// Click effect (explosion)
function createExplosion(x, y) {
    const explosion = document.createElement('div');
    explosion.className = 'explosion';
    document.body.appendChild(explosion);

    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.style.position = 'absolute';
        particle.style.width = '10px';
        particle.style.height = '10px';
        particle.style.backgroundColor = '#00ffff';
        particle.style.borderRadius = '50%';
        explosion.appendChild(particle);

        gsap.fromTo(particle,
            {
                x: 0,
                y: 0,
                opacity: 1
            },
            {
                x: (Math.random() - 0.5) * 200,
                y: (Math.random() - 0.5) * 200,
                opacity: 0,
                duration: 1,
                ease: 'power2.out'
            }
        );
    }

    gsap.to(explosion, {
        opacity: 0,
        duration: 1,
        ease: 'power2.out',
        onComplete: () => {
            document.body.removeChild(explosion);
        }
    });

    explosion.style.left = x + 'px';
    explosion.style.top = y + 'px';
}

// Add click event listener to all sections
document.querySelectorAll('section').forEach((section,i) => {
    section.addEventListener('click', (e) => {
        createExplosion(e.clientX, e.clientY+window.innerHeight*i);
    });
});

// Initial call to set the active link
updateActiveLink();


// Mobile menu toggle
const menuToggle = document.querySelector('.menu-toggle');
const navMenu = document.querySelector('nav ul');

menuToggle.addEventListener('click', () => {
    navMenu.classList.toggle('show');
});

// Close menu when a link is clicked
document.querySelectorAll('nav a').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('show');
    });
});


function isMobile() {
    return window.matchMedia("(max-width: 767px)").matches;
}

