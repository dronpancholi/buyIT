/**
 * Storefront Logic
 */

let state = {
  products: [],
  activeCategory: 'All',
  searchQuery: '',
  isCartOpen: false,
  heroSlideIndex: 0
};

// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
  // Ensure Lucide is available, if not, wait or degraded gracefully
  initStore();
  setupEventListeners();
  startHeroSlider();
});

function initStore() {
  state.products = window.ProductService.getAll();
  renderHeader();
  renderCategories();
  renderProducts();
  renderCart();
  refreshIcons();
}

function refreshIcons() {
  if (window.lucide && typeof window.lucide.createIcons === 'function') {
    window.lucide.createIcons();
  }
}

// --- Event Listeners ---
function setupEventListeners() {
  // Global Event Delegation for dynamic elements
  document.body.addEventListener('click', (e) => {
    const target = e.target;

    // Add to Cart
    const addBtn = target.closest('[data-action="add-to-cart"]');
    if (addBtn) {
      e.stopPropagation();
      const productId = addBtn.dataset.id;
      const product = state.products.find(p => p.id === productId);
      if (product) {
        window.CartService.add(product);
        refreshUI();
      }
    }

    // Remove one from Cart
    const decBtn = target.closest('[data-action="decrease-cart"]');
    if (decBtn) {
      e.stopPropagation();
      window.CartService.removeOne(decBtn.dataset.id);
      refreshUI();
    }
    
    // Remove entire item
    const delBtn = target.closest('[data-action="delete-cart-item"]');
    if (delBtn) {
      e.stopPropagation();
      window.CartService.delete(delBtn.dataset.id);
      refreshUI();
    }

    // Category Filter
    const catBtn = target.closest('[data-category]');
    if (catBtn) {
      state.activeCategory = catBtn.dataset.category;
      renderCategories();
      renderProducts();
    }
  });

  // Search Input
  const setupSearch = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('input', (e) => {
        state.searchQuery = e.target.value;
        renderProducts();
      });
    }
  };
  setupSearch('search-input');
  setupSearch('mobile-search-input');

  // Cart Drawer Toggles
  const toggleCart = () => {
    const drawer = document.getElementById('cart-drawer');
    const overlay = document.getElementById('cart-overlay');
    if(!drawer || !overlay) return;
    
    state.isCartOpen = !state.isCartOpen;

    if (state.isCartOpen) {
      drawer.classList.remove('translate-x-full');
      drawer.classList.add('translate-x-0');
      overlay.classList.remove('opacity-0', 'pointer-events-none');
      overlay.classList.add('opacity-100', 'pointer-events-auto');
    } else {
      drawer.classList.add('translate-x-full');
      drawer.classList.remove('translate-x-0');
      overlay.classList.add('opacity-0', 'pointer-events-none');
      overlay.classList.remove('opacity-100', 'pointer-events-auto');
    }
  };

  const cartBtn = document.getElementById('cart-btn');
  if(cartBtn) cartBtn.addEventListener('click', toggleCart);
  
  const closeCartBtn = document.getElementById('close-cart-btn');
  if(closeCartBtn) closeCartBtn.addEventListener('click', toggleCart);
  
  const cartOverlay = document.getElementById('cart-overlay');
  if(cartOverlay) cartOverlay.addEventListener('click', toggleCart);

  // Storage Sync
  window.addEventListener('storage', (e) => {
    if (e.key === window.BUYIT_CONSTANTS.PRODUCTS_KEY) {
      state.products = window.ProductService.getAll();
      renderProducts();
    }
  });
}

function refreshUI() {
  renderHeader();
  renderProducts(); // Re-render to update button states (Add vs +/-)
  renderCart();
  refreshIcons();
}

// --- Rendering Functions ---

function renderHeader() {
  const count = window.CartService.getTotalCount();
  const badge = document.getElementById('cart-count-badge');
  
  if (badge) {
    if (count > 0) {
      badge.textContent = count;
      badge.classList.remove('hidden');
      badge.classList.add('flex');
    } else {
      badge.classList.add('hidden');
      badge.classList.remove('flex');
    }
  }
}

function renderCategories() {
  const container = document.getElementById('categories-container');
  if (!container) return;

  let html = `
    <button data-category="All" 
      class="flex-shrink-0 px-6 py-3 rounded-2xl font-bold transition-all border border-transparent ${state.activeCategory === 'All' ? 'bg-secondary text-primary shadow-lg scale-105' : 'bg-white text-gray-600 hover:bg-gray-100 shadow-sm'}">
      All Items
    </button>
  `;

  window.INITIAL_CATEGORIES.forEach(cat => {
    const isActive = state.activeCategory === cat.name;
    html += `
      <button data-category="${cat.name}" 
        class="flex-shrink-0 px-6 py-3 rounded-2xl font-bold transition-all flex items-center gap-2 border border-transparent ${isActive ? 'bg-secondary text-primary shadow-lg scale-105' : 'bg-white text-gray-600 hover:bg-gray-100 shadow-sm'}">
        <i data-lucide="${cat.icon}" class="w-4 h-4"></i>
        <span>${cat.name}</span>
      </button>
    `;
  });

  container.innerHTML = html;
  // We refresh icons later in the cycle usually, but good to do here if called specifically
}

function renderProducts() {
  const container = document.getElementById('products-grid');
  if (!container) return;

  const cart = window.CartService.get();
  
  let filtered = state.products;

  if (state.activeCategory !== 'All') {
    filtered = filtered.filter(p => p.category === state.activeCategory);
  }

  if (state.searchQuery) {
    const q = state.searchQuery.toLowerCase();
    filtered = filtered.filter(p => p.name.toLowerCase().includes(q));
  }

  const titleEl = document.getElementById('category-title');
  if(titleEl) titleEl.textContent = state.activeCategory === 'All' ? 'Popular Products' : state.activeCategory;
  
  const countEl = document.getElementById('item-count');
  if(countEl) countEl.textContent = `${filtered.length} items`;

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="col-span-full text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
        <p class="text-xl text-gray-400 font-medium">No products found</p>
        <p class="text-sm text-gray-300">Try adjusting your search or category</p>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(product => {
    const cartItem = cart.find(item => item.id === product.id);
    const quantity = cartItem ? cartItem.quantity : 0;
    
    const discountBadge = product.discount 
      ? `<div class="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-md shadow-sm">${product.discount}% OFF</div>` 
      : '';

    let actionButtons = '';
    if (quantity === 0) {
      actionButtons = `
        <button data-action="add-to-cart" data-id="${product.id}" 
          class="px-5 py-2 rounded-xl text-sm font-bold text-primary bg-secondary border-2 border-transparent hover:bg-gray-800 transition-colors shadow-sm">
          ADD
        </button>
      `;
    } else {
      actionButtons = `
        <div class="flex items-center bg-secondary text-primary rounded-xl shadow-md overflow-hidden h-9">
          <button data-action="decrease-cart" data-id="${product.id}" class="w-9 h-full flex items-center justify-center hover:bg-gray-700 transition-colors">
            <i data-lucide="minus" class="w-3.5 h-3.5"></i>
          </button>
          <span class="w-6 text-center text-sm font-bold text-white">${quantity}</span>
          <button data-action="add-to-cart" data-id="${product.id}" class="w-9 h-full flex items-center justify-center hover:bg-gray-700 transition-colors">
            <i data-lucide="plus" class="w-3.5 h-3.5"></i>
          </button>
        </div>
      `;
    }

    return `
      <div class="group bg-white rounded-3xl p-3 shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full animate-fade-in">
        <div class="relative mb-3 overflow-hidden rounded-2xl aspect-square bg-gray-50">
          <img src="${product.image}" alt="${product.name}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500">
          ${discountBadge}
        </div>
        <div class="flex-1 px-1">
          <div class="text-xs text-gray-400 font-medium mb-1">${product.weight}</div>
          <h3 class="font-bold text-gray-900 leading-tight mb-1 text-base">${product.name}</h3>
          <div class="text-xs text-gray-400 mb-3">${product.category}</div>
        </div>
        <div class="flex items-center justify-between mt-auto px-1 pb-1">
          <div class="font-bold text-lg text-secondary">${window.formatCurrency(product.price)}</div>
          ${actionButtons}
        </div>
      </div>
    `;
  }).join('');
}

function renderCart() {
  const container = document.getElementById('cart-items-container');
  const footer = document.getElementById('cart-footer');
  const emptyState = document.getElementById('cart-empty-state');
  
  if(!container || !footer || !emptyState) return;

  const cart = window.CartService.get();
  
  if (cart.length === 0) {
    container.innerHTML = '';
    container.classList.add('hidden');
    emptyState.classList.remove('hidden');
    emptyState.classList.add('flex');
    footer.classList.add('hidden');
    return;
  }

  container.classList.remove('hidden');
  emptyState.classList.remove('flex');
  emptyState.classList.add('hidden');
  footer.classList.remove('hidden');

  container.innerHTML = cart.map(item => `
    <div class="flex gap-4 p-3 bg-gray-50 rounded-xl border border-gray-100 animate-fade-in items-center">
      <img src="${item.image}" alt="${item.name}" class="w-16 h-16 object-cover rounded-lg bg-white shrink-0" />
      <div class="flex-1 flex flex-col justify-between h-16 py-0.5">
        <div>
          <h3 class="font-bold text-secondary line-clamp-1 text-sm">${item.name}</h3>
          <p class="text-xs text-gray-500">${item.weight}</p>
        </div>
        <div class="flex items-center justify-between">
          <div class="font-bold text-secondary text-sm">${window.formatCurrency(item.price * item.quantity)}</div>
          <div class="flex items-center gap-2 bg-white px-1 py-0.5 rounded-lg border border-gray-200 shadow-sm">
            <button data-action="decrease-cart" data-id="${item.id}" class="text-gray-500 hover:text-red-500 transition-colors flex items-center p-1">
              <i data-lucide="minus" class="w-3 h-3"></i>
            </button>
            <span class="text-xs font-bold w-4 text-center">${item.quantity}</span>
            <button data-action="add-to-cart" data-id="${item.id}" class="text-gray-500 hover:text-green-600 transition-colors flex items-center p-1">
              <i data-lucide="plus" class="w-3 h-3"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  `).join('');

  const total = window.CartService.getTotalPrice();
  const deliveryFee = total > 50 ? 0 : 5.99;
  const grandTotal = total + deliveryFee;

  const subTotalEl = document.getElementById('cart-subtotal');
  if(subTotalEl) subTotalEl.textContent = window.formatCurrency(total);
  
  const deliveryEl = document.getElementById('cart-delivery');
  if (deliveryEl) {
    if (deliveryFee === 0) {
      deliveryEl.innerHTML = '<span class="text-green-600 font-bold">FREE</span>';
    } else {
      deliveryEl.textContent = window.formatCurrency(deliveryFee);
    }
  }
  
  const totalEl = document.getElementById('cart-total');
  if(totalEl) totalEl.textContent = window.formatCurrency(grandTotal);
}

// --- Hero Slider ---
const HERO_SLIDES = [
  { title: "Fresh from the farm", subtitle: "Get 20% off on all organic vegetables this weekend.", bg: "bg-green-100", text: "text-green-900", accent: "text-green-700", image: "https://picsum.photos/seed/veg/800/400" },
  { title: "Midnight cravings?", subtitle: "Instant delivery for snacks & beverages. 24/7.", bg: "bg-indigo-100", text: "text-indigo-900", accent: "text-indigo-700", image: "https://picsum.photos/seed/snack/800/400" },
  { title: "Bakery Specials", subtitle: "Freshly baked sourdough and croissants arrived.", bg: "bg-orange-100", text: "text-orange-900", accent: "text-orange-700", image: "https://picsum.photos/seed/bake/800/400" }
];

function startHeroSlider() {
  const sliderContainer = document.getElementById('hero-slider');
  if (!sliderContainer) return;
  
  function renderSlide() {
    const slide = HERO_SLIDES[state.heroSlideIndex];
    // Keep container styles mostly static to prevent jumping
    sliderContainer.className = `container mx-auto px-4 md:px-6 mb-8 mt-4`;
    
    sliderContainer.innerHTML = `
      <div class="relative overflow-hidden rounded-3xl ${slide.bg} transition-colors duration-700 h-[300px] md:h-[400px] flex items-center animate-fade-in shadow-lg">
        <div class="relative z-10 w-full md:w-1/2 px-8 md:px-16 flex flex-col items-start gap-4">
          <span class="px-3 py-1 rounded-full bg-white/50 backdrop-blur-sm text-xs font-bold uppercase tracking-wider ${slide.accent}">
            Featured Promo
          </span>
          <h1 class="text-4xl md:text-6xl font-black tracking-tight leading-none ${slide.text}">
            ${slide.title}
          </h1>
          <p class="text-lg md:text-xl font-medium opacity-80 max-w-sm ${slide.text}">
            ${slide.subtitle}
          </p>
          <button class="mt-2 shadow-xl group inline-flex items-center justify-center font-semibold transition-all active:scale-95 rounded-xl bg-primary text-secondary hover:bg-yellow-300 px-8 py-3.5 text-base">
            Shop Now <i data-lucide="arrow-right" class="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform"></i>
          </button>
        </div>
        <div class="absolute top-0 right-0 w-full h-full md:w-2/3 pointer-events-none opacity-20 md:opacity-100">
           <img src="${slide.image}" class="w-full h-full object-cover mix-blend-overlay md:mix-blend-normal" />
           <div class="absolute inset-0 bg-gradient-to-r ${slide.bg} to-transparent md:via-transparent"></div>
        </div>
        <div class="absolute bottom-6 left-8 md:left-16 flex gap-2">
          ${HERO_SLIDES.map((_, idx) => `
            <button onclick="changeSlide(${idx})" class="w-2 h-2 md:w-3 md:h-3 rounded-full transition-all ${idx === state.heroSlideIndex ? 'bg-secondary w-6 md:w-8' : 'bg-secondary/20 hover:bg-secondary/40'}"></button>
          `).join('')}
        </div>
      </div>
    `;
    refreshIcons();
  }

  renderSlide();
  
  // Expose slide change for dots
  window.changeSlide = (idx) => {
    state.heroSlideIndex = idx;
    renderSlide();
    // Reset interval on manual interaction
    clearInterval(window.heroInterval);
    window.heroInterval = setInterval(() => {
      state.heroSlideIndex = (state.heroSlideIndex + 1) % HERO_SLIDES.length;
      renderSlide();
    }, 5000);
  }

  window.heroInterval = setInterval(() => {
    state.heroSlideIndex = (state.heroSlideIndex + 1) % HERO_SLIDES.length;
    renderSlide();
  }, 5000);
}