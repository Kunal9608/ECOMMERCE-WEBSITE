document.addEventListener('DOMContentLoaded', () => {
  const products = [
    { id: 1, name: "iPhone 15 Pro", category: "phone", price: 82917, image: "https://m.media-amazon.com/images/I/81UKVHM77GL._AC_SL1500_.jpg" },
    { id: 2, name: "Samsung Galaxy S24", category: "phone", price: 74617, image: "https://m.media-amazon.com/images/I/81vxWpPpgNL.jpg" },
    { id: 3, name: "Google Pixel 8", category: "phone", price: 58017, image: "https://pisces.bbystatic.com/image2/BestBuy_US/images/products/6559/6559243_sd.jpg" },
    { id: 4, name: "MacBook Air M2", category: "laptop", price: 99517, image: "https://th.bing.com/th/id/OIP.J1T4ipznMlXFPBtGSLw2RwHaEe?w=263&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3" },
    { id: 5, name: "Dell XPS 13", category: "laptop", price: 82917, image: "https://www.bing.com/th/id/OIP.KatWGrAJIQf5KrVWBoZgjAHaE6?w=267&h=211&c=8&rs=1&qlt=90&o=6&dpr=1.3&pid=3.1&rm=2" },
    { id: 6, name: "HP Spectre x360", category: "laptop", price: 107817, image: "https://tse3.mm.bing.net/th/id/OIP.s2H7Xw6eCsVWnSaEkab83wHaGN?rs=1&pid=ImgDetMain&o=7&rm=3" },
    { id: 7, name: "Apple AirPods Pro", category: "earbuds", price: 20667, image: "https://th.bing.com/th/id/OIP.oZhAgHANB68gzjdV0-MYAgHaHa?w=161&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3" },
    { id: 8, name: "Samsung Galaxy Buds2 Pro", category: "earbuds", price: 18907, image: "https://pisces.bbystatic.com/image2/BestBuy_US/images/products/6510/6510541cv12d.jpg" },
    { id: 9, name: "Sony WF-1000XM5", category: "earbuds", price: 24817, image: "https://th.bing.com/th/id/OIP.imKg5QiH7dfVdnKagnHqhAHaET?w=292&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3" },
    { id: 10, name: "GoPro HERO12", category: "camera", price: 33117, image: "https://th.bing.com/th/id/OPAC.HEDxUwo117aFxg474C474?w=220&h=220&c=17&o=5&dpr=1.3&pid=21.1" },
    { id: 11, name: "DJI Mini 4 Pro", category: "camera", price: 63017, image: "https://tse4.mm.bing.net/th/id/OIP.nJ_WWEop1xciKwDGYGcrywHaD4?rs=1&pid=ImgDetMain&o=7&rm=3" },
    { id: 12, name: "Sony Alpha A7 IV", category: "camera", price: 207417, image: "https://www.bing.com/th/id/OIP.vWh-GRqaBbwB30b8YCUL5gHaG7?w=218&h=211&c=8&rs=1&qlt=90&o=6&dpr=1.3&pid=3.1&rm=2" },
    { id: 13, name: "Anker PowerCore 26800", category: "accessory", price: 5727, image: "https://m.media-amazon.com/images/I/61vj2BPDpuL._AC_SL1500_.jpg" },
    { id: 14, name: "Logitech MX Master 3S", category: "accessory", price: 8217, image: "https://tse3.mm.bing.net/th/id/OIP.AGkAIoXCQnKlUDYz6CQi1wHaHa?rs=1&pid=ImgDetMain&o=7&rm=3" },
    { id: 15, name: "Apple Magic Keyboard", category: "accessory", price: 8217, image: "https://www.bing.com/th/id/OIP.mdq-jsj3Vue-Pff1WfhYlgHaEL?w=246&h=211&c=8&rs=1&qlt=90&o=6&dpr=1.3&pid=3.1&rm=2" }
  ];

  const wishlistGrid = document.getElementById('wishlistGrid');
  const emptyWishlist = document.getElementById('emptyWishlist');

  const user = JSON.parse(localStorage.getItem('user'));
  const userId = user?.email;
  if (!userId) {
    window.location.href = 'login.html';
    return;
  }

  let wishlist = JSON.parse(localStorage.getItem(`wishlist_${userId}`)) || [];
  const wishlistProducts = products.filter(p => wishlist.includes(p.id));

  if (wishlistProducts.length === 0) {
    emptyWishlist.style.display = 'block';
    wishlistGrid.style.display = 'none';
  } else {
    emptyWishlist.style.display = 'none';
    wishlistGrid.style.display = 'grid';
    renderWishlist(wishlistProducts);
  }

  function renderWishlist(items) {
    wishlistGrid.innerHTML = '';
    items.forEach(p => {
      const card = document.createElement('div');
      card.className = 'wishlist-card';
      card.innerHTML = `
        <button class="remove-btn" data-id="${p.id}">
          <i class="fas fa-times"></i>
        </button>
        <img src="${p.image}" alt="${p.name}" class="wishlist-image">
        <div class="wishlist-info">
          <div class="wishlist-title">${p.name}</div>
          <div class="wishlist-price">₹${p.price.toLocaleString('en-IN')}</div>
          <div class="wishlist-actions">
            <button class="add-to-cart-btn" data-id="${p.id}">
              <i class="fas fa-shopping-cart"></i> Add to Cart
            </button>
            <button class="remove-from-wishlist-btn" data-id="${p.id}">
              <i class="fas fa-trash"></i> Remove
            </button>
          </div>
        </div>
      `;
      wishlistGrid.appendChild(card);
    });

    document.querySelectorAll('.remove-btn, .remove-from-wishlist-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = parseInt(btn.dataset.id);
        wishlist = wishlist.filter(item => item !== id);
        localStorage.setItem(`wishlist_${userId}`, JSON.stringify(wishlist));
        window.location.reload();
      });
    });

    document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = parseInt(btn.dataset.id);
        let cart = JSON.parse(localStorage.getItem(`cart_${userId}`)) || [];
        const existing = cart.find(item => item.id === id);
        if (existing) {
          existing.quantity += 1;
        } else {
          cart.push({ id, quantity: 1 });
        }
        localStorage.setItem(`cart_${userId}`, JSON.stringify(cart));
        wishlist = wishlist.filter(item => item !== id);
        localStorage.setItem(`wishlist_${userId}`, JSON.stringify(wishlist));
        showToast('Added to cart!', 'success');
        setTimeout(() => window.location.reload(), 800);
      });
    });
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