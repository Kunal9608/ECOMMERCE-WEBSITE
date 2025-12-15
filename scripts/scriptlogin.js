document.addEventListener('DOMContentLoaded', () => {

  // ✅ ENSURE DEFAULT USER EXISTS IN localStorage
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

  function showToast(message, type = 'error') {
    const toastContainer = document.getElementById('toastContainer');
    if (!toastContainer) return;
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    toastContainer.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  }

  // ============== LOGIN PAGE ==============
  if (document.getElementById('loginForm')) {
    const togglePassword = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('password');
    if (togglePassword && passwordInput) {
      togglePassword.addEventListener('click', function() {
        const type = passwordInput.type === 'password' ? 'text' : 'password';
        passwordInput.type = type;
        this.innerHTML = type === 'password' ? '<i class="far fa-eye"></i>' : '<i class="far fa-eye-slash"></i>';
      });
    }

    document.getElementById('loginForm').addEventListener('submit', (e) => {
      e.preventDefault();
      const identifier = document.getElementById('username').value.trim();
      const password = document.getElementById('password').value;

      // Normalize input
      const allUsers = JSON.parse(localStorage.getItem('users')) || {};
      let user = null;

      if (identifier.includes('@')) {
        const email = identifier.toLowerCase();
        user = Object.values(allUsers).find(u => u.email === email);
      } else {
        user = Object.values(allUsers).find(u => u.username.toLowerCase() === identifier.toLowerCase());
      }

      if (user && user.password === password) {
        localStorage.setItem('user', JSON.stringify(user));
        window.location.href = 'itemdash.html';
      } else {
        showToast('Invalid username/email or password.', 'error');
      }
    });
  }

  // ============== FORGET PASSWORD PAGE ==============
  if (document.getElementById('resetPasswordForm')) {
    function setupToggle(inputId, toggleId) {
      const input = document.getElementById(inputId);
      const toggle = document.getElementById(toggleId);
      if (input && toggle) {
        toggle.addEventListener('click', () => {
          const type = input.type === 'password' ? 'text' : 'password';
          input.type = type;
          toggle.innerHTML = type === 'password' ? '<i class="far fa-eye"></i>' : '<i class="far fa-eye-slash"></i>';
        });
      }
    }

    setupToggle('newPassword', 'toggleNewPassword');
    setupToggle('confirmPassword', 'toggleConfirmPassword');

    const getOtpBtn = document.getElementById('getOtpBtn');
    const emailInput = document.getElementById('email');
    const newPassword = document.getElementById('newPassword');
    const confirmPassword = document.getElementById('confirmPassword');
    const resendTimer = document.getElementById('resendTimer');
    const countdownEl = document.getElementById('countdown');
    let otpCooldownActive = false;
    let forgetGeneratedOtp = null;

    if (getOtpBtn) {
      getOtpBtn.addEventListener('click', async () => {
        const rawEmail = emailInput.value.trim();
        const pass1 = newPassword.value;
        const pass2 = confirmPassword.value;

        if (!rawEmail || !/^[^\s@]+@gmail\.com$/i.test(rawEmail)) {
          showToast('Please enter a valid Gmail address.', 'error');
          return;
        }

        if (!pass1 || pass1.length < 6) {
          showToast('Password must be at least 6 characters.', 'error');
          return;
        }

        if (pass1 !== pass2) {
          showToast('Passwords do not match.', 'error');
          return;
        }

        const email = rawEmail.toLowerCase();
        const allUsers = JSON.parse(localStorage.getItem('users')) || {};
        const userExists = Object.values(allUsers).some(u => u.email === email);

        if (!userExists) {
          showToast('No account found with this email.', 'error');
          return;
        }

        forgetGeneratedOtp = Math.floor(10000 + Math.random() * 90000).toString();
        showToast('Sending OTP... ✉️', 'success');

        try {
          await emailjs.send('service_44phjaw', 'template_z62klwh', {
            to_email: rawEmail,
            email: rawEmail,
            otp_code: forgetGeneratedOtp
          });
          showToast('OTP sent to your Gmail!', 'success');
        } catch (error) {
          console.error('EmailJS Error (Forget):', error);
          showToast('Failed to send OTP. Please try again.', 'error');
          return;
        }

        otpCooldownActive = true;
        getOtpBtn.disabled = true;
        resendTimer.style.display = 'block';
        let seconds = 30;
        const timer = setInterval(() => {
          seconds--;
          countdownEl.textContent = seconds;
          if (seconds <= 0) {
            clearInterval(timer);
            otpCooldownActive = false;
            getOtpBtn.disabled = false;
            resendTimer.style.display = 'none';
          }
        }, 1000);
      });
    }

    document.getElementById('resetPasswordForm').addEventListener('submit', (e) => {
      e.preventDefault();
      const rawEmail = emailInput.value.trim();
      const pass1 = newPassword.value;
      const pass2 = confirmPassword.value;
      const otp = document.getElementById('otp').value.trim();

      if (!rawEmail || !/^[^\s@]+@gmail\.com$/i.test(rawEmail)) {
        showToast('Please enter a valid Gmail address.', 'error');
        return;
      }
      if (!pass1 || pass1.length < 6) {
        showToast('Password must be at least 6 characters.', 'error');
        return;
      }
      if (pass1 !== pass2) {
        showToast('Passwords do not match.', 'error');
        return;
      }
      if (!otp || otp !== forgetGeneratedOtp) {
        showToast('Invalid OTP. Please check and try again.', 'error');
        return;
      }

      const email = rawEmail.toLowerCase();
      const allUsers = JSON.parse(localStorage.getItem('users')) || {};
      for (let key in allUsers) {
        if (allUsers[key].email === email) {
          allUsers[key].password = pass1;
          localStorage.setItem('users', JSON.stringify(allUsers));
          localStorage.setItem('user', JSON.stringify(allUsers[key]));
          break;
        }
      }

      showToast('Password reset successful!', 'success');
      setTimeout(() => window.location.href = 'itemdash.html', 1500);
    });
  }

  // ============== SIGNUP PAGE ==============
  if (document.getElementById('signupForm')) {
    const usernameInput = document.getElementById('username');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const togglePassword = document.getElementById('togglePassword');
    const getOtpBtn = document.getElementById('getOtpBtn');
    const otpInput = document.getElementById('otp');
    const resendTimer = document.getElementById('resendTimer');
    const countdownEl = document.getElementById('countdown');

    let signupOtpCooldownActive = false;
    let generatedOtp = null;

    if (togglePassword && passwordInput) {
      togglePassword.addEventListener('click', () => {
        const type = passwordInput.type === 'password' ? 'text' : 'password';
        passwordInput.type = type;
        togglePassword.innerHTML = type === 'password' ? '<i class="far fa-eye"></i>' : '<i class="far fa-eye-slash"></i>';
      });
    }

    function checkUsername() {
      const username = usernameInput.value.trim();
      const feedback = document.getElementById('usernameFeedback');
      if (username.length < 3) {
        feedback.textContent = '';
        feedback.className = 'feedback';
        return;
      }
      const allUsers = JSON.parse(localStorage.getItem('users')) || {};
      const exists = Object.keys(allUsers).some(key => key.toLowerCase() === username.toLowerCase());
      feedback.textContent = exists ? 'Username already taken' : 'Username available';
      feedback.className = exists ? 'feedback taken' : 'feedback available';
    }

    function checkEmail() {
      const rawEmail = emailInput.value.trim();
      const feedback = document.getElementById('emailFeedback');
      if (!rawEmail || !/^[^\s@]+@gmail\.com$/i.test(rawEmail)) {
        feedback.textContent = '';
        feedback.className = 'feedback';
        return;
      }
      const email = rawEmail.toLowerCase();
      const allUsers = JSON.parse(localStorage.getItem('users')) || {};
      const exists = Object.values(allUsers).some(u => u.email === email);
      feedback.textContent = exists ? 'Email already registered' : 'Email available';
      feedback.className = exists ? 'feedback taken' : 'feedback available';
    }

    usernameInput.addEventListener('input', checkUsername);
    emailInput.addEventListener('input', checkEmail);

    if (getOtpBtn) {
      getOtpBtn.addEventListener('click', async () => {
        const username = usernameInput.value.trim();
        const rawEmail = emailInput.value.trim();
        const password = passwordInput.value;

        if (username.length < 3) {
          showToast('Username must be at least 3 characters.', 'error');
          return;
        }

        const allUsers = JSON.parse(localStorage.getItem('users')) || {};
        if (Object.keys(allUsers).some(key => key.toLowerCase() === username.toLowerCase())) {
          showToast('Username already exists.', 'error');
          return;
        }

        const email = rawEmail.toLowerCase();
        if (Object.values(allUsers).some(u => u.email === email)) {
          showToast('Email already registered.', 'error');
          return;
        }

        if (!rawEmail || !/^[^\s@]+@gmail\.com$/i.test(rawEmail)) {
          showToast('Please enter a valid Gmail address.', 'error');
          return;
        }

        if (!password || password.length < 6) {
          showToast('Password must be at least 6 characters.', 'error');
          return;
        }

        generatedOtp = Math.floor(10000 + Math.random() * 90000).toString();
        showToast('Sending OTP... ✉️', 'success');

        try {
          await emailjs.send('service_44phjaw', 'template_lusyhse', {
            to_email: rawEmail,
            email: rawEmail,
            otp_code: generatedOtp
          });
          showToast('OTP sent to your Gmail!', 'success');
        } catch (error) {
          console.error('EmailJS Error (Signup):', error);
          showToast('Failed to send OTP. Please try again.', 'error');
          return;
        }

        signupOtpCooldownActive = true;
        getOtpBtn.disabled = true;
        resendTimer.style.display = 'block';
        let seconds = 30;
        const timer = setInterval(() => {
          seconds--;
          countdownEl.textContent = seconds;
          if (seconds <= 0) {
            clearInterval(timer);
            signupOtpCooldownActive = false;
            getOtpBtn.disabled = false;
            resendTimer.style.display = 'none';
          }
        }, 1000);
      });
    }

    document.getElementById('signupForm').addEventListener('submit', (e) => {
      e.preventDefault();
      const username = usernameInput.value.trim();
      const rawEmail = emailInput.value.trim();
      const password = passwordInput.value;
      const otp = otpInput.value.trim();

      if (username.length < 3) {
        showToast('Username must be at least 3 characters.', 'error');
        return;
      }
      if (!rawEmail || !/^[^\s@]+@gmail\.com$/i.test(rawEmail)) {
        showToast('Please enter a valid Gmail address.', 'error');
        return;
      }
      if (!password || password.length < 6) {
        showToast('Password must be at least 6 characters.', 'error');
        return;
      }
      if (!otp || otp !== generatedOtp) {
        showToast('Invalid OTP. Please check and try again.', 'error');
        return;
      }

      const email = rawEmail.toLowerCase();
      const allUsers = JSON.parse(localStorage.getItem('users')) || {};
      if (Object.keys(allUsers).some(key => key.toLowerCase() === username.toLowerCase()) ||
          Object.values(allUsers).some(u => u.email === email)) {
        showToast('Username or email already exists.', 'error');
        return;
      }

      allUsers[username] = { username, email, password, role: 'customer' };
      allUsers[email] = allUsers[username];
      localStorage.setItem('users', JSON.stringify(allUsers));

      showToast('Account created successfully!', 'success');
      setTimeout(() => window.location.href = 'itemdash.html', 1500);
    });
  }

});