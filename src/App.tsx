import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import ProductDetails from './pages/ProductDetails';
import CartPage from './pages/CartPage';
import Checkout from './pages/Checkout';
import Favorites from './pages/Favorites';
import Footer from './components/Footer';
import NotFound from './pages/NotFound';
import OrderSuccess from './pages/PostOrder';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/order-success" element={<OrderSuccess />} />
           <Route path="*" element={<NotFound />} />
        </Routes>

        {/* Footer */}
        <Footer/>
      </div>
    </BrowserRouter>
  );
}

export default App;
