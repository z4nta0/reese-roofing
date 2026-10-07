import { Routes, Route } from 'react-router-dom';
import Home from './pages/home/home';
import NotFound from './pages/not-found/not-found';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
