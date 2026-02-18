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
  initStore();
  setupEventListeners();
  startHeroSlider();
});

function initStore() {
  state.products = ProductService.getAll();
  renderHeader(); // Initial render for cart count
  renderCategories();
  renderProducts();
  renderCart(); // Pre-render cart
  lucide.createIcons();
}

// --- Event Listeners ---
function setupEventListeners() {
  // Global Event Delegation for dynamic elements
  document.body.addEventListener('click', (e) => {
    const target = e.target;

    // Add to Cart
    if (target.closest('[data-action="add-to-cart"]')) {
      const btn = target.closest('[data-action="add-to-cart"]');
      const productId = btn.dataset.id;
      const product = state.products.find(p => p.id === productId);
      if (product) {
        CartService.add(product);
        renderHeader();
        renderProducts(); // Re-render to update card state
        renderCart();
      }
    }

    // Remove one from Cart (Card or Drawer)
    if (target.closest('[data-action="decrease-cart"]')) {
      const btn = target.closest('[data-action="decrease-cart"]');
      CartService.removeOne(btn.dataset.id);
      renderHeader();
      renderProducts();
      renderCart();
    }
    
    // Remove entire item (Drawer)
    if (target.closest('[data-action="delete-cart-item"]')) {
      const btn = target.closest('[data-action="delete-cart-item"]');
      CartService.delete(btn.dataset.id);
      renderHeader();
      renderProducts();
      renderCart();
    }

    // Category Filter
    if (target.closest('[data-category]')) {
      const btn = target.closest('[data-category]');
      state.activeCategory = btn.dataset.category;
      renderCategories(); // Update active state
      renderProducts();
    }
  });

  // Search Input
  const searchInput = document.getElementById('search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      state.searchQuery = e.target.value;
      renderProducts();
    });
  }
  
  // Mobile Search Input
  const mobileSearchInput = document.getElementById('mobile-search-input');
  if (mobileSearchInput) {
    mobileSearchInput.addEventListener('input', (e) => {
      state.searchQuery = e.target.value;
      renderProducts();
    });
  }

  // Cart Drawer Toggles
  document.getElementById('cart-btn').addEventListener('click', toggleCart);
  document.getElementById('close-cart-btn').addEventListener('click', toggleCart);
  document.getElementById('cart-overlay').addEventListener('click', toggleCart);

  // Storage Sync (if admin updates products in another tab)
  window.addEventListener('storage', (e) => {
    if (e.key === 'buyit_products') {
      state.products = ProductService.getAll();
      renderProducts();
    }
  });
}

// --- Rendering Functions ---

function renderHeader() {
  const count = CartService.getTotalCount();
  const badge = document.getElementById('cart-count-badge');
  
  if (count > 0) {
    badge.textContent = count;
    badge.classList.remove('hidden');
    badge.classList.add('flex');
  } else {
    badge.classList.add('hidden');
    badge.classList.remove('flex');
  }
}

function renderCategories() {
  const container = document.getElementById('categories-container');
  
  // "All" Button
  let html = `
    <button data-category="All" 
      class="flex-shrink-0 px-6 py-3 rounded-2xl font-bold transition-all ${state.activeCategory === 'All' ? 'bg-secondary text-primary shadow-lg scale-105' : 'bg-white text-gray-600 hover:bg-gray-100 shadow-sm'}">
      All Items
    </button>
  `;

  INITIAL_CATEGORIES.forEach(cat => {
    const isActive = state.activeCategory === cat.name;
    // Note: We use data-lucide attribute for icons which will be parsed by lucide.createIcons()
    html += `
      <button data-category="${cat.name}" 
        class="flex-shrink-0 px-6 py-3 rounded-2xl font-bold transition-all flex items-center gap-2 ${isActive ? 'bg-secondary text-primary shadow-lg scale-105' : 'bg-white text-gray-600 hover:bg-gray-100 shadow-sm'}">
        <i data-lucide="${cat.icon}" width="18" height="18"></i>
        <span>${cat.name}</span>
      </button>
    `;
  });

  container.innerHTML = html;
  lucide.createIcons();
}

function renderProducts() {
  const container = document.getElementById('products-grid');
  const cart = CartService.get();
  
  let filtered = state.products;

  // Filter by Category
  if (state.activeCategory !== 'All') {
    filtered = filtered.filter(p => p.category === state.activeCategory);
  }

  // Filter by Search
  if (state.searchQuery) {
    const q = state.searchQuery.toLowerCase();
    filtered = filtered.filter(p => p.name.toLowerCase().includes(q));
  }

  // Update Section Title
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
    
    // Discount Badge
    const discountBadge = product.discount 
      ? `<div class="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-md shadow-sm">${product.discount}% OFF</div>` 
      : '';

    // Action Buttons Logic
    let actionButtons = '';
    if (quantity === 0) {
      actionButtons = `
        <button data-action="add-to-cart" data-id="${product.id}" 
          class="px-4 py-1.5 rounded-lg text-sm font-bold text-primary bg-secondary border-2 border-transparent hover:bg-gray-800 transition-colors">
          ADD
        </button>
      `;
    } else {
      actionButtons = `
        <div class="flex items-center bg-secondary text-primary rounded-lg shadow-md overflow-hidden h-8">
          <button data-action="decrease-cart" data-id="${product.id}" class="w-8 h-full flex items-center justify-center hover:bg-gray-700 transition-colors">
            <i data-lucide="minus" width="14"></i>
          </button>
          <span class="w-6 text-center text-sm font-bold text-white">${quantity}</span>
          <button data-action="add-to-cart" data-id="${product.id}" class="w-8 h-full flex items-center justify-center hover:bg-gray-700 transition-colors">
            <i data-lucide="plus" width="14"></i>
          </button>
        </div>
      `;
    }

    return `
      <div class="group bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full animate-fade-in">
        <div class="relative mb-4 overflow-hidden rounded-xl aspect-square bg-gray-50">
          <img src="${product.image}" alt="${product.name}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500">
          ${discountBadge}
        </div>
        <div class="flex-1">
          <div class="text-xs text-gray-400 font-medium mb-1">${product.weight}</div>
          <h3 class="font-bold text-gray-900 leading-tight mb-1">${product.name}</h3>
          <div class="text-xs text-gray-400 mb-3">${product.category}</div>
        </div>
        <div class="flex items-center justify-between mt-auto">
          <div class="font-bold text-lg text-secondary">${formatCurrency(product.price)}</div>
          ${actionButtons}
        </div>
      </div>
    `;
  }).join('');

  lucide.createIcons();
}

function renderCart() {
  const container = document.getElementById('cart-items-container');
  const footer = document.getElementById('cart-footer');
  const emptyState = document.getElementById('cart-empty-state');
  
  const cart = CartService.get();
  
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
    <div class="flex gap-4 p-3 bg-gray-50 rounded-xl border border-gray-100 animate-fade-in">
      <img src="${item.image}" alt="${item.name}" class="w-20 h-20 object-cover rounded-lg bg-white" />
      <div class="flex-1 flex flex-col justify-between">
        <div>
          <h3 class="font-bold text-secondary line-clamp-1">${item.name}</h3>
          <p class="text-xs text-gray-500">${item.weight}</p>
        </div>
        <div class="flex items-center justify-between">
          <div class="font-bold text-secondary">${formatCurrency(item.price * item.quantity)}</div>
          <div class="flex items-center gap-3 bg-white px-2 py-1 rounded-lg border border-gray-200 shadow-sm">
            <button data-action="decrease-cart" data-id="${item.id}" class="text-gray-500 hover:text-red-500 transition-colors flex items-center">
              <i data-lucide="minus" width="14"></i>
            </button>
            <span class="text-sm font-bold w-4 text-center">${item.quantity}</span>
            <button data-action="add-to-cart" data-id="${item.id}" class="text-gray-500 hover:text-green-600 transition-colors flex items-center">
              <i data-lucide="plus" width="14"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  `).join('');

  // Cart Totals
  const total = CartService.getTotalPrice();
  const deliveryFee = total > 50 ? 0 : 5.99;
  const grandTotal = total + deliveryFee;

  document.getElementById('cart-subtotal').textContent = formatCurrency(total);
  const deliveryEl = document.getElementById('cart-delivery');
  if (deliveryFee === 0) {
    deliveryEl.innerHTML = '<span class="text-green-600 font-bold">FREE</span>';
  } else {
    deliveryEl.textContent = formatCurrency(deliveryFee);
  }
  document.getElementById('cart-total').textContent = formatCurrency(grandTotal);

  lucide.createIcons();
}

function toggleCart() {
  const drawer = document.getElementById('cart-drawer');
  const overlay = document.getElementById('cart-overlay');
  
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
}

// --- Hero Slider ---
const HERO_SLIDES = [
  { title: "Fresh from the farm", subtitle: "Get 20% off on all organic vegetables this weekend.", bg: "bg-green-100", text: "text-green-900", accent: "text-green-700", image: "https://picsum.photos/seed/veg/800/400" },
  { title: "Midnight cravings?", subtitle: "Instant delivery for snacks & beverages. 24/7.", bg: "bg-indigo-100", text: "text-indigo-900", accent: "text-indigo-700", image: "https://picsum.photos/seed/snack/800/400" },
  { title: "Bakery Specials", subtitle: "Freshly baked sourdough and croissants arrived.", bg: "bg-orange-100", text: "text-orange-900", accent: "text-orange-700", image: "https://picsum.photos/seed/bake/800/400" }
];

function startHeroSlider() {
  const sliderContainer = document.getElementById('hero-slider');
  
  function renderSlide() {
    const slide = HERO_SLIDES[state.heroSlideIndex];
    sliderContainer.className = `relative overflow-hidden rounded-3xl ${slide.bg} transition-colors duration-700 h-[300px] md:h-[400px] flex items-center animate-fade-in`;
    
    sliderContainer.innerHTML = `
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
          <div class="w-2 h-2 md:w-3 md:h-3 rounded-full transition-all ${idx === state.heroSlideIndex ? 'bg-secondary w-6 md:w-8' : 'bg-secondary/20'}"></div>
        `).join('')}
      </div>
    `;
    lucide.createIcons();
  }

  renderSlide();
  
  setInterval(() => {
    state.heroSlideIndex = (state.heroSlideIndex + 1) % HERO_SLIDES.length;
    renderSlide();
  }, 5000);
}