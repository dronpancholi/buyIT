import React, { useState } from 'react';
import { Product } from '../types';
import { Button } from '../components/Button';
import { Edit2, Trash2, Plus, X, Image as ImageIcon } from 'lucide-react';
import { INITIAL_CATEGORIES } from '../constants';

interface AdminProductsProps {
  products: Product[];
  onUpdateProducts: (products: Product[]) => void;
}

const emptyProduct: Omit<Product, 'id'> = {
  name: '',
  price: 0,
  category: 'Fruits & Veg',
  weight: '',
  image: '',
  discount: 0
};

export const AdminProducts: React.FC<AdminProductsProps> = ({ products, onUpdateProducts }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Partial<Product>>({});
  
  const handleEdit = (product: Product) => {
    setCurrentProduct(product);
    setIsEditing(true);
  };

  const handleAddNew = () => {
    setCurrentProduct(emptyProduct);
    setIsEditing(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      onUpdateProducts(products.filter(p => p.id !== id));
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentProduct.name || !currentProduct.price) return;

    if (currentProduct.id) {
      // Update existing
      onUpdateProducts(products.map(p => (p.id === currentProduct.id ? currentProduct as Product : p)));
    } else {
      // Create new
      const newProduct = {
        ...currentProduct,
        id: `p_${Date.now()}`,
        image: currentProduct.image || `https://picsum.photos/seed/${currentProduct.name}/400/400`
      } as Product;
      onUpdateProducts([...products, newProduct]);
    }
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-secondary">{currentProduct.id ? 'Edit Product' : 'Add New Product'}</h2>
          <button onClick={() => setIsEditing(false)} className="p-2 hover:bg-gray-100 rounded-full"><X size={24} /></button>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Product Name</label>
              <input 
                type="text" 
                required
                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-primary outline-none"
                value={currentProduct.name || ''}
                onChange={e => setCurrentProduct({...currentProduct, name: e.target.value})}
              />
            </div>
             <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Weight/Qty</label>
              <input 
                type="text" 
                required
                placeholder="e.g. 1kg, 2pcs"
                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-primary outline-none"
                value={currentProduct.weight || ''}
                onChange={e => setCurrentProduct({...currentProduct, weight: e.target.value})}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Price ($)</label>
              <input 
                type="number" 
                step="0.01"
                required
                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-primary outline-none"
                value={currentProduct.price || ''}
                onChange={e => setCurrentProduct({...currentProduct, price: parseFloat(e.target.value)})}
              />
            </div>
             <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Discount (%)</label>
              <input 
                type="number" 
                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-primary outline-none"
                value={currentProduct.discount || 0}
                onChange={e => setCurrentProduct({...currentProduct, discount: parseInt(e.target.value)})}
              />
            </div>
          </div>

          <div>
             <label className="block text-sm font-bold text-gray-700 mb-2">Category</label>
             <select 
              className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-primary outline-none appearance-none"
              value={currentProduct.category}
              onChange={e => setCurrentProduct({...currentProduct, category: e.target.value})}
             >
               {INITIAL_CATEGORIES.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
             </select>
          </div>

          <div>
             <label className="block text-sm font-bold text-gray-700 mb-2">Image URL</label>
             <div className="flex gap-4">
               <input 
                  type="text" 
                  className="flex-1 px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-primary outline-none"
                  placeholder="https://..."
                  value={currentProduct.image || ''}
                  onChange={e => setCurrentProduct({...currentProduct, image: e.target.value})}
                />
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                  {currentProduct.image ? (
                    <img src={currentProduct.image} className="w-full h-full object-cover" />
                  ) : <ImageIcon size={20} className="text-gray-400" />}
                </div>
             </div>
             <p className="text-xs text-gray-400 mt-2">Leave empty to auto-generate from picsum</p>
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
            <Button type="submit">Save Product</Button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-secondary">Product Management</h2>
          <p className="text-gray-500">Manage your inventory</p>
        </div>
        <Button onClick={handleAddNew} className="flex gap-2">
          <Plus size={20} /> Add Product
        </Button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-sm">
                <th className="p-4 font-bold rounded-tl-2xl">Product</th>
                <th className="p-4 font-bold">Category</th>
                <th className="p-4 font-bold">Price</th>
                <th className="p-4 font-bold">Weight</th>
                <th className="p-4 font-bold rounded-tr-2xl text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.map(product => (
                <tr key={product.id} className="hover:bg-gray-50 transition-colors group">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img src={product.image} alt={product.name} className="w-10 h-10 rounded-lg object-cover bg-gray-100" />
                      <span className="font-bold text-secondary">{product.name}</span>
                      {product.discount && <span className="bg-red-100 text-red-600 text-[10px] font-bold px-1.5 py-0.5 rounded">{product.discount}%</span>}
                    </div>
                  </td>
                  <td className="p-4 text-sm text-gray-500">{product.category}</td>
                  <td className="p-4 font-bold text-secondary">${product.price.toFixed(2)}</td>
                  <td className="p-4 text-sm text-gray-500">{product.weight}</td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleEdit(product)} className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <Edit2 size={18} />
                      </button>
                      <button onClick={() => handleDelete(product.id)} className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};