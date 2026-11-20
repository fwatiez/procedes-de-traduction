
let bank = [];
let questions = [];
let current = 0;
let answers = [];
let selected = null;
let labels = {};
const $ = (id) => document.getElementById(id);

async function init(){
  const response = await fetch('data/questions.json');
  const data = await response.json();
  bank = data.questions;
  data.categories.forEach(c => labels[c.id] = c.name);
  renderDefinitions(data.categories);
}
function renderDefinitions(categories){
  $('definitions').innerHTML = categories.map(c => `
    <article class="definition-card">
      <h3>${escapeHtml(c.name)}</h3>
      <p>${escapeHtml(c.definition)}</p>
      <div class="example"><p><strong>Anglais :</strong> <em>${escapeHtml(c.example_en)}</em></p><p><strong>Français :</strong> ${escapeHtml(c.example_fr)}</p></div>
      <p class="explanation">${escapeHtml(c.explanation)}</p>
    </article>`).join('');
}
function escapeHtml(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function shuffle(a){const x=[...a];for(let i=x.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[x[i],x[j]]=[x[j],x[i]];}return x;}
function startQuiz(){
  const count = $('question-count').value;
  questions = shuffle(bank).slice(0, count==='all'?bank.length:Number(count));
  answers = Array(questions.length).fill(null); current=0; selected=null;
  $('results').hidden=true; $('quiz').hidden=false;
  renderQuestion();
  $('quiz').scrollIntoView({behavior:'smooth',block:'start'});
}
function renderQuestion(){
  const q=questions[current]; selected=answers[current];
  $('progress').textContent=`Question ${current+1} / ${questions.length}`;
  $('answered-count').textContent=`${answers.filter(a=>a!==null).length} réponse(s) enregistrée(s)`;
  $('progress-bar').style.width=`${(current/questions.length)*100}%`;
  $('question-content').innerHTML=`
    <p class="question-label">Identifiez le procédé de traduction</p>
    <p class="english">${escapeHtml(q.english)}</p>
    <p class="french">${escapeHtml(q.french)}</p>
    <div class="answers">${shuffle(Object.keys(labels)).map((id,i)=>`
      <button class="answer ${selected===id?'selected':''}" data-id="${id}">
        <span class="letter">${String.fromCharCode(65+i)}</span><span>${escapeHtml(labels[id])}</span>
      </button>`).join('')}</div>`;
  document.querySelectorAll('.answer').forEach(btn=>btn.addEventListener('click',()=>{
    selected=btn.dataset.id; answers[current]=selected;
    document.querySelectorAll('.answer').forEach(b=>b.classList.toggle('selected',b===btn));
    $('next-question').disabled=false;
    $('next-question').textContent=current===questions.length-1?'Voir la correction':'Question suivante';
    $('answered-count').textContent=`${answers.filter(a=>a!==null).length} réponse(s) enregistrée(s)`;
  }));
  $('next-question').disabled=selected===null;
  $('next-question').textContent=current===questions.length-1?'Voir la correction':'Question suivante';
}
function nextQuestion(){
  if(answers[current]===null)return;
  if(current<questions.length-1){current++;renderQuestion();}
  else showResults();
}
function showResults(){
  const score=questions.reduce((n,q,i)=>n+(answers[i]===q.correct?1:0),0);
  $('quiz').hidden=true;$('results').hidden=false;
  $('results').innerHTML=`
    <p class="eyebrow">Correction finale</p><h2>Résultat</h2>
    <p class="score">${score} / ${questions.length}</p>
    <p>${Math.round(score/questions.length*100)} % de bonnes réponses</p>
    <h3>Correction détaillée</h3>
    ${questions.map((q,i)=>{const ok=answers[i]===q.correct;return `
      <article class="review-item">
        <h4>${i+1}. ${escapeHtml(q.english)}</h4>
        <p>${escapeHtml(q.french)}</p>
        <p class="${ok?'correct-text':'incorrect-text'}"><strong>${ok?'Bonne réponse':'Réponse incorrecte'}</strong> — ${escapeHtml(labels[q.correct])}</p>
        ${!ok?`<p>Votre réponse : ${escapeHtml(labels[answers[i]]||'Aucune réponse')}</p>`:''}
        <p class="explanation">${escapeHtml(q.explanation)}</p>
      </article>`}).join('')}
    <button id="restart" class="button">Recommencer avec un nouveau tirage</button>`;
  $('progress-bar').style.width='100%';
  $('restart').addEventListener('click',startQuiz);
  $('results').scrollIntoView({behavior:'smooth',block:'start'});
}
$('start-quiz').addEventListener('click',startQuiz);
$('next-question').addEventListener('click',nextQuestion);
init().catch(()=>{$('definitions').textContent="Impossible de charger le cours. Vérifiez que le site est ouvert depuis son hébergement ou un serveur local.";});
