document.addEventListener('DOMContentLoaded', () => {
  const PRODUCTS = [
    { id: 1, name: "iPhone 15 Pro", price: 82917, image: "https://m.media-amazon.com/images/I/81UKVHM77GL._AC_SL1500_.jpg" },
    { id: 2, name: "Samsung Galaxy S24", price: 74617, image: "https://m.media-amazon.com/images/I/81vxWpPpgNL.jpg" },
    { id: 3, name: "Google Pixel 8", price: 58017, image: "https://pisces.bbystatic.com/image2/BestBuy_US/images/products/6559/6559243_sd.jpg" },
    { id: 4, name: "MacBook Air M2", price: 99517, image: "https://th.bing.com/th/id/OIP.J1T4ipznMlXFPBtGSLw2RwHaEe?w=263&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3" },
    { id: 5, name: "Dell XPS 13", price: 82917, image: "https://www.bing.com/th/id/OIP.KatWGrAJIQf5KrVWBoZgjAHaE6?w=267&h=211&c=8&rs=1&qlt=90&o=6&dpr=1.3&pid=3.1&rm=2" },
    { id: 6, name: "HP Spectre x360", price: 107817, image: "https://tse3.mm.bing.net/th/id/OIP.s2H7Xw6eCsVWnSaEkab83wHaGN?rs=1&pid=ImgDetMain&o=7&rm=3" },
    { id: 7, name: "Apple AirPods Pro", price: 20667, image: "https://th.bing.com/th/id/OIP.oZhAgHANB68gzjdV0-MYAgHaHa?w=161&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3" },
    { id: 8, name: "Samsung Galaxy Buds2 Pro", price: 18907, image: "https://pisces.bbystatic.com/image2/BestBuy_US/images/products/6510/6510541cv12d.jpg" },
    { id: 9, name: "Sony WF-1000XM5", price: 24817, image: "https://th.bing.com/th/id/OIP.imKg5QiH7dfVdnKagnHqhAHaET?w=292&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3" },
    { id: 10, name: "GoPro HERO12", price: 33117, image: "https://th.bing.com/th/id/OPAC.HEDxUwo117aFxg474C474?w=220&h=220&c=17&o=5&dpr=1.3&pid=21.1" },
    { id: 11, name: "DJI Mini 4 Pro", price: 63017, image: "https://tse4.mm.bing.net/th/id/OIP.nJ_WWEop1xciKwDGYGcrywHaD4?rs=1&pid=ImgDetMain&o=7&rm=3" },
    { id: 12, name: "Sony Alpha A7 IV", price: 207417, image: "https://www.bing.com/th/id/OIP.vWh-GRqaBbwB30b8YCUL5gHaG7?w=218&h=211&c=8&rs=1&qlt=90&o=6&dpr=1.3&pid=3.1&rm=2" },
    { id: 13, name: "Anker PowerCore 26800", price: 5727, image: "https://m.media-amazon.com/images/I/61vj2BPDpuL._AC_SL1500_.jpg" },
    { id: 14, name: "Logitech MX Master 3S", price: 8217, image: "https://tse3.mm.bing.net/th/id/OIP.AGkAIoXCQnKlUDYz6CQi1wHaHa?rs=1&pid=ImgDetMain&o=7&rm=3" },
    { id: 15, name: "Apple Magic Keyboard", price: 8217, image: "https://www.bing.com/th/id/OIP.mdq-jsj3Vue-Pff1WfhYlgHaEL?w=246&h=211&c=8&rs=1&qlt=90&o=6&dpr=1.3&pid=3.1&rm=2" }
  ];

  const user = JSON.parse(localStorage.getItem('user'));
  const userId = user?.email;
  if (!userId) {
    window.location.href = 'login.html';
    return;
  }

  let cart = JSON.parse(localStorage.getItem(`cart_${userId}`)) || [];
  let appliedDiscount = null;

  const cartItems = document.getElementById('cartItems');
  const emptyCart = document.getElementById('emptyCart');
  const orderSummary = document.getElementById('orderSummary');
  const subtotalEl = document.getElementById('subtotal');
  const discountRow = document.getElementById('discountRow');
  const discountAmountEl = document.getElementById('discountAmount');
  const shippingEl = document.getElementById('shipping');
  const taxesEl = document.getElementById('taxes');
  const totalEl = document.getElementById('total');
  const discountCodeInput = document.getElementById('discountCode');
  const applyBtn = document.getElementById('applyDiscount');
  const cartTitle = document.getElementById('cartTitle');

  renderCart();

  function updateCartBadge() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const badge = document.querySelector('.cart-badge');
    if (badge) {
      badge.textContent = totalItems || '';
      badge.style.display = totalItems > 0 ? 'flex' : 'none';
    }
  }

  function renderCart() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartTitle.textContent = totalItems > 0 ? `CART (${totalItems})` : 'CART';

    if (totalItems === 0) {
      emptyCart.style.display = 'block';
      cartItems.style.display = 'none';
      if (orderSummary) orderSummary.style.display = 'none';
      return;
    }

    emptyCart.style.display = 'none';
    cartItems.style.display = 'block';
    if (orderSummary) orderSummary.style.display = 'block';

    cartItems.innerHTML = '';
    let subtotal = 0;
    cart.forEach(item => {
      const product = PRODUCTS.find(p => p.id === item.id);
      if (!product) return;
      const itemTotal = product.price * item.quantity;
      subtotal += itemTotal;

      const itemEl = document.createElement('div');
      itemEl.className = 'cart-item';
      itemEl.innerHTML = `
        <img src="${product.image}" alt="${product.name}" class="item-image">
        <div class="item-details">
          <div class="item-title">${product.name}</div>
          <div class="item-price">₹${product.price.toLocaleString('en-IN')}</div>
          <div class="quantity-group">
            <button class="quantity-btn minus" data-id="${item.id}">−</button>
            <span class="quantity-display">${item.quantity}</span>
            <button class="quantity-btn plus" data-id="${item.id}">+</button>
          </div>
          <button class="remove-btn" data-id="${item.id}">
            <i class="fas fa-trash"></i> Remove
          </button>
        </div>
      `;
      cartItems.appendChild(itemEl);
    });

    subtotalEl.textContent = `₹${subtotal.toLocaleString('en-IN')}`;
    applyDiscountLogic(subtotal);
    updateCartBadge();

    document.querySelectorAll('.minus').forEach(btn => {
      btn.addEventListener('click', () => updateQuantity(parseInt(btn.dataset.id), -1));
    });
    document.querySelectorAll('.plus').forEach(btn => {
      btn.addEventListener('click', () => updateQuantity(parseInt(btn.dataset.id), 1));
    });
    document.querySelectorAll('.remove-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = parseInt(btn.dataset.id);
        cart = cart.filter(item => item.id !== id);
        localStorage.setItem(`cart_${userId}`, JSON.stringify(cart));
        renderCart();
        showToast('Item removed', 'success');
      });
    });
  }

  function updateQuantity(id, change) {
    const item = cart.find(item => item.id === id);
    if (!item) return;
    item.quantity += change;
    if (item.quantity < 1) {
      cart = cart.filter(item => item.id !== id);
    } else {
      const index = cart.findIndex(i => i.id === id);
      cart[index] = item;
    }
    localStorage.setItem(`cart_${userId}`, JSON.stringify(cart));
    renderCart();
    showToast(change > 0 ? 'Added!' : 'Removed!', 'success');
  }

  function applyDiscountLogic(subtotal) {
    const shipping = subtotal >= 100000 ? 0 : 99;
    const discountedSub = appliedDiscount ? subtotal * (1 - appliedDiscount.rate) : subtotal;
    const taxes = discountedSub * 0.05;
    const total = discountedSub + shipping + taxes;

    if (appliedDiscount) {
      discountRow.style.display = 'flex';
      discountAmountEl.textContent = `-₹${Math.round(subtotal * appliedDiscount.rate).toLocaleString('en-IN')}`;
    } else {
      discountRow.style.display = 'none';
    }

    shippingEl.textContent = shipping === 0 ? 'Free' : `₹${shipping.toLocaleString('en-IN')}`;
    taxesEl.textContent = `₹${Math.round(taxes).toLocaleString('en-IN')}`;
    totalEl.textContent = `₹${Math.round(total).toLocaleString('en-IN')}`;
  }

  function updateDiscountUI() {
    if (appliedDiscount) {
      discountCodeInput.disabled = true;
      applyBtn.textContent = 'Remove';
      applyBtn.style.background = 'linear-gradient(135deg, #ef4444, #dc2626)';
    } else {
      discountCodeInput.disabled = false;
      discountCodeInput.value = '';
      applyBtn.textContent = 'Apply';
      applyBtn.style.background = 'var(--button-primary)';
    }
  }

  applyBtn.addEventListener('click', () => {
    if (appliedDiscount) {
      appliedDiscount = null;
      showToast('Discount removed.', 'success');
    } else {
      const code = discountCodeInput.value.trim().toUpperCase();
      if (code === 'NEW10') {
        appliedDiscount = { code: 'NEW10', rate: 0.10 };
        showToast('10% discount applied!', 'success');
      } else if (code) {
        showToast('Invalid discount code!', 'error');
        return;
      } else {
        showToast('Please enter a discount code.', 'error');
        return;
      }
    }
    const subtotal = cart.reduce((sum, item) => {
      const product = PRODUCTS.find(p => p.id === item.id);
      return sum + (product ? product.price * item.quantity : 0);
    }, 0);
    applyDiscountLogic(subtotal);
    updateDiscountUI();
  });

  updateDiscountUI();

  document.getElementById('proceedToCheckoutBtn').addEventListener('click', () => {
    const subtotal = cart.reduce((sum, item) => {
      const product = PRODUCTS.find(p => p.id === item.id);
      return sum + (product ? product.price * item.quantity : 0);
    }, 0);
    
    const shipping = subtotal >= 100000 ? 0 : 99;
    const discountedSub = appliedDiscount ? subtotal * (1 - appliedDiscount.rate) : subtotal;
    const taxes = discountedSub * 0.05;
    const total = discountedSub + shipping + taxes;

    const orderSummary = {
      subtotal,
      discount: appliedDiscount ? subtotal * appliedDiscount.rate : 0,
      shipping,
      taxes,
      total,
      discountCode: appliedDiscount ? appliedDiscount.code : null
    };

    localStorage.setItem('orderSummary', JSON.stringify(orderSummary));
    localStorage.setItem('cartItems', JSON.stringify(cart));
    window.location.href = 'checkout.html';
  });

  function showToast(message, type = 'success') {
    const toastContainer = document.getElementById('toastContainer');
    if (!toastContainer) return;
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