Javascript-project-2026
A JavaScript + Firebase learner support portal for managing tasks, bookings, and progress tracking — built as a team project for the NSSA JavaScript Programmer skills programme.

SkillsTrack Learner Support Portal

A browser-based portal that helps learners manage tasks, book support sessions, track progress and play a short coding mini-game — built with JavaScript, Firebase and GitHub as part of the NSSA TPC JavaScript Programmer Skills Programme (SP-220373).

Project Overview

SkillsTrack Training Centre currently tracks learner goals, tasks, support bookings and progress across separate documents and messages, making it hard for assessors to see outstanding work or who needs help. This project delivers a single web app where learners can register, manage their own tasks, book support sessions, view their progress and play a small learning game — all backed by a Firebase database.

Client Brief Summary

Build a Learner Support Portal that:
- Lets learners register, sign in and manage their own data.
- Stores and manages data (create, read, update, delete) in Firebase.
- Shows a dashboard with task totals, completed/outstanding work and progress calculations.
- Includes a support-booking form, search/filter tools and a small coding mini-game.
- Is built and version-controlled as a team using GitHub.

Project Objectives

- Deliver a working, readable, testable front-end app connected to Firebase.
- Demonstrate solid JavaScript fundamentals (variables, functions, arrays, loops, conditionals, DOM events).
- Demonstrate Firebase Authentication, Realtime Database and REST CRUD operations.
- Show genuine team collaboration through Git branches, commits, pull requests and reviews.
- Every team member must be able to explain their own contribution and the app as a whole.

Technologies

| Area | Technology |
| Core development | HTML5, CSS3, JavaScript (ES6+) |
| Database | Firebase Realtime Database |
| Authentication | Firebase Authentication |
| REST communication | Firebase REST API (GET, POST, PUT/PATCH, DELETE) |
| Framework/Library | *(add once approved by assessor — e.g. for the mini-game)* |
| Version control | Git & GitHub |
| CI | GitHub Actions (basic lint/test check) |

Development Tools

- Visual Studio Code (or another assessor-approved IDE)
- ESLint / Prettier (formatting & linting)
- Browser DevTools (console, breakpoints, debugger)
- Git & GitHub

Team Members & Responsibilities

| Member | Focus Area | Responsible For |
|---|---|---|
| **Brian** | Planning & Testing | Flowcharts, programming life-cycle plan, testing/debugging log (3+ logged bugs) |
| **Modise** | Logic & OOP | Class design, pseudocode, core JS logic — functions, arrays/loops/conditionals, map/filter/reduce |
| **Chad** | UI & GitHub | Wireframes, DOM & events, environment setup, GitHub repo & collaboration setup, final polish & review |

**Shared responsibility:** GitHub collaboration (branches, pull requests, commit history) needs regular contributions from *all three* members — commit early and often, not one big dump at the end. Code style/formatting and each person's debugging notes belong to whoever writes that section of code.

**Month 1 deadline:** end of August 2026

Repository Structure

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

Git Branching Strategy

main — protected, always working/deployable. No one commits directly to main.
  Each member works on their own **feature branch**, e.g.:
  - feature/brian-testing-plan
  - feature/modise-oop-logic
  - feature/chad-github-ui
- Branch naming: `feature/<name>-<short-description>`
- Open a **Pull Request** to merge into main. At least one team member must review before merging.
- Resolve merge conflicts as a team and note how they were handled (this is assessed).

  Contribution Guidelines

1. Pull the latest main before starting new work: git pull origin main
2. Create a feature branch for your task.
3. Commit often with clear messages, e.g. `feat: add task completion toggle`, `fix: correct progress percentage calculation`.
4. Push your branch and open a Pull Request.
5. Get at least one review before merging.
6. Delete the branch after merging.
7. Update the Project Board as your task status changes.

Setup Instructions

  bash
1. Clone the repository
git clone <repo-url>
cd Learner-Support-Portal

2. Create your feature branch
git checkout -b feature/your-name-your-task

3. Open the project in VS Code
code .

4. Add your Firebase config (see docs/ for details — never commit real keys/secrets)


How to Run the Project

1. Open index.html in a browser (e.g. via the VS Code "Live Server" extension), **or**
2. Serve it locally with any static server of your choice.
3. Ensure your Firebase project keys are set up locally (do **not** commit them — see Security note below).

Project Milestones

| Milestone | Target Date |
|---|---|
| Planning docs done (flowchart, class design, wireframe) | Fri, 7 Aug 2026 |
| Core features built off the plans | Mon 10 – Wed 12 Aug 2026 |
| Polish (cookies, dialogs, print) + assessor review booked | Thu, 13 Aug 2026 |
| Final review, cleanup & Month 1 submission | Fri, 14 Aug 2026 |
| Month 2: Auth, Firebase CRUD, OOP, game, final integration | See project brief |

CHANGELOG

See [`CHANGELOG.md`](./CHANGELOG.md) for a running log of notable changes, dated and attributed to each contributor.

Links

- Figma / design link: *add link here*
- Project Board: *add link here*
- Client Brief / full project document: docs/Client Brief

References

- QCTO JavaScript Programmer Skills Programme Document (SP-220373)
- JavaScript Programmer Curriculum Document (Curriculum Code 900219-000-00-00)

Security Note

- Never commit passwords, API keys, service-account files or other secrets to this repository.
- Firebase database rules must not allow unrestricted public read/write access.
- All user input must be validated before being written to Firebase.



*Built by Team Chad · Modise · Brian for the NSSA TPC JavaScript Programmer Skills Programme.*


Project Documentation

This README serves as our week-by-week log of work completed by each team member.

Team
Chad
Modise
Brian
How to use this doc

Each week has a section below. Under each week, fill in what you worked on, any blockers, and next steps. Update your own subsection when you finish work for the week.

Week 1
Chad
What I worked on:
Blockers:
Next steps:

Modise
What I worked on:
Blockers:
Next steps:

Brian
What I worked on:
Blockers:
Next steps:

Week 2
Chad
What I worked on:
Blockers:
Next steps:

Modise
What I worked on:
Blockers:
Next steps:

Brian
What I worked on:
Blockers:
Next steps:

Week 3
Chad
What I worked on:
Blockers:
Next steps:

Modise
What I worked on:
Blockers:
Next steps:

Brian
What I worked on:
Blockers:
Next steps:

Week 4
Chad
What I worked on:
Blockers:
Next steps:

Modise
What I worked on:
Blockers:
Next steps:

Brian
What I worked on:
Blockers:
Next steps:

Week 5
Chad
What I worked on:
Blockers:
Next steps:

Modise
What I worked on:
Blockers:
Next steps:

Brian
What I worked on:
Blockers:
Next steps:

Week 6
Chad
What I worked on:
Blockers:
Next steps:

Modise
What I worked on:
Blockers:
Next steps:

Brian
What I worked on:
Blockers:
Next steps:

Week 7
Chad
What I worked on:
Blockers:
Next steps:

Modise
What I worked on:
Blockers:
Next steps:

Brian
What I worked on:
Blockers:
Next steps:

Week 8
Chad
What I worked on:
Blockers:
Next steps:

Modise
What I worked on:
Blockers:
Next steps:

Brian
What I worked on:
Blockers:
Next steps: