document.addEventListener('DOMContentLoaded', () => {
  const ordersContainer = document.getElementById('ordersContainer');
  const emptyOrders = document.getElementById('emptyOrders');

  const user = JSON.parse(localStorage.getItem('user'));
  const userId = user?.email;
  if (!userId) {
    window.location.href = 'login.html';
    return;
  }

  let orders = JSON.parse(localStorage.getItem(`orders_${userId}`)) || [];

  if (orders.length === 0) {
    emptyOrders.style.display = 'block';
    return;
  }

  ordersContainer.style.display = 'flex';
  renderOrders(orders);
});

function renderOrders(orders) {
  const ordersContainer = document.getElementById('ordersContainer');
  ordersContainer.innerHTML = '';
  orders.forEach(order => {
    const card = document.createElement('div');
    card.className = 'order-card';

    let itemsHtml = '';
    order.items.forEach(item => {
      itemsHtml += `
        <div class="order-item">
          <img src="${item.image}" alt="${item.name}" class="item-image">
          <div class="item-details">
            <div class="item-name">${item.name}</div>
            <div class="item-price">Qty: ${item.quantity} • ₹${item.price.toLocaleString('en-IN')}</div>
          </div>
        </div>
      `;
    });

    const statuses = ['Placed', 'Confirmed', 'Packed', 'In Transit', 'Out for Delivery', 'Delivered'];
    let stepsHtml = '';
    statuses.forEach((label, i) => {
      let cls = '';
      if (i < order.statusIndex) cls = 'completed';
      else if (i === order.statusIndex) cls = 'active';
      stepsHtml += `
        <div class="status-step ${cls}">
          <div class="status-icon">
            ${i < order.statusIndex ? '<i class="fas fa-check"></i>' : i === order.statusIndex ? '<i class="fas fa-spinner fa-spin"></i>' : ''}
          </div>
          <div class="status-label">${label}</div>
        </div>
      `;
    });

    card.innerHTML = `
      <div class="order-header">
        <div class="order-id">Order #${order.id}</div>
        <div class="order-date">${new Date(order.date).toLocaleDateString('en-IN')}</div>
      </div>
      <div class="order-items">
        ${itemsHtml}
      </div>
      <div class="order-total">Total: ₹${order.total.toLocaleString('en-IN')}</div>
      <div class="status-steps">
        ${stepsHtml}
      </div>
      ${order.statusIndex === 0 ? 
        `<div class="cancel-section">
          <button class="cancel-btn">
            <i class="fas fa-times"></i> CANCEL ORDER
          </button>
        </div>` : ''}
    `;
    ordersContainer.appendChild(card);
  });

  document.querySelectorAll('.cancel-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      showCancelAlert();
    });
  });
}

function showCancelAlert() {
  const modal = document.createElement('div');
  modal.id = 'cancelOrderModal';
  modal.innerHTML = `
    <div class="modal-overlay"></div>
    <div class="modal-content">
      <div style="font-size: 56px; color: #ef4444; margin-bottom: 20px;">
        <i class="fas fa-exclamation-triangle"></i>
      </div>
      <h3 style="font-size: 24px; font-weight: 800; color: var(--text-primary); margin-bottom: 12px;">
        Can't Cancel Order
      </h3>
      <p style="color: var(--text-secondary); margin-bottom: 24px; font-size: 16px;">
        You can't cancel an order once it's placed.
      </p>
      <button id="closeModal" style="
        padding: 14px 40px;
        border-radius: 16px;
        font-weight: 600;
        background: var(--button-primary);
        color: white;
        border: none;
        cursor: pointer;
        box-shadow: 0 4px 14px rgba(99, 102, 241, 0.3);
      ">Close</button>
    </div>
  `;

  const style = document.createElement('style');
  style.textContent = `
    #cancelOrderModal {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 9999;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .modal-overlay {
      position: absolute;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.6);
      animation: fadeIn 0.3s;
    }
    .modal-content {
      background: var(--bg-primary);
      border-radius: 24px;
      padding: 32px;
      width: 90%;
      max-width: 500px;
      box-shadow: 0 20px 50px rgba(0,0,0,0.3);
      transform: scale(0.9);
      animation: popIn 0.4s forwards cubic-bezier(0.18, 0.89, 0.32, 1.28);
      text-align: center;
    }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes popIn { to { transform: scale(1); } }
  `;
  document.head.appendChild(style);
  document.body.appendChild(modal);

  document.getElementById('closeModal').onclick = () => {
    document.body.removeChild(modal);
    document.head.removeChild(style);
  };
  document.querySelector('.modal-overlay').onclick = () => {
    document.body.removeChild(modal);
    document.head.removeChild(style);
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