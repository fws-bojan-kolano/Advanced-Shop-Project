import PageHome from './pages/PageHome';
import PageAbout from './pages/PageAbout';
import PageDashboard from './pages/PageDashboard';
import PageSingleProduct from './pages/PageSingleProduct';
import PageCart from './pages/PageCart';
import Header from './components/header/Header';
import Footer from './components/footer/Footer';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import UserContextProvider from './components/user/user-context';
import { CartContextProvider } from './components/cart/cart-context';
import PageProductListing from './pages/PageProductListing';
import PageCheckout from './pages/pageCheckout';

function App() {

  return (
    <>
      <UserContextProvider>
        <CartContextProvider>
          <div className='main'>
            <BrowserRouter>
              <Header />
              <Routes>
                <Route path="/" element={<PageHome />} />
                <Route path="/about" element={<PageAbout />} />
                <Route path="/shop" element={<PageProductListing />} />
                <Route path="/dashboard/*" element={<PageDashboard />} />
                <Route path="/product/:id" element={<PageSingleProduct />} />
                <Route path="/cart" element={<PageCart />} />
                <Route path="/checkout" element={<PageCheckout />} />
              </Routes>
              <Footer />
            </BrowserRouter>
          </div>
        </CartContextProvider>
      </UserContextProvider>
    </>
  )
}

export default App
