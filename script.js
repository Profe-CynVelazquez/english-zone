// ═══════════════════════════════════════════════════════
//  ENGLISH ZONE – script.js (COMPLETO Y AMPLIADO)
// ═══════════════════════════════════════════════════════

// ─── CONTROL DE PROGRESO DINÁMICO REFORZADO ──────────────
function getApprovedModules(key) {
  try {
    const data = localStorage.getItem(key);
    const parsed = JSON.parse(data || "[]");
    return Array.isArray(parsed) ? parsed.map(num => parseInt(num, 10)).filter(num => !isNaN(num)) : [];
  } catch (e) {
    return [];
  }
}

function setModuleApproved(modNum, isYear2 = false) {
  const key = isYear2 ? 'ez_approved_y2' : 'ez_approved_y1';
  let approved = getApprovedModules(key);
  const cleanModNum = parseInt(modNum, 10);
  
  if (!approved.includes(cleanModNum) && !isNaN(cleanModNum)) {
    approved.push(cleanModNum);
    localStorage.setItem(key, JSON.stringify(approved));
  }
  
  refreshProgressBars();
}

function refreshProgressBars() {
  const approvedY1 = getApprovedModules('ez_approved_y1');
  const pctY1 = Math.min(approvedY1.length * 25, 100);
  
  const fill1 = document.getElementById('progressFill');
  const txt1  = document.getElementById('progressPct');
  if (fill1) fill1.style.width = pctY1 + '%';
  if (txt1)  txt1.textContent  = pctY1 + '%';

  const approvedY2 = getApprovedModules('ez_approved_y2');
  let pctY2 = approvedY2.length * 33;
  if (approvedY2.length === 3) pctY2 = 100;
  
  const fill2 = document.getElementById('progressFill2');
  const txt2  = document.getElementById('progressPct2');
  if (fill2) fill2.style.width = pctY2 + '%';
  if (txt2)  txt2.textContent  = pctY2 + '%';
}

function bumpProgress(modNum, isYear2 = false) {
  setModuleApproved(modNum, isYear2);
}


// ─── CONTROL DE MODALES (SOPORTA TODOS LOS MÓDULOS) ────
function openModule(num) {
  const content = document.getElementById('modalContent');
  
  const builders = { 
    1: buildModule1,      2: buildModule2,      3: buildModule3,      4: buildModule4,
    'y2-1': buildModuleY21, 'y2-2': buildModuleY22, 'y2-3': buildModuleY23
  };
  
  const inits = { 
    1: initModule1,      2: initModule2,      3: initModule3,      4: initModule4,
    'y2-1': initModuleY21, 'y2-2': initModuleY22, 'y2-3': initModuleY23
  };
  
  if (builders[num]) {
    content.innerHTML = builders[num]();
    if (inits[num]) inits[num]();
    document.getElementById('modalOverlay').classList.add('open');
    document.body.style.overflow = 'hidden';
  } else {
    console.error("El módulo asignado (" + num + ") no está implementado o estructurado aún.");
  }
}

function openModuleY2(num) {
  openModule('y2-' + num);
}

function closeModal() {
  document.getElementById('modalOverlay').classList.remove('open');
  document.body.style.overflow = '';
}
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });


// ─── ESTILOS CSS COMPARTIDOS DINÁMICOS ──────────────────
const sharedCSS = `<style>
.tab-btn{font-family:'Orbitron',sans-serif;font-size:.55rem;letter-spacing:.1em;padding:.4rem .75rem;border-radius:4px;cursor:pointer;border:1px solid #2e2e55;background:#0a0a0f;color:#555577;transition:all .15s;margin-bottom:.3rem}
.tab-btn.active{border-color:var(--mc);color:var(--mc);box-shadow: 0 0 6px var(--mc);}
.act-panel{animation:fadeIn .3s ease}
@keyframes fadeIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}
.act-title{font-size:.82rem;color:#9999bb;margin-bottom:.9rem;line-height:1.6}
.act-submit{font-family:'Orbitron',sans-serif;font-size:.58rem;letter-spacing:.13em;color:var(--mc);background:transparent;border:1px solid var(--mc);padding:.5rem 1.2rem;border-radius:4px;cursor:pointer;transition:all .15s;margin-top:.7rem}
.act-submit:hover{background:var(--mc);color:#0a0a0f}
.quiz-option{display:block;width:100%;text-align:left;padding:.55rem .85rem;margin-bottom:.35rem;background:#0a0a0f;border:1px solid #2e2e55;border-radius:6px;color:#9999bb;font-size:.8rem;cursor:pointer;transition:all .15s}
.quiz-option:hover{border-color:var(--mc);color:#eef0ff}
.quiz-option.selected{border-color:var(--mc)!important;color:#eef0ff!important;background:#1a1a2e!important}
.quiz-option.correct{border-color:#39ff14!important;color:#39ff14!important;background:#0a1a0a!important}
.quiz-option.wrong{border-color:#ff2d78!important;color:#ff2d78!important;background:#1a0a0f!important}
.match-item{padding:.55rem .4rem;border:1px solid #2e2e55;border-radius:6px;text-align:center;font-size:.76rem;color:#9999bb;cursor:pointer;transition:all .15s;background:#0a0a0f;word-break:break-word}
.match-item:hover{border-color:var(--mc);color:#eef0ff}
.match-item.selected{border-color:var(--mc);color:var(--mc);background:#001a1f}
.match-item.matched{border-color:#39ff14;color:#39ff14;background:#0a1a0a;pointer-events:none}
.match-item.wrong-flash{border-color:#ff2d78!important;color:#ff2d78!important}
.fill-item{margin-bottom:.85rem;font-size:.83rem;color:#eef0ff;line-height:2.2}
.fill-input{background:#0a0a0f;border:1px solid #2e2e55;border-radius:4px;color:#eef0ff;font-size:.8rem;padding:.2rem .4rem;width:110px;text-align:center;outline:none;transition:border-color .15s}
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
</style>`;


// ─── HELPERS PARA TABS DE CONTENIDO ────────────────────
function tabsHTML(labels, color) {
  return `<div style="display:flex;gap:.4rem;margin-bottom:1rem;flex-wrap:wrap">
    ${labels.map((l,i)=>`<button class="tab-btn${i===0?' active':''}" onclick="switchTab(${i+1},${labels.length})" id="tab${i+1}">${l}</button>`).join('')}
  </div>`;
}
function switchTab(n, total) {
  for(let i=1;i<=total;i++){
    const element = document.getElementById('act'+i);
    const tab = document.getElementById('tab'+i);
    if(element) element.style.display = i === n ? 'block' : 'none';
    if(tab) tab.classList.toggle('active', i === n);
  }
}


// ─── COMPONENTE Y LÓGICA DE QUIZ ───────────────────────
const qAnswers={}; const quizCorrected={}; 
function quizBlock(data, id) {
  return data.map((item,qi)=>`
    <div style="margin-bottom:.9rem" data-quiz-block="${id}-${qi}">
      <p style="font-size:.81rem;color:#eef0ff;margin-bottom:.35rem">${qi+1}. ${item.q}</p>
      ${item.opts.map((o,oi)=>`<button class="quiz-option" onclick="selectQ('${id}',${qi},${oi},this)">${o}</button>`).join('')}
    </div>`).join('');
}
function selectQ(id, qi, sel, btn){
  if(quizCorrected[id]) return;
  if(!qAnswers[id]) qAnswers[id]={};
  qAnswers[id][qi] = sel;
  
  const parent = btn.closest(`[data-quiz-block="${id}-${qi}"]`);
  if(parent) {
    parent.querySelectorAll('.quiz-option').forEach((b, i) => {
      b.classList.toggle('selected', i === sel);
    });
  }
}
function checkQuizGeneric(id, total, moduleIdentifier, isYear2 = false){
  if(quizCorrected[id]) return;
  const data = window[id+'Data'];
  let score = 0;
  
  data.forEach((item, qi) => {
    const sel = qAnswers[id] ? qAnswers[id][qi] : undefined;
    const parent = document.querySelector(`[data-quiz-block="${id}-${qi}"]`);
    
    if(parent) {
      parent.querySelectorAll('.quiz-option').forEach((b, i) => {
        b.classList.remove('selected');
        if(i === item.ans) b.classList.add('correct');
        if(i === sel && sel !== item.ans) b.classList.add('wrong');
        b.style.pointerEvents = 'none';
      });
    }
    if(sel === item.ans) score++;
  });
  
  quizCorrected[id] = true;
  const pct = Math.round(score / total * 100);
  
  const box = document.getElementById(id+'-result');
  if(box) {
    box.className = 'result-box ' + (pct >= 70 ? 'result-ok' : 'result-err');
    box.textContent = pct >= 70 ? `🏆 ${score}/${total} correctas (${pct}%)!` : `💪 ${score}/${total} correctas — ¡Inténtalo de nuevo!`;
    box.style.display = 'block';
  }
  
  if(pct >= 70) {
    bumpProgress(moduleIdentifier, isYear2);
  }
}


// ─── COMPONENTE Y LÓGICA DE RELACIONAR (MATCH) ─────────
function matchGrid(data, id, moduleIdentifier, isYear2 = false){
  const shuffled = [...data].sort(()=>Math.random()-.5);
  return `<div id="${id}-grid" style="display:grid;grid-template-columns:1fr 1fr;gap:.5rem">
    ${data.map((item,i)=>`
      <div class="match-item" onclick="handleMatch(this,'${id}','${moduleIdentifier}',${isYear2})" data-type="en" data-key="${item.en}">${item.en}</div>
      <div class="match-item" onclick="handleMatch(this,'${id}','${moduleIdentifier}',${isYear2})" data-type="es" data-key="${shuffled[i].en}">${shuffled[i].es}</div>
    `).join('')}
  </div>
  <div id="${id}-match-result" class="result-box result-ok" style="display:none;margin-top:.7rem;">🏆 ¡Todas las conexiones completadas con éxito!</div>`;
}
const matchState={};
function handleMatch(el, id, moduleIdentifier, isYear2){
  if(el.classList.contains('matched')) return;
  if(!matchState[id]) matchState[id]={selected:null,done:0,total:0};
  const s = matchState[id];
  if(!s.total) s.total = document.querySelectorAll(`#${id}-grid .match-item[data-type="en"]`).length;
  if(!s.selected){ s.selected=el; el.classList.add('selected'); return; }
  if(s.selected === el){ el.classList.remove('selected'); s.selected=null; return; }
  
  const a = s.selected, b = el;
  const ok = a.dataset.type !== b.dataset.type && a.dataset.key === b.dataset.key;
  if(ok){
    a.classList.remove('selected'); a.classList.add('matched'); b.classList.add('matched');
    s.done++;
    if(s.done === s.total){
      const resBox = document.getElementById(id+'-match-result');
      if(resBox) resBox.style.display = 'block';
      if(moduleIdentifier) bumpProgress(moduleIdentifier, isYear2);
    }
  } else {
    a.classList.add('wrong-flash'); b.classList.add('wrong-flash');
    setTimeout(()=>{ a.classList.remove('selected','wrong-flash'); b.classList.remove('wrong-flash'); },600);
  }
  s.selected = null;
}


// ─── COMPONENTE Y LÓGICA DE LLENAR ESPACIOS (FILL) ─────
function fillBlock(data, id){
  return data.map((item,i)=>`
    <div class="fill-item">
      <span style="color:#555577;font-size:.72rem;margin-right:.35rem">${i+1}.</span>
      ${item.pre} <input class="fill-input" id="${id}-f${i}" placeholder="___" autocomplete="off" spellcheck="false"/> ${item.post}
    </div>`).join('');
}
function checkFillGeneric(data, id, moduleIdentifier, isYear2 = false){
  let score = 0;
  data.forEach((item,i)=>{
    const inp = document.getElementById(`${id}-f${i}`);
    if(!inp) return;
    const ok = inp.value.trim().toLowerCase() === item.blank.toLowerCase();
    inp.classList.remove('ok','err'); inp.classList.add(ok?'ok':'err');
    inp.readOnly = true;
    inp.style.pointerEvents = 'none';
    if(ok) score++;
  });
  const pct = Math.round(score / data.length * 100);
  const box = document.getElementById(id+'-fill-result');
  if(box){
    box.className = 'result-box ' + (pct >= 70 ? 'result-ok' : 'result-err');
    box.textContent = pct >= 70 ? `🏆 ${score}/${data.length} correctas (${pct}%)!` : `💪 ${score}/${data.length} correctas — ¡Inténtalo de nuevo!`;
    box.style.display = 'block';
  }
  if(pct >= 70 && moduleIdentifier) {
    bumpProgress(moduleIdentifier, isYear2);
  }
}


// ─── COMPONENTE Y LÓGICA DE ORDENAR ORACIONES ─────────
function orderBlock(sentences, id){
  return sentences.map((s,i)=>{
    const words = [...s.words].sort(()=>Math.random()-.5);
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
const orderState={}; const orderCorrected={};
function placeWord(id, si, word, wi){
  if(orderCorrected[id]) return;
  if(!orderState[id]) orderState[id]={};
  if(!orderState[id][si]) orderState[id][si]=[];
  orderState[id][si].push({word,wi});
  document.getElementById(`${id}-chip${si}-${wi}`).classList.add('used');
  renderDrop(id,si);
}
function removeLastWord(id, si){
  if(orderCorrected[id]) return;
  if(!orderState[id] || !orderState[id][si] || !orderState[id][si].length) return;
  const last = orderState[id][si].pop();
  document.getElementById(`${id}-chip${si}-${last.wi}`).classList.remove('used');
  renderDrop(id,si);
}
function renderDrop(id, si){
  const drop = document.getElementById(`${id}-drop${si}`);
  const words = (orderState[id] && orderState[id][si]) || [];
  drop.innerHTML = words.map(w=>`<span class="placed-word">${w.word}</span>`).join('') || '<span style="font-size:.72rem;color:#2e2e55">Tocá las palabras para armar...</span>';
}
function checkOrder(sentences, id, moduleIdentifier, isYear2 = false){
  if(orderCorrected[id]) return;
  let score = 0;
  sentences.forEach((s,i)=>{
    const placed = ((orderState[id] && orderState[id][i]) || []).map(w=>w.word).join(' ');
    const correct = s.words.join(' ');
    const box = document.getElementById(`${id}-drop${i}`);
    if(placed.toLowerCase() === correct.toLowerCase()){
      score++; box.style.borderBottomColor = '#39ff14';
    } else {
      box.style.borderBottomColor = '#ff2d78';
    }
    box.style.pointerEvents = 'none';
    const bank = document.getElementById(`${id}-bank${i}`);
    if(bank) bank.style.pointerEvents = 'none';
  });
  orderCorrected[id] = true;
  const pct = Math.round(score / sentences.length * 100);
  const box = document.getElementById(id+'-order-result');
  if(box){
    box.className = 'result-box ' + (pct >= 70 ? 'result-ok' : 'result-err');
    box.textContent = pct >= 70 ? `🏆 ${score}/${sentences.length} correctas (${pct}%)!` : `💪 ${score}/${sentences.length} correctas — ¡Inténtalo de nuevo!`;
    box.style.display = 'block';
  }
  if(pct >= 70 && moduleIdentifier) {
    bumpProgress(moduleIdentifier, isYear2);
  }
}


// ─── COMPONENTE Y LÓGICA DE CRUCIGRAMAS INTEGRADOS ─────
function buildCrossword(cells, clues, id){
  const rows = Math.max(...cells.map(c=>c.r))+1;
  const cols = Math.max(...cells.map(c=>c.c))+1;
  const grid = Array.from({length:rows},()=>Array(cols).fill(null));
  cells.forEach(c=>grid[c.r][c.c]=c);

  let html = `<div class="cw-grid" style="grid-template-columns:repeat(${cols},30px);grid-template-rows:repeat(${rows},30px)">`;
  for(let r=0;r<rows;r++){
    for(let c=0;c<cols;c++){
      const cell = grid[r][c];
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
function checkCrossword(id, moduleIdentifier, isYear2 = false){
  const inputs = document.querySelectorAll(`[id^="${id}-"]`);
  let total = 0, score = 0;
  inputs.forEach(inp=>{
    if(!inp.dataset.ans) return;
    total++;
    inp.classList.remove('ok','err');
    if(inp.value.toUpperCase() === inp.dataset.ans.toUpperCase()){
      inp.classList.add('ok'); score++;
    } else {
      inp.classList.add('err');
    }
    inp.readOnly = true;
    inp.style.pointerEvents = 'none';
  });
  const pct = Math.round(score / total * 100);
  const box = document.getElementById(id+'-cw-result');
  if(box){
    box.className = 'result-box ' + (pct >= 70 ? 'result-ok' : 'result-err');
    box.textContent = pct >= 70 ? `🏆 ${score}/${total} correctas (${pct}%)!` : `💪 ${score}/${total} correctas — ¡Inténtalo de nuevo!`;
    box.style.display = 'block';
  }
  if(pct >= 70 && moduleIdentifier) {
    bumpProgress(moduleIdentifier, isYear2);
  }
}


// ═══════════════════════════════════════════════════════
//  1° AÑO - MÓDULO 1: THE BASICS
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
    {r:0,c:2,a:'E',n:2},
    {r:1,c:2,a:'R'},
    {r:2,c:0,a:'C',n:1},{r:2,c:1,a:'H'},{r:2,c:2,a:'A'},{r:2,c:3,a:'I'},{r:2,c:4,a:'R'},
    {r:3,c:2,a:'S'},
    {r:4,c:2,a:'E'},
    {r:5,c:2,a:'R'}
  ],
  clues:{
    across:[{n:1,clue:'Mueble escolar elemental para sentarse (Silla).'}],
    down:[{n:2,clue:'Útil escolar que sirve para borrar trazos de lápiz (Goma).'}],
  }
};

function buildModule1(){
  return `${sharedCSS}
  <div style="--mc:#00f5ff">
    <h2 style="color:#00f5ff;font-family:'Orbitron',sans-serif;font-size:.95rem;letter-spacing:.1em;margin-bottom:.25rem">MOD 01 · The Basics</h2>
    <p style="font-size:.75rem;color:#555577;margin-bottom:1rem">5 actividades · Colores, útiles y Verbo To Be</p>
    ${tabsHTML(['🎨 Quiz','🔗 Unir','✏️ To Be','¼ Ordenar','🔠 Crucigrama'],'#00f5ff')}
    <div id="act1" class="act-panel">
      ${quizBlock(window.quiz1Data,'quiz1')}
      <button class="act-submit" onclick="checkQuizGeneric('quiz1',${window.quiz1Data.length},1,false)">CORREGIR</button>
      <div id="quiz1-result" class="result-box" style="display:none"></div>
    </div>
    <div id="act2" class="act-panel" style="display:none">
      ${matchGrid(match1Data,'m1',1,false)}
    </div>
    <div id="act3" class="act-panel" style="display:none">
      ${fillBlock(fill1Data,'f1')}
      <button class="act-submit" onclick="checkFillGeneric(fill1Data,'f1',1,false)">CORREGIR</button>
      <div id="f1-fill-result" class="result-box" style="display:none"></div>
    </div>
    <div id="act4" class="act-panel" style="display:none">
      ${orderBlock(order1Data,'o1')}
      <button class="act-submit" onclick="checkOrder(order1Data,'o1',1,false)">CORREGIR</button>
      <div id="o1-order-result" class="result-box" style="display:none"></div>
    </div>
    <div id="act5" class="act-panel" style="display:none">
      ${buildCrossword(cw1.cells,cw1.clues,'cw1')}
      <button class="act-submit" onclick="checkCrossword('cw1',1,false)">CORREGIR</button>
      <div id="cw1-cw-result" class="result-box" style="display:none"></div>
    </div>
  </div>`;
}
function initModule1(){}


// ═══════════════════════════════════════════════════════
//  1° AÑO - MÓDULO 2: ALL ABOUT ME
// ═══════════════════════════════════════════════════════
window.quiz2Data=[
  {q:'¿Cómo se dice "Yo soy"?',                       opts:['He is','She is','I am','It is'],          ans:2},
  {q:'¿Cómo se dice "Ella es"?',                       opts:['I am','She is','He is','You are'],        ans:1},
  {q:'¿Nacionalidad de alguien de Brazil?',            opts:['Spanish','Brazilian','British','French'],  ans:1},
  {q:'¿Cuándo usamos AN?',                             opts:['Siempre','Palabras largas','Antes de vocal','Nunca'], ans:2},
  {q:'"My" significa...',                              opts:['Tu','Su (de él)','Mi','Nuestro'],          ans:2},
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
];
const order2Data=[
  {hint:'Armá: "Yo soy estudiante."',          words:['I','am','a','student','.']},
  {hint:'Armá: "Ella es mi amiga."',           words:['She','is','my','friend','.']},
];
const cw2={
  cells:[
    {r:0,c:3,a:'T',n:2},
    {r:1,c:3,a:'E'},
    {r:2,c:0,a:'F',n:1},{r:2,c:1,a:'R'},{r:2,c:2,a:'I'},{r:2,c:3,a:'E'},{r:2,c:4,a:'N'},{r:2,c:5,a:'D'},
    {r:3,c:3,a:'A'},
    {r:4,c:3,a:'C'},
    {r:5,c:3,a:'H'},
    {r:6,c:3,a:'E'},
    {r:7,c:3,a:'R'}
  ],
  clues: {
    across:[{n:1,clue:'Persona unida a otra por afecto y confianza (Amigo/a).'}],
    down:[{n:2,clue:'Profesional que enseña y dicta clases en la escuela (Profesor).'}],
  }
};

function buildModule2(){
  return `${sharedCSS}
  <div style="--mc:#ff2d78">
    <h2 style="color:#ff2d78;font-family:'Orbitron',sans-serif;font-size:.95rem;letter-spacing:.1em;margin-bottom:.25rem">MOD 02 · All About Me</h2>
    <p style="font-size:.75rem;color:#555577;margin-bottom:1rem">5 actividades · Pronombres y posesivos</p>
    ${tabsHTML(['🌍 Quiz','🔗 Unir','✏️ Completar','¼ Ordenar','🔠 Crucigrama'],'#ff2d78')}
    <div id="act1" class="act-panel">
      ${quizBlock(window.quiz2Data,'quiz2')}
      <button class="act-submit" onclick="checkQuizGeneric('quiz2',${window.quiz2Data.length},2,false)">CORREGIR</button>
      <div id="quiz2-result" class="result-box" style="display:none"></div>
    </div>
    <div id="act2" class="act-panel" style="display:none">
      ${matchGrid(match2Data,'m2',2,false)}
    </div>
    <div id="act3" class="act-panel" style="display:none">
      ${fillBlock(fill2Data,'f2')}
      <button class="act-submit" onclick="checkFillGeneric(fill2Data,'f2',2,false)">CORREGIR</button>
      <div id="f2-fill-result" class="result-box" style="display:none"></div>
    </div>
    <div id="act4" class="act-panel" style="display:none">
      ${orderBlock(order2Data,'o2')}
      <button class="act-submit" onclick="checkOrder(order2Data,'o2',2,false)">CORREGIR</button>
      <div id="o2-order-result" class="result-box" style="display:none"></div>
    </div>
    <div id="act5" class="act-panel" style="display:none">
      ${buildCrossword(cw2.cells,cw2.clues,'cw2')}
      <button class="act-submit" onclick="checkCrossword('cw2',2,false)">CORREGIR</button>
      <div id="cw2-cw-result" class="result-box" style="display:none"></div>
    </div>
  </div>`;
}
function initModule2(){}


// ═══════════════════════════════════════════════════════
//  1° AÑO - MÓDULO 3: PEOPLE & PLACES (AMPLIADO)
// ═══════════════════════════════════════════════════════
window.quiz3Data=[
  {q:'¿Cuál es el pronombre para "Ellos"?', opts:['We','You','They','He'], ans:2},
  {q:'We ______ doctors.', opts:['am','is','are','be'], ans:2},
  {q:'¿Qué significa "Where"?', opts:['Quién','Dónde','Cuándo','Qué'], ans:1},
  {q:'¿Cómo se dice Cocinero en inglés?', opts:['Firefighter','Chef','Nurse','Pilot'], ans:1},
  {q:'He ______ a police officer.', opts:['am','are','is','be'], ans:2},
  {q:'¿Cuál es la pregunta para "Él es de Argentina"?', opts:['Where am I from?','Where is he from?','Who is he?','What is he?'], ans:1},
  {q:'Ellos no son bomberos se dice...', opts:['They not are firefighters.','They are no firefighters.','They aren\'t firefighters.','They isn\'t firefighters.'], ans:2}
];
const match3Data=[
  {en:'Doctor',es:'Médico/a'},{en:'Hospital',es:'Hospital'},{en:'Chef',es:'Cocinero/a'},
  {en:'School',es:'Escuela'},{en:'Pilot',es:'Piloto'},{en:'Airport',es:'Aeropuerto'},
  {en:'Firefighter',es:'Bombero'},{en:'Fire station',es:'Cuartel'}
];
const fill3Data=[
  {pre:'They',blank:'are',post:'happy in the office.'},
  {pre:'Where',blank:'is',post:'the new teacher?'},
  {pre:'She',blank:'is',post:'a talented nurse.'},
  {pre:'We',blank:'are',post:'at the local fire station.'},
  {pre:'What',blank:'is',post:'your job?'},
  {pre:'I',blank:'am',post:'not a pilot.'}
];
const order3Data=[
  {hint:'Armá: "¿Quién es él?"', words:['Who','is','he','?']},
  {hint:'Armá: "Ellos son doctores."', words:['They','are','doctors','.']},
  {hint:'Armá: "¿Dónde está la escuela?"', words:['Where','is','the','school','?']},
  {hint:'Armá: "Yo no soy cocinero."', words:['I','am','not','a','chef','.']}
];
const cw3={
  cells:[
    {r:0,c:0,a:'P',n:1},{r:0,c:1,a:'I'},{r:0,c:2,a:'L'},{r:0,c:3,a:'O'},{r:0,c:4,a:'T'},
    {r:1,c:0,a:'O'},
    {r:2,c:0,a:'L'},
    {r:3,c:0,a:'I'},{r:3,c:1,a:'C'},{r:3,c:2,a:'E',n:2},
    {r:4,c:0,a:'C'},
    {r:5,c:0,a:'E'}
  ],
  clues:{
    across:[
      {n:1,clue:'Persona que vuela aviones profesionalmente.'},
      {n:2,clue:'Fuerza de seguridad encargada del orden (empieza en la fila 3).'}
    ],
    down:[
      {n:1,clue:'Oficial de seguridad individual: _____ officer.'}
    ],
  }
};

function buildModule3(){
  return `${sharedCSS}
  <div style="--mc:#ffe600">
    <h2 style="color:#ffe600;font-family:'Orbitron',sans-serif;font-size:.95rem;letter-spacing:.1em;margin-bottom:.25rem">MOD 03 · People & Places</h2>
    <p style="font-size:.75rem;color:#555577;margin-bottom:1rem">5 actividades · Profesiones, lugares de trabajo y preguntas con WH-</p>
    ${tabsHTML(['🎨 Quiz','🔗 Unir','✏️ Completar','¼ Ordenar','🔠 Crucigrama'],'#ffe600')}
    <div id="act1" class="act-panel">
      ${quizBlock(window.quiz3Data,'quiz3')}
      <button class="act-submit" onclick="checkQuizGeneric('quiz3',${window.quiz3Data.length},3,false)">CORREGIR</button>
      <div id="quiz3-result" class="result-box" style="display:none"></div>
    </div>
    <div id="act2" class="act-panel" style="display:none">
      ${matchGrid(match3Data,'m3',3,false)}
    </div>
    <div id="act3" class="act-panel" style="display:none">
      ${fillBlock(fill3Data,'f3')}
      <button class="act-submit" onclick="checkFillGeneric(fill3Data,'f3',3,false)">CORREGIR</button>
      <div id="f3-fill-result" class="result-box" style="display:none"></div>
    </div>
    <div id="act4" class="act-panel" style="display:none">
      ${orderBlock(order3Data,'o3')}
      <button class="act-submit" onclick="checkOrder(order3Data,'o3',3,false)">CORREGIR</button>
      <div id="o3-order-result" class="result-box" style="display:none"></div>
    </div>
    <div id="act5" class="act-panel" style="display:none">
      ${buildCrossword(cw3.cells,cw3.clues,'cw3')}
      <button class="act-submit" onclick="checkCrossword('cw3',3,false)">CORREGIR</button>
      <div id="cw3-cw-result" class="result-box" style="display:none"></div>
    </div>
  </div>`;
}
function initModule3(){}


// ═══════════════════════════════════════════════════════
//  1° AÑO - MÓDULO 4: MY CITY & HOME (AMPLIADO)
// ═══════════════════════════════════════════════════════
window.quiz4Data=[
  {q:'¿Cuándo usamos THERE ARE?', opts:['Singular','Plural','Cosas incontables','Siempre'], ans:1},
  {q:'¿Qué significa "Next to"?', opts:['Debajo','Al lado de','Enfrente','Entre'], ans:1},
  {q:'There ______ a book on the table.', opts:['are','is','am','be'], ans:1},
  {q:'¿Qué parte de la casa es Bed-room?', opts:['Cocina','Baño','Dormitorio','Living'], ans:2},
  {q:'Para decir que NO hay plazas (plural) usamos:', opts:['There isn\'t any parks.','There aren\'t any parks.','There not parks.','There no are parks.'], ans:1},
  {q:'¿Qué preposición significa "dentro de"?', opts:['On','Under','In','Behind'], ans:2}
];
const match4Data=[
  {en:'Bed',es:'Cama'},{en:'Kitchen',es:'Cocina'},{en:'Park',es:'Parque'},
  {en:'Sofa',es:'Sillón'},{en:'Bathroom',es:'Baño'},{en:'Museum',es:'Museo'},
  {en:'Between',es:'Entre (medio)'},{en:'Behind',es:'Detrás de'}
];
const fill4Data=[
  {pre:'There',blank:'is',post:'a big table in the room.'},
  {pre:'There',blank:'are',post:'three chairs in the kitchen.'},
  {pre:'The cat is',blank:'under',post:'the bed.'},
  {pre:'There',blank:'aren\'t',post:'any cars in the garage.'},
  {pre:'Is',blank:'there',post:'a supermarket near here?'}
];
const order4Data=[
  {hint:'Armá: "Hay dos parques."', words:['There','are','two','parks','.']},
  {hint:'Armá: "El sillón está en el living."', words:['The','sofa','is','in','the','living','room','.']},
  {hint:'Armá: "¿Hay un museo aquí?"', words:['Is','there','a','museum','here','?']}
];
const cw4={
  cells:[
    {r:0,c:0,a:'H',n:1},{r:0,c:1,a:'O'},{r:0,c:2,a:'U'},{r:0,c:3,a:'S'},{r:0,c:4,a:'E'},
    {r:1,c:3,a:'O'},
    {r:2,c:3,a:'F'},
    {r:3,c:3,a:'A',n:2}
  ],
  clues:{
    across:[{n:1,clue:'El hogar o vivienda general donde vive una familia.'}],
    down:[{n:2,clue:'Mueble cómodo del living para sentarse (Sofá).'}],
  }
};

function buildModule4(){
  return `${sharedCSS}
  <div style="--mc:#39ff14">
    <h2 style="color:#39ff14;font-family:'Orbitron',sans-serif;font-size:.95rem;letter-spacing:.1em;margin-bottom:.25rem">MOD 04 · My City & Home</h2>
    <p style="font-size:.75rem;color:#555577;margin-bottom:1rem">5 actividades · Estructuras urbanas, partes de la casa y preposiciones de lugar</p>
    ${tabsHTML(['🎨 Quiz','🔗 Unir','✏️ Rellenar','¼ Ordenar','🔠 Crucigrama'],'#39ff14')}
    <div id="act1" class="act-panel">
      ${quizBlock(window.quiz4Data,'quiz4')}
      <button class="act-submit" onclick="checkQuizGeneric('quiz4',${window.quiz4Data.length},4,false)">CORREGIR</button>
      <div id="quiz4-result" class="result-box" style="display:none"></div>
    </div>
    <div id="act2" class="act-panel" style="display:none">
      ${matchGrid(match4Data,'m4',4,false)}
    </div>
    <div id="act3" class="act-panel" style="display:none">
      ${fillBlock(fill4Data,'f4')}
      <button class="act-submit" onclick="checkFillGeneric(fill4Data,'f4',4,false)">CORREGIR</button>
      <div id="f4-fill-result" class="result-box" style="display:none"></div>
    </div>
    <div id="act4" class="act-panel" style="display:none">
      ${orderBlock(order4Data,'o4')}
      <button class="act-submit" onclick="checkOrder(order4Data,'o4',4,false)">CORREGIR</button>
      <div id="o4-order-result" class="result-box" style="display:none"></div>
    </div>
    <div id="act5" class="act-panel" style="display:none">
      ${buildCrossword(cw4.cells,cw4.clues,'cw4')}
      <button class="act-submit" onclick="checkCrossword('cw4',4,false)">CORREGIR</button>
      <div id="cw4-cw-result" class="result-box" style="display:none"></div>
    </div>
  </div>`;
}
function initModule4(){}


// ═══════════════════════════════════════════════════════
//  2° AÑO - NÚCLEO 1: WHO AM I? (AMPLIADO)
// ═══════════════════════════════════════════════════════
window.quizY21Data=[
  {q:'¿Qué pronombre corresponde a un objeto o animal?', opts:['He','She','It','They'], ans:2},
  {q:'I _____ fifteen years old.', opts:['is','am','are','have'], ans:1},
  {q:'¿Cómo se dice "Tío" en inglés?', opts:['Aunt','Uncle','Brother','Father'], ans:1},
  {q:'¿Cuál es el artículo correcto antes de la palabra "Apple"?', opts:['A','An','Some','Any'], ans:1},
  {q:'¿Qué adjetivo posesivo corresponde a "We" (Nosotros)?', opts:['Their','Your','Our','His'], ans:2}
];
const matchY21Data=[
  {en:'Mother',es:'Madre'},{en:'Father',es:'Padre'},{en:'Aunt',es:'Tía'},
  {en:'Cousin',es:'Primo/a'},{en:'Grandfather',es:'Abuelo'},{en:'Sister',es:'Hermana'},
  {en:'Nephew',es:'Sobrino'},{en:'Daughter',es:'Hija'}
];
const fillY21Data=[
  {pre:'He is',blank:'an',post:'actor.'},
  {pre:'She is',blank:'a',post:'doctor.'},
  {pre:'They',blank:'are',post:'my beloved cousins.'},
  {pre:'This is',blank:'our',post:'house. We live here.'}
];
const orderY21Data=[
  {hint:'Armá: "Ella es mi tía."', words:['She','is','my','aunt','.']},
  {hint:'Armá: "Nosotros somos una familia."', words:['We','are','a','family','.']}
];

function buildModuleY21(){
  return `${sharedCSS}
  <div style="--mc:#ffa500">
    <h2 style="color:#ffa500;font-family:'Orbitron',sans-serif;font-size:.95rem;letter-spacing:.1em;margin-bottom:.25rem">NÚC 01 · Who Am I?</h2>
    <p style="font-size:.75rem;color:#555577;margin-bottom:1rem">4 actividades · Presentaciones personales, artículos A/AN y árboles genealógicos</p>
    ${tabsHTML(['🎨 Quiz','🔗 Familia','✏️ Completar','¼ Ordenar'],'#ffa500')}
    <div id="act1" class="act-panel">
      ${quizBlock(window.quizY21Data,'quizY21')}
      <button class="act-submit" onclick="checkQuizGeneric('quizY21',${window.quizY21Data.length},1,true)">CORREGIR</button>
      <div id="quizY21-result" class="result-box" style="display:none"></div>
    </div>
    <div id="act2" class="act-panel" style="display:none">
      ${matchGrid(matchY21Data,'mY21',1,true)}
    </div>
    <div id="act3" class="act-panel" style="display:none">
      ${fillBlock(fillY21Data,'fY21')}
      <button class="act-submit" onclick="checkFillGeneric(fillY21Data,'fY21',1,true)">CORREGIR</button>
      <div id="fY21-fill-result" class="result-box" style="display:none"></div>
    </div>
    <div id="act4" class="act-panel" style="display:none">
      ${orderBlock(orderY21Data,'oY21')}
      <button class="act-submit" onclick="checkOrder(orderY21Data,'oY21',1,true)">CORREGIR</button>
      <div id="oY21-order-result" class="result-box" style="display:none"></div>
    </div>
  </div>`;
}
function initModuleY21(){}


// ═══════════════════════════════════════════════════════
//  2° AÑO - NÚCLEO 2: MY CITY & FOOD (AMPLIADO)
// ═══════════════════════════════════════════════════════
window.quizY22Data=[
  {q:'¿Para qué se utiliza el verbo CAN?', opts:['Habilidad / Permiso','Pasado','Obligación','Futuro'], ans:0},
  {q:'Water es un sustantivo...', opts:['Contable','Incontable','Plural','Ninguno'], ans:1},
  {q:'¿Qué palabra usamos en oraciones negativas con incontables?', opts:['Some','Any','A','Many'], ans:1},
  {q:'I ______ swim very well, I practice every day.', opts:['can','cannot','am','is'], ans:0},
  {q:'¿Cuál es un sustantivo contable?', opts:['Rice','Sugar','Burger','Soup'], ans:2}
];
const matchY22Data=[
  {en:'Library',es:'Biblioteca'},{en:'Bakery',es:'Panadería'},{en:'Apple',es:'Manzana'},
  {en:'Supermarket',es:'Supermercado'},{en:'Milk',es:'Leche'},{en:'Cinema',es:'Cine'},
  {en:'Butcher\'s',es:'Carnicería'},{en:'Cheese',es:'Queso'}
];
const fillY22Data=[
  {pre:'I can buy bread at the',blank:'bakery',post:'.'},
  {pre:'Would you like',blank:'some',post:'water?'},
  {pre:'There isn\'t',blank:'any',post:'sugar left.'},
  {pre:'Bats',blank:'can',post:'fly at night.'}
];
const orderY22Data=[
  {hint:'Armá: "Yo puedo hablar inglés."', words:['I','can','speak','English','.']},
  {hint:'Armá: "¿Hay algo de leche?"', words:['Is','there','any','milk','?']}
];

function buildModuleY22(){
  return `${sharedCSS}
  <div style="--mc:#b026ff">
    <h2 style="color:#b026ff;font-family:'Orbitron',sans-serif;font-size:.95rem;letter-spacing:.1em;margin-bottom:.25rem">NÚC 02 · My City & Healthy Food</h2>
    <p style="font-size:.75rem;color:#555577;margin-bottom:1rem">4 actividades · Comercio urbano, Countable/Uncountable y verbo modal CAN</p>
    ${tabsHTML(['🎨 Quiz','🔗 Conexiones','✏️ Completar','¼ Ordenar'],'#b026ff')}
    <div id="act1" class="act-panel">
      ${quizBlock(window.quizY22Data,'quizY22')}
      <button class="act-submit" onclick="checkQuizGeneric('quizY22',${window.quizY22Data.length},2,true)">CORREGIR</button>
      <div id="quizY22-result" class="result-box" style="display:none"></div>
    </div>
    <div id="act2" class="act-panel" style="display:none">
      ${matchGrid(matchY22Data,'mY22',2,true)}
    </div>
    <div id="act3" class="act-panel" style="display:none">
      ${fillBlock(fillY22Data,'fY22')}
      <button class="act-submit" onclick="checkFillGeneric(fillY22Data,'fY22',2,true)">CORREGIR</button>
      <div id="fY22-fill-result" class="result-box" style="display:none"></div>
    </div>
    <div id="act4" class="act-panel" style="display:none">
      ${orderBlock(orderY22Data,'oY22')}
      <button class="act-submit" onclick="checkOrder(orderY22Data,'oY22',2,true)">CORREGIR</button>
      <div id="oY22-order-result" class="result-box" style="display:none"></div>
    </div>
  </div>`;
}
function initModuleY22(){}


// ═══════════════════════════════════════════════════════
//  2° AÑO - NÚCLEO 3: ROUTINES & WILDLIFE (AMPLIADO)
// ═══════════════════════════════════════════════════════
window.quizY23Data=[
  {q:'He ______ to school every day.', opts:['go','goes','going','gone'], ans:1},
  {q:'¿Qué significa "Have breakfast"?', opts:['Almorzar','Cenar','Desayunar','Dormir'], ans:2},
  {q:'¿Cuál de estos es un animal salvaje?', opts:['Cow','Dog','Lion','Cat'], ans:2},
  {q:'They ______ up at 7 o\'clock every morning.', opts:['gets','getting','get','has'], ans:2},
  {q:'¿Cuál es el auxiliar negativo para He/She/It en Presente Simple?', opts:['Don\'t','Doesn\'t','Isn\'t','Aren\'t'], ans:1}
];
const matchY23Data=[
  {en:'Lion',es:'León'},{en:'Eagle',es:'Águila'},{en:'Shark',es:'Tiburón'},
  {en:'Elephant',es:'Elefante'},{en:'Monkey',es:'Mono'},{en:'Snake',es:'Serpiente'},
  {en:'Get up',es:'Levantarse'},{en:'Go to bed',es:'Acostarse'}
];
const fillY23Data=[
  {pre:'She',blank:'does',post:'not like reptiles.'},
  {pre:'What time do you',blank:'have',post:'dinner?'},
  {pre:'An elephant',blank:'lives',post:'in Africa.'},
  {pre:'Monkeys',blank:'climb',post:'trees easily.'}
];
const orderY23Data=[
  {hint:'Armá: "Él se ducha."', words:['He','takes','a','shower','.']},
  {hint:'Armá: "Los tiburones nadan rápido."', words:['Sharks','swim','fast','.']}
];

function buildModuleY23(){
  return `${sharedCSS}
  <div style="--mc:#008080">
    <h2 style="color:#008080;font-family:'Orbitron',sans-serif;font-size:.95rem;letter-spacing:.1em;margin-bottom:.25rem">NÚC 03 · Routines & Wildlife</h2>
    <p style="font-size:.75rem;color:#555577;margin-bottom:1rem">4 actividades · Rutinas en Presente Simple, adverbios y vida silvestre salvaje</p>
    ${tabsHTML(['🎨 Quiz','🔗 Vocabulario','✏️ Completar','¼ Ordenar'],'#008080')}
    <div id="act1" class="act-panel">
      ${quizBlock(window.quizY23Data,'quizY23')}
      <button class="act-submit" onclick="checkQuizGeneric('quizY23',${window.quizY23Data.length},3,true)">CORREGIR</button>
      <div id="quizY23-result" class="result-box" style="display:none"></div>
    </div>
    <div id="act2" class="act-panel" style="display:none">
      ${matchGrid(matchY23Data,'mY23',3,true)}
    </div>
    <div id="act3" class="act-panel" style="display:none">
      ${fillBlock(fillY23Data,'fY23')}
      <button class="act-submit" onclick="checkFillGeneric(fillY23Data,'fY23',3,true)">CORREGIRESTUDIANTE</button>
      <div id="fY23-fill-result" class="result-box" style="display:none"></div>
    </div>
    <div id="act4" class="act-panel" style="display:none">
      ${orderBlock(orderY23Data,'oY23')}
      <button class="act-submit" onclick="checkOrder(orderY23Data,'oY23',3,true)">CORREGIR</button>
      <div id="oY23-order-result" class="result-box" style="display:none"></div>
    </div>
  </div>`;
}
function initModuleY23(){}


// ─── INICIALIZACIÓN GENERAL EN CARGA DE PÁGINA ──────────
document.addEventListener('DOMContentLoaded', () => {
  refreshProgressBars();
});