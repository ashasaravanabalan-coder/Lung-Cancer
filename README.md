#  AI-Powered Lung Cancer Clinical Decision Support System

 An Intelligent Framework for Lung Cancer Risk Assessment, Staging & Personalized Clinical Decision Support

The **AI-Powered Lung Cancer Clinical Decision Support System** is an intelligent healthcare framework designed to assist in the analysis of patient information and provide structured insights for lung cancer assessment.

The system combines **clinical information, symptoms, smoking history, CT scan reports, and genetic mutation information** to estimate lung cancer risk, identify the affected lung, predict the probable cancer stage, classify risk level, and provide personalized decision-support recommendations.

The framework also provides **3D lung visualization** and **PDF-based clinical report generation** to make the results easier to understand and document.

> ⚠️ **Medical Disclaimer:** This project is an academic/research prototype intended to support clinical decision-making. It is not intended to replace professional medical diagnosis, treatment, or physician judgment.

---

##  Project Objective

Lung cancer diagnosis often requires the analysis of multiple types of information, including patient history, symptoms, imaging reports, and molecular biomarkers.

The objective of this project is to develop an integrated AI-assisted framework that can:

* Assess the probability of lung cancer
* Analyze clinical symptoms and risk factors
* Interpret structured CT scan report information
* Identify the affected lung
* Estimate the probable cancer stage
* Determine patient risk level
* Analyze relevant genetic mutations
* Generate personalized treatment-support suggestions
* Visualize affected lung regions in 3D
* Generate a clinical summary report in PDF format

---

##  Proposed System

The proposed framework follows a multimodal clinical decision-support workflow.

```text
                    ┌─────────────────────────┐
                    │     Patient Information  │
                    └────────────┬────────────┘
                                 │
          ┌──────────────────────┼──────────────────────┐
          │                      │                      │
          ▼                      ▼                      ▼
   Demographic Data        Medical History       Clinical Symptoms
          │                      │                      │
          └──────────────────────┼──────────────────────┘
                                 │
                                 ▼
                      ┌─────────────────────┐
                      │   Risk Assessment   │
                      │                     │
                      │ Rule-Based Heuristic│
                      │      Algorithm      │
                      └──────────┬──────────┘
                                 │
             ┌───────────────────┼───────────────────┐
             │                   │                   │
             ▼                   ▼                   ▼
       Cancer Risk          Cancer Stage       Risk Level
             │                   │                   │
             └───────────────────┼───────────────────┘
                                 │
                                 ▼
                     ┌──────────────────────┐
                     │ Genetic Information  │
                     │ EGFR / ALK / ROS1    │
                     │ MET / BRAF / KRAS    │
                     │ TP53                 │
                     └──────────┬───────────┘
                                │
                                ▼
                    ┌────────────────────────┐
                    │ Clinical Decision       │
                    │ Support & Recommendation│
                    └───────────┬────────────┘
                                │
                    ┌───────────┴────────────┐
                    ▼                        ▼
             3D Lung Visualization      PDF Report
```

---

#  Key Features

## 1. Patient Data Collection

The system considers multiple patient-level parameters, including:

* Demographic information
* Medical history
* Smoking habits
* Clinical symptoms
* Previous medical conditions
* CT scan report information
* Genetic mutation results

This allows the system to consider multiple factors rather than relying on a single prediction variable.

---

## 2. Rule-Based Heuristic Algorithm

A **Rule-Based Heuristic Algorithm** is used to combine clinical indicators and generate structured decision-support outputs.

The algorithm evaluates relevant clinical factors and assigns appropriate weights to different indicators.

Conceptually:

```text
Patient Data
     ↓
Feature Extraction
     ↓
Feature Weight Assignment
     ↓
Clinical Rule Evaluation
     ↓
Risk Score
     ↓
Decision Support
```

The framework can evaluate factors such as:

* Smoking history
* Persistent cough
* Chest pain
* Shortness of breath
* Abnormal CT findings
* Nodule characteristics
* Lymph-node involvement
* Metastatic findings
* Genetic mutations

---

## 3. Lung Cancer Risk Assessment

The system estimates a patient's lung cancer risk based on the combined clinical evidence.

The risk assessment can be represented as:

```text
Risk Score =
Σ (Feature Weight × Clinical Evidence)
```

Based on the resulting score, the patient can be categorized into different risk levels.

```text
Clinical Features
       ↓
Weighted Analysis
       ↓
Risk Score
       ↓
┌──────────────┬──────────────┬──────────────┐
│     Low      │   Moderate   │     High     │
└──────────────┴──────────────┴──────────────┘
```

---

## 4. CT Scan Report Analysis

The framework can use information extracted from CT scan reports to support clinical assessment.

Relevant findings may include:

* Nodule presence
* Nodule size
* Nodule location
* Nodule characteristics
* Lung involvement
* Lymph-node involvement
* Possible metastatic findings

These findings are combined with other patient information during the decision-support process.

---

## 5. Cancer Stage Assessment

The framework provides support for estimating the probable lung cancer stage based on available clinical and imaging information.

```text
Stage I
   ↓
Localized disease

Stage II
   ↓
Larger/local disease or nearby involvement

Stage III
   ↓
Advanced local/regional involvement

Stage IV
   ↓
Distant metastatic disease
```

The staging output is intended as **decision support** and requires confirmation using established clinical staging procedures.

---

## 6. Affected Lung Identification

The system analyzes available imaging/report information to identify whether the suspected abnormality is associated with:

* Left lung
* Right lung
* Bilateral involvement

This information is also used by the visualization component.

---

#  Genetic Mutation Analysis

The framework incorporates molecular information associated with lung cancer.

The supported mutation information includes:

| Gene / Mutation | Purpose                           |
| --------------- | --------------------------------- |
| **EGFR**        | Targeted therapy decision support |
| **ALK**         | Molecular characterization        |
| **ROS1**        | Targeted treatment support        |
| **MET**         | Molecular profiling               |
| **BRAF**        | Mutation-based decision support   |
| **KRAS**        | Molecular characterization        |
| **TP53**        | Risk/biological context           |

Genetic information can be combined with clinical and imaging information to provide a more comprehensive decision-support profile.

---

#  3D Lung Visualization

A major component of the framework is the visualization of lung-related findings in a three-dimensional environment.

### Visualization Technologies

* Three.js
* WebGL

### Procedural Mesh Generation

A procedural mesh generation approach can be used to create and modify the 3D lung representation.

```text
Lung Data
    ↓
Geometry Generation
    ↓
Vertex Processing
    ↓
Mesh Generation
    ↓
3D Rendering
```

### Dynamic Localization & Scaling

The visualization component can dynamically position and scale the affected region based on the identified lung and available localization information.

This helps users visually understand the reported abnormal region.

---

#  Clinical Report Generation

The framework provides PDF report generation containing important clinical decision-support information.

A generated report can include:

* Patient information
* Clinical findings
* Risk assessment
* Cancer probability
* Probable stage
* Affected lung
* Risk classification
* Genetic mutation information
* Decision-support recommendations
* 3D visualization summary

---

#  System Architecture

```text
┌───────────────────────────────────────────────┐
│              Patient Interface                │
└───────────────────────┬───────────────────────┘
                        │
                        ▼
┌───────────────────────────────────────────────┐
│              Data Collection Layer             │
│                                               │
│ Demographics | Symptoms | History | CT | Genes│
└───────────────────────┬───────────────────────┘
                        │
                        ▼
┌───────────────────────────────────────────────┐
│             Feature Analysis Layer             │
│                                               │
│ Clinical Feature Extraction                   │
│ Imaging Report Analysis                       │
│ Genetic Information Analysis                  │
└───────────────────────┬───────────────────────┘
                        │
                        ▼
┌───────────────────────────────────────────────┐
│          Rule-Based Heuristic Engine           │
│                                               │
│ Feature Weighting → Rule Evaluation → Scoring │
└───────────────────────┬───────────────────────┘
                        │
                        ▼
┌───────────────────────────────────────────────┐
│          Clinical Decision Support             │
│                                               │
│ Risk | Stage | Lung | Recommendations         │
└───────────────┬─────────────────┬─────────────┘
                │                 │
                ▼                 ▼
       ┌────────────────┐  ┌─────────────────┐
       │ 3D Visualization│  │  PDF Generation │
       └────────────────┘  └─────────────────┘
```

---

#  Technology Stack

## Artificial Intelligence & Machine Learning

* Python
* Machine Learning
* Rule-Based Heuristic Reasoning
* Clinical Decision Support
* Natural Language Processing

## Large Language Model

* Llama 3.1 8B
* LLM-assisted clinical information processing

## Backend

* FastAPI
* Python

## Frontend

* HTML
* CSS
* JavaScript

## 3D Visualization

* Three.js
* WebGL

## Data Processing

* NumPy
* Pandas
* Scikit-learn

## Reporting

* PDF generation

---

#  Project Structure

```text
Lung-Cancer/
│
├── frontend/
│   ├── index.html
│   ├── css/
│   ├── js/
│   └── assets/
│
├── backend/
│   ├── main.py
│   ├── models/
│   ├── routes/
│   ├── services/
│   └── utils/
│
├── models/
│   └── trained_models/
│
├── data/
│   └── datasets/
│
├── notebooks/
│   └── experiments/
│
├── reports/
│
├── requirements.txt
├── README.md
└── .gitignore
```

> Update the structure above if your repository uses different folder names.

---

#  Getting Started

## Prerequisites

Install:

* Python 3.9+
* pip
* Git

---

## 1. Clone the Repository

```bash
git clone https://github.com/ashasaravanabalan-coder/Lung-Cancer.git
```

```bash
cd Lung-Cancer
```

---

## 2. Create a Virtual Environment

### Windows

```bash
python -m venv venv
venv\Scripts\activate
```

### Linux / macOS

```bash
python3 -m venv venv
source venv/bin/activate
```

---

## 3. Install Dependencies

```bash
pip install -r requirements.txt
```

---

## 4. Configure Environment Variables

Create a `.env` file if your application requires API keys or service configuration.

Example:

```env
LLM_API_KEY=your_api_key
```

> Never commit API keys, passwords, database credentials, or other secrets to GitHub.

---

## 5. Run the Application

For a FastAPI backend:

```bash
uvicorn main:app --reload
```

The API can then be accessed through the FastAPI development server.

---

#  Complete Workflow

```text
User
 │
 ▼
Enter Patient Information
 │
 ▼
Clinical Symptoms & Medical History
 │
 ▼
CT Scan / Report Information
 │
 ▼
Genetic Mutation Information
 │
 ▼
Feature Extraction
 │
 ▼
Rule-Based Heuristic Analysis
 │
 ▼
Cancer Risk Estimation
 │
 ├──────────────► Cancer Probability
 │
 ├──────────────► Probable Stage
 │
 ├──────────────► Affected Lung
 │
 └──────────────► Risk Level
 │
 ▼
Personalized Decision Support
 │
 ├──────────────► 3D Lung Visualization
 │
 └──────────────► PDF Clinical Report
```

---

#  Expected Outputs

The system is designed to provide a structured patient assessment containing:

| Output                 | Description                                      |
| ---------------------- | ------------------------------------------------ |
| **Cancer Probability** | Estimated likelihood based on available evidence |
| **Cancer Stage**       | Probable stage based on analyzed findings        |
| **Affected Lung**      | Left / Right / Bilateral                         |
| **Risk Level**         | Low / Moderate / High                            |
| **Mutation Profile**   | Detected genetic mutation information            |
| **Recommendations**    | Decision-support suggestions                     |
| **3D Visualization**   | Visual representation of lung findings           |
| **Clinical Report**    | Downloadable PDF summary                         |

---



#  Medical & Research Disclaimer

This application is a **research and educational prototype**.

The predictions, risk scores, staging estimates, visualizations, and recommendations generated by the system should **not be considered a medical diagnosis or treatment prescription**.

Clinical decisions must be made by qualified healthcare professionals using appropriate medical examination, imaging, pathology, molecular testing, and established clinical guidelines.


#  Project Highlights

*  AI-assisted lung cancer assessment
*  Rule-based clinical reasoning
*  Genetic mutation analysis
*  Risk-level classification
*  Clinical decision support
*  3D lung visualization
*  Automated PDF reporting
*  LLM-assisted information processing
*  FastAPI backend
*  Interactive web interface

---

## 📌 Keywords

`Lung Cancer` `Clinical Decision Support` `Healthcare AI` `Medical AI` `Machine Learning` `Artificial Intelligence` `CT Scan Analysis` `Cancer Staging` `Genomic Analysis` `Rule-Based System` `Llama 3.1` `FastAPI` `Three.js` `WebGL` `3D Visualization`
