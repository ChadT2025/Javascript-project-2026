import { initLoginForm } from "../shared/auth.js";

// Each login page declares its role on <body data-role="learner|assessor">
initLoginForm(document.body.dataset.role || "learner");
