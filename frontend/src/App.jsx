import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import Catalog from './pages/Catalog';
import Cart from './pages/Cart';

function App() {
  return (
    <Router>
      <CartProvider>
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
          <Navbar />
          <main className="flex-grow container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<Catalog />} />
              <Route path="/cart" element={<Cart />} />
            </Routes>
          </main>
          <footer className="bg-gray-800 text-white py-6 text-center text-sm">
            &copy; 2024 Wise Sales Mini E-commerce
          </footer>
        </div>
      </CartProvider>
    </Router>
  );
}

export default App;
