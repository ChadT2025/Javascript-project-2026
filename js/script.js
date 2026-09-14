const DB='skillstrack_users', SESSION='skillstrack_session';
const getUsers=()=>JSON.parse(localStorage.getItem(DB)||'[]');
const saveUsers=u=>localStorage.setItem(DB,JSON.stringify(u));
const msg=(id,t,err=true)=>{const e=document.getElementById(id);e.textContent=t;e.style.display='block';e.className=err?'error':'success';setTimeout(()=>e.style.display='none',3500)}
 
function createAccount(e){
e.preventDefault();
const name=document.getElementById('su_name').value.trim();
const email=document.getElementById('su_email').value.trim().toLowerCase();
const pass=document.getElementById('su_pass').value;
const role=document.getElementById('su_role').value;
if(!name||!email||!pass) return msg('su_err','Fill all fields');
if(pass.length<4) return msg('su_err','Password min 4 chars');
let users=getUsers();
if(users.find(u=>u.email===email)) return msg('su_err','Email already registered');
users.push({id:Date.now(),name,email,password:pass,role,progress:Math.floor(Math.random()*60)+20});
saveUsers(users);
msg('su_ok','Account created! Go to login...',false);
setTimeout(()=>location.href = role==='assessor'? 'assessor-login.html' : 'index.html',1200);
}
function studentLogin(e){
e.preventDefault();
const input=document.getElementById('st_user').value.trim().toLowerCase();
const pass=document.getElementById('st_pass').value;
let users=getUsers(); if(users.length===0) seed(); users=getUsers();
const u=users.find(x=>(x.email===input||x.name.toLowerCase()===input)&&x.password===pass&&x.role!=='assessor');
if(!u) return msg('st_err','Invalid student credentials. Create account first.');
localStorage.setItem(SESSION,JSON.stringify(u));
msg('st_ok','Welcome '+u.name+'!',false);
setTimeout(()=>location.href='student.html',800);
}
function assessorLogin(e){
e.preventDefault();
const input=document.getElementById('as_user').value.trim().toLowerCase();
const pass=document.getElementById('as_pass').value;
let users=getUsers(); if(users.length===0) seed(); users=getUsers();
const u=users.find(x=>(x.email===input||x.name.toLowerCase()===input)&&x.password===pass);
if(!u) return msg('as_err','Invalid. Try assessor@skillstrack.com / 1234');
if(u.role!=='assessor'&& input!=='assessor@skillstrack.com') return msg('as_err','This is not an assessor account');
localStorage.setItem(SESSION,JSON.stringify(u));
msg('as_ok','Welcome Assessor '+u.name+'!',false);
setTimeout(()=>location.href='assessor.html',800);
}
function seed(){
const demo=[
  {id:1,name:'Sam Assessor',email:'assessor@skillstrack.com',password:'1234',role:'assessor',progress:61},
  {id:2,name:'Alex Morgan',email:'alex@student.com',password:'1234',role:'learner',progress:75},
  {id:3,name:'Jordan Lee',email:'jordan@student.com',password:'1234',role:'learner',progress:45},
  {id:4,name:'Casey Rivera',email:'casey@student.com',password:'1234',role:'learner',progress:90},
  {id:5,name:'Sam Wu',email:'sam@student.com',password:'1234',role:'learner',progress:60}
];
saveUsers(demo);
}
 
// === ASSESSOR NEW LOGIC ===
function loadAssessor(){
const s=JSON.parse(localStorage.getItem(SESSION)||'null');
if(!s){location.href='assessor-login.html';return}
if(s.role!=='assessor' && s.email!=='assessor@skillstrack.com'){ if(confirm('Not assessor. Go to student dashboard?')) location.href='student.html'; else location.href='assessor-login.html'; return}
document.getElementById('assessorName').textContent=s.name;
document.getElementById('welcomeName').textContent=s.name;
document.getElementById('lastLogin').textContent='Last login: Today at '+new Date().toLocaleTimeString()+' - 5 submissions awaiting review';
renderLearners();
document.getElementById('totalLearners').textContent=getUsers().filter(u=>u.role!=='assessor').length;
document.getElementById('learnerCount').textContent=getUsers().filter(u=>u.role!=='assessor').length;
}
function showTab(tab){
document.querySelectorAll('.tab-content').forEach(t=>t.classList.remove('active'));
document.querySelectorAll('.sidebar.nav').forEach(n=>n.classList.remove('active'));
document.getElementById('tab-'+tab).classList.add('active');
document.getElementById('nav-'+tab).classList.add('active');
const titles={overview:'Assessor Overview',learners:'Learners Management',reviews:'Reviews & Submissions',schedule:'Schedule & Sessions'};
document.getElementById('tabTitle').textContent=titles[tab];
}
function renderLearners(){
const users=getUsers().filter(u=>u.role!=='assessor');
const body=document.getElementById('learnersBody');
if(!body) return;
body.innerHTML=users.map(u=>`
  <tr>
   <td><span class="avatar">${u.name.substring(0,2).toUpperCase()}</span> ${u.name}</td>
   <td>${u.email}</td>
   <td><div class="progress-mini"><span style="width:${u.progress}%"></span></div> ${u.progress}%</td>
   <td><span class="badge ${u.progress>70?'reviewed':'pending'}">${u.progress>70?'Active':'Learning'}</span></td>
   <td><button class="action-btn" onclick="alert('View ${u.name}')">View</button><button class="action-btn" onclick="alert('Message ${u.name}')">Message</button></td>
  </tr>
`).join('');
}
function filterLearners(){
const q=document.getElementById('learnerSearch').value.toLowerCase();
document.querySelectorAll('#learnersBody tr').forEach(tr=>{ tr.style.display=tr.textContent.toLowerCase().includes(q)?'':'none' });
}
function filterReviews(type,btn){
document.querySelectorAll('#tab-reviews.filter').forEach(b=>b.classList.remove('active')); btn.classList.add('active');
document.querySelectorAll('#reviewsBody tr').forEach(tr=>{
  const isPending=tr.innerHTML.includes('Pending');
  if(type==='all') tr.style.display='';
  else if(type==='pending') tr.style.display=isPending?'':'none';
  else tr.style.display=!isPending?'':'none';
});
}
function loadStudent(){
const s=JSON.parse(localStorage.getItem(SESSION)||'null');
if(!s){location.href='index.html';return}
const el1=document.getElementById('studentName'); if(el1) el1.textContent=s.name;
const el2=document.getElementById('studentEmail'); if(el2) el2.textContent=s.email;
}
function logout(){localStorage.removeItem(SESSION);location.href='index.html'}
function markReviewed(el){el.textContent='Reviewed';el.className='badge reviewed';}
function viewSchedule(){showTab('schedule')}