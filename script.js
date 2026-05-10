// ---- NAVIGATION (multi-page version) ----
// Navigasi sudah menggunakan href antar file HTML, tidak perlu fungsi navigateTo

// Hamburger toggle
document.querySelector('.hamburger').addEventListener('click', () => {
  document.querySelector('.nav-links').classList.toggle('open');
});

// ---- TOAST NOTIFICATION ----
function showToast(message, type = 'success') {
  // Hapus toast sebelumnya kalau masih ada
  const existing = document.querySelector('.toast-notif');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = 'toast-notif toast-' + type;
  toast.innerHTML = message;
  document.body.appendChild(toast);

  // Munculkan
  setTimeout(() => toast.classList.add('toast-show'), 10);

  // Hilangkan setelah 3.5 detik
  setTimeout(() => {
    toast.classList.remove('toast-show');
    setTimeout(() => toast.remove(), 400);
  }, 3500);
}

// ---- PRODUCT FILTER ----
function filterProducts(category) {
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  event.target.classList.add('active');

  const cards = document.querySelectorAll('.product-card');
  cards.forEach(card => {
    if (category === 'all' || card.dataset.category === category) {
      card.style.display = 'block';
      card.style.animation = 'fadeInLeft 0.4s ease forwards';
    } else {
      card.style.display = 'none';
    }
  });
}

// ---- ADD TO CART ----
function addToCart(productName, price) {
  showToast('✨ <strong>' + productName + '</strong> berhasil ditambahkan ke keranjang!<br><small>Harga: Rp ' + price.toLocaleString('id-ID') + '</small>');
}

// ---- FORM VALIDATION ----
function validateForm(e) {
  e.preventDefault();
  let isValid = true;

  // Clear previous errors
  document.querySelectorAll('.form-error').forEach(el => el.style.display = 'none');
  document.querySelectorAll('.form-group input, .form-group select, .form-group textarea').forEach(el => {
    el.style.borderColor = '';
  });

  const name = document.getElementById('contact-name');
  const email = document.getElementById('contact-email');
  const phone = document.getElementById('contact-phone');
  const interest = document.getElementById('contact-interest');
  const message = document.getElementById('contact-message');

  // Validate name
  if (!name.value.trim() || name.value.trim().length < 3) {
    showError(name, 'nameError', 'Nama lengkap wajib diisi (minimal 3 karakter)');
    isValid = false;
  }

  // Validate email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email.value.trim() || !emailRegex.test(email.value)) {
    showError(email, 'emailError', 'Format email tidak valid');
    isValid = false;
  }

  // Validate phone
  const phoneRegex = /^[0-9+\-\s]{10,15}$/;
  if (!phone.value.trim() || !phoneRegex.test(phone.value)) {
    showError(phone, 'phoneError', 'Nomor telepon tidak valid (10-15 digit)');
    isValid = false;
  }

  // Validate interest
  if (!interest.value) {
    showError(interest, 'interestError', 'Pilih kategori yang diminati');
    isValid = false;
  }

  // Validate message
  if (!message.value.trim() || message.value.trim().length < 10) {
    showError(message, 'messageError', 'Pesan wajib diisi (minimal 10 karakter)');
    isValid = false;
  }

  if (isValid) {
    showToast('🌟 Pesan berhasil terkirim! Halo <strong>' + name.value + '</strong>, kami akan menghubungi kamu dalam 1x24 jam 💛');
    e.target.reset();
  }

  return false;
}

function showError(input, errorId, message) {
  input.style.borderColor = '#c0392b';
  const errorEl = document.getElementById(errorId);
  if (errorEl) {
    errorEl.textContent = message;
    errorEl.style.display = 'block';
  }
}

// ---- GALLERY LIGHTBOX ----
function openGallery(title, desc) {
  showToast('📸 <strong>' + title + '</strong><br><small>' + desc + '</small>', 'info');
}

// ---- SCROLL ANIMATION ----
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.1 });

// Observe cards
document.querySelectorAll('.product-card, .value-card, .gallery-item').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  observer.observe(el);
});

// ---- INITIALIZE ----
// Tidak perlu navigateTo — setiap halaman sudah tampil langsung via active-page class

// ---- PRODUCT MODAL ----
let currentProduct = {};
let currentQty = 1;

function openModal(imgSrc, badge, category, name, desc, price) {
  currentProduct = { imgSrc, badge, category, name, desc, price: parseInt(price) };
  currentQty = 1;

  const modalImgEl = document.getElementById('modal-img');
  if (imgSrc && (imgSrc.startsWith('images/') || imgSrc.startsWith('http'))) {
    modalImgEl.innerHTML = '<img src="' + imgSrc + '" alt="' + name + '">';
  } else {
    modalImgEl.textContent = imgSrc; // fallback emoji
  }

  document.getElementById('modal-category').textContent = category;
  document.getElementById('modal-name').textContent     = name;
  document.getElementById('modal-desc').textContent     = desc;
  document.getElementById('qty-value').textContent      = 1;

  const badgeEl = document.getElementById('modal-badge');
  if (badge) {
    badgeEl.textContent = badge;
    badgeEl.style.display = 'inline-block';
  } else {
    badgeEl.style.display = 'none';
  }

  updateModalPrice();

  const modal = document.getElementById('productModal');
  modal.classList.add('modal-open');
  document.body.style.overflow = 'hidden';
}

function closeModal(e) {
  if (e.target === document.getElementById('productModal')) closeModalDirect();
}

function closeModalDirect() {
  document.getElementById('productModal').classList.remove('modal-open');
  document.body.style.overflow = '';
}

function changeQty(delta) {
  currentQty = Math.max(1, Math.min(99, currentQty + delta));
  document.getElementById('qty-value').textContent = currentQty;
  updateModalPrice();
}

function updateModalPrice() {
  const fmt = (n) => 'Rp ' + n.toLocaleString('id-ID');
  document.getElementById('modal-price').textContent   = fmt(currentProduct.price) + ' / pcs';
  document.getElementById('modal-subtotal').textContent = 'Total: ' + fmt(currentProduct.price * currentQty);
}

function addToCartFromModal() {
  const total = currentProduct.price * currentQty;
  closeModalDirect();
  showToast('✨ <strong>' + currentProduct.name + '</strong> ×' + currentQty + ' berhasil ditambahkan!<br><small>Total: Rp ' + total.toLocaleString('id-ID') + '</small>');
}