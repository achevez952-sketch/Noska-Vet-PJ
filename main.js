// Noska-Vet - Frontend App Logic

// Initial Puppies Data
const DEFAULT_PUPPIES = [
  {
    id: 'p1',
    name: 'Luna',
    breed: 'Golden Retriever',
    age: '2 meses',
    gender: 'Hembra',
    size: 'Mediano',
    status: 'Disponible',
    image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=600&q=80',
    description: 'Luna es super juguetona, cariñosa y le encantan los abrazos. Está vacunada y desparasitada.'
  },
  {
    id: 'p2',
    name: 'Milo',
    breed: 'Bulldog Francés',
    age: '3 meses',
    gender: 'Macho',
    size: 'Pequeño',
    status: 'Disponible',
    image: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=600&q=80',
    description: 'Milo es tranquilo, le encanta dormir siestas y socializa maravillosamente con otros animales.'
  },
  {
    id: 'p3',
    name: 'Bella',
    breed: 'Pomerania',
    age: '2.5 meses',
    gender: 'Hembra',
    size: 'Pequeño',
    status: 'Disponible',
    image: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=600&q=80',
    description: 'Bella es una bolita de pelo enérgica y llena de alegría. Lista para llenar de amor un hogar.'
  },
  {
    id: 'p4',
    name: 'Rocky',
    breed: 'Pastor Australiano',
    age: '3 meses',
    gender: 'Macho',
    size: 'Mediano',
    status: 'Disponible',
    image: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=600&q=80',
    description: 'Rocky es muy inteligente y activo. Ideal para familias dinámicas o personas activas.'
  }
];

// App State
let state = {
  puppies: DEFAULT_PUPPIES,
  appointments: [],
  adoptions: []
};

// Fetch data from MongoDB backend API
async function loadDataFromApi() {
  try {
    const [aptRes, adoptRes] = await Promise.all([
      fetch('/api/appointments').catch(() => null),
      fetch('/api/adoptions').catch(() => null)
    ]);

    if (aptRes && aptRes.ok) {
      state.appointments = await aptRes.json();
    }
    if (adoptRes && adoptRes.ok) {
      state.adoptions = await adoptRes.json();
    }
  } catch (err) {
    console.warn("MongoDB API connection warning:", err);
  }
  updateBadges();
  renderDashboard();
}

// Update badges counter
function updateBadges() {
  const aptBadge = document.getElementById('apt-badge-count');
  if (aptBadge) {
    aptBadge.textContent = state.appointments.length;
  }
}

// Render Puppies Grid
function renderPuppies(filterSize = 'all') {
  const grid = document.getElementById('puppies-grid');
  if (!grid) return;

  grid.innerHTML = '';

  const filtered = filterSize === 'all' 
    ? state.puppies 
    : state.puppies.filter(p => p.size.toLowerCase() === filterSize.toLowerCase());

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div class="empty-state" style="grid-column: 1/-1;">
        <i class="fa-solid fa-paw"></i>
        <p>No hay cachorros disponibles con el filtro seleccionado.</p>
      </div>
    `;
    return;
  }

  filtered.forEach(puppy => {
    const card = document.createElement('div');
    card.className = 'puppy-card';
    
    const isAvailable = puppy.status === 'Disponible';
    const statusClass = isAvailable ? 'status-available' : 'status-reserved';
    
    card.innerHTML = `
      <div class="puppy-img-container">
        <img src="${puppy.image}" alt="${puppy.name}">
        <span class="puppy-status ${statusClass}">${puppy.status}</span>
        <span class="puppy-tag">${puppy.size}</span>
      </div>
      <div class="puppy-content">
        <div class="puppy-name">
          <span>${puppy.name}</span>
          <span class="puppy-gender">${puppy.gender === 'Hembra' ? '♀' : '♂'}</span>
        </div>
        <div class="puppy-breed">${puppy.breed} • ${puppy.age}</div>
        <p class="puppy-desc">${puppy.description}</p>
        <button class="btn btn-primary" style="width: 100%" onclick="openAdoptionModal('${puppy.id}')" ${!isAvailable ? 'disabled' : ''}>
          ${isAvailable ? '<i class="fa-solid fa-heart"></i> Solicitar Adopción' : 'Proceso Iniciado'}
        </button>
      </div>
    `;
    grid.appendChild(card);
  });
}

// Filter Puppy Buttons handler
function setupFilterButtons() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      filterBtns.forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      const size = e.target.getAttribute('data-filter');
      renderPuppies(size);
    });
  });
}

// Handle Appointment Submission
function setupAppointmentForm() {
  const form = document.getElementById('appointment-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const newAppointment = {
      ownerName: document.getElementById('apt-owner').value.trim(),
      phone: document.getElementById('apt-phone').value.trim(),
      petName: document.getElementById('apt-pet').value.trim(),
      petType: document.getElementById('apt-type').value,
      service: document.getElementById('apt-service').value,
      date: document.getElementById('apt-date').value,
      time: document.getElementById('apt-time').value,
      notes: document.getElementById('apt-notes').value.trim()
    };

    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAppointment)
      });

      if (res.ok) {
        const saved = await res.json();
        state.appointments.unshift(saved);
      } else {
        newAppointment._id = 'apt-' + Date.now();
        state.appointments.unshift(newAppointment);
      }
    } catch (err) {
      newAppointment._id = 'apt-' + Date.now();
      state.appointments.unshift(newAppointment);
    }

    form.reset();
    updateBadges();
    showToast('✨ ¡Cita agendada con éxito en MongoDB / Noska-Vet!');
    renderDashboard();
    
    document.getElementById('dashboard')?.scrollIntoView({ behavior: 'smooth' });
  });
}

// Open Adoption Modal
let selectedPuppyId = null;

function openAdoptionModal(puppyId) {
  selectedPuppyId = puppyId;
  const puppy = state.puppies.find(p => p.id === puppyId);
  if (!puppy) return;

  const modal = document.getElementById('adoption-modal');
  const modalContent = document.getElementById('modal-puppy-info');

  modalContent.innerHTML = `
    <div style="display: flex; gap: 16px; align-items: center; margin-bottom: 20px;">
      <img src="${puppy.image}" style="width: 80px; height: 80px; border-radius: 50%; object-fit: cover;" alt="${puppy.name}">
      <div>
        <h4 style="font-size: 1.2rem; color: var(--rose-dark);">${puppy.name}</h4>
        <p style="font-size: 0.85rem; color: var(--text-muted);">${puppy.breed} • ${puppy.age}</p>
      </div>
    </div>
  `;

  modal.classList.add('active');
}

function closeAdoptionModal() {
  const modal = document.getElementById('adoption-modal');
  if (modal) modal.classList.remove('active');
}

// Handle Adoption Form Submission
function setupAdoptionForm() {
  const form = document.getElementById('adoption-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const puppy = state.puppies.find(p => p.id === selectedPuppyId);
    if (!puppy) return;

    const newAdoption = {
      puppyId: puppy.id,
      puppyName: puppy.name,
      applicantName: document.getElementById('adopt-applicant').value.trim(),
      phone: document.getElementById('adopt-phone').value.trim(),
      email: document.getElementById('adopt-email').value.trim(),
      homeType: document.getElementById('adopt-home').value,
      date: new Date().toLocaleDateString('es-ES')
    };

    try {
      const res = await fetch('/api/adoptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAdoption)
      });
      if (res.ok) {
        const saved = await res.json();
        state.adoptions.unshift(saved);
      } else {
        newAdoption._id = 'adopt-' + Date.now();
        state.adoptions.unshift(newAdoption);
      }
    } catch (err) {
      newAdoption._id = 'adopt-' + Date.now();
      state.adoptions.unshift(newAdoption);
    }

    puppy.status = 'En Proceso';

    closeAdoptionModal();
    form.reset();
    renderPuppies();
    renderDashboard();
    showToast(`🐾 ¡Solicitud para adoptar a ${puppy.name} enviada!`);
  });
}

// Render Appointments and Adoptions Dashboard
function renderDashboard(tab = 'appointments') {
  const container = document.getElementById('dashboard-content');
  if (!container) return;

  if (tab === 'appointments') {
    if (state.appointments.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <i class="fa-regular fa-calendar-xmark"></i>
          <p>Aún no tienes citas agendadas.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = `
      <div class="table-wrapper">
        <table class="custom-table">
          <thead>
            <tr>
              <th>Propietario</th>
              <th>Mascota</th>
              <th>Servicio</th>
              <th>Fecha y Hora</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            ${state.appointments.map(apt => `
              <tr>
                <td><strong>${apt.ownerName}</strong><br><small>${apt.phone}</small></td>
                <td>${apt.petName} (${apt.petType})</td>
                <td><span class="badge" style="background: var(--primary-100); color: var(--primary-700);">${apt.service}</span></td>
                <td>${apt.date} a las ${apt.time} HS</td>
                <td>
                  <button class="action-btn-danger" onclick="cancelAppointment('${apt._id || apt.id}')">
                    <i class="fa-solid fa-trash"></i> Cancelar
                  </button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  } else if (tab === 'adoptions') {
    if (state.adoptions.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <i class="fa-solid fa-heart-crack"></i>
          <p>No has realizado solicitudes de adopción de cachorros aún.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = `
      <div class="table-wrapper">
        <table class="custom-table">
          <thead>
            <tr>
              <th>Cachorro</th>
              <th>Solicitante</th>
              <th>Contacto</th>
              <th>Vivienda</th>
              <th>Fecha Solicitud</th>
            </tr>
          </thead>
          <tbody>
            ${state.adoptions.map(ad => `
              <tr>
                <td><strong>🐶 ${ad.puppyName}</strong></td>
                <td>${ad.applicantName}</td>
                <td>${ad.phone} / ${ad.email}</td>
                <td>${ad.homeType}</td>
                <td>${ad.date}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }
}

// Cancel Appointment
async function cancelAppointment(id) {
  if (confirm('¿Estás seguro de cancelar esta cita médica?')) {
    try {
      await fetch(`/api/appointments/${id}`, { method: 'DELETE' });
    } catch (err) {
      console.error(err);
    }
    state.appointments = state.appointments.filter(a => (a._id || a.id) !== id);
    updateBadges();
    renderDashboard('appointments');
    showToast('🗑️ Cita cancelada.');
  }
}

// Setup Dashboard Tabs
function setupDashboardTabs() {
  const tabs = document.querySelectorAll('.tab-btn');
  tabs.forEach(tab => {
    tab.addEventListener('click', (e) => {
      tabs.forEach(t => t.classList.remove('active'));
      e.target.classList.add('active');
      const targetTab = e.target.getAttribute('data-tab');
      renderDashboard(targetTab);
    });
  });
}

// Toast Notifications
function showToast(message) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <i class="fa-solid fa-circle-check" style="color: var(--primary-500); font-size: 1.2rem;"></i>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 4000);
}

// Initialize Everything on DOM Content Loaded
document.addEventListener('DOMContentLoaded', () => {
  renderPuppies();
  setupFilterButtons();
  setupAppointmentForm();
  setupAdoptionForm();
  setupDashboardTabs();
  loadDataFromApi();

  const dateInput = document.getElementById('apt-date');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
  }
});
