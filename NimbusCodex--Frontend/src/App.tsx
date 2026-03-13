import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Lab from './pages/Lab';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/lab" element={<Lab />} />
      </Routes>
    </BrowserRouter>
  );
}
