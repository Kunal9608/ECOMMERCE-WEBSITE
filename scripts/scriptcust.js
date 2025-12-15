// ✅ ENSURE DEFAULT USER EXISTS
function ensureDefaultUser() {
  const users = JSON.parse(localStorage.getItem('users')) || {};
  const defaultEmail = 'kunaldixit.2995@gmail.com';
  if (!users[defaultEmail]) {
    const defaultUser = {
      username: 'KUNAL',
      email: defaultEmail,
      password: '123456',
      role: 'customer'
    };
    users['KUNAL'] = defaultUser;
    users[defaultEmail] = defaultUser;
    localStorage.setItem('users', JSON.stringify(users));
  }
}
ensureDefaultUser();

document.addEventListener('DOMContentLoaded', () => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user && document.getElementById('userInitial')) {
    document.getElementById('userInitial').textContent = user.username.charAt(0).toUpperCase();
  }

  const themeToggleBtn = document.getElementById('themeToggleBtn');
  if (themeToggleBtn) {
    const savedTheme = localStorage.getItem('theme') || 'light';
    if (savedTheme === 'dark') {
      document.body.classList.add('dark-theme');
      themeToggleBtn.innerHTML = '<i class="fas fa-sun"></i>';
    }
    themeToggleBtn.addEventListener('click', () => {
      document.body.classList.toggle('dark-theme');
      const isDark = document.body.classList.contains('dark-theme');
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
      themeToggleBtn.innerHTML = isDark 
        ? '<i class="fas fa-sun"></i>' 
        : '<i class="fas fa-moon"></i>';
    });
  }

  // ✅ LOGOUT: ONLY REMOVE 'user' SESSION — KEEP ALL USER DATA
  if (document.getElementById('logoutBtn')) {
    document.getElementById('logoutBtn').addEventListener('click', (e) => {
      e.preventDefault();
      // ✅ DO NOT CLEAR wishlist, cart, orders, etc.
      localStorage.removeItem('user'); // only log out
      window.location.href = 'login.html';
    });
  }

  const userInitial = document.getElementById('userInitial');
  const userMenu = document.getElementById('userMenu');
  if (userInitial && userMenu) {
    userInitial.addEventListener('click', () => {
      userMenu.classList.toggle('show');
    });
    document.addEventListener('click', (e) => {
      if (!userInitial.contains(e.target) && !userMenu.contains(e.target)) {
        userMenu.classList.remove('show');
      }
    });
  }
});