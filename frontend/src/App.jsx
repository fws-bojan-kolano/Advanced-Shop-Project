import PageHome from './pages/PageHome';
import PageDashboard from './pages/PageDashboard';
import Header from './components/header/Header';
import Footer from './components/footer/Footer';
import { Routes, Route, BrowserRouter } from 'react-router-dom';

function App() {

  return (
    <>
      <div className='main'>
        <BrowserRouter>
          <Header />
          <Routes>
            <Route path="/" element={<PageHome />} />
            <Route path="/dashboard" element={<PageDashboard />} />
          </Routes>
          <Footer />
        </BrowserRouter>
      </div>
    </>
  )
}

export default App
