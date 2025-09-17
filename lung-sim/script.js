let scene, camera, renderer, lung;
let particles = [];
let substance = 'smoking';
let amount = 0;
let lungHealth = 100;
let substanceDuration = 0;
let damagedAlveoli = 0;
let tarBuildup = 0;
let nicotineLevel = 0;
let popcornLung = 0;

document.getElementById('start-btn').addEventListener('click', () => {
    document.getElementById('instruction-modal').style.display = 'none';
    document.getElementById('container').style.display = 'block';
    init();
});

function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 200; // Move the camera back
    renderer = new THREE.WebGLRenderer({
        canvas: document.createElement('canvas'),
        antialias: true
    });
    renderer.setSize(500, 500);
    document.querySelector('.lung-container').appendChild(renderer.domElement);

    // Add lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(0, 0, 100);
    scene.add(pointLight);

    // Create lung model
    const geometry = new THREE.Group();
    const trachea = new THREE.CylinderGeometry(10, 10, 50, 32);
    const tracheaMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const tracheaMesh = new THREE.Mesh(trachea, tracheaMaterial);
    tracheaMesh.position.y = 25;
    geometry.add(tracheaMesh);

    const lung1 = new THREE.SphereGeometry(30, 32, 32);
    const lung1Material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const lung1Mesh = new THREE.Mesh(lung1, lung1Material);
    lung1Mesh.position.x = -40;
    lung1Mesh.position.y = -25;
    geometry.add(lung1Mesh);

    const lung2 = new THREE.SphereGeometry(30, 32, 32);
    const lung2Material = new THREE.MeshBasicMaterial({ color: 0x0000ff });
    const lung2Mesh = new THREE.Mesh(lung2, lung2Material);
    lung2Mesh.position.x = 40;
    lung2Mesh.position.y = -25;
    geometry.add(lung2Mesh);

    lung = geometry;
    scene.add(lung);

    // Create particles
    particles = [];
    for (let i = 0; i < 100; i++) {
        const particle = new THREE.Vector3(Math.random() * 200 - 100, Math.random() * 200 - 100, Math.random() * 200 - 100);
        particles.push(particle);
    }

    // Event listeners
    document.getElementById('submit-btn').addEventListener('click', (e) => {
        e.preventDefault();
        substance = document.getElementById('substance').value;
        amount = parseInt(document.getElementById('amount').value);
    });

    animate();
}

function animate() {
    requestAnimationFrame(animate);

    // Update lung health
    if (substance === 'smoking') {
        lungHealth -= amount * 0.01;
        tarBuildup += amount * 0.01;
        nicotineLevel += amount * 0.1;
    } else if (substance === 'vaping') {
        lungHealth -= amount * 0.005;
        popcornLung += amount * 0.01;
        nicotineLevel += amount * 0.05;
    }

    if (lungHealth < 0) lungHealth = 0;
    if (tarBuildup > 100) tarBuildup = 100;
    if (nicotineLevel > 100) nicotineLevel = 100;
    if (popcornLung > 100) popcornLung = 100;

    document.getElementById('lung-health').innerText = `Lung health: ${Math.round(lungHealth)}%`;
    document.getElementById('substance-duration').innerText = `Substance use duration: ${Math.round(substanceDuration)} years`;
    document.getElementById('damaged-alveoli').innerText = `Damaged alveoli: ${Math.round(damagedAlveoli)}%`;
    document.getElementById('tar-buildup').innerText = `Tar buildup: ${Math.round(tarBuildup)}%`;
    document.getElementById('nicotine-level').innerText = `Nicotine level: ${Math.round(nicotineLevel)}%`;
    document.getElementById('popcorn-lung').innerText = `Popcorn lung risk: ${Math.round(popcornLung)}%`;

    // Update particles
    for (let i = 0; i < particles.length; i++) {
        particles[i].x += Math.random() * 2 - 1;
        particles[i].y += Math.random() * 2 - 1;
        particles[i].z += Math.random() * 2 - 1;
    }

    // Update substance duration
    substanceDuration += 1 / 60;

    // Render
    renderer.render(scene, camera);
}