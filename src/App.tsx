import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import MyWardrobe from './pages/MyWardrobe';
import MyOutfits from './pages/MyOutfits';
import OutfitGenerator from './pages/OutfitGenerator';
import Trading from './pages/Trading';
import Search from './pages/Search';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/closet" element={<MyWardrobe />} />
            <Route path="/outfits" element={<MyOutfits />} />
            <Route path="/outfit-generator" element={<OutfitGenerator />} />
            <Route path="/trading" element={<Trading />} />
            <Route path="/search" element={<Search />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;