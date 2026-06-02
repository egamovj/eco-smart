import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import UserApp from './apps/user/UserApp';
import AdminApp from './apps/admin/AdminApp';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin/*"   element={<AdminApp />} />
        <Route path="/*"         element={<UserApp />} />
      </Routes>
    </BrowserRouter>
  );
}
