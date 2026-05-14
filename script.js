const duckColor = document.getElementById('duckColor');
const duckName = document.getElementById('duckName');
const duckOutfit = document.getElementById('duckOutfit');
const track = document.getElementById('track');
const list = document.getElementById('duckList');
const results = document.getElementById('resultList');

const outfits = { none: '', cap: '🧢', crown: '👑', pirate: '🏴‍☠️', ninja: '🥷' };
let ducks = [
  { name: 'Flash', color: '#ffd84d', outfit: 'cap' },
  { name: 'Turbo', color: '#7dd3fc', outfit: 'crown' },
  { name: 'Mango', color: '#f9a8d4', outfit: 'pirate' }
];
let running = false;

function renderAdmin() {
  list.innerHTML = '';
  ducks.forEach((d, i) => {
    const row = document.createElement('div');
    row.className = 'duck-row';
    row.innerHTML = `<span>${i + 1}. ${d.name} — ${d.outfit}</span><button data-i="${i}">Sil</button>`;
    row.querySelector('button').onclick = () => { if (!running) { ducks.splice(i, 1); renderAll(); } };
    list.appendChild(row);
  });
}

function renderTrack() {
  track.innerHTML = '';
  ducks.forEach((d, i) => {
    const lane = document.createElement('div');
    lane.className = 'lane';
    lane.innerHTML = `
      <div class="duck" id="duck-${i}">
        <div class="body" style="background:${d.color}"><div class="eye"></div><div class="outfit">${outfits[d.outfit]}</div></div>
        <span class="label">${d.name}</span>
      </div>`;
    track.appendChild(lane);
  });
}

function renderAll() { renderAdmin(); renderTrack(); }

function addDuck() {
  const name = duckName.value.trim() || `Duck ${ducks.length + 1}`;
  ducks.push({ name, color: duckColor.value, outfit: duckOutfit.value });
  duckName.value = '';
  renderAll();
}

function startRace() {
  if (running || ducks.length < 2) return;
  running = true;
  results.innerHTML = '';
  const finishX = track.clientWidth - 140;
  const state = ducks.map((d, i) => ({ idx: i, dist: 0, speed: 0, done: false, place: 0 }));
  let place = 1;

  const timer = setInterval(() => {
    for (const s of state) {
      if (s.done) continue;
      s.speed += (Math.random() - 0.45) * 2;
      s.speed = Math.min(Math.max(s.speed, 1.2), 7.2);
      s.dist += s.speed;
      const duck = document.getElementById(`duck-${s.idx}`);
      duck.style.left = `${Math.min(s.dist, finishX)}px`;
      duck.style.transform = `translateY(-50%) rotate(${Math.sin(s.dist / 24) * 6}deg)`;
      if (s.dist >= finishX) {
        s.done = true;
        s.place = place++;
        const li = document.createElement('li');
        li.textContent = `#${s.place} ${ducks[s.idx].name}`;
        results.appendChild(li);
      }
    }
    if (state.every(s => s.done)) {
      clearInterval(timer);
      running = false;
    }
  }, 80);
}

function resetRace() {
  if (running) return;
  document.querySelectorAll('.duck').forEach(d => {
    d.style.left = '.5rem';
    d.style.transform = 'translateY(-50%)';
  });
  results.innerHTML = '';
}

document.getElementById('createCustom').onclick = addDuck;
document.getElementById('addDuck').onclick = addDuck;
document.getElementById('startRace').onclick = startRace;
document.getElementById('shuffle').onclick = () => { if (!running) { ducks.sort(() => Math.random() - 0.5); renderAll(); } };
document.getElementById('reset').onclick = resetRace;

renderAll();
