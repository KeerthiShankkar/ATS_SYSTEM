# 🧠 ATS System – AI-Powered Resume Screening & Job Matching

An intelligent, end-to-end **Applicant Tracking System** that automates resume parsing, evaluates candidate-job fit using semantic similarity, and enables recruiters to manage job postings and applications with ease.

> Built with **Node.js**, **MongoDB**, **Redis**, **BullMQ**, **Xenova MiniLM Embeddings**, and **Express.js**

---

## 🔥 Key Features

- ✅ **Job Posting & Application Portal**
  - Recruiters can create job posts with detailed descriptions
  - Candidates can submit applications and upload resumes

- 🤖 **AI Resume Scoring Engine**
  - Extracts and parses resumes
  - Compares resume with job descriptions using embeddings
  - Calculates semantic match score with **MiniLM**

- 🧵 **Asynchronous Processing Pipeline**
  - Background queue using **BullMQ + Redis**
  - Scalable and efficient resume evaluation

- 🛡️ **Role-Based Access Control (RBAC)**
  - Admins, recruiters, and candidates have different access rights
  - Powered by policy-based authorization middleware

- 📊 **ATS Report Dashboard**
  - Stores and displays match scores, analysis, and fit insights for each application

---

## 🏗️ Tech Stack

| Category     | Stack / Tool                     |
|--------------|----------------------------------|
| Backend      | Node.js, Express.js              |
| Database     | MongoDB (via Mongoose)           |
| Queue System | Redis, BullMQ                    |
| Embeddings   | Xenova MiniLM                    |
| PDF Parsing  | pdfjs-dist                       |
| Auth         | JWT (JSON Web Tokens)            |
| Hosting      | [Your deployment platform here]  |

---
WORKFLOW OF THE ATS (MESSAGE QUEUE PART)
![ATS Workflow](https://github.com/KeerthiShankkar/ATS_SYSTEM/blob/main/assets/workflowATS.png?raw=true)
## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/KeerthiShankkar/ATS_SYSTEM.git
cd ATS_SYSTEM

