import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Home from './pages/Home';
import Lab from './pages/Lab';
import Auth from './pages/Auth/Auth';
import AuthGuard from './components/AuthGuard';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route 
            path="/lab" 
            element={
              <AuthGuard>
                <Lab />
              </AuthGuard>
            } 
          />
          <Route path="/login" element={<Auth />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
