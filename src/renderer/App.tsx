/* eslint-disable react/function-component-definition */
import {
  MemoryRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from 'react-router-dom';
import './App.css';
import { useState } from 'react';
import Home from './routes/Home';
import Auth from './routes/Auth';

const ProtectedRoute = ({ children, user }: any) => {
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return children || <Outlet />;
};

export default function App() {
  const [user, setUser] = useState<any>(null);
  return (
    <Router>
      <Routes>
        <Route element={<ProtectedRoute user={user} />}>
          <Route path="/" element={<Home />} />
        </Route>
        <Route path="/auth" element={<Auth setUser={setUser} />} />
      </Routes>
    </Router>
  );
}
