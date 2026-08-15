# SkillsTrack Learner Support Portal

A JavaScript + Firebase learner support portal for managing tasks, bookings, and progress tracking — built as a team project for the NSSA JavaScript Programmer Skills Programme (SP-220373).

![MIT License](https://img.shields.io/badge/license-MIT-blue)

---

## Project Overview

SkillsTrack Training Centre currently tracks learner goals, tasks, support bookings and progress across separate documents and messages, making it hard for assessors to see outstanding work or who needs help.

This project delivers a single web app where learners can:

- Register and sign in
- Manage their own tasks
- Book support sessions
- View their progress
- Play a small learning game

All data is backed by a Firebase database.

---

## Client Brief Summary

Build a Learner Support Portal that:

- Lets learners register, sign in and manage their own data
- Stores and manages data (create, read, update, delete) in Firebase
- Shows a dashboard with task totals, completed/outstanding work and progress calculations
- Includes a support-booking form, search/filter tools and a small coding mini-game
- Is built and version-controlled as a team using GitHub

---

## Project Objectives

- Deliver a working, readable, testable front-end app connected to Firebase
- Demonstrate solid JavaScript fundamentals (variables, functions, arrays, loops, conditionals, DOM events)
- Demonstrate Firebase Authentication, Realtime Database and REST CRUD operations
- Show genuine team collaboration through Git branches, commits, pull requests and reviews
- Ensure every team member can explain their own contribution and the app as a whole

---

## Technologies

| Area                | Technology                                               |
| ------------------- | -------------------------------------------------------- |
| Core development    | HTML5, CSS3, JavaScript (ES6+)                           |
| Database            | Firebase Realtime Database                               |
| Authentication      | Firebase Authentication                                  |
| REST communication  | Firebase REST API (GET, POST, PUT/PATCH, DELETE)         |
| Framework / library | _Add once approved by assessor — e.g. for the mini-game_ |
| Version control     | Git & GitHub                                             |
| CI                  | GitHub Actions (basic lint/test check)                   |

### Development Tools

- Visual Studio Code (or another assessor-approved IDE)
- ESLint / Prettier (formatting & linting)
- Browser DevTools (console, breakpoints, debugger)
- Git & GitHub

---

## Team Members & Responsibilities

| Member     | Focus Area         | Responsible For                                                                                       |
| ---------- | ------------------ | ----------------------------------------------------------------------------------------------------- |
| **Brian**  | Planning & Testing | Flowcharts, programming life-cycle plan, testing/debugging log (3+ logged bugs)                       |
| **Modise** | Logic & OOP        | Class design, pseudocode, core JS logic — functions, arrays/loops/conditionals, map/filter/reduce     |
| **Chad**   | UI & GitHub        | Wireframes, DOM & events, environment setup, GitHub repo & collaboration setup, final polish & review |

> **Shared responsibility:** GitHub collaboration (branches, pull requests, commit history) needs regular contributions from all three members — commit early and often, not one big dump at the end. Code style/formatting and each person's debugging notes belong to whoever writes that section of code.

**Month 1 deadline:** end of August 2026

---

## Repository Structure

```
Learner-Support-Portal/
├── README.md
├── CHANGELOG.md
├── LICENSE
├── .gitignore
├── docs/
│   ├── Client Brief
│   ├── Requirements
│   ├── Research
│   ├── Meeting Minutes
│   ├── User Stories
│   ├── Use Cases
│   ├── Wireframes
│   ├── UI Designs
│   └── Test Plan
├── designs/
│   ├── Figma Link.md
│   ├── UI Mockups
│   └── Images
├── src/
├── assets/
└── presentation/
```

---

## Git Branching Strategy

- `main` is protected and always working/deployable. **No one commits directly to `main`.**
- Each member works on their own feature branch, named:

```
feature/<name>-<short-description>
```

Examples:

- `feature/brian-testing-plan`
- `feature/modise-oop-logic`
- `feature/chad-github-ui`

**Workflow:**

1. Open a Pull Request to merge into `main`.
2. At least one team member must review the PR before it's merged.
3. Resolve merge conflicts as a team, and record how each conflict was handled (this is assessed).

---

## Contribution Guidelines

1. Pull the latest `main` before starting new work:
   ```bash
   git pull origin main
   ```
2. Create a feature branch for your task:
   ```bash
   git checkout -b feature/your-name-your-task
   ```
3. Commit often with clear messages, e.g.:
   - `feat: add task completion toggle`
   - `fix: correct progress percentage calculation`
4. Push your branch and open a Pull Request.
5. Get at least one review before merging.
6. Delete the branch after merging.
7. Update the Project Board as your task status changes.

---

## Setup Instructions

```bash
# 1. Clone the repository
git clone <repo-url>
cd Learner-Support-Portal

# 2. Create your feature branch
git checkout -b feature/your-name-your-task

# 3. Open the project in VS Code
code .

# 4. Add your Firebase config
# (see docs/ for details — never commit real keys/secrets)
```

---

## How to Run the Project

- Open `index.html` in a/your browser (e.g. via the VS Code **Live Server** extension), **or**
- Serve it locally with any static server of your choice.
- Make sure your Firebase project keys are set up locally — **do not commit them** (see [Security Note](#security-note) below).

---

## Project Milestones

| Milestone                                                  | Target Date              |
| ---------------------------------------------------------- | ------------------------ |
| Planning docs done (flowchart, class design, wireframe)    | Fri, 7 Aug 2026          |
| Core features built off the plans                          | Mon 10 – Wed 12 Aug 2026 |
| Polish (cookies, dialogs, print) + assessor review booked  | Thu, 13 Aug 2026         |
| Final review, cleanup & Month 1 submission                 | Fri, 14 Aug 2026         |
| Month 2: Auth, Firebase CRUD, OOP, game, final integration | See project brief        |

---

## Links

- **Full project brief:** `docs/Client Brief`

### Figma Link

https://www.figma.com/make/jeM3MYwB52qW55eoLwU0Hn/wire-frame-design?t=StEgwdxRuOLGpqR9-1

### Project Boards

- [Chad's Tasks](https://github.com/ChadT2025/Javascript-project-2026/projects/3)
- [Modise's Tasks](https://github.com/ChadT2025/Javascript-project-2026/projects/6)
- [Brian's Tasks](https://github.com/ChadT2025/Javascript-project-2026/projects/5)

> Double-check these link to the right board — open each one on GitHub and confirm the number in the URL matches before committing.

---

## References

- QCTO JavaScript Programmer Skills Programme Document (SP-220373)
- JavaScript Programmer Curriculum Document (Curriculum Code 900219-000-00-00)

---

## Security Note

- Never commit passwords, API keys, service-account files or other secrets to this repository.
- Firebase database rules must **not** allow unrestricted public read/write access.
- All user input must be validated before being written to Firebase.

---

## Changelog

See [`CHANGELOG.md`](./CHANGELOG.md) for a running log of notable changes, dated and attributed to each contributor.

---

## Weekly Progress Log

This section serves as our week-by-week log of work completed by each team member. Update your own subsection when you finish work for the week.

<details>
<summary><strong>Week 1</strong></summary>

**Chad**

- What I worked on:
- Blockers:
- Next steps:

**Modise**

- What I worked on:
- Blockers:
- Next steps:

**Brian**

- What I worked on:
- Blockers:
- Next steps:

</details>

<details>
<summary><strong>Week 2</strong></summary>

**Chad**

- What I worked on:
- Blockers:
- Next steps:

**Modise**

- What I worked on:
- Blockers:
- Next steps:

**Brian**

- What I worked on:
- Blockers:
- Next steps:

</details>

<details>
<summary><strong>Week 3</strong></summary>

**Chad**

- What I worked on:
- Blockers:
- Next steps:

**Modise**

- What I worked on:
- Blockers:
- Next steps:

**Brian**

- What I worked on:
- Blockers:
- Next steps:

</details>

<details>
<summary><strong>Week 4</strong></summary>

**Chad**

- What I worked on:
- Blockers:
- Next steps:

**Modise**

- What I worked on:
- Blockers:
- Next steps:

**Brian**

- What I worked on:
- Blockers:
- Next steps:

</details>

<details>
<summary><strong>Week 5</strong></summary>

**Chad**

- What I worked on: Created a Low fedility wirframe and set up the ide toolkit to the repos/file.
- Blockers: Nothing major just a small delay in adding colaborators.
- Next steps: create high fedelity wireframe and complete the syntax and cookie section of the project

**Modise**

- What I worked on:
- Blockers:
- Next steps:

**Brian**

- What I worked on:
- Blockers:
- Next steps:

</details>

<details>
<summary><strong>Week 6</strong></summary>

**Chad**

- What I worked on: created a High fedelity mockup and 1 tasks prototype page as well as added cookies and dialogs to the high ffedelity wireframe and lastly set up syntax correction tools to catch errors in code.
- Blockers: Nothing major
- Next steps: Book review sesions to touch up potential problems before deadline

**Modise**

- What I worked on:
- Blockers:
- Next steps:

**Brian**

- What I worked on:
- Blockers:
- Next steps:

</details>

<details>
<summary><strong>Week 7</strong></summary>

**Chad**

- What I worked on:
- Blockers:
- Next steps:

**Modise**

- What I worked on:
- Blockers:
- Next steps:

**Brian**

- What I worked on:
- Blockers:
- Next steps:

</details>

<details>
<summary><strong>Week 8</strong></summary>

**Chad**

- What I worked on:
- Blockers:
- Next steps:

**Modise**

- What I worked on:
- Blockers:
- Next steps:

**Brian**

- What I worked on:
- Blockers:
- Next steps:

</details>

---

Built by **Team Chad · Modise · Brian** for the NSSA TPC JavaScript Programmer Skills Programme.
