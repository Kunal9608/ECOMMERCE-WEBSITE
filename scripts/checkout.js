document.addEventListener('DOMContentLoaded', () => {
  const addressOptions = document.getElementById('addressOptions');
  const addressForm = document.getElementById('addressForm');
  const formTitle = document.getElementById('formTitle');
  const orderSummaryTable = document.getElementById('orderSummaryTable');
  const toggleFormBtn = document.getElementById('toggleAddressForm');
  const cancelFormBtn = document.getElementById('cancelFormBtn');
  const saveAddressBtn = document.getElementById('saveAddressBtn');
  const proceedToPaymentBtn = document.getElementById('proceedToPaymentBtn');
  const fullNameInput = document.getElementById('fullName');
  const phoneInput = document.getElementById('phone');
  const pincodeInput = document.getElementById('pincode');
  const cityInput = document.getElementById('city');
  const stateInput = document.getElementById('state');
  const countryInput = document.getElementById('country');
  const pincodeStatus = document.getElementById('pincodeStatus');

  // ✅ GET CURRENT USER
  const user = JSON.parse(localStorage.getItem('user'));
  const userId = user?.email;
  if (!userId) {
    window.location.href = 'login.html';
    return;
  }

  let savedAddresses = JSON.parse(localStorage.getItem(`addresses_${userId}`)) || [];
  let selectedAddress = null;
  let editingIndex = -1;
  let pincodeData = null;

  // Auto-uppercase name
  fullNameInput.addEventListener('input', () => {
    fullNameInput.value = fullNameInput.value.toUpperCase();
  });

  // Format phone
  phoneInput.addEventListener('input', () => {
    let val = phoneInput.value.replace(/\D/g, '');
    if (val.length > 10) val = val.slice(0, 10);
    phoneInput.value = val;
  });

  // Pincode lookup
  pincodeInput.addEventListener('input', async () => {
    const pin = pincodeInput.value.trim();
    pincodeStatus.textContent = '';
    cityInput.value = '';
    stateInput.value = '';
    pincodeData = null;

    if (pin.length === 6 && /^\d+$/.test(pin)) {
      pincodeStatus.textContent = 'Checking...';
      pincodeStatus.className = 'pincode-status';
      try {
        const res = await fetch(`https://api.postalpincode.in/pincode/${pin}`);
        const data = await res.json();
        if (data[0].Status === 'Success') {
          const postOffice = data[0].PostOffice[0];
          cityInput.value = postOffice.District || postOffice.Block || '';
          stateInput.value = postOffice.State || '';
          countryInput.value = 'India';
          pincodeData = { city: postOffice.District, state: postOffice.State, country: 'India' };
          pincodeStatus.textContent = '✅ Valid pincode';
          pincodeStatus.className = 'pincode-status valid';
        } else {
          pincodeStatus.textContent = '❌ Invalid pincode';
          pincodeStatus.className = 'pincode-status invalid';
        }
      } catch (err) {
        pincodeStatus.textContent = '🌐 Offline';
        pincodeStatus.className = 'pincode-status invalid';
      }
    }
  });

  // Render addresses
  function renderAddresses() {
    addressOptions.innerHTML = '';
    if (savedAddresses.length === 0) {
      addressOptions.innerHTML = '<p>No saved addresses.</p>';
    } else {
      savedAddresses.forEach((addr, index) => {
        const card = document.createElement('div');
        card.className = 'address-card';
        card.innerHTML = `
          <h4>${addr.fullName}</h4>
          <p>${addr.building}, ${addr.area},<br>${addr.city} - ${addr.pincode}, ${addr.state}, ${addr.country}</p>
          <div class="address-actions">
            <button class="edit-btn" data-index="${index}"><i class="fas fa-edit"></i></button>
            <button class="delete-btn" data-index="${index}"><i class="fas fa-trash"></i></button>
          </div>
        `;
        card.addEventListener('click', (e) => {
          if (e.target.closest('.edit-btn') || e.target.closest('.delete-btn')) return;
          document.querySelectorAll('.address-card').forEach(c => c.classList.remove('selected'));
          card.classList.add('selected');
          selectedAddress = addr;
        });
        addressOptions.appendChild(card);
      });

      // Edit
      document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const index = parseInt(btn.dataset.index);
          const addr = savedAddresses[index];
          fullNameInput.value = addr.fullName;
          phoneInput.value = addr.phone.replace('+91 ', '');
          document.getElementById('building').value = addr.building;
          document.getElementById('area').value = addr.area;
          pincodeInput.value = addr.pincode;
          cityInput.value = addr.city;
          stateInput.value = addr.state;
          countryInput.value = 'India';
          editingIndex = index;
          formTitle.textContent = 'Edit Address';
          addressForm.style.display = 'block';
          addressOptions.style.display = 'none';
          toggleFormBtn.style.display = 'none';
        });
      });

      // Delete
      document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const index = parseInt(btn.dataset.index);
          savedAddresses.splice(index, 1);
          localStorage.setItem(`addresses_${userId}`, JSON.stringify(savedAddresses));
          renderAddresses();
          if (selectedAddress && selectedAddress === savedAddresses[index]) {
            selectedAddress = null;
          }
          showToast('Address deleted!', 'success');
        });
      });
    }
  }

  // Load order summary
  const orderSummary = JSON.parse(localStorage.getItem('orderSummary'));
  if (!orderSummary) {
    window.location.href = 'cart.html';
    return;
  }
  const { subtotal, discount, shipping, taxes, total, discountCode } = orderSummary;
  let summaryHtml = `
    <div class="summary-row">
      <label>Subtotal</label>
      <span>₹${subtotal.toLocaleString('en-IN')}</span>
    </div>
  `;
  if (discount > 0) {
    summaryHtml += `
      <div class="summary-row discount-row">
        <label>Discount (${discountCode})</label>
        <span>-₹${Math.round(discount).toLocaleString('en-IN')}</span>
      </div>
    `;
  }
  summaryHtml += `
    <div class="summary-row">
      <label>Shipping</label>
      <span>${shipping === 0 ? 'Free' : `₹${shipping.toLocaleString('en-IN')}`}</span>
    </div>
    <div class="summary-row">
      <label>Taxes (5%)</label>
      <span>₹${Math.round(taxes).toLocaleString('en-IN')}</span>
    </div>
    <div class="divider"></div>
    <div class="summary-row total-row">
      <label>Total</label>
      <span>₹${Math.round(total).toLocaleString('en-IN')}</span>
    </div>
  `;
  orderSummaryTable.innerHTML = summaryHtml;

  // Toggle form
  toggleFormBtn.addEventListener('click', () => {
    formTitle.textContent = 'Enter New Address';
    editingIndex = -1;
    fullNameInput.value = '';
    phoneInput.value = '';
    document.getElementById('building').value = '';
    document.getElementById('area').value = '';
    pincodeInput.value = '';
    cityInput.value = '';
    stateInput.value = '';
    countryInput.value = 'India';
    pincodeStatus.textContent = '';
    addressForm.style.display = 'block';
    addressOptions.style.display = 'none';
    toggleFormBtn.style.display = 'none';
  });

  cancelFormBtn.addEventListener('click', () => {
    addressForm.style.display = 'none';
    addressOptions.style.display = 'block';
    toggleFormBtn.style.display = 'block';
  });

  // Save address
  saveAddressBtn.addEventListener('click', () => {
    const fullName = fullNameInput.value.trim();
    const phone = phoneInput.value.trim();
    const building = document.getElementById('building').value.trim();
    const area = document.getElementById('area').value.trim();
    const pincode = pincodeInput.value.trim();
    const city = cityInput.value.trim();
    const state = stateInput.value.trim();
    const country = 'India';

    if (!fullName || !phone || !building || !area || !pincode || !city || !state) {
      showToast('Please fill all required fields.', 'error');
      return;
    }
    if (!/^\d{10}$/.test(phone)) {
      showToast('Mobile must be a 10-digit number.', 'error');
      return;
    }
    if (!pincodeData) {
      showToast('Please enter a valid pincode.', 'error');
      return;
    }

    const newAddress = { fullName, phone: `+91 ${phone}`, building, area, city, pincode, state, country };
    if (editingIndex >= 0) {
      savedAddresses[editingIndex] = newAddress;
      showToast('Address updated!', 'success');
    } else {
      savedAddresses.push(newAddress);
      showToast('Address saved!', 'success');
    }
    localStorage.setItem(`addresses_${userId}`, JSON.stringify(savedAddresses));
    addressForm.style.display = 'none';
    addressOptions.style.display = 'block';
    toggleFormBtn.style.display = 'block';
    renderAddresses();
    selectedAddress = newAddress;
  });

  // Proceed to payment
  proceedToPaymentBtn.addEventListener('click', () => {
    if (!selectedAddress && savedAddresses.length > 0) {
      showToast('Please select a shipping address.', 'error');
      return;
    }
    if (savedAddresses.length === 0) {
      showToast('Please add a shipping address.', 'error');
      return;
    }
    const finalAddress = selectedAddress || savedAddresses[0];
    localStorage.setItem('selectedAddress', JSON.stringify(finalAddress));
    window.location.href = 'payment.html';
  });

  renderAddresses();
});

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