import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-100 pt-16 pb-8 mt-auto">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-1 md:col-span-1">
            <div className="text-2xl font-extrabold tracking-tighter text-secondary mb-4">
              BUY<span className="text-primary">IT</span>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed">
              Premium groceries delivered in minutes. 
              Freshness guaranteed or your money back.
            </p>
          </div>
          
          <div>
            <h4 className="font-bold text-secondary mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><a href="#" className="hover:text-primary transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Blog</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-secondary mb-4">Help</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><a href="#" className="hover:text-primary transition-colors">Support Center</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-secondary mb-4">Newsletter</h4>
            <div className="flex gap-2">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="bg-gray-100 rounded-xl px-4 py-2 text-sm w-full outline-none focus:ring-2 focus:ring-primary"
              />
              <button className="bg-secondary text-white rounded-xl px-4 py-2 text-sm font-bold hover:bg-black">
                →
              </button>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-400">
          <p>© 2024 BUYIT Inc. All rights reserved.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <span>Instagram</span>
            <span>Twitter</span>
            <span>Facebook</span>
          </div>
        </div>
      </div>
    </footer>
  );
};