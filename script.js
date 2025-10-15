// Select DOM elements
const status = document.getElementById('status');
const container = document.getElementById('cardContainer');
const select = document.getElementById('scheduleSelect');

// Map keyboard keys to JSON files
const keyMap = {
  '1': 'Drew.json',
  '2': 'Alexa.json',
  '3': 'Chris.json',
  '4': 'Zahr.json'
};

// Load Drew's schedule by default
document.addEventListener('DOMContentLoaded', () => {
  loadSchedule('Drew.json');
});

// Event: dropdown change
select.addEventListener('change', (e) => {
  loadSchedule(e.target.value);
});

// Event: key press (non-button)
document.addEventListener('keydown', (e) => {
  if (keyMap[e.key]) {
    select.value = keyMap[e.key]; // keep dropdown in sync
    loadSchedule(keyMap[e.key]);
  }
});

/**
 * Load and display a schedule JSON file
 * @param {string} fileName - the JSON file name in ./json/
 */
async function loadSchedule(fileName) {
  // Show loading message
  status.innerHTML = `<div class="alert alert-info">Loading schedule...</div>`;
  container.innerHTML = "";

  try {
    // Fetch JSON file using template literal
    const response = await fetch(`./json/${fileName}`);
    if (!response.ok) throw new Error(`File not found (${response.status})`);

    const data = await response.json();

    // Sort classes by period (extra credit)
    data.sort((a, b) => (a.period || 99) - (b.period || 99));

    status.innerHTML = `<div class="alert alert-success py-2">Loaded <strong>${fileName.replace('.json','')}</strong></div>`;

    // Build schedule cards dynamically
    data.forEach(cls => {
      const cardHTML = `
        <div class="col-12 col-md-6 col-lg-4">
          <div class="card shadow-sm">
            <div class="card-body">
              <h5 class="card-title">${cls.className}</h5>
              <p class="mb-1"><strong>Period:</strong> ${cls.period}</p>
              <p class="mb-1"><strong>Teacher:</strong> ${cls.teacher}</p>
              <p class="mb-1"><strong>Room:</strong> ${cls.roomNumber}</p>
              <p class="text-muted mb-0"><em>${cls.subjectArea}</em></p>
            </div>
          </div>
        </div>
      `;
      container.insertAdjacentHTML('beforeend', cardHTML);
    });

  } catch (err) {
    console.error(err);
    status.innerHTML = `<div class="alert alert-danger">Error loading <strong>${fileName}</strong>: ${err.message}</div>`;
  }
}
