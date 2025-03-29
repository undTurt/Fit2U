import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import DigitalCloset from './pages/DigitalCloset';
import Auth from './pages/Auth';
import { useAuthStore } from './store/authStore';

function App() {
  const { loading } = useAuthStore();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/closet" element={<DigitalCloset />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;