import React, { useState } from 'react';
import { Button } from '../components/Button';
import { Lock } from 'lucide-react';

interface AdminLoginProps {
  onLogin: () => void;
  onBack: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLogin, onBack }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'admin' && password === 'admin') {
      onLogin();
    } else {
      setError('Invalid credentials. Try admin/admin');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 md:p-12">
        <div className="flex justify-center mb-8">
          <div className="bg-primary/20 p-4 rounded-full">
            <Lock className="text-yellow-700" size={32} />
          </div>
        </div>
        <h2 className="text-3xl font-extrabold text-center text-secondary mb-2">Admin Portal</h2>
        <p className="text-center text-gray-400 mb-8">Please sign in to continue</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-primary focus:bg-white outline-none transition-all"
              placeholder="Enter username"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-primary focus:bg-white outline-none transition-all"
              placeholder="••••••••"
            />
          </div>
          
          {error && <p className="text-red-500 text-sm font-medium text-center">{error}</p>}

          <Button type="submit" size="lg" className="w-full">Sign In</Button>
          <button type="button" onClick={onBack} className="w-full text-sm text-gray-400 hover:text-gray-600 font-medium">
            Back to Store
          </button>
        </form>
      </div>
    </div>
  );
};