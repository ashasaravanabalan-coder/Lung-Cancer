/* ==========================================================================
   Aegis Lung AI - 3D Lung Anatomical Visualization
   Author: Antigravity AI
   Implements 3D modeling of lungs, airways, tumors, and metastasis based on AI Prediction.
   ========================================================================== */

let scene, camera, renderer, controls;
let lungGroup, airwayGroup, vesselsGroup, tumorGroup, lymphGroup, metastasisGroup, pleuraGroup;
let leftLungMesh, rightLungMesh;
let primaryTumorMesh;
let labels = [];

const HEALTHY_COLOR = 0x22c55e; // Medical Green
const CANCER_COLOR = 0xef4444; // Red

function initThreeJSLung(results) {
    const container = document.getElementById('lung-3d-container');
    if (!container) return;
    
    // Clear any previous canvas
    const oldCanvas = container.querySelector('canvas');
    if (oldCanvas) oldCanvas.remove();
    
    document.getElementById('viewer-loading').style.display = 'flex';

    // 1. Setup Scene, Camera, Renderer
    scene = new THREE.Scene();
    scene.background = null; 
    
    const width = container.clientWidth;
    const height = container.clientHeight;
    camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 1, 15);
    
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);
    
    // 2. Setup OrbitControls
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxDistance = 30;
    controls.minDistance = 5;
    
    // 3. Setup Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);
    
    const dirLight1 = new THREE.DirectionalLight(0xffffff, 1.0);
    dirLight1.position.set(10, 10, 10);
    scene.add(dirLight1);

    // 4. Create Groups
    lungGroup = new THREE.Group();
    airwayGroup = new THREE.Group();
    tumorGroup = new THREE.Group();
    
    scene.add(lungGroup);
    scene.add(airwayGroup);
    scene.add(tumorGroup);

    // 5. Build anatomical models procedurally
    buildLungs(results);
    buildAirwayTree();
    buildTumor(results);
    
    // Setup reset view button
    document.getElementById('btn-reset-view').addEventListener('click', () => {
        controls.reset();
        camera.position.set(0, 1, 15);
    });
    
    // 6. Hide loading overlay
    document.getElementById('viewer-loading').style.display = 'none';
    
    // 7. Handle Window Resize
    window.addEventListener('resize', onWindowResize);
    
    // 8. Animation Loop
    animate();
}

function buildLungs(results) {
    // Determine lung color
    const isCancer = results.probability >= 50;
    const lungColor = isCancer ? CANCER_COLOR : HEALTHY_COLOR;

    const lungMatConfig = {
        color: lungColor,
        transparent: true,
        opacity: 0.5,
        roughness: 0.2,
        side: THREE.DoubleSide
    };
    
    const lungMat = new THREE.MeshPhysicalMaterial(lungMatConfig);

    // Left Lung
    const leftLobe = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 32), lungMat);
    leftLobe.scale.set(1.8, 3.5, 1.5);
    leftLobe.position.set(-2.2, 0, 0);
    leftLobe.rotation.set(0, 0, -0.1);
    lungGroup.add(leftLobe);

    // Right Lung
    const rightLobe = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 32), lungMat);
    rightLobe.scale.set(1.9, 3.6, 1.6);
    rightLobe.position.set(2.2, 0, 0);
    rightLobe.rotation.set(0, 0, 0.1);
    lungGroup.add(rightLobe);
}

function buildAirwayTree() {
    const airwayMat = new THREE.MeshStandardMaterial({
        color: 0xe2e8f0,
        roughness: 0.5,
        side: THREE.DoubleSide
    });

    const trachea = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.45, 4.0, 16), airwayMat);
    trachea.position.set(0, 3.2, 0);
    airwayGroup.add(trachea);

    const leftBronch = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.28, 2.2, 16), airwayMat);
    leftBronch.position.set(-1.0, 1.1, 0.2);
    leftBronch.rotation.set(0.1, 0, 0.85);
    airwayGroup.add(leftBronch);

    const rightBronch = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.3, 1.8, 16), airwayMat);
    rightBronch.position.set(0.9, 1.2, 0.1);
    rightBronch.rotation.set(0.15, 0, -0.65);
    airwayGroup.add(rightBronch);
}

function buildTumor(results) {
    if (results.probability < 25) return; // No tumor

    const tumorGeo = new THREE.SphereGeometry(0.7, 32, 32);
    const posAttr = tumorGeo.attributes.position;
    for (let i = 0; i < posAttr.count; i++) {
        let vx = posAttr.getX(i), vy = posAttr.getY(i), vz = posAttr.getZ(i);
        const noise = Math.sin(vx * 4.0) * Math.cos(vy * 4.0) * 0.08;
        posAttr.setX(i, vx + vx * noise);
        posAttr.setY(i, vy + vy * noise);
        posAttr.setZ(i, vz + vz * noise);
    }
    tumorGeo.computeVertexNormals();

    const tumorMat = new THREE.MeshStandardMaterial({
        color: 0x8b0000,
        emissive: 0xff0000,
        emissiveIntensity: 0.5
    });

    primaryTumorMesh = new THREE.Mesh(tumorGeo, tumorMat);
    
    // Position based on affected lung
    if (results.affectedLung === 'Right') {
        primaryTumorMesh.position.set(2.4, 1.2, 0.5);
    } else {
        primaryTumorMesh.position.set(-2.0, 0.9, 0.6);
    }

    // Scale based on stage
    if (results.stage.includes('III') || results.stage === 'Stage IV') {
        primaryTumorMesh.scale.set(1.5, 1.5, 1.5);
    } else {
        primaryTumorMesh.scale.set(0.8, 0.8, 0.8);
    }

    tumorGroup.add(primaryTumorMesh);
    buildLabels(results);
}

function buildLabels(results) {
    const container = document.getElementById('labels-container');
    container.innerHTML = '';
    
    const labelData = [
        { label: 'Trachea', pos: new THREE.Vector3(0, 3.8, 0.1) }
    ];

    if (results.probability >= 25 && primaryTumorMesh) {
        labelData.push({ 
            label: `Detected Tumor (${results.stage})`, 
            pos: primaryTumorMesh.position.clone().add(new THREE.Vector3(0,1,0)),
            isCancer: true
        });
    }

    labels = labelData.map(d => {
        const div = document.createElement('div');
        div.className = `scene-label ${d.isCancer ? 'cancer-label' : ''}`;
        div.textContent = d.label;
        container.appendChild(div);
        return { element: div, pos: d.pos };
    });
}

function updateHtmlLabels() {
    if (!labels.length || !camera) return;
    const widthHalf = renderer.domElement.clientWidth / 2;
    const heightHalf = renderer.domElement.clientHeight / 2;
    
    labels.forEach(lbl => {
        const vector = lbl.pos.clone().project(camera);
        if (vector.z > 1) {
            lbl.element.classList.remove('visible');
            return;
        }
        
        lbl.element.classList.add('visible');
        const x = (vector.x * widthHalf) + widthHalf;
        const y = -(vector.y * heightHalf) + heightHalf;
        lbl.element.style.left = `${x}px`;
        lbl.element.style.top = `${y}px`;
    });
}

function onWindowResize() {
    const container = document.getElementById('lung-3d-container');
    if (!container) return;
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
}

function animate() {
    requestAnimationFrame(animate);
    if (controls) controls.update();
    
    if (lungGroup) lungGroup.rotation.y = Math.sin(Date.now() * 0.0003) * 0.1;
    if (airwayGroup) airwayGroup.rotation.y = Math.sin(Date.now() * 0.0003) * 0.1;
    if (tumorGroup) tumorGroup.rotation.y = Math.sin(Date.now() * 0.0003) * 0.1;
    
    if (primaryTumorMesh) {
        primaryTumorMesh.material.emissiveIntensity = 0.4 + Math.sin(Date.now() * 0.005) * 0.2;
    }

    updateHtmlLabels();
    if (renderer && scene && camera) renderer.render(scene, camera);
}

window.initThreeJSLung = initThreeJSLung;
