const API = 'https://api.fatihdurdu.xyz';

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function getToken() { return localStorage.getItem('token'); }

function logout(force) {
  if (force !== false) {
    localStorage.removeItem('token');
    window.location.href = 'index.html';
  }
}

async function apiFetch(path, opts = {}) {
  const res = await fetch(API + path, {
    ...opts,
    headers: { 'Authorization': 'Bearer ' + getToken(), 'Content-Type': 'application/json', ...opts.headers }
  });
  return res.json();
}

async function initNav() {
  const token = localStorage.getItem('token');
  const authButtons = document.getElementById('authButtons');
  const userDropdown = document.getElementById('userDropdown');
  const navUserTrigger = document.getElementById('navUserTrigger');

  if (!token) return;

  try {
    const res = await fetch(API + '/api/me', {
      headers: { 'Authorization': 'Bearer ' + token }
    });
    if (res.status === 401) { localStorage.removeItem('token'); return; }
    if (res.status !== 200) return;

    const data = await res.json();
    if (data.error) { localStorage.removeItem('token'); return; }

    if (authButtons) authButtons.style.display = 'none';
    if (userDropdown) userDropdown.style.display = 'inline-block';
    if (navUserTrigger) navUserTrigger.textContent = data.user.username;

    if (navUserTrigger) {
      navUserTrigger.addEventListener('click', function(e) {
        e.stopPropagation();
        const content = userDropdown.querySelector('.user-dropdown-content');
        content.classList.toggle('show');
      });
    }

    return data;
  } catch (e) {
    if (authButtons) authButtons.style.display = 'none';
    if (userDropdown) userDropdown.style.display = 'inline-block';
    if (navUserTrigger) navUserTrigger.textContent = '...';
  }
}

// Dışarıya tıklayınca dropdown kapat
document.addEventListener('click', function(e) {
  const dropdowns = document.querySelectorAll('.user-dropdown-content.show');
  dropdowns.forEach(function(d) {
    if (!d.closest('.user-dropdown').contains(e.target)) d.classList.remove('show');
  });
});

// Mobile menu toggle
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileDropdown = document.getElementById('mobileDropdown');
const navLeft = document.querySelector('.nav-left');

function toggleMobileMenu() {
  const isOpen = mobileMenuBtn.classList.toggle('open');
  mobileDropdown.classList.toggle('show', isOpen);
  if (navLeft) navLeft.classList.toggle('hidden', isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : '';
}

if (mobileMenuBtn) mobileMenuBtn.addEventListener('click', toggleMobileMenu);

document.addEventListener('click', function(e) {
  if (mobileMenuBtn && !mobileMenuBtn.contains(e.target) && mobileDropdown && !mobileDropdown.contains(e.target)) {
    mobileMenuBtn.classList.remove('open');
    mobileDropdown.classList.remove('show');
    if (navLeft) navLeft.classList.remove('hidden');
    document.body.style.overflow = '';
  }
});

document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    if (typeof closeModal === 'function') closeModal();
    if (typeof closeRegisterModal === 'function') closeRegisterModal();
    if (typeof closeProfileModal === 'function') closeProfileModal();
    if (mobileMenuBtn) mobileMenuBtn.classList.remove('open');
    if (mobileDropdown) mobileDropdown.classList.remove('show');
    if (navLeft) navLeft.classList.remove('hidden');
    document.body.style.overflow = '';
  }
});

// Sayfa yüklendiğinde
initNav();
