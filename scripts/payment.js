document.addEventListener('DOMContentLoaded', () => {
  const paymentOptions = document.getElementById('paymentOptions');
  const orderSummaryTable = document.getElementById('orderSummaryTable');
  const placeOrderBtn = document.getElementById('placeOrderBtn');

  let selectedPayment = 'cod';
  const orderSummary = JSON.parse(localStorage.getItem('orderSummary'));
  const selectedAddress = JSON.parse(localStorage.getItem('selectedAddress'));
  const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

  if (!orderSummary || !selectedAddress) {
    window.location.href = 'checkout.html';
    return;
  }

  const user = JSON.parse(localStorage.getItem('user'));
  const userId = user?.email;
  if (!userId) {
    window.location.href = 'login.html';
    return;
  }

  const generateOrderId = () => `ORD-${Math.floor(100000 + Math.random() * 900000)}`;

  const methods = [
    { id: 'cod', name: 'Cash on Delivery', icon: 'fas fa-hand-holding-dollar', available: true },
    { id: 'upi', name: 'UPI / QR', icon: 'fas fa-qrcode', available: false },
    { id: 'card', name: 'Credit/Debit Card', icon: 'fas fa-credit-card', available: false },
    { id: 'netbanking', name: 'Net Banking', icon: 'fas fa-building-columns', available: false },
    { id: 'wallet', name: 'Wallets (Paytm, etc.)', icon: 'fas fa-wallet', available: false }
  ];

  methods.forEach(method => {
    const div = document.createElement('div');
    div.className = 'payment-option';
    if (method.available) div.classList.add('selected');
    div.innerHTML = `<i class="${method.icon}"></i> <span>${method.name}</span>`;
    div.addEventListener('click', () => {
      if (!method.available) {
        showToast('Coming soon!', 'error');
        return;
      }
      document.querySelectorAll('.payment-option').forEach(el => el.classList.remove('selected'));
      div.classList.add('selected');
      selectedPayment = method.id;
      renderSummary();
    });
    paymentOptions.appendChild(div);
  });

  function renderSummary() {
    let { subtotal, discount, shipping, taxes, total, discountCode } = orderSummary;
    if (selectedPayment === 'cod') total += 10;

    let html = `
      <div class="summary-row">
        <label>Subtotal</label>
        <span>₹${subtotal.toLocaleString('en-IN')}</span>
      </div>
    `;
    if (discount > 0) {
      html += `
        <div class="summary-row discount-row">
          <label>Discount (${discountCode})</label>
          <span>-₹${Math.round(discount).toLocaleString('en-IN')}</span>
        </div>
      `;
    }
    html += `
      <div class="summary-row">
        <label>Shipping</label>
        <span>${shipping === 0 ? 'Free' : `₹${shipping.toLocaleString('en-IN')}`}</span>
      </div>
      <div class="summary-row">
        <label>Taxes (5%)</label>
        <span>₹${Math.round(taxes).toLocaleString('en-IN')}</span>
      </div>
    `;
    if (selectedPayment === 'cod') {
      html += `
        <div class="summary-row cod-fee-row">
          <label>COD Fee</label>
          <span>+₹10</span>
        </div>
      `;
    }
    html += `
      <div class="summary-row total-row">
        <label>Total</label>
        <span>₹${Math.round(total).toLocaleString('en-IN')}</span>
      </div>
    `;
    orderSummaryTable.innerHTML = html;
  }

  renderSummary();

  placeOrderBtn.addEventListener('click', () => {
    if (selectedPayment !== 'cod') {
      showToast('Only Cash on Delivery is available.', 'error');
      return;
    }

    // ✅ LOAD USER-SPECIFIC ORDERS
    const orders = JSON.parse(localStorage.getItem(`orders_${userId}`)) || [];

    // ✅ CREATE NEW ORDER
    const newOrder = {
      id: generateOrderId(),
      date: new Date().toISOString(),
      items: cartItems.map(item => {
        const product = PRODUCTS.find(p => p.id === item.id);
        return {
          id: item.id,
          name: product.name,
          image: product.image,
          quantity: item.quantity,
          price: product.price * item.quantity
        };
      }),
      total: orderSummary.total + 10,
      statusIndex: 0,
      paymentMethod: 'Cash on Delivery'
    };

    // ✅ SAVE UNDER USER NAMESPACE
    orders.unshift(newOrder);
    localStorage.setItem(`orders_${userId}`, JSON.stringify(orders));

    // ✅ CLEAR USER-SPECIFIC CART AND TEMP DATA
    localStorage.removeItem(`cart_${userId}`);
    localStorage.removeItem('orderSummary');
    localStorage.removeItem('cartItems');

    showToast('Order placed successfully!', 'success');
    setTimeout(() => window.location.href = 'orders.html', 1500);
  });

  // ✅ PRODUCT DATA FOR MAPPING
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