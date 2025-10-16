const status = document.getElementById('status');
const container = document.getElementById('cardContainer');
const select = document.getElementById('scheduleSelect');
const sortSelect = document.getElementById('sortSelect');
const resetSort = document.getElementById('resetSort');
const backToTop = document.getElementById('backToTop');

const keyMap = {
  '1': 'Drew.json',
  '2': 'Alexa.json',
  '3': 'Chris.json',
  '4': 'Zahr.json'
};

let currentData = [];
let originalData = [];

document.addEventListener('DOMContentLoaded', () => {
  loadSchedule('Drew.json');
});

select.addEventListener('change', e => {
  loadSchedule(e.target.value);
});

sortSelect.addEventListener('change', () => {
  renderCards(currentData);
});

resetSort.addEventListener('click', () => {
  sortSelect.value = "";
  currentData = [...originalData]; 
  renderCards(currentData);
});

document.addEventListener('keydown', e => {
  if (keyMap[e.key]) {
    select.value = keyMap[e.key];
    loadSchedule(keyMap[e.key]);
  }
});

async function loadSchedule(fileName) {
  status.innerHTML = `<div class="alert alert-info">Loading schedule...</div>`;
  container.innerHTML = "";

  try {
    const response = await fetch(`./json/${fileName}`);
    if (!response.ok) throw new Error(`File not found (${response.status})`);

    currentData = await response.json();
    originalData = [...currentData]; 

    status.innerHTML = `<div class="alert alert-success py-2">Loaded <strong>${fileName.replace('.json','')}</strong></div>`;

    renderCards(currentData);

  } catch (err) {
    status.innerHTML = `<div class="alert alert-danger">Error loading <strong>${fileName}</strong>: ${err.message}</div>`;
  }
}

function renderCards(data) {
  container.innerHTML = "";

  const sortBy = sortSelect.value;

  if (sortBy) {
    data.sort((a, b) => {
      const keyA = (a[sortBy] || a[capitalize(sortBy)])?.toString().toLowerCase() || '';
      const keyB = (b[sortBy] || b[capitalize(sortBy)])?.toString().toLowerCase() || '';
      return keyA.localeCompare(keyB);
    });
  }

  data.forEach(cls => {
    const cardHTML = `
      <div class="card shadow-sm">
        <div class="card-body">
          <h5 class="card-title">${cls.className || cls.Class}</h5>
          <p class="mb-1"><strong>Teacher:</strong> ${cls.teacher || cls.Teacher}</p>
          <p class="mb-1"><strong>Room:</strong> ${cls.roomNumber || cls['Room Number']}</p>
          ${cls.subjectArea ? `<p class="text-muted mb-0"><em>${cls.subjectArea}</em></p>` : ''}
        </div>
      </div>
    `;
    container.insertAdjacentHTML('beforeend', cardHTML);
  });
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

backToTop.addEventListener('click', () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
});
