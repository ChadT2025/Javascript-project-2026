# Deploying SkillsTrack to Firebase Hosting

Firebase project: `school-learning-platform-3724e`  (already set in `.firebaserc`)
Live URL after deploy: https://school-learning-platform-3724e.web.app

## One-time setup (Firebase Console — https://console.firebase.google.com)
1. Open the project **school-learning-platform-3724e**.
2. **Build → Authentication → Get started → Sign-in method → Email/Password → Enable → Save.**
3. **Build → Firestore Database → Create database** (if not already created). Pick a region, start in *production mode*
   (the rules in `firestore.rules` get deployed in step 6 below).
4. **Build → Hosting → Get started** (only if the console says Hosting isn't set up yet — just click through).

## Deploy from your computer
1. Install Node.js LTS from https://nodejs.org (skip if installed). Check: `node -v`
2. Install the Firebase CLI:  `npm install -g firebase-tools`
3. Log in:                    `firebase login`
4. Open a terminal INSIDE the `skillstrack` folder (the one containing `firebase.json`):
   `cd path\to\skillstrack`
5. Confirm the project:       `firebase use school-learning-platform-3724e`
6. Deploy everything:         `firebase deploy`
   (this publishes the website AND the Firestore security rules)
7. Open https://school-learning-platform-3724e.web.app

## First run on the live site
1. Go to the site → **Sign up** → choose **Assessor / Facilitator** → create the assessor account.
2. Sign out → **Sign up** as a **Learner**.
3. As the assessor: **Schedule → add a slot**, **Tasks → Assign Task**.
4. As the learner: **Tasks → + New Task**, Start → Submit; the assessor then **Approves** it and the
   learner's **Progress** page updates.

## Test locally before deploying (optional)
`firebase emulators:start --only hosting` → http://localhost:5000
(the pages use ES modules, so they must be served over http — double-clicking an .html file will not work)

## Re-deploying after changes
`firebase deploy` again. Only hosting:  `firebase deploy --only hosting`. Only rules: `firebase deploy --only firestore:rules`.

## Troubleshooting
- "Missing or insufficient permissions": run `firebase deploy --only firestore:rules`, and make sure you are on the right role's page.
- "auth/operation-not-allowed": Email/Password sign-in is not enabled (setup step 2).
- Old version still showing: hard refresh (Ctrl+Shift+R).
- "Hosting site not found" on deploy: do setup step 4, or run `firebase hosting:sites:create school-learning-platform-3724e`.
- Using a custom domain: add it under Authentication → Settings → Authorized domains.
