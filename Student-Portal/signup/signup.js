import { initSignupForm } from "../shared/auth.js";

const $ = (id) => document.getElementById(id);

function setRole(role) {
  $("su_role").value = role;
  $("tabLearner").classList.toggle("active",  role === "learner");
  $("tabAssessor").classList.toggle("active", role === "assessor");
}

$("tabLearner").addEventListener("click",  () => setRole("learner"));
$("tabAssessor").addEventListener("click", () => setRole("assessor"));

initSignupForm();
