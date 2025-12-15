document.addEventListener('DOMContentLoaded', () => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (!user) {
    window.location.href = 'login.html';
    return;
  }

  const userId = user.email;
  const displayName = user.fullName || user.username || user.email.split('@')[0];
  document.getElementById('displayName').textContent = displayName;
  document.getElementById('displayEmail').textContent = user.email || '—';
  document.getElementById('fullName').textContent = displayName;
  document.getElementById('username').textContent = user.username || '—';
  document.getElementById('email').textContent = user.email || '—';
  document.getElementById('phone').textContent = user.phone || 'Not provided';
  document.getElementById('role').textContent = (user.role || 'customer').charAt(0).toUpperCase() + (user.role || 'customer').slice(1);
  document.querySelector('.badge.role').textContent = (user.role || 'customer').charAt(0).toUpperCase() + (user.role || 'customer').slice(1);

  // Last Login
  const lastLogin = user.lastLogin
    ? new Date(user.lastLogin).toLocaleString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      })
    : 'First login';
  document.getElementById('lastLogin').textContent = lastLogin;

  // Wishlist count
  const wishlist = JSON.parse(localStorage.getItem(`wishlist_${userId}`)) || [];
  document.getElementById('wishlistCount').textContent = wishlist.length;

  // Avatar
  const initial = user.username ? user.username.charAt(0).toUpperCase() : 'U';
  document.querySelector('.avatar-placeholder i').textContent = initial;
  const savedAvatar = localStorage.getItem(`userAvatar_${userId}`);
  const avatarImg = document.getElementById('avatarImg');
  const avatarPlaceholder = document.getElementById('avatarPlaceholder');
  if (savedAvatar) {
    avatarImg.src = savedAvatar;
    avatarImg.style.display = 'block';
    avatarPlaceholder.style.display = 'none';
  }

  // Avatar upload
  document.getElementById('avatarInput').addEventListener('change', (e) => {
    if (e.target.files?.[0]) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        avatarImg.src = ev.target.result;
        avatarImg.style.display = 'block';
        avatarPlaceholder.style.display = 'none';
        localStorage.setItem(`userAvatar_${userId}`, ev.target.result);
        showToast('Avatar updated!', 'success');
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  });

  // Cart badge update
  function updateCartBadge() {
    const cart = JSON.parse(localStorage.getItem(`cart_${userId}`)) || [];
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const badge = document.querySelector('.cart-badge');
    if (badge) {
      badge.textContent = totalItems || '';
      badge.style.display = totalItems > 0 ? 'flex' : 'none';
    }
  }
  updateCartBadge();

  document.getElementById('editProfileBtn').addEventListener('click', () => {
    showToast('Editing coming soon!', 'success');
  });
  document.getElementById('changePasswordBtn').addEventListener('click', () => {
    window.location.href = 'forget.html';
  });
  document.getElementById('viewOrdersBtn').addEventListener('click', () => {
    window.location.href = 'orders.html';
  });
  document.getElementById('deleteAccountBtn').addEventListener('click', () => {
    showDeleteConfirm();
  });

  function showDeleteConfirm() {
    const overlay = document.createElement('div');
    overlay.id = 'deleteConfirmModal';
    overlay.innerHTML = `
      <div class="modal-overlay"></div>
      <div class="modal-content">
        <div style="font-size: 60px; margin-bottom: 20px; color: #ef4444;">
          <i class="fas fa-exclamation-triangle"></i>
        </div>
        <h3 style="font-size: 24px; font-weight: 800; color: var(--text-primary); margin-bottom: 12px;">
          Delete Account?
        </h3>
        <p style="color: var(--text-secondary); margin-bottom: 28px; font-size: 16px;">
          This action cannot be undone. All your data will be permanently deleted.
        </p>
        <div style="display: flex; gap: 16px; justify-content: center;">
          <button id="cancelDelete" style="
            flex: 1;
            padding: 14px;
            border-radius: 16px;
            font-weight: 600;
            font-size: 16px;
            background: var(--bg-secondary);
            color: var(--text-primary);
            border: none;
            cursor: pointer;
          ">Cancel</button>
          <button id="confirmDelete" style="
            flex: 1;
            padding: 14px;
            border-radius: 16px;
            font-weight: 600;
            font-size: 16px;
            background: linear-gradient(135deg, #ef4444, #dc2626);
            color: white;
            border: none;
            cursor: pointer;
            box-shadow: 0 4px 14px rgba(239, 68, 68, 0.3);
          ">Delete</button>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);
    document.getElementById('cancelDelete').onclick = () => {
      document.body.removeChild(overlay);
    };
    document.getElementById('confirmDelete').onclick = () => {
      localStorage.removeItem('user');
      localStorage.removeItem(`wishlist_${userId}`);
      localStorage.removeItem(`cart_${userId}`);
      localStorage.removeItem(`orders_${userId}`);
      localStorage.removeItem(`addresses_${userId}`);
      localStorage.removeItem(`userAvatar_${userId}`);
      document.body.removeChild(overlay);
      window.location.href = 'login.html';
    };
  }

  function showToast(message, type = 'success') {
    const toastContainer = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    toastContainer.appendChild(toast);
    setTimeout(() => {
      toast.style.animation = 'fadeOut 0.4s forwards';
      setTimeout(() => toast.remove(), 400);
    }, 2600);
  }
});