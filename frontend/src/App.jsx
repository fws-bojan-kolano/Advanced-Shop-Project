
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import UserContextProvider from './components/user/user-context';
import { CartContextProvider } from './components/cart/cart-context';
import { Suspense, lazy } from 'react';
import Header from './components/header/Header';
import Footer from './components/footer/Footer';

// Lazy load pages
const PageHome = lazy(() => import(/* webpackPrefetch: true */ './pages/PageHome'));
const PageAbout = lazy(() => import(/* webpackPrefetch: true */ './pages/PageAbout'));
const PageDashboard = lazy(() => import('./pages/PageDashboard'));
const PageSingleProduct = lazy(() => import('./pages/PageSingleProduct'));
const PageCart = lazy(() => import('./pages/PageCart'));
const PageProductListing = lazy(() => import('./pages/PageProductListing'));
const PageCheckout = lazy(() => import('./pages/pageCheckout'));
const PageThankYou = lazy(() => import('./pages/PageThankYou'));
const SingleOrder = lazy(() => import('./components/singleOrder/SingleOrder'));
const Products = lazy(() => import('./components/products/Products'));

function App() {
  return (
    <>
      <UserContextProvider>
        <CartContextProvider>
          <div className='main'>
            <BrowserRouter>
              <Header />
              <Suspense fallback={<div>Loading...</div>}>
                <Routes>
                  <Route path="/" element={<PageHome />} />
                  <Route path="/about" element={<PageAbout />} />
                  <Route path="/shop" element={<PageProductListing />} />
                  <Route path="/dashboard/*" element={<PageDashboard />} />
                  <Route path="/product/:id" element={<PageSingleProduct />} />
                  <Route path="/cart" element={<PageCart />} />
                  <Route path="/checkout" element={<PageCheckout />} />
                  <Route path="/thank-you" element={<PageThankYou />} />
                  <Route path="/order/:orderId" element={<SingleOrder />} />
                  <Route path="/category/:categoryName" element={<Products />} />
                  <Route path="/products" element={<Products />} />
                </Routes>
              </Suspense>
              <Footer />
            </BrowserRouter>
          </div>
        </CartContextProvider>
      </UserContextProvider>
    </>
  )
}

export default App
