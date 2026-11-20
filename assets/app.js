let allQuestions = [];
let quizQuestions = [];
let currentIndex = 0;
let answers = [];

const area = document.getElementById("quiz-area");
const categorySelect = document.getElementById("category");
const countSelect = document.getElementById("question-count");

fetch("data/questions.json")
  .then(response => {
    if (!response.ok) throw new Error("Impossible de charger la banque de questions.");
    return response.json();
  })
  .then(data => { allQuestions = data; })
  .catch(() => {
    area.innerHTML = "<h3>Banque de questions indisponible</h3><p>Vérifiez que le fichier data/questions.json est bien présent.</p>";
  });

function shuffle(items) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

document.getElementById("start-quiz").addEventListener("click", () => {
  const category = categorySelect.value;
  const count = Number(countSelect.value);
  const pool = category === "all" ? allQuestions : allQuestions.filter(q => q.category === category);
  if (!pool.length) {
    area.innerHTML = "<h3>Aucune question disponible</h3><p>Cette catégorie sera alimentée prochainement.</p>";
    return;
  }
  quizQuestions = shuffle(pool).slice(0, Math.min(count, pool.length)).map(q => ({
    ...q,
    answers: shuffle(q.answers.map((answer, index) => ({ text: answer, originalIndex: index })))
  }));
  currentIndex = 0;
  answers = Array(quizQuestions.length).fill(null);
  renderQuestion();
});

function renderQuestion() {
  const q = quizQuestions[currentIndex];
  area.innerHTML = `
    <div class="quiz-question">
      <div class="quiz-topline"><span>Question ${currentIndex + 1} / ${quizQuestions.length}</span><span>${escapeHtml(q.label || "Entraînement")}</span></div>
      <h3>${escapeHtml(q.question)}</h3>
      <div class="answer-list">
        ${q.answers.map((a, i) => `<label class="answer-option"><input type="radio" name="answer" value="${a.originalIndex}" ${answers[currentIndex] === a.originalIndex ? "checked" : ""}><span>${String.fromCharCode(65+i)}. ${escapeHtml(a.text)}</span></label>`).join("")}
      </div>
      <div class="quiz-nav">
        <button class="button button-secondary" id="previous" ${currentIndex === 0 ? "disabled" : ""}>Précédent</button>
        <button class="button button-primary" id="next">${currentIndex === quizQuestions.length - 1 ? "Voir la correction" : "Suivant"}</button>
      </div>
    </div>`;
  area.querySelectorAll('input[name="answer"]').forEach(input => {
    input.addEventListener("change", event => { answers[currentIndex] = Number(event.target.value); });
  });
  document.getElementById("previous").addEventListener("click", () => { currentIndex--; renderQuestion(); });
  document.getElementById("next").addEventListener("click", () => {
    if (answers[currentIndex] === null) {
      const notice = document.createElement("p");
      notice.className = "small muted";
      notice.textContent = "Choisissez une réponse avant de continuer.";
      area.querySelector(".quiz-nav").before(notice);
      return;
    }
    if (currentIndex < quizQuestions.length - 1) { currentIndex++; renderQuestion(); }
    else renderResults();
  });
}

function renderResults() {
  const score = quizQuestions.reduce((sum, q, i) => sum + (answers[i] === q.correct ? 1 : 0), 0);
  const reviews = quizQuestions.map((q, i) => {
    const correct = answers[i] === q.correct;
    return `<article class="review-item"><strong>${i+1}. ${escapeHtml(q.question)}</strong><span class="${correct ? "good" : "bad"}">${correct ? "Bonne réponse" : "Réponse à revoir"}</span><p>Réponse attendue : <b>${escapeHtml(q.answersOriginal[q.correct])}</b></p><p>${escapeHtml(q.explanation)}</p></article>`;
  }).join("");
  area.innerHTML = `
    <div class="quiz-question">
      <div class="eyebrow">Résultat de votre entraînement</div>
      <h3>QCM terminé</h3>
      <div class="result-score">${score} / ${quizQuestions.length}</div>
      <p class="muted">Les réponses et explications sont détaillées ci-dessous. Ce résultat reste uniquement dans cette page.</p>
      <div class="review-list">${reviews}</div>
      <div class="quiz-nav"><button class="button button-primary" id="restart">Recommencer avec un nouveau tirage</button></div>
    </div>`;
  document.getElementById("restart").addEventListener("click", () => document.getElementById("start-quiz").click());
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, char => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
  })[char]);
}
