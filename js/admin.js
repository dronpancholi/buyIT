/**
 * Admin Panel Logic
 */

let adminState = {
  products: []
};

document.addEventListener('DOMContentLoaded', () => {
  setupAdminAuth();
  // We don't render products immediately until logged in/dashboard shown
  setupProductForm();
  refreshIcons();
});

function refreshIcons() {
  if (window.lucide && typeof window.lucide.createIcons === 'function') {
    window.lucide.createIcons();
  }
}

// --- Auth ---
function setupAdminAuth() {
  const loginForm = document.getElementById('login-form');
  const loginView = document.getElementById('login-view');
  const dashboardView = document.getElementById('dashboard-view');
  const loginError = document.getElementById('login-error');

  // Check session
  if (sessionStorage.getItem('isAdmin')) {
    showDashboard();
  }

  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const u = document.getElementById('username').value;
    const p = document.getElementById('password').value;

    if (u === 'admin' && p === 'admin') {
      sessionStorage.setItem('isAdmin', 'true');
      showDashboard();
    } else {
      loginError.classList.remove('hidden');
    }
  });

  // Use delegation or robust selection for logout as elements might be hidden/mobile
  document.addEventListener('click', (e) => {
    if(e.target.closest('#logout-btn')) {
      logout();
    }
  });
  
  function logout() {
    sessionStorage.removeItem('isAdmin');
    window.location.reload();
  }

  function showDashboard() {
    loginView.classList.add('hidden');
    dashboardView.classList.remove('hidden');
    
    // Initialize Dashboard Data
    adminState.products = window.ProductService.getAll();
    renderAdminProducts();
    populateCategorySelect();
    updateStats();
    
    refreshIcons();
  }
}

// --- Mobile Navigation ---
window.toggleSidebar = () => {
  const sidebar = document.getElementById('sidebar');
  const backdrop = document.getElementById('sidebar-backdrop');
  if(!sidebar || !backdrop) return;
  
  if (sidebar.classList.contains('-translate-x-full')) {
    sidebar.classList.remove('-translate-x-full');
    backdrop.classList.remove('hidden');
  } else {
    sidebar.classList.add('-translate-x-full');
    backdrop.classList.add('hidden');
  }
};

window.switchTab = (tabName) => {
  // Hide all tabs
  document.getElementById('tab-overview').classList.add('hidden');
  document.getElementById('tab-products').classList.add('hidden');
  
  // Reset Nav Styles
  ['nav-overview', 'nav-products'].forEach(id => {
    const el = document.getElementById(id);
    if(el) el.className = "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-gray-400 hover:bg-gray-800 hover:text-white";
  });

  // Show Active Tab
  document.getElementById(`tab-${tabName}`).classList.remove('hidden');
  const activeNav = document.getElementById(`nav-${tabName}`);
  if(activeNav) activeNav.className = "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all bg-primary text-secondary font-bold";
  
  refreshIcons();
};

// --- Product Management ---

function renderAdminProducts() {
  const tbody = document.getElementById('products-table-body');
  if(!tbody) return;
  
  tbody.innerHTML = adminState.products.map(product => `
    <tr class="hover:bg-gray-50 transition-colors group border-b border-gray-50">
      <td class="p-4">
        <div class="flex items-center gap-3">
          <img src="${product.image}" class="w-10 h-10 rounded-lg object-cover bg-gray-100" />
          <div>
            <div class="font-bold text-secondary text-sm">${product.name}</div>
            <div class="text-xs text-gray-400">${product.weight}</div>
          </div>
        </div>
      </td>
      <td class="p-4 text-sm text-gray-500">${product.category}</td>
      <td class="p-4 font-bold text-secondary">${window.formatCurrency(product.price)}</td>
      <td class="p-4 text-right">
        <button onclick="editProduct('${product.id}')" class="text-blue-500 hover:underline text-sm mr-3 font-bold">Edit</button>
        <button onclick="deleteProduct('${product.id}')" class="text-red-500 hover:underline text-sm font-bold">Delete</button>
      </td>
    </tr>
  `).join('');
}

function updateStats() {
  const statTotal = document.getElementById('stat-total-products');
  if(statTotal) statTotal.textContent = adminState.products.length;
}

function populateCategorySelect() {
  const select = document.getElementById('p-category');
  if(!select) return;
  const categories = ['Fruits & Veg', 'Dairy & Bakery', 'Snacks', 'Beverages', 'Household', 'Personal Care'];
  select.innerHTML = categories.map(c => `<option value="${c}">${c}</option>`).join('');
}

// --- Modal Logic ---
const modal = document.getElementById('product-modal');
const modalContent = document.getElementById('product-modal-content');

window.openProductModal = () => {
  document.getElementById('product-form').reset();
  document.getElementById('edit-id').value = '';
  document.getElementById('modal-title').textContent = 'Add Product';
  
  modal.classList.remove('hidden');
  setTimeout(() => {
    modal.classList.remove('opacity-0');
    modalContent.classList.remove('scale-95');
    modalContent.classList.add('scale-100');
  }, 10);
};

window.closeProductModal = () => {
  modal.classList.add('opacity-0');
  modalContent.classList.remove('scale-100');
  modalContent.classList.add('scale-95');
  setTimeout(() => modal.classList.add('hidden'), 300);
};

function setupProductForm() {
  const form = document.getElementById('product-form');
  if(form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const id = document.getElementById('edit-id').value;
      const name = document.getElementById('p-name').value;
      const price = parseFloat(document.getElementById('p-price').value);
      const weight = document.getElementById('p-weight').value;
      const category = document.getElementById('p-category').value;
      let image = document.getElementById('p-image').value;

      if (!image) {
        image = `https://picsum.photos/seed/${name}/400/400`;
      }

      if (id) {
        // Update
        const index = adminState.products.findIndex(p => p.id === id);
        if (index > -1) {
          adminState.products[index] = { ...adminState.products[index], name, price, weight, category, image };
        }
      } else {
        // Create
        const newProduct = {
          id: `p_${Date.now()}`,
          name, price, weight, category, image,
          discount: 0
        };
        adminState.products.push(newProduct);
      }

      window.ProductService.save(adminState.products);
      renderAdminProducts();
      updateStats();
      window.closeProductModal();
    });
  }
}

window.editProduct = (id) => {
  const p = adminState.products.find(x => x.id === id);
  if (!p) return;

  document.getElementById('edit-id').value = p.id;
  document.getElementById('p-name').value = p.name;
  document.getElementById('p-price').value = p.price;
  document.getElementById('p-weight').value = p.weight;
  document.getElementById('p-category').value = p.category;
  document.getElementById('p-image').value = p.image;
  
  document.getElementById('modal-title').textContent = 'Edit Product';
  
  modal.classList.remove('hidden');
  setTimeout(() => {
    modal.classList.remove('opacity-0');
    modalContent.classList.remove('scale-95');
    modalContent.classList.add('scale-100');
  }, 10);
};

window.deleteProduct = (id) => {
  if(confirm('Are you sure you want to delete this product?')) {
    adminState.products = adminState.products.filter(p => p.id !== id);
    window.ProductService.save(adminState.products);
    renderAdminProducts();
    updateStats();
  }
};