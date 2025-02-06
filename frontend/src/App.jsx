import PageHome from './pages/PageHome';
import PageDashboard from './pages/PageDashboard';
import Header from './components/header/Header';
import Footer from './components/footer/Footer';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import UserContextProvider from './components/user/user-context';

function App() {

  return (
    <>
      <UserContextProvider>
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
      </UserContextProvider>
    </>
  )
}

export default App
