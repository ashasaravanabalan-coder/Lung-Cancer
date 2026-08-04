/* ================================================================
   Aegis Lung AI – Unified Application Logic
   Handles: SPA navigation, Form Validation, AI Prediction Engine,
            Dynamic Treatment Recommendations, PDF Export
   ================================================================ */

const state = {
    currentStep: 1,
    totalSteps: 6,
    patientIdCounter: 1,
    patientData: {},
    results: {}
};

// ==========================================
// 1. INITIALIZATION & SPA NAVIGATION
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    // Nav Buttons
    document.getElementById('btn-start-form').addEventListener('click', () => switchSection('section-form'));
    document.getElementById('btn-new-patient').addEventListener('click', () => {
        window.location.reload(); // simple reset
    });

    // Form Stepper Logic
    setupFormLogic();

    // Generate Patient ID
    const saved = localStorage.getItem('aegis_pid_counter');
    if (saved) state.patientIdCounter = parseInt(saved) + 1;
    document.getElementById('patientId').value = `LC-${new Date().getFullYear()}-${String(state.patientIdCounter).padStart(4, '0')}`;
});

function switchSection(sectionId) {
    document.querySelectorAll('.screen-section').forEach(s => s.classList.remove('active'));
    document.getElementById(sectionId).classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ==========================================
// 2. FORM LOGIC (Validation & Stepper)
// ==========================================
function setupFormLogic() {
    // Smoking conditional
    document.querySelectorAll('input[name="smoking"]').forEach(r => {
        r.addEventListener('change', () => {
            document.getElementById('smokingDetails').style.display = document.getElementById('smokingYes').checked ? 'block' : 'none';
        });
    });

    // File Uploads Visual
    const files = ['fileCT', 'fileXray', 'fileBiopsy', 'filePET'];
    files.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.addEventListener('change', function() {
                const label = document.getElementById(id.replace('file', 'fname-').toLowerCase());
                const box = document.getElementById(id.replace('file', 'upload-').toLowerCase());
                if (this.files.length) {
                    label.textContent = this.files[0].name;
                    box.classList.add('has-file');
                } else {
                    label.textContent = 'No file selected';
                    box.classList.remove('has-file');
                }
            });
        }
    });

    // Navigation Buttons
    document.getElementById('btnNext').addEventListener('click', handleNextStep);
    document.getElementById('btnPrev').addEventListener('click', handlePrevStep);
    
    // Declaration Checkbox
    document.getElementById('declarationCheck').addEventListener('change', function () {
        document.getElementById('btnSubmit').disabled = !this.checked;
    });

    // Submit Action
    document.getElementById('btnSubmit').addEventListener('click', handleSubmit);
}

function handleNextStep() {
    if (!validateStep(state.currentStep)) return;
    
    // mark completed
    document.querySelector(`.step[data-step="${state.currentStep}"]`).classList.add('completed');
    
    state.currentStep++;
    showFormStep(state.currentStep);
}

function handlePrevStep() {
    state.currentStep--;
    showFormStep(state.currentStep);
}

function showFormStep(n) {
    document.querySelectorAll('.form-step').forEach(s => s.classList.remove('active'));
    document.getElementById(`step-${n}`).classList.add('active');

    document.querySelectorAll('.step').forEach(s => {
        const sn = parseInt(s.dataset.step);
        s.classList.toggle('active', sn === n);
    });

    document.getElementById('btnPrev').disabled = n === 1;
    document.getElementById('btnNext').style.display = n === state.totalSteps ? 'none' : 'inline-flex';
    document.getElementById('btnSubmit').style.display = n === state.totalSteps ? 'inline-flex' : 'none';

    if (n === state.totalSteps) buildReviewSummary();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function validateStep(n) {
    let valid = true;
    if (n === 1) {
        const name = document.getElementById('patientName');
        const age = document.getElementById('age');
        
        if (!name.value.trim()) { name.closest('.field').classList.add('invalid'); valid = false; }
        else { name.closest('.field').classList.remove('invalid'); }
        
        if (!age.value || age.value < 1) { age.closest('.field').classList.add('invalid'); valid = false; }
        else { age.closest('.field').classList.remove('invalid'); }
    }
    return valid;
}

// Helpers for reading form
const val = id => document.getElementById(id)?.value || '';
const radio = name => document.querySelector(`input[name="${name}"]:checked`)?.value || 'No';
const checks = name => [...document.querySelectorAll(`input[name="${name}"]:checked`)].map(c => c.value);

function buildReviewSummary() {
    const c = document.getElementById('reviewSummary');
    let h = `<h4><span class="material-icons-outlined">person</span> Details</h4>
             <div class="review-grid">
               <div class="review-item">Name: <strong>${val('patientName')}</strong></div>
               <div class="review-item">Age: <strong>${val('age')}</strong></div>
             </div>`;
    c.innerHTML = h;
}

function handleSubmit() {
    // Collect all data
    state.patientData = {
        name: val('patientName'), id: val('patientId'), age: parseInt(val('age')), gender: radio('gender'), 
        height: val('height'), weight: val('weight'), blood: val('bloodGroup'),
        smoking: radio('smoking'), cigs: parseInt(val('cigsPerDay')) || 0, years: parseInt(val('smokingYears')) || 0,
        alcohol: radio('alcohol'), family: radio('familyHistory'), prevCancer: val('prevCancer'), 
        pollution: val('airPollution'), occupation: checks('occupation'), diseases: checks('diseases'),
        symptoms: checks('symptoms'), severity: val('severity'), duration: val('duration'),
        genes: {
            EGFR: { res: val('egfr-result'), mut: val('egfr-mutation') },
            ALK:  { res: val('alk-result'),  fusion: radio('alk-fusion') },
            ROS1: { res: val('ros1-result'), fusion: radio('ros1-fusion') },
            MET:  { res: val('met-result'),  mut: val('met-alteration') },
            BRAF: { res: val('braf-result'), mut: val('braf-mutation') },
            KRAS: { res: val('kras-result'), mut: val('kras-mutation') },
            TP53: { res: val('tp53-result'), mut: val('tp53-mutation') }
        }
    };

    // Increment PID
    localStorage.setItem('aegis_pid_counter', String(state.patientIdCounter));

    // Show Dashboard loading screen
    switchSection('section-dashboard');
    document.getElementById('ai-loading-screen').style.display = 'flex';
    document.getElementById('dashboard-content').style.display = 'none';

    // Simulate AI processing time
    setTimeout(() => {
        runAIEngine();
        updateDashboardUI();
        document.getElementById('ai-loading-screen').style.display = 'none';
        document.getElementById('dashboard-content').style.display = 'block';
        
        // Init 3D Lung if available
        if(window.initThreeJSLung) {
            window.initThreeJSLung(state.results);
        }
    }, 2000);
}


// ==========================================
// 3. AI PREDICTION ENGINE
// ==========================================
function runAIEngine() {
    const d = state.patientData;
    let r = {};

    // 3.1 Calculate Risk Points (0 - 100 base scale)
    let risk = 5; // base
    
    // Demographics
    if (d.age > 45) risk += 10;
    if (d.age > 60) risk += 15;
    
    // History
    if (d.smoking === 'Yes') { risk += 25; risk += Math.min((d.years * 0.5), 15); }
    if (d.family === 'Yes') risk += 10;
    if (d.prevCancer !== 'None') risk += 15;
    if (d.pollution === 'High') risk += 5;
    if (d.diseases.includes('COPD')) risk += 10;
    
    // Symptoms
    const syms = d.symptoms;
    const severeMods = d.severity === 'Severe' ? 1.5 : (d.severity === 'Moderate' ? 1.2 : 1.0);
    
    let symRisk = 0;
    if(syms.includes('Coughing Blood')) symRisk += 25;
    if(syms.includes('Chest Pain')) symRisk += 15;
    if(syms.includes('Shortness of Breath')) symRisk += 15;
    if(syms.includes('Weight Loss')) symRisk += 10;
    if(syms.includes('Bone Pain')) symRisk += 20; // Mets indicator
    if(syms.includes('Headache')) symRisk += 10;  // Mets indicator
    
    risk += (symRisk * severeMods);

    // Genes
    let activeMutations = [];
    Object.keys(d.genes).forEach(g => {
        if (d.genes[g].res === 'Positive') {
            activeMutations.push(g);
            risk += 15;
        }
    });

    // Probability & Tier
    r.probability = Math.min(Math.round(risk), 98);
    if (r.probability < 20) r.riskTier = 'Low';
    else if (r.probability < 50) r.riskTier = 'Moderate';
    else r.riskTier = 'High';

    // 3.2 Cancer Type & Subtype Logic
    if (r.probability < 25) {
        r.diagnosis = "Benign / Low Suspicion";
        r.subtype = "N/A";
    } else {
        r.diagnosis = "Malignant Neoplasm Suspicion";
        if (activeMutations.includes('EGFR') || activeMutations.includes('ALK') || activeMutations.includes('ROS1')) {
            r.subtype = "Non-Small Cell Lung Cancer (Adenocarcinoma)";
        } else if (d.smoking === 'Yes' && activeMutations.includes('TP53')) {
            r.subtype = "Small Cell Lung Cancer (SCLC)";
        } else if (d.smoking === 'Yes' && activeMutations.includes('KRAS')) {
            r.subtype = "Non-Small Cell Lung Cancer (Squamous Cell / Adeno)";
        } else {
            r.subtype = "Non-Small Cell Lung Cancer (NOS)";
        }
    }

    // 3.3 TNM Staging Prediction
    let T = 1, N = 0, M = 0;
    
    // T (Tumor size indicator)
    if (syms.includes('Coughing Blood') || syms.includes('Chest Pain')) T = 3;
    else if (syms.includes('Shortness of Breath') || syms.length >= 4) T = 2;
    
    // N (Nodes)
    if (syms.length > 5 || activeMutations.includes('TP53')) N = 1;
    if (r.probability > 75) N = 2;
    
    // M (Metastasis)
    if (syms.includes('Bone Pain') || syms.includes('Headache')) M = 1;

    r.tnm = `T${T} N${N} M${M}`;
    
    if(M === 1) r.stage = 'Stage IV';
    else if(N === 2) r.stage = 'Stage IIIA/B';
    else if(N === 1) r.stage = 'Stage II';
    else if(T >= 2) r.stage = 'Stage IB';
    else r.stage = r.probability < 25 ? 'N/A' : 'Stage IA';
    
    r.metastasis = M === 1 ? 'Positive (Suspected)' : 'Negative';
    r.lymphNodes = N > 0 ? 'Involved' : 'Clear';

    // 3.4 Lobe / Localization Simulation
    const isSmoker = d.smoking === 'Yes';
    r.affectedLung = (isSmoker || Math.random() > 0.5) ? 'Right' : 'Left';
    if(r.affectedLung === 'Right') {
        r.affectedLobe = T >= 3 ? 'Upper & Middle Lobe' : 'Upper Lobe';
    } else {
        r.affectedLobe = 'Upper Lobe';
    }
    
    // 3.5 Treatment Recommendations
    let recs = [];
    
    if (r.probability < 25) {
        recs.push({ title: 'Monitoring', desc: 'Routine follow-up in 6-12 months. Smoking cessation if applicable.', icon: 'calendar-check' });
    } else {
        if (M === 0 && (r.stage.includes('I') || r.stage === 'Stage II')) {
            recs.push({ title: 'Surgical Resection', desc: 'Primary lobectomy or wedge resection recommended for localized disease.', icon: 'scalpel' });
        }
        
        // Targeted Therapies
        if (activeMutations.includes('EGFR')) {
            recs.push({ title: 'Targeted Therapy (EGFR)', desc: 'Use Tyrosine Kinase Inhibitors (TKIs) like Osimertinib.', icon: 'pills' });
        }
        if (activeMutations.includes('ALK')) {
            recs.push({ title: 'Targeted Therapy (ALK)', desc: 'ALK inhibitors such as Alectinib or Brigatinib indicated.', icon: 'pills' });
        }
        if (activeMutations.includes('ROS1')) {
            recs.push({ title: 'Targeted Therapy (ROS1)', desc: 'Crizotinib or Entrectinib indicated for ROS1 fusions.', icon: 'pills' });
        }
        if (activeMutations.includes('KRAS')) {
            recs.push({ title: 'Targeted Therapy (KRAS)', desc: 'Sotorasib indicated if KRAS G12C mutation is confirmed.', icon: 'pills' });
        }
        
        // General Chemotherapy / Immuno
        if (activeMutations.length === 0 || r.subtype.includes('Small Cell')) {
            recs.push({ title: 'Platinum-Doublet Chemotherapy', desc: 'Standard cytotoxic regimen (e.g. Cisplatin/Etoposide).', icon: 'flask' });
        }
        if (M === 1 || N >= 1) {
            recs.push({ title: 'Immunotherapy', desc: 'PD-L1 inhibitors (Pembrolizumab) recommended to boost immune response.', icon: 'shield-virus' });
        }
        
        // Radiology Followup
        recs.push({ title: 'Imaging Follow-up', desc: 'PET/CT scan to confirm metastatic spread and staging.', icon: 'x-ray' });
    }
    
    r.treatments = recs;
    r.activeMutations = activeMutations;
    r.confidence = Math.min(80 + (d.symptoms.length > 0 ? 10 : 0) + (Object.keys(d.genes).some(k=>d.genes[k].res==='Positive') ? 5 : 0), 98);
    
    state.results = r;
}


// ==========================================
// 4. UI DASHBOARD UPDATES
// ==========================================
function updateDashboardUI() {
    const d = state.patientData;
    const r = state.results;

    // Col 1: Summary
    document.getElementById('dash-name').textContent = d.name;
    document.getElementById('dash-id').textContent = d.id;
    document.getElementById('dash-age-gender').textContent = `${d.age} / ${d.gender}`;
    document.getElementById('dash-blood').textContent = d.blood || 'N/A';
    document.getElementById('dash-smoking').textContent = d.smoking === 'Yes' ? `Yes (${d.cigs} / ${d.years} yrs)` : 'Never';
    document.getElementById('dash-prev-cancer').textContent = d.prevCancer;

    // Cancer Prediction
    const probEl = document.getElementById('dash-prob');
    probEl.textContent = `${r.probability}%`;
    probEl.className = `value huge ${r.probability >= 50 ? 'text-red' : (r.probability > 25 ? 'text-accent' : 'text-green')}`;
    
    document.getElementById('dash-type').textContent = r.diagnosis;
    document.getElementById('dash-subtype').textContent = r.subtype;

    // Risk Assessment
    const rlEl = document.getElementById('dash-risk-level');
    rlEl.textContent = r.riskTier;
    rlEl.className = `status-chip ${r.riskTier.toLowerCase()}`;
    
    document.getElementById('dash-stage').textContent = r.stage;
    document.getElementById('dash-metastasis').textContent = r.metastasis;
    document.getElementById('dash-lymph').textContent = r.lymphNodes;
    
    document.getElementById('dash-confidence-fill').style.width = `${r.confidence}%`;
    document.getElementById('dash-confidence-text').textContent = `${r.confidence}%`;

    // 3D Controls
    document.getElementById('dash-affected-lung').textContent = r.affectedLung;
    document.getElementById('dash-affected-lobe').textContent = r.affectedLobe;

    // Gene Mutations
    const gList = document.getElementById('dash-genes-list');
    gList.innerHTML = '';
    Object.keys(d.genes).forEach(g => {
        const gene = d.genes[g];
        const span = document.createElement('span');
        const isMut = gene.res === 'Positive';
        span.className = `gene-chip ${isMut ? 'mutated' : ''}`;
        
        let detail = gene.mut || gene.fusion;
        span.textContent = `${g}: ${isMut ? detail : 'Wildtype'}`;
        gList.appendChild(span);
    });

    // Treatments
    const tList = document.getElementById('dash-treatments');
    tList.innerHTML = '';
    r.treatments.forEach(t => {
        const li = document.createElement('li');
        li.innerHTML = `<h5><i class="fa-solid fa-${t.icon}"></i> ${t.title}</h5><p>${t.desc}</p>`;
        tList.appendChild(li);
    });

    // Clinical Summary
    document.getElementById('dash-clinical-summary').textContent = 
        `Patient presents with ${d.symptoms.length || 'no'} symptoms of ${d.severity} severity lasting ${d.duration}. ` + 
        `Risk factors include ${d.smoking === 'Yes' ? 'smoking' : 'non-smoking'} history and ${d.occupation.join(', ')} exposure.`;
}


// ==========================================
// 5. PDF REPORT GENERATION
// ==========================================
document.getElementById('btn-download-pdf').addEventListener('click', () => {
    const d = state.patientData;
    const r = state.results;
    
    // Fill template
    document.getElementById('pdf-date').textContent = new Date().toLocaleDateString();
    document.getElementById('pdf-name').textContent = d.name;
    document.getElementById('pdf-id').textContent = d.id;
    document.getElementById('pdf-age').textContent = d.age;
    document.getElementById('pdf-gender').textContent = d.gender;
    
    document.getElementById('pdf-prob').textContent = `${r.probability}%`;
    document.getElementById('pdf-diagnosis').textContent = `${r.diagnosis} (${r.subtype})`;
    document.getElementById('pdf-stage').textContent = `${r.stage} [${r.tnm}]`;
    document.getElementById('pdf-region').textContent = `${r.affectedLung} Lung, ${r.affectedLobe}`;
    
    document.getElementById('pdf-genes').innerHTML = r.activeMutations.length > 0 
        ? `Positive for: ${r.activeMutations.map(g => `${g} (${d.genes[g].mut || d.genes[g].fusion})`).join(', ')}` 
        : 'All tested genes Wildtype (Negative).';
        
    const pT = document.getElementById('pdf-treatment');
    pT.innerHTML = '';
    r.treatments.forEach(t => {
        pT.innerHTML += `<li><strong>${t.title}:</strong> ${t.desc}</li>`;
    });
    
    // Show hidden block
    const element = document.getElementById('pdf-report-template');
    element.style.display = 'block';
    
    html2pdf().set({
        margin: 10,
        filename: `${d.id}_Aegis_Report.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    }).from(element).save().then(() => {
        element.style.display = 'none'; // hide again
    });
});
