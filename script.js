// ═══════════════════════════════════════════════════════
//  ENGLISH ZONE – script.js  (versión completa)
// ═══════════════════════════════════════════════════════

// ─── PROGRESO ───────────────────────────────────────────
function getProgress() { return parseInt(localStorage.getItem('ez_progress') || '0'); }
function setProgress(val) { localStorage.setItem('ez_progress', val); updateProgressBar(val); }
function updateProgressBar(val) {
  const fill = document.getElementById('progressFill');
  const pct  = document.getElementById('progressPct');
  if (fill) fill.style.width = val + '%';
  if (pct)  pct.textContent  = val + '%';
}
function bumpProgress(amount) {
  if (getProgress() < amount) setProgress(amount);
}

// ─── MODAL ──────────────────────────────────────────────
function openModule(num) {
  const content = document.getElementById('modalContent');
  const builders = { 1:buildModule1, 2:buildModule2, 3:buildModule3, 4:buildModule4 };
  const inits    = { 1:initModule1,  2:initModule2,  3:initModule3,  4:initModule4  };
  content.innerHTML = builders[num]();
  inits[num]();
  document.getElementById('modalOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeModal() {
  document.getElementById('modalOverlay').classList.remove('open');
  document.body.style.overflow = '';
}
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

// ─── CSS COMPARTIDO ─────────────────────────────────────
const sharedCSS = `<style>
.tab-btn{font-family:'Orbitron',sans-serif;font-size:.55rem;letter-spacing:.1em;padding:.4rem .75rem;border-radius:4px;cursor:pointer;border:1px solid #2e2e55;background:#0a0a0f;color:#555577;transition:all .15s;margin-bottom:.3rem}
.tab-btn.active{border-color:var(--mc);color:var(--mc)}
.act-panel{animation:fadeIn .3s ease}
@keyframes fadeIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}
.act-title{font-size:.82rem;color:#9999bb;margin-bottom:.9rem;line-height:1.6}
.act-submit{font-family:'Orbitron',sans-serif;font-size:.58rem;letter-spacing:.13em;color:var(--mc);background:transparent;border:1px solid var(--mc);padding:.5rem 1.2rem;border-radius:4px;cursor:pointer;transition:all .15s;margin-top:.7rem}
.act-submit:hover{background:var(--mc);color:#0a0a0f}
.quiz-option{display:block;width:100%;text-align:left;padding:.55rem .85rem;margin-bottom:.35rem;background:#0a0a0f;border:1px solid #2e2e55;border-radius:6px;color:#9999bb;font-size:.8rem;cursor:pointer;transition:all .15s}
.quiz-option:hover{border-color:var(--mc);color:#eef0ff}
.quiz-option.correct{border-color:#39ff14!important;color:#39ff14!important;background:#0a1a0a!important}
.quiz-option.wrong{border-color:#ff2d78!important;color:#ff2d78!important;background:#1a0a0f!important}
.match-item{padding:.55rem .4rem;border:1px solid #2e2e55;border-radius:6px;text-align:center;font-size:.76rem;color:#9999bb;cursor:pointer;transition:all .15s;background:#0a0a0f;word-break:break-word}
.match-item:hover{border-color:var(--mc);color:#eef0ff}
.match-item.selected{border-color:var(--mc);color:var(--mc);background:#001a1f}
.match-item.matched{border-color:#39ff14;color:#39ff14;background:#0a1a0a;pointer-events:none}
.match-item.wrong-flash{border-color:#ff2d78!important;color:#ff2d78!important}
.fill-item{margin-bottom:.85rem;font-size:.83rem;color:#eef0ff;line-height:2.2}
.fill-input{background:#0a0a0f;border:1px solid #2e2e55;border-radius:4px;color:#eef0ff;font-size:.8rem;padding:.2rem .4rem;width:100px;text-align:center;outline:none;transition:border-color .15s}
.fill-input:focus{border-color:var(--mc)}
.fill-input.ok{border-color:#39ff14!important;color:#39ff14!important}
.fill-input.err{border-color:#ff2d78!important;color:#ff2d78!important}
.result-box{text-align:center;padding:.8rem;border-radius:8px;margin-top:.7rem;font-family:'Orbitron',sans-serif;font-size:.68rem;letter-spacing:.1em}
.result-ok{border:1px solid #39ff14;color:#39ff14;background:#0a1a0a}
.result-err{border:1px solid #ff2d78;color:#ff2d78;background:#1a0a0f}
.word-bank{display:flex;flex-wrap:wrap;gap:.4rem;margin-bottom:.9rem}
.word-chip{padding:.3rem .65rem;background:#0a0a0f;border:1px solid #2e2e55;border-radius:20px;font-size:.78rem;color:#9999bb;cursor:pointer;transition:all .15s;user-select:none}
.word-chip:hover{border-color:var(--mc);color:#eef0ff}
.word-chip.used{opacity:.3;pointer-events:none}
.sentence-drop{min-height:2.2rem;border-bottom:1px solid #2e2e55;padding:.3rem .2rem;margin-bottom:.7rem;display:flex;flex-wrap:wrap;gap:.4rem;align-items:center}
.placed-word{padding:.2rem .55rem;background:#1a1a2e;border:1px solid var(--mc);border-radius:20px;font-size:.78rem;color:var(--mc);cursor:pointer}
.cw-grid{display:inline-grid;gap:2px;margin-bottom:.8rem}
.cw-cell{width:30px;height:30px;display:flex;align-items:center;justify-content:center;font-size:.8rem;font-weight:700;text-transform:uppercase}
.cw-input{width:30px;height:30px;background:#0a0a0f;border:1px solid #2e2e55;border-radius:3px;color:#eef0ff;font-size:.75rem;font-weight:700;text-align:center;text-transform:uppercase;outline:none;transition:border-color .15s;padding:0}
.cw-input:focus{border-color:var(--mc)}
.cw-input.ok{border-color:#39ff14;color:#39ff14;background:#0a1a0a}
.cw-input.err{border-color:#ff2d78;color:#ff2d78}
.cw-black{background:#000;border:none;width:30px;height:30px}
.cw-num{font-size:.5rem;color:#555577;line-height:1;position:absolute;top:1px;left:2px}
.cw-cell-wrap{position:relative;width:30px;height:30px}
.listen-btn{font-family:'Orbitron',sans-serif;font-size:.6rem;letter-spacing:.12em;padding:.45rem .9rem;border-radius:4px;cursor:pointer;border:1px solid var(--mc);background:#0a0a0f;color:var(--mc);transition:all .15s}
.listen-btn:hover{background:var(--mc);color:#0a0a0f}
.listen-btn:disabled{opacity:.5;cursor:not-allowed}
</style>`;

// ─── HELPERS TABS ────────────────────────────────────────
function tabsHTML(labels, color) {
  return `<div style="display:flex;gap:.4rem;margin-bottom:1.1rem;flex-wrap:wrap">
    ${labels.map((l,i)=>`<button class="tab-btn${i===0?' active':''}" onclick="switchTab(${i+1},${labels.length})" id="tab${i+1}">${l}</button>`).join('')}
  </div>`;
}
function switchTab(n, total) {
  for(let i=1;i<=total;i++){
    document.getElementById('act'+i).style.display=i===n?'block':'none';
    document.getElementById('tab'+i).classList.toggle('active',i===n);
  }
}

// ─── HELPERS QUIZ ────────────────────────────────────────
function quizBlock(data, id) {
  return data.map((item,qi)=>`
    <div style="margin-bottom:.9rem">
      <p style="font-size:.81rem;color:#eef0ff;margin-bottom:.35rem">${qi+1}. ${item.q}</p>
      ${item.opts.map((o,oi)=>`<button class="quiz-option" onclick="selectQ('${id}',${qi},${oi},${item.ans},this.parentElement)">${o}</button>`).join('')}
    </div>`).join('');
}
const qAnswers={};
function selectQ(id,qi,sel,ans,block){
  if(!qAnswers[id]) qAnswers[id]={};
  qAnswers[id][qi]=sel;
  block.querySelectorAll('.quiz-option').forEach((b,i)=>{
    b.classList.remove('correct','wrong');
    if(i===sel) b.classList.add(sel===ans?'correct':'wrong');
  });
}
function checkQuizGeneric(id,total,prog){
  if(!qAnswers[id]) return;
  const data=window[id+'Data'];
  const score=Object.entries(qAnswers[id]).filter(([i,v])=>v===data[i].ans).length;
  const pct=Math.round(score/total*100);
  showResult(id+'-result', score, total, pct, prog);
}
function showResult(elId, score, total, pct, prog){
  const box=document.getElementById(elId);
  box.className='result-box '+(pct>=70?'result-ok':'result-err');
  box.textContent=pct>=70?`🏆 ${score}/${total} correctas (${pct}%)!`:`💪 ${score}/${total} correctas — ¡Intentalo de nuevo!`;
  box.style.display='block';
  if(pct>=80) bumpProgress(prog);
}

// ─── HELPERS MATCH ───────────────────────────────────────
function matchGrid(data, id){
  const shuffled=[...data].sort(()=>Math.random()-.5);
  return `<div id="${id}-grid" style="display:grid;grid-template-columns:1fr 1fr;gap:.5rem">
    ${data.map((item,i)=>`
      <div class="match-item" onclick="handleMatch(this,'${id}')" data-type="en" data-key="${item.en}">${item.en}</div>
      <div class="match-item" onclick="handleMatch(this,'${id}')" data-type="es" data-key="${shuffled[i].en}">${shuffled[i].es}</div>
    `).join('')}
  </div>
  <div id="${id}-match-result" style="margin-top:.7rem;font-family:'Orbitron',sans-serif;font-size:.68rem;letter-spacing:.1em;color:#39ff14;text-align:center;min-height:1.2rem"></div>`;
}
const matchState={};
function handleMatch(el,id){
  if(el.classList.contains('matched')) return;
  if(!matchState[id]) matchState[id]={selected:null,done:0,total:0};
  const s=matchState[id];
  if(!s.total) s.total=document.querySelectorAll(`#${id}-grid .match-item[data-type="en"]`).length;
  if(!s.selected){s.selected=el;el.classList.add('selected');return;}
  if(s.selected===el){el.classList.remove('selected');s.selected=null;return;}
  const a=s.selected,b=el;
  const ok=a.dataset.type!==b.dataset.type&&a.dataset.key===b.dataset.key;
  if(ok){
    a.classList.remove('selected');a.classList.add('matched');b.classList.add('matched');
    s.done++;
    if(s.done===s.total){document.getElementById(id+'-match-result').textContent='🏆 ¡Todas correctas!';}
  } else {
    a.classList.add('wrong-flash');b.classList.add('wrong-flash');
    setTimeout(()=>{a.classList.remove('selected','wrong-flash');b.classList.remove('wrong-flash');},600);
  }
  s.selected=null;
}

// ─── HELPERS FILL ────────────────────────────────────────
function fillBlock(data,id){
  return data.map((item,i)=>`
    <div class="fill-item">
      <span style="color:#555577;font-size:.72rem;margin-right:.35rem">${i+1}.</span>
      ${item.pre} <input class="fill-input" id="${id}-f${i}" placeholder="___" autocomplete="off" spellcheck="false"/> ${item.post}
    </div>`).join('');
}
function checkFillGeneric(data,id,prog){
  let score=0;
  data.forEach((item,i)=>{
    const inp=document.getElementById(`${id}-f${i}`);
    const ok=inp.value.trim().toLowerCase()===item.blank.toLowerCase();
    inp.classList.remove('ok','err');inp.classList.add(ok?'ok':'err');
    if(ok) score++;
  });
  const pct=Math.round(score/data.length*100);
  showResult(id+'-fill-result', score, data.length, pct, prog);
}

// ─── HELPERS ORDENAR ─────────────────────────────────────
function orderBlock(sentences, id){
  return sentences.map((s,i)=>{
    const words=[...s.words].sort(()=>Math.random()-.5);
    return `
    <div style="margin-bottom:1.1rem">
      <p style="font-size:.75rem;color:#555577;margin-bottom:.4rem">${i+1}. ${s.hint}</p>
      <div class="word-bank" id="${id}-bank${i}">
        ${words.map((w,wi)=>`<span class="word-chip" id="${id}-chip${i}-${wi}" onclick="placeWord('${id}',${i},'${w}',${wi})">${w}</span>`).join('')}
      </div>
      <div class="sentence-drop" id="${id}-drop${i}" onclick="removeLastWord('${id}',${i})"></div>
    </div>`;
  }).join('');
}
const orderState={};
function placeWord(id,si,word,wi){
  if(!orderState[id]) orderState[id]={};
  if(!orderState[id][si]) orderState[id][si]=[];
  orderState[id][si].push({word,wi});
  document.getElementById(`${id}-chip${si}-${wi}`).classList.add('used');
  renderDrop(id,si);
}
function removeLastWord(id,si){
  if(!orderState[id]||!orderState[id][si]||!orderState[id][si].length) return;
  const last=orderState[id][si].pop();
  document.getElementById(`${id}-chip${si}-${last.wi}`).classList.remove('used');
  renderDrop(id,si);
}
function renderDrop(id,si){
  const drop=document.getElementById(`${id}-drop${si}`);
  const words=(orderState[id]&&orderState[id][si])||[];
  drop.innerHTML=words.map(w=>`<span class="placed-word">${w.word}</span>`).join('')||'<span style="font-size:.72rem;color:#2e2e55">Tocá las palabras para armar la oración...</span>';
}
function checkOrder(sentences,id,prog){
  let score=0;
  sentences.forEach((s,i)=>{
    const placed=((orderState[id]&&orderState[id][i])||[]).map(w=>w.word).join(' ');
    const correct=s.words.join(' ');
    const box=document.getElementById(`${id}-drop${i}`);
    if(placed.toLowerCase()===correct.toLowerCase()){
      score++;
      box.style.borderBottomColor='#39ff14';
    } else {
      box.style.borderBottomColor='#ff2d78';
    }
  });
  const pct=Math.round(score/sentences.length*100);
  showResult(id+'-order-result',score,sentences.length,pct,prog);
}

// ─── HELPERS CRUCIGRAMA ──────────────────────────────────
function buildCrossword(cells, clues, id){
  const rows=Math.max(...cells.map(c=>c.r))+1;
  const cols=Math.max(...cells.map(c=>c.c))+1;
  const grid=Array.from({length:rows},()=>Array(cols).fill(null));
  cells.forEach(c=>grid[c.r][c.c]=c);

  let html=`<div class="cw-grid" style="grid-template-columns:repeat(${cols},30px);grid-template-rows:repeat(${rows},30px)">`;
  for(let r=0;r<rows;r++){
    for(let c=0;c<cols;c++){
      const cell=grid[r][c];
      if(!cell){ html+=`<div class="cw-black"></div>`; }
      else {
        html+=`<div class="cw-cell-wrap">
          ${cell.n?`<span class="cw-num">${cell.n}</span>`:''}
          <input class="cw-input" id="${id}-${r}-${c}" maxlength="1" data-ans="${cell.a}" />
        </div>`;
      }
    }
  }
  html+=`</div>`;
  html+=`<div style="margin-bottom:.8rem">`;
  if(clues.across.length){
    html+=`<p style="font-size:.72rem;color:var(--mc);font-family:'Orbitron',sans-serif;letter-spacing:.1em;margin-bottom:.3rem">HORIZONTAL</p>`;
    clues.across.forEach(cl=>{ html+=`<p style="font-size:.75rem;color:#9999bb;margin-bottom:.2rem"><b style="color:#eef0ff">${cl.n}.</b> ${cl.clue}</p>`; });
  }
  if(clues.down.length){
    html+=`<p style="font-size:.72rem;color:var(--mc);font-family:'Orbitron',sans-serif;letter-spacing:.1em;margin:.5rem 0 .3rem">VERTICAL</p>`;
    clues.down.forEach(cl=>{ html+=`<p style="font-size:.75rem;color:#9999bb;margin-bottom:.2rem"><b style="color:#eef0ff">${cl.n}.</b> ${cl.clue}</p>`; });
  }
  html+=`</div>`;
  return html;
}
function checkCrossword(id){
  const inputs=document.querySelectorAll(`[id^="${id}-"]`);
  let total=0,score=0;
  inputs.forEach(inp=>{
    if(!inp.dataset.ans) return;
    total++;
    inp.classList.remove('ok','err');
    if(inp.value.toUpperCase()===inp.dataset.ans.toUpperCase()){inp.classList.add('ok');score++;}
    else inp.classList.add('err');
  });
  const pct=Math.round(score/total*100);
  showResult(id+'-cw-result',score,total,pct,0);
}

// ═══════════════════════════════════════════════════════
//  MÓDULO 1 – THE BASICS
//  Actividades: Quiz colores · Unir objetos · Fill To Be
//               Ordenar · Crucigrama
// ═══════════════════════════════════════════════════════
window.quiz1Data=[
  {q:'¿Qué color es RED?',    opts:['Azul','Rojo','Verde','Amarillo'],     ans:1},
  {q:'¿Qué color es BLUE?',   opts:['Rojo','Naranja','Azul','Marrón'],     ans:2},
  {q:'¿Qué color es GREEN?',  opts:['Verde','Gris','Rosa','Violeta'],      ans:0},
  {q:'¿Qué color es YELLOW?', opts:['Blanco','Negro','Amarillo','Celeste'],ans:2},
  {q:'¿Qué color es BLACK?',  opts:['Negro','Marrón','Rojo','Azul'],       ans:0},
  {q:'¿Qué color es WHITE?',  opts:['Gris','Blanco','Verde','Naranja'],    ans:1},
  {q:'"It IS a pencil." ¿Es correcta?', opts:['Sí','No, es "It ARE"','No, es "It AM"','No, es "It BE"'], ans:0},
  {q:'¿Cómo se dice "No es una regla"?', opts:['It is a ruler.','It isn\'t a ruler.','It not a ruler.','It are a ruler.'], ans:1},
];
const match1Data=[
  {en:'Pencil',es:'Lápiz'},{en:'Ruler',es:'Regla'},{en:'Book',es:'Libro'},
  {en:'Eraser',es:'Goma'},{en:'Bag',es:'Mochila'},{en:'Chair',es:'Silla'},
];
const fill1Data=[
  {pre:'It',blank:'is',   post:'a pencil.'},
  {pre:'It',blank:"isn't",post:'a ruler.'},
  {pre:'It',blank:'is',   post:'blue.'},
  {pre:'It',blank:"isn't",post:'a bag.'},
  {pre:'It',blank:'is',   post:'a book.'},
  {pre:'It',blank:"isn't",post:'red. It\'s green.'},
];
const order1Data=[
  {hint:'Armá: "Es un lápiz."',       words:['It','is','a','pencil','.']},
  {hint:'Armá: "No es una silla."',   words:['It',"isn't",'a','chair','.']},
  {hint:'Armá: "¿Es un libro?"',      words:['Is','it','a','book','?']},
  {hint:'Armá: "Es rojo."',           words:['It','is','red','.']},
];
const cw1={
  cells:[
    {r:0,c:0,a:'R',n:1},{r:0,c:1,a:'E'},{r:0,c:2,a:'D'},
    {r:1,c:0,a:'U',n:2},{r:1,c:1,a:'L'},{r:1,c:2,a:'U'},{r:1,c:3,a:'E'},
    {r:2,c:0,a:'L',n:3},{r:2,c:1,a:'A'},{r:2,c:2,a:'E'},{r:2,c:3,a:'N'},
    {r:3,c:0,a:'E'},{r:3,c:1,a:'R'},
    {r:4,c:0,a:'R',n:4},{r:4,c:1,a:'O'},{r:4,c:2,a:'S','a':'S'},{r:4,c:3,a:'A'},
  ],
  clues:{
    across:[
      {n:1,clue:'Color rojo en inglés'},
      {n:2,clue:'Color azul en inglés'},
      {n:4,clue:'Objeto para borrar (goma)'},
    ],
    down:[
      {n:1,clue:'Regla (objeto escolar)'},
      {n:3,clue:'Color verde en inglés'},
    ]
  }
};

function buildModule1(){
  return `${sharedCSS}
  <div style="--mc:#00f5ff">
    <h2 style="color:#00f5ff;font-family:'Orbitron',sans-serif;font-size:.95rem;letter-spacing:.1em;margin-bottom:.25rem">MOD 01 · The Basics</h2>
    <p style="font-size:.75rem;color:#555577;margin-bottom:1rem">5 actividades · Colores, objetos y Verbo To Be</p>
    ${tabsHTML(['🎨 Quiz','🔗 Unir','✏️ To Be','📝 Ordenar','🔠 Crucigrama','🎧 Audio'],'#00f5ff')}
    <div id="act1" class="act-panel">
      <p class="act-title">¿Qué color o forma es? Elegí la opción correcta</p>
      ${quizBlock(window.quiz1Data,'quiz1')}
      <button class="act-submit" onclick="checkQuizGeneric('quiz1',${window.quiz1Data.length},20)">VER RESULTADOS</button>
      <div id="quiz1-result" class="result-box" style="display:none"></div>
    </div>
    <div id="act2" class="act-panel" style="display:none">
      <p class="act-title">Tocá una palabra en inglés y después su traducción</p>
      ${matchGrid(match1Data,'m1')}
    </div>
    <div id="act3" class="act-panel" style="display:none">
      <p class="act-title">Completá con <em>is</em> o <em>isn't</em></p>
      ${fillBlock(fill1Data,'f1')}
      <button class="act-submit" onclick="checkFillGeneric(fill1Data,'f1',20)">CORREGIR</button>
      <div id="f1-fill-result" class="result-box" style="display:none"></div>
    </div>
    <div id="act4" class="act-panel" style="display:none">
      <p class="act-title">Tocá las palabras en orden para armar la oración. Tocá la zona azul para deshacer.</p>
      ${orderBlock(order1Data,'o1')}
      <button class="act-submit" onclick="checkOrder(order1Data,'o1',20)">CORREGIR</button>
      <div id="o1-order-result" class="result-box" style="display:none"></div>
    </div>
    <div id="act5" class="act-panel" style="display:none">
      <p class="act-title">Completá el crucigrama con colores y objetos escolares</p>
      ${buildCrossword(cw1.cells,cw1.clues,'cw1')}
      <button class="act-submit" onclick="checkCrossword('cw1')">CORREGIR</button>
      <div id="cw1-cw-result" class="result-box" style="display:none"></div>
    </div>
    <div id="act6" class="act-panel" style="display:none">
      <p class="act-title">🎧 Escuchá cada palabra y elegí lo que oíste. Usá auriculares si podés.</p>
      ${listeningBlock(listen1Data,'l1')}
      <button class="act-submit" onclick="checkListening(listen1Data,'l1',20)">VER RESULTADOS</button>
      <div id="l1-listen-result" class="result-box" style="display:none"></div>
    </div>
  </div>`;
}
function initModule1(){}

// ═══════════════════════════════════════════════════════
//  MÓDULO 2 – ALL ABOUT ME
//  Actividades: Quiz · Unir pronombres · Fill posesivos
//               Ordenar · Crucigrama
// ═══════════════════════════════════════════════════════
window.quiz2Data=[
  {q:'¿Cómo se dice "Yo soy"?',                       opts:['He is','She is','I am','It is'],          ans:2},
  {q:'¿Cómo se dice "Ella es"?',                       opts:['I am','She is','He is','You are'],        ans:1},
  {q:'¿Nacionalidad de alguien de Brazil?',            opts:['Spanish','Brazilian','British','French'],  ans:1},
  {q:'¿Cuándo usamos AN?',                             opts:['Siempre','Palabras largas','Antes de vocal','Nunca'], ans:2},
  {q:'"My" significa...',                              opts:['Tu','Su (de él)','Mi','Nuestro'],          ans:2},
  {q:'¿Cuál es la traducción de "friend"?',            opts:['Familia','Amigo/a','Maestro/a','Gato'],   ans:1},
  {q:'"A" se usa antes de...',                         opts:['Apple','Umbrella','Elephant','Orange'],    ans:0},
  {q:'¿Adjetivo posesivo de "she"?',                   opts:['His','My','Her','Its'],                   ans:2},
];
const match2Data=[
  {en:'I am',es:'Yo soy'},{en:'He is',es:'Él es'},{en:'She is',es:'Ella es'},
  {en:'My',es:'Mi'},{en:'His',es:'De él'},{en:'Her',es:'De ella'},
];
const fill2Data=[
  {pre:'',       blank:'I',   post:'am a student.'},
  {pre:'',       blank:'She', post:"is my friend."},
  {pre:'',       blank:'He',  post:'is a teacher.'},
  {pre:'This is',blank:'my',  post:'dog.'},
  {pre:'',       blank:'Her', post:'name is Ana.'},
  {pre:'It is',  blank:'an',  post:'apple.'},
];
const order2Data=[
  {hint:'Armá: "Yo soy estudiante."',          words:['I','am','a','student','.']},
  {hint:'Armá: "Ella es mi amiga."',           words:['She','is','my','friend','.']},
  {hint:'Armá: "Es una manzana." (fruta)',     words:['It','is','an','apple','.']},
  {hint:'Armá: "¿Cuál es tu nombre?"',         words:['What','is','your','name','?']},
];
const cw2={
  cells:[
    {r:0,c:0,a:'F',n:1},{r:0,c:1,a:'R'},{r:0,c:2,a:'I'},{r:0,c:3,a:'E'},{r:0,c:4,a:'N'},{r:0,c:5,a:'D'},
    {r:1,c:0,a:'L',n:2},
    {r:2,c:0,a:'O',n:3},{r:2,c:1,a:'M'},{r:2,c:2,a:'A'},
    {r:3,c:0,a:'W',n:4},{r:3,c:1,a:'E'},{r:3,c:2,a:'R'},{r:3,c:3,a:'E'},
    {r:4,c:0,a:'E',n:5},{r:4,c:1,a:'A'},{r:4,c:2,a:'T'},
  ],
  clues:{
    across:[
      {n:1,clue:'Amigo/a en inglés'},
      {n:3,clue:'Mi (posesivo)'},
      {n:4,clue:'¿De dónde...? (Where ___ you from?)'},
      {n:5,clue:'Comer (verbo)'},
    ],
    down:[
      {n:1,clue:'Flor en inglés'},
      {n:2,clue:'Perder / Extrañar'},
    ]
  }
};

function buildModule2(){
  return `${sharedCSS}
  <div style="--mc:#ff2d78">
    <h2 style="color:#ff2d78;font-family:'Orbitron',sans-serif;font-size:.95rem;letter-spacing:.1em;margin-bottom:.25rem">MOD 02 · All About Me</h2>
    <p style="font-size:.75rem;color:#555577;margin-bottom:1rem">5 actividades · Pronombres, países y posesivos</p>
    ${tabsHTML(['🌍 Quiz','🔗 Pronombres','✏️ Completar','📝 Ordenar','🔠 Crucigrama','🎧 Audio'],'#ff2d78')}
    <div id="act1" class="act-panel">
      <p class="act-title">Elegí la respuesta correcta</p>
      ${quizBlock(window.quiz2Data,'quiz2')}
      <button class="act-submit" onclick="checkQuizGeneric('quiz2',${window.quiz2Data.length},40)">VER RESULTADOS</button>
      <div id="quiz2-result" class="result-box" style="display:none"></div>
    </div>
    <div id="act2" class="act-panel" style="display:none">
      <p class="act-title">Uní pronombres y posesivos con su traducción</p>
      ${matchGrid(match2Data,'m2')}
    </div>
    <div id="act3" class="act-panel" style="display:none">
      <p class="act-title">Completá con el pronombre o posesivo correcto</p>
      ${fillBlock(fill2Data,'f2')}
      <button class="act-submit" onclick="checkFillGeneric(fill2Data,'f2',40)">CORREGIR</button>
      <div id="f2-fill-result" class="result-box" style="display:none"></div>
    </div>
    <div id="act4" class="act-panel" style="display:none">
      <p class="act-title">Ordená las palabras para formar oraciones. Tocá la zona para deshacer.</p>
      ${orderBlock(order2Data,'o2')}
      <button class="act-submit" onclick="checkOrder(order2Data,'o2',40)">CORREGIR</button>
      <div id="o2-order-result" class="result-box" style="display:none"></div>
    </div>
    <div id="act5" class="act-panel" style="display:none">
      <p class="act-title">Completá el crucigrama de vocabulario</p>
      ${buildCrossword(cw2.cells,cw2.clues,'cw2')}
      <button class="act-submit" onclick="checkCrossword('cw2')">CORREGIR</button>
      <div id="cw2-cw-result" class="result-box" style="display:none"></div>
    </div>
    <div id="act6" class="act-panel" style="display:none">
      <p class="act-title">🎧 Escuchá la oración y elegí su traducción correcta.</p>
      ${listeningBlock(listen2Data,'l2')}
      <button class="act-submit" onclick="checkListening(listen2Data,'l2',40)">VER RESULTADOS</button>
      <div id="l2-listen-result" class="result-box" style="display:none"></div>
    </div>
  </div>`;
}
function initModule2(){}

// ═══════════════════════════════════════════════════════
//  MÓDULO 3 – PEOPLE & PLACES
//  Actividades: Quiz · Unir trabajos · Fill WH/To Be
//               Ordenar · Crucigrama
// ═══════════════════════════════════════════════════════
window.quiz3Data=[
  {q:'"They ___ students." Forma negativa',            opts:['They not are','They aren\'t','They is not','They be not'],  ans:1},
  {q:'¿Cómo preguntamos "¿Sos médico?"?',              opts:['You are a doctor?','Are you a doctor?','Is you a doctor?','You is?'], ans:1},
  {q:'"Tall" significa...',                            opts:['Gracioso','Inteligente','Alto','Corto'],                    ans:2},
  {q:'WH word para preguntar por una PERSONA',         opts:['What','Where','When','Who'],                               ans:3},
  {q:'WH word para preguntar por un LUGAR',            opts:['Who','What','Where','When'],                               ans:2},
  {q:'"We ___ friends." En negativa',                  opts:['We not friends','We aren\'t friends','We isn\'t','We no are'], ans:1},
  {q:'"Short" es lo opuesto de...',                    opts:['Funny','Tall','Smart','Kind'],                             ans:1},
  {q:'WH word para preguntar CUÁNDO',                  opts:['Who','Where','What','When'],                               ans:3},
];
const match3Data=[
  {en:'Doctor',es:'Médico/a'},{en:'Teacher',es:'Maestro/a'},{en:'Pilot',es:'Piloto'},
  {en:'Cook',es:'Cocinero/a'},{en:'Nurse',es:'Enfermero/a'},{en:'Lawyer',es:'Abogado/a'},
];
const fill3Data=[
  {pre:'',      blank:'Are',    post:"you a student? Yes, I am."},
  {pre:'They',  blank:"aren't", post:"teachers. They're pilots."},
  {pre:'',      blank:'Who',    post:"is she? She's my sister."},
  {pre:'',      blank:'Where',  post:"are you from? I'm from Argentina."},
  {pre:'We',    blank:"aren't", post:"short. We're tall."},
  {pre:'',      blank:'What',   post:"is your job? I'm a nurse."},
];
const order3Data=[
  {hint:'Armá: "¿Sos estudiante?"',                words:['Are','you','a','student','?']},
  {hint:'Armá: "Ellos no son maestros."',          words:['They',"aren't",'teachers','.']},
  {hint:'Armá: "¿De dónde sos?"',                  words:['Where','are','you','from','?']},
  {hint:'Armá: "Ella es alta e inteligente."',     words:['She','is','tall','and','intelligent','.']},
];
const cw3={
  cells:[
    {r:0,c:0,a:'T',n:1},{r:0,c:1,a:'A'},{r:0,c:2,a:'L'},{r:0,c:3,a:'L'},
    {r:1,c:0,a:'E',n:2},
    {r:2,c:0,a:'A',n:3},{r:2,c:1,a:'R'},{r:2,c:2,a:'E'},
    {r:3,c:0,a:'C',n:4},{r:3,c:1,a:'O'},{r:3,c:2,a:'O'},{r:3,c:3,a:'K'},
    {r:4,c:0,a:'H',n:5},{r:4,c:1,a:'O'},{r:4,c:2,a:'W'},
  ],
  clues:{
    across:[
      {n:1,clue:'Alto (adjetivo descriptivo)'},
      {n:3,clue:'To Be plural: They ___ friends'},
      {n:4,clue:'Cocinero/a en inglés'},
      {n:5,clue:'¿Cómo...? (WH word)'},
    ],
    down:[
      {n:1,clue:'Maestro/a en inglés'},
      {n:2,clue:'Verbo "comer"'},
    ]
  }
};

function buildModule3(){
  return `${sharedCSS}
  <div style="--mc:#ffe600">
    <h2 style="color:#ffe600;font-family:'Orbitron',sans-serif;font-size:.95rem;letter-spacing:.1em;margin-bottom:.25rem">MOD 03 · People & Places</h2>
    <p style="font-size:.75rem;color:#555577;margin-bottom:1rem">5 actividades · To Be completo y WH Questions</p>
    ${tabsHTML(['❓ Quiz','💼 Trabajos','✏️ Completar','📝 Ordenar','🔠 Crucigrama','🎧 Audio'],'#ffe600')}
    <div id="act1" class="act-panel">
      <p class="act-title">Elegí la respuesta correcta</p>
      ${quizBlock(window.quiz3Data,'quiz3')}
      <button class="act-submit" onclick="checkQuizGeneric('quiz3',${window.quiz3Data.length},60)">VER RESULTADOS</button>
      <div id="quiz3-result" class="result-box" style="display:none"></div>
    </div>
    <div id="act2" class="act-panel" style="display:none">
      <p class="act-title">Uní cada trabajo con su traducción</p>
      ${matchGrid(match3Data,'m3')}
    </div>
    <div id="act3" class="act-panel" style="display:none">
      <p class="act-title">Completá con la forma de To Be o WH word correcta</p>
      ${fillBlock(fill3Data,'f3')}
      <button class="act-submit" onclick="checkFillGeneric(fill3Data,'f3',60)">CORREGIR</button>
      <div id="f3-fill-result" class="result-box" style="display:none"></div>
    </div>
    <div id="act4" class="act-panel" style="display:none">
      <p class="act-title">Ordená las palabras. Tocá la zona para deshacer.</p>
      ${orderBlock(order3Data,'o3')}
      <button class="act-submit" onclick="checkOrder(order3Data,'o3',60)">CORREGIR</button>
      <div id="o3-order-result" class="result-box" style="display:none"></div>
    </div>
    <div id="act5" class="act-panel" style="display:none">
      <p class="act-title">Completá el crucigrama de trabajos y adjetivos</p>
      ${buildCrossword(cw3.cells,cw3.clues,'cw3')}
      <button class="act-submit" onclick="checkCrossword('cw3')">CORREGIR</button>
      <div id="cw3-cw-result" class="result-box" style="display:none"></div>
    </div>
    <div id="act6" class="act-panel" style="display:none">
      <p class="act-title">🎧 Escuchá y elegí la traducción correcta de lo que oíste.</p>
      ${listeningBlock(listen3Data,'l3')}
      <button class="act-submit" onclick="checkListening(listen3Data,'l3',60)">VER RESULTADOS</button>
      <div id="l3-listen-result" class="result-box" style="display:none"></div>
    </div>
  </div>`;
}
function initModule3(){}

// ═══════════════════════════════════════════════════════
//  MÓDULO 4 – MY CITY & HOME
//  Actividades: Quiz · Unir lugares · Fill preposiciones
//               Ordenar (más largo) · Crucigrama
// ═══════════════════════════════════════════════════════
window.quiz4Data=[
  {q:'"There ___ a park." ¿Qué va?',                  opts:['are','is','am','be'],                                       ans:1},
  {q:'"There ___ two schools." ¿Qué va?',              opts:['is','am','are','be'],                                       ans:2},
  {q:'¿Cómo preguntamos si hay un banco?',             opts:['There is a bank?','Is there a bank?','Are there?','There a bank?'], ans:1},
  {q:'"The cat is ___ the table." (encima)',           opts:['under','in','on','next to'],                                ans:2},
  {q:'"The school is ___ the park and the hospital."', opts:['in front of','next to','between','behind'],                 ans:2},
  {q:'"The chair is ___ the desk." (detrás)',          opts:['in front of','behind','next to','between'],                 ans:1},
  {q:'"The book is ___ the bag." (dentro)',            opts:['on','under','next to','in'],                                ans:3},
  {q:'There ___ a sofa and two chairs in the room.',   opts:['are','am','is','be'],                                       ans:0},
];
const match4Data=[
  {en:'Hospital',es:'Hospital'},{en:'School',es:'Escuela'},{en:'Supermarket',es:'Supermercado'},
  {en:'Park',es:'Parque'},{en:'Bank',es:'Banco'},{en:'Library',es:'Biblioteca'},
];
const fill4Data=[
  {pre:'',           blank:'There is',    post:'a park near my house.'},
  {pre:'',           blank:'There are',   post:'two bedrooms in my flat.'},
  {pre:'Is',         blank:'there',       post:'a bank? Yes, there is.'},
  {pre:'The sofa is',blank:'in front of', post:'the TV.'},
  {pre:'The dog is', blank:'under',       post:'the bed.'},
  {pre:'The keys are',blank:'on',         post:'the table.'},
];
const order4Data=[
  {hint:'Armá: "Hay un parque cerca."',              words:['There','is','a','park','nearby','.']},
  {hint:'Armá: "¿Hay un supermercado?"',             words:['Is','there','a','supermarket','?']},
  {hint:'Armá: "El gato está debajo de la silla."',  words:['The','cat','is','under','the','chair','.']},
  {hint:'Armá: "La escuela está entre el banco y el hospital."', words:['The','school','is','between','the','bank','and','the','hospital','.']},
];
const cw4={
  cells:[
    {r:0,c:0,a:'P',n:1},{r:0,c:1,a:'A'},{r:0,c:2,a:'R'},{r:0,c:3,a:'K'},
    {r:1,c:0,a:'O',n:2},
    {r:2,c:0,a:'N',n:3},{r:2,c:1,a:'E'},{r:2,c:2,a:'X'},{r:2,c:3,a:'T'},
    {r:3,c:0,a:'U',n:4},{r:3,c:1,a:'N'},{r:3,c:2,a:'D'},{r:3,c:3,a:'E'},{r:3,c:4,a:'R'},
    {r:4,c:0,a:'S',n:5},{r:4,c:1,a:'C'},{r:4,c:2,a:'H'},{r:4,c:3,a:'O'},{r:4,c:4,a:'O'},{r:4,c:5,a:'L'},
  ],
  clues:{
    across:[
      {n:1,clue:'Lugar verde para recreo'},
      {n:3,clue:'Preposición: al lado de (next ___)'},
      {n:4,clue:'Preposición: debajo de'},
      {n:5,clue:'Escuela en inglés'},
    ],
    down:[
      {n:1,clue:'Preposición: encima de'},
      {n:2,clue:'Preposición: en (dentro)'},
    ]
  }
};

function buildModule4(){
  return `${sharedCSS}
  <div style="--mc:#39ff14">
    <h2 style="color:#39ff14;font-family:'Orbitron',sans-serif;font-size:.95rem;letter-spacing:.1em;margin-bottom:.25rem">MOD 04 · My City & Home</h2>
    <p style="font-size:.75rem;color:#555577;margin-bottom:1rem">5 actividades · There is/are y preposiciones</p>
    ${tabsHTML(['🏙️ Quiz','🗺️ Lugares','✏️ Completar','📝 Ordenar','🔠 Crucigrama','🎧 Audio'],'#39ff14')}
    <div id="act1" class="act-panel">
      <p class="act-title">Elegí la respuesta correcta</p>
      ${quizBlock(window.quiz4Data,'quiz4')}
      <button class="act-submit" onclick="checkQuizGeneric('quiz4',${window.quiz4Data.length},100)">VER RESULTADOS</button>
      <div id="quiz4-result" class="result-box" style="display:none"></div>
    </div>
    <div id="act2" class="act-panel" style="display:none">
      <p class="act-title">Uní cada lugar con su traducción</p>
      ${matchGrid(match4Data,'m4')}
    </div>
    <div id="act3" class="act-panel" style="display:none">
      <p class="act-title">Completá con There is / There are / preposición</p>
      ${fillBlock(fill4Data,'f4')}
      <button class="act-submit" onclick="checkFillGeneric(fill4Data,'f4',100)">CORREGIR</button>
      <div id="f4-fill-result" class="result-box" style="display:none"></div>
    </div>
    <div id="act4" class="act-panel" style="display:none">
      <p class="act-title">Ordená las palabras. Tocá la zona para deshacer.</p>
      ${orderBlock(order4Data,'o4')}
      <button class="act-submit" onclick="checkOrder(order4Data,'o4',100)">CORREGIR</button>
      <div id="o4-order-result" class="result-box" style="display:none"></div>
    </div>
    <div id="act5" class="act-panel" style="display:none">
      <p class="act-title">Completá el crucigrama de lugares y preposiciones</p>
      ${buildCrossword(cw4.cells,cw4.clues,'cw4')}
      <button class="act-submit" onclick="checkCrossword('cw4')">CORREGIR</button>
      <div id="cw4-cw-result" class="result-box" style="display:none"></div>
    </div>
    <div id="act6" class="act-panel" style="display:none">
      <p class="act-title">🎧 Escuchá la oración y elegí la traducción. ¡Prestá atención a las preposiciones!</p>
      ${listeningBlock(listen4Data,'l4')}
      <button class="act-submit" onclick="checkListening(listen4Data,'l4',100)">VER RESULTADOS</button>
      <div id="l4-listen-result" class="result-box" style="display:none"></div>
    </div>
  </div>`;
}
function initModule4(){}

// ═══════════════════════════════════════════════════════
//  INIT GENERAL
// ═══════════════════════════════════════════════════════
document.addEventListener('DOMContentLoaded', () => {
  updateProgressBar(getProgress());
  document.querySelectorAll('.mission-card').forEach(card => {
    card.style.opacity='0';
    card.style.transform='translateY(24px)';
    card.style.transition='opacity .5s ease, transform .5s ease';
  });
  setTimeout(() => {
    document.querySelectorAll('.mission-card').forEach((card,i) => {
      setTimeout(()=>{ card.style.opacity='1'; card.style.transform='translateY(0)'; }, i*120);
    });
  }, 300);
});

// ═══════════════════════════════════════════════════════
//  AUDIO – Web Speech API (sin dependencias externas)
// ═══════════════════════════════════════════════════════

// ─── Hablar una palabra en inglés ───────────────────────
function speak(text, btn) {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = 'en-US';
  utter.rate = 0.85;
  utter.pitch = 1;
  if (btn) {
    btn.textContent = '🔊 ...';
    btn.disabled = true;
    utter.onend = () => { btn.textContent = '🔊 Escuchar'; btn.disabled = false; };
  }
  window.speechSynthesis.speak(utter);
}

// ─── Bloque de actividad listening ──────────────────────
function listeningBlock(data, id) {
  return data.map((item, i) => `
    <div style="background:#0a0a0f;border:1px solid #2e2e55;border-radius:8px;padding:.9rem;margin-bottom:.7rem" id="${id}-listen${i}">
      <div style="display:flex;align-items:center;gap:.8rem;margin-bottom:.6rem">
        <button class="listen-btn" onclick="speak('${item.word}', this)">🔊 Escuchar</button>
        <span style="font-size:.72rem;color:#555577;font-family:'Orbitron',sans-serif;letter-spacing:.1em">PREGUNTA ${i+1}</span>
      </div>
      <p style="font-size:.78rem;color:#9999bb;margin-bottom:.5rem">${item.question}</p>
      ${item.opts.map((o, oi) => `
        <button class="quiz-option" onclick="selectListen('${id}',${i},${oi},${item.ans},this.parentElement)">${o}</button>
      `).join('')}
    </div>`).join('');
}

const listenAnswers = {};
function selectListen(id, qi, sel, ans, block) {
  if (!listenAnswers[id]) listenAnswers[id] = {};
  listenAnswers[id][qi] = sel;
  block.querySelectorAll('.quiz-option').forEach((b, i) => {
    b.classList.remove('correct', 'wrong');
    if (i === sel) b.classList.add(sel === ans ? 'correct' : 'wrong');
  });
}
function checkListening(data, id, prog) {
  const score = data.filter((item, i) =>
    listenAnswers[id] && listenAnswers[id][i] === item.ans
  ).length;
  const pct = Math.round(score / data.length * 100);
  showResult(id + '-listen-result', score, data.length, pct, prog);
}

// ─── Datos de listening por módulo ──────────────────────
const listen1Data = [
  { word:'red',     question:'¿Qué color escuchaste?',           opts:['Azul','Rojo','Verde','Amarillo'],      ans:1 },
  { word:'pencil',  question:'¿Qué objeto escuchaste?',          opts:['Goma','Regla','Lápiz','Libro'],        ans:2 },
  { word:'seven',   question:'¿Qué número escuchaste?',          opts:['Once','Siete','Cuatro','Nueve'],       ans:1 },
  { word:'eraser',  question:'¿Qué objeto escuchaste?',          opts:['Mochila','Lápiz','Silla','Goma'],      ans:3 },
  { word:'blue',    question:'¿Qué color escuchaste?',           opts:['Verde','Negro','Azul','Blanco'],       ans:2 },
  { word:'Monday',  question:'¿Qué día escuchaste?',             opts:['Martes','Jueves','Lunes','Viernes'],   ans:2 },
];

const listen2Data = [
  { word:'I am a student',  question:'¿Qué oración escuchaste?',  opts:['Ella es estudiante','Yo soy estudiante','Él es maestro','Vos sos amigo'], ans:1 },
  { word:'my friend',       question:'¿Qué escuchaste?',          opts:['Tu amigo','Mi amigo','Su amigo','Nuestro amigo'],                         ans:1 },
  { word:'she is Brazilian', question:'¿Qué escuchaste?',         opts:['Él es argentino','Ella es brasileña','Yo soy francesa','Ellos son españoles'], ans:1 },
  { word:'an apple',        question:'¿Qué escuchaste?',          opts:['Una naranja','Un libro','Una manzana','Un perro'],                        ans:2 },
  { word:'his name is Tom', question:'¿Qué escuchaste?',          opts:['Mi nombre es Tom','Su nombre es Tom (de ella)','Su nombre es Tom (de él)','Tu nombre es Tom'], ans:2 },
];

const listen3Data = [
  { word:'Are you a doctor',   question:'¿Qué pregunta escuchaste?', opts:['¿Ella es médica?','¿Sos médico?','¿Ellos son médicos?','¿Soy médico?'],            ans:1 },
  { word:'They aren\'t tall',  question:'¿Qué oración escuchaste?',  opts:['Ellos son altos','Ella no es alta','Ellos no son altos','Nosotros somos altos'],   ans:2 },
  { word:'where are you from', question:'¿Qué pregunta escuchaste?', opts:['¿Cómo te llamás?','¿Dónde vivís?','¿De dónde sos?','¿Cuántos años tenés?'],       ans:2 },
  { word:'funny',              question:'¿Qué adjetivo escuchaste?', opts:['Alto','Inteligente','Gracioso','Corto'],                                            ans:2 },
  { word:'who is she',         question:'¿Qué pregunta escuchaste?', opts:['¿Qué es eso?','¿Cuándo es?','¿Quién es ella?','¿Dónde está?'],                    ans:2 },
];

const listen4Data = [
  { word:'there is a park',       question:'¿Qué escuchaste?',         opts:['Hay dos parques','Hay un parque','No hay parque','¿Hay un parque?'],               ans:1 },
  { word:'the cat is under the table', question:'¿Dónde está el gato?', opts:['Sobre la mesa','Al lado de la mesa','Detrás de la mesa','Debajo de la mesa'],   ans:3 },
  { word:'next to the school',    question:'¿Qué ubicación escuchaste?',opts:['Detrás de la escuela','Delante de la escuela','Al lado de la escuela','Entre las escuelas'], ans:2 },
  { word:'is there a supermarket',question:'¿Qué pregunta escuchaste?', opts:['Hay un supermercado','¿Hay un supermercado?','No hay supermercado','¿Dónde está el super?'], ans:1 },
  { word:'between the bank and the hospital', question:'¿Qué escuchaste?', opts:['Al lado del banco','Detrás del hospital','Entre el banco y el hospital','Frente al hospital'], ans:2 },
];
// ═══════════════════════════════════════════════════════
//  2° AÑO – MÓDULOS
// ═══════════════════════════════════════════════════════

// Registrar módulos de 2° año en openModule
const _origOpenModule = openModule;
openModule = function(num) {
  if (typeof num === 'string' && num.startsWith('y2-')) {
    const n = parseInt(num.split('-')[1]);
    const builders2 = { 1: buildModuleY2_1, 2: buildModuleY2_2, 3: buildModuleY2_3 };
    const content = document.getElementById('modalContent');
    content.innerHTML = builders2[n]();
    document.getElementById('modalOverlay').classList.add('open');
    document.body.style.overflow = 'hidden';
  } else {
    _origOpenModule(num);
  }
};

// Progreso 2° año
function getProgress2() { return parseInt(localStorage.getItem('ez_progress2') || '0'); }
function setProgress2(val) { localStorage.setItem('ez_progress2', val); updateProgressBar2(val); }
function updateProgressBar2(val) {
  const fill = document.getElementById('progressFill2');
  const pct  = document.getElementById('progressPct2');
  if (fill) fill.style.width = val + '%';
  if (pct)  pct.textContent  = val + '%';
}
function bumpProgress2(amount) {
  if (getProgress2() < amount) setProgress2(amount);
}

// ─── NÚCLEO Y2-1: Who Am I? ─────────────────────────
const quizY21Data = [
  { q:'¿Cuál es la forma correcta?', opts:['I are a student','I am a student','I is a student','Me am student'], ans:1 },
  { q:'¿Cómo se dice "Ella tiene 15 años"?', opts:['She have 15 years','She is 15 years old','She are 15','Her is 15'], ans:1 },
  { q:'¿Qué artículo va antes de "apple"?', opts:['a','an','the','—'], ans:1 },
  { q:'¿Cómo se dice "hermano" en inglés?', opts:['sister','cousin','brother','uncle'], ans:2 },
  { q:'My name ___ Laura.', opts:['am','are','is','be'], ans:2 },
];
const matchY21Data = [
  {en:'father',es:'padre'},{en:'mother',es:'madre'},{en:'brother',es:'hermano'},
  {en:'sister',es:'hermana'},{en:'grandmother',es:'abuela'},{en:'cousin',es:'primo/a'},
];
const fillY21Data = [
  { sentence:'___ name is Carlos. ___ is 14 years old.', answers:['His','He'], blanks:2 },
  { sentence:'___ are from Argentina. Our nationality is Argentine.', answers:['We'], blanks:1 },
  { sentence:'She is ___ teacher. ___ name is Miss Velazquez.', answers:['a','Her'], blanks:2 },
];
const listenY21Data = [
  { word:'I am a student', question:'¿Qué oración escuchaste?', opts:['Él es estudiante','Yo soy estudiante','Ella es maestra','Vos sos amigo'], ans:1 },
  { word:'my sister', question:'¿Qué escuchaste?', opts:['mi hermano','mi prima','mi hermana','mi madre'], ans:2 },
  { word:'He is fifteen years old', question:'¿Qué oración escuchaste?', opts:['Ella tiene 15 años','Él tiene 50 años','Él tiene 15 años','Yo tengo 15 años'], ans:2 },
  { word:'an engineer', question:'¿Qué ocupación escuchaste?', opts:['un doctor','un maestro','un ingeniero','un abogado'], ans:2 },
  { word:'What is your name', question:'¿Qué pregunta escuchaste?', opts:['¿Cómo estás?','¿Cuántos años tenés?','¿Cómo te llamás?','¿De dónde sos?'], ans:2 },
];

function buildModuleY2_1() {
  window.quizY21Data = quizY21Data;
  return sharedCSS + `<style>:root{--mc:var(--orange)}</style>
  <h2 style="color:var(--orange)">NÚC 01 · Who Am I?</h2>
  <p>Presentaciones · Familia · Datos personales · Verbo To Be</p>
  ${tabsHTML(['QUIZ','MATCH','COMPLETAR','🔊 LISTENING'],'var(--orange)')}
  <div id="act1" class="act-panel">
    <p class="act-title">Elegí la opción correcta</p>
    ${quizBlock(quizY21Data,'quizY21')}
    <button class="act-submit" onclick="checkQuizGeneric('quizY21',${quizY21Data.length},33)">CORREGIR</button>
    <div id="quizY21-result" class="result-box" style="display:none"></div>
  </div>
  <div id="act2" class="act-panel" style="display:none">
    <p class="act-title">Uní cada palabra con su traducción</p>
    ${matchGrid(matchY21Data,'mY21')}
    <div id="mY21-match-result" class="result-box" style="display:none"></div>
  </div>
  <div id="act3" class="act-panel" style="display:none">
    <p class="act-title">Completá los espacios con las palabras del recuadro</p>
    <div style="display:flex;flex-wrap:wrap;gap:.4rem;margin-bottom:1rem">
      ${['His','He','We','a','Her'].map(w=>`<span style="padding:.25rem .6rem;background:#0a0a0f;border:1px solid var(--orange);border-radius:20px;font-size:.78rem;color:var(--orange)">${w}</span>`).join('')}
    </div>
    ${fillY21Data.map((item,i)=>`
      <div class="fill-item" id="fy21-${i}">
        ${item.sentence.split('___').map((part,pi,arr)=>
          pi<arr.length-1
            ? `${part}<input class="fill-input" id="fy21-inp-${i}-${pi}" placeholder="___" />`
            : part
        ).join('')}
      </div>`).join('')}
    <button class="act-submit" onclick="checkFillY21()">CORREGIR</button>
    <div id="fy21-result" class="result-box" style="display:none"></div>
  </div>
  <div id="act4" class="act-panel" style="display:none">
    <p class="act-title">🎧 Escuchá y elegí la respuesta correcta</p>
    ${listeningBlock(listenY21Data,'lY21')}
    <button class="act-submit" onclick="checkListening(listenY21Data,'lY21',66)">VER RESULTADOS</button>
    <div id="lY21-listen-result" class="result-box" style="display:none"></div>
  </div>`;
}

function checkFillY21() {
  let ok=0, total=0;
  fillY21Data.forEach((item,i)=>{
    item.answers.forEach((ans,pi)=>{
      const inp=document.getElementById(`fy21-inp-${i}-${pi}`);
      if(!inp) return;
      total++;
      if(inp.value.trim().toLowerCase()===ans.toLowerCase()){inp.classList.add('ok');ok++;}
      else inp.classList.add('err');
    });
  });
  showResult('fy21-result',ok,total,Math.round(ok/total*100),33);
}

// ─── NÚCLEO Y2-2: My City ───────────────────────────
const quizY22Data = [
  { q:'¿Cuál es la forma correcta?', opts:['There is many parks','There are a park','There are many parks','There is many park'], ans:2 },
  { q:'"Can you help me?" significa:', opts:['¿Podés ayudarme?','¿Querés ayudarme?','¿Debés ayudarme?','¿Podría ayudarte?'], ans:0 },
  { q:'¿Cuál es incontable?', opts:['apple','water','book','chair'], ans:1 },
  { q:'"___ milk in the fridge." (hay algo)', opts:['There are some','There is some','There is any','There are any'], ans:1 },
  { q:'¿Cómo se dice "biblioteca"?', opts:['hospital','library','bakery','park'], ans:1 },
];
const matchY22Data = [
  {en:'supermarket',es:'supermercado'},{en:'bakery',es:'panadería'},
  {en:'hospital',es:'hospital'},{en:'library',es:'biblioteca'},
  {en:'school',es:'escuela'},{en:'pharmacy',es:'farmacia'},
];
const listenY22Data = [
  { word:'There is a bank near the school', question:'¿Qué escuchaste?', opts:['Hay un banco cerca de la escuela','Hay una escuela cerca del banco','No hay banco','Hay un parque cerca'], ans:0 },
  { word:'Can I use your pen please', question:'¿Qué pediste?', opts:['Prestame tu libro','¿Puedo usar tu lapicera?','¿Tenés una pluma?','Dame tu lápiz'], ans:1 },
  { word:'There are some apples', question:'¿Qué hay?', opts:['Algunas naranjas','Ninguna manzana','Algunas manzanas','Una manzana'], ans:2 },
  { word:'Is there a library here', question:'¿Qué preguntaste?', opts:['¿Hay una farmacia?','¿Hay una biblioteca?','¿Dónde está la biblioteca?','¿Cuántas bibliotecas hay?'], ans:1 },
  { word:'healthy food', question:'¿Qué escuchaste?', opts:['comida rápida','comida saludable','mucha comida','poca comida'], ans:1 },
];

function buildModuleY2_2() {
  return sharedCSS + `<style>:root{--mc:var(--purple)}</style>
  <h2 style="color:var(--purple)">NÚC 02 · My City</h2>
  <p>Can · There is/are · Sustantivos contables e incontables · Lugares</p>
  ${tabsHTML(['QUIZ','MATCH','🔊 LISTENING'],'var(--purple)')}
  <div id="act1" class="act-panel">
    <p class="act-title">Elegí la opción correcta</p>
    ${quizBlock(quizY22Data,'quizY22')}
    <button class="act-submit" onclick="checkQuizGeneric('quizY22',${quizY22Data.length},66)">CORREGIR</button>
    <div id="quizY22-result" class="result-box" style="display:none"></div>
  </div>
  <div id="act2" class="act-panel" style="display:none">
    <p class="act-title">Uní cada lugar con su traducción</p>
    ${matchGrid(matchY22Data,'mY22')}
    <div id="mY22-match-result" class="result-box" style="display:none"></div>
  </div>
  <div id="act3" class="act-panel" style="display:none">
    <p class="act-title">🎧 Escuchá y elegí la respuesta correcta</p>
    ${listeningBlock(listenY22Data,'lY22')}
    <button class="act-submit" onclick="checkListening(listenY22Data,'lY22',100)">VER RESULTADOS</button>
    <div id="lY22-listen-result" class="result-box" style="display:none"></div>
  </div>`;
}
window.quizY22Data = quizY22Data;

// ─── NÚCLEO Y2-3: Routines & Wildlife ───────────────
const quizY23Data = [
  { q:'She ___ to school every day.', opts:['go','goes','is go','going'], ans:1 },
  { q:'"He doesn\'t eat meat." Es una oración:', opts:['afirmativa','interrogativa','negativa','exclamativa'], ans:2 },
  { q:'¿Qué adverbio indica acción casi siempre?', opts:['never','sometimes','usually','always'], ans:3 },
  { q:'"Lions ___ in Africa." (vivir)', opts:['live','lives','is living','lived'], ans:0 },
  { q:'"Do you like pizza?" La respuesta negativa es:', opts:["Yes, I do","No, I don't","No, I doesn't","Yes, he does"], ans:1 },
];
const matchY23Data = [
  {en:'lion',es:'león'},{en:'elephant',es:'elefante'},{en:'eagle',es:'águila'},
  {en:'dolphin',es:'delfín'},{en:'snake',es:'serpiente'},{en:'butterfly',es:'mariposa'},
];
const orderY23Data = [
  { words:['gets','She','up','early','always'], correct:'She always gets up early' },
  { words:['eat','Lions','meat','only'], correct:'Lions eat only meat' },
  { words:['he','Does','English','study','?'], correct:'Does he study English ?' },
  { words:['never','I','junk','eat','food'], correct:'I never eat junk food' },
];
const listenY23Data = [
  { word:'I usually wake up at seven', question:'¿Qué hace la persona?', opts:['Se duerme a las 7','Se despierta a las 7','Come a las 7','Sale a las 7'], ans:1 },
  { word:'She never eats fast food', question:'¿Qué oración escuchaste?', opts:['Ella siempre come comida rápida','Ella nunca come comida rápida','Ella a veces come comida rápida','Ella come comida rápida'], ans:1 },
  { word:'Elephants live in Africa and Asia', question:'¿Dónde viven los elefantes?', opts:['Solo en África','Solo en Asia','En África y Asia','En América'], ans:2 },
  { word:'Do you have a pet', question:'¿Qué pregunta escuchaste?', opts:['¿Tenés una mascota?','¿Querés una mascota?','¿Cómo se llama tu mascota?','¿Dónde está tu mascota?'], ans:0 },
  { word:'always', question:'¿Qué adverbio escuchaste?', opts:['nunca','a veces','siempre','generalmente'], ans:2 },
];

function buildModuleY2_3() {
  window.quizY23Data = quizY23Data;
  return sharedCSS + `<style>:root{--mc:var(--teal)}</style>
  <h2 style="color:var(--teal)">NÚC 03 · Routines & Wildlife</h2>
  <p>Simple Present · Rutinas · Animales · Adverbios de frecuencia</p>
  ${tabsHTML(['QUIZ','MATCH','ORDENAR','🔊 LISTENING'],'var(--teal)')}
  <div id="act1" class="act-panel">
    <p class="act-title">Elegí la opción correcta</p>
    ${quizBlock(quizY23Data,'quizY23')}
    <button class="act-submit" onclick="checkQuizGeneric('quizY23',${quizY23Data.length},66)">CORREGIR</button>
    <div id="quizY23-result" class="result-box" style="display:none"></div>
  </div>
  <div id="act2" class="act-panel" style="display:none">
    <p class="act-title">Uní cada animal con su traducción</p>
    ${matchGrid(matchY23Data,'mY23')}
    <div id="mY23-match-result" class="result-box" style="display:none"></div>
  </div>
  <div id="act3" class="act-panel" style="display:none">
    <p class="act-title">Ordená las palabras para formar oraciones correctas</p>
    ${orderBlock(orderY23Data,'oY23')}
    <button class="act-submit" onclick="checkOrder(orderY23Data,'oY23',100)">CORREGIR</button>
    <div id="oY23-order-result" class="result-box" style="display:none"></div>
  </div>
  <div id="act4" class="act-panel" style="display:none">
    <p class="act-title">🎧 Escuchá y elegí la respuesta correcta</p>
    ${listeningBlock(listenY23Data,'lY23')}
    <button class="act-submit" onclick="checkListening(listenY23Data,'lY23',100)">VER RESULTADOS</button>
    <div id="lY23-listen-result" class="result-box" style="display:none"></div>
  </div>`;
}

// Iniciar barra de 2° año al cargar
document.addEventListener('DOMContentLoaded', () => {
  updateProgressBar2(getProgress2());
});
