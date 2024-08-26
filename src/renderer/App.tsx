/* eslint-disable react/function-component-definition */
import {
  MemoryRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from 'react-router-dom';
import './App.css';
import { useEffect, useState } from 'react';
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

  useEffect(() => {
    console.log('useEffect');
    (async () => {
      console.log('async');
      const result = await sessionStorage.getItem('sessionId');
      console.log('result', result);
      if (result) {
        console.log('result', result);
        const response = await window.electron.ipcRenderer.getUser(result);
        if (response.success) {
          setUser(response.user);
        }
        console.log('response', response);
      }
      setUser(result);
    })();
  }, []);

  return (
    <Router>
      <Routes>
        <Route element={<ProtectedRoute user={user} />}>
          <Route path="/" element={<Home />} />
        </Route>
        <Route path="/auth" element={<Auth setUser={setUser} user={user} />} />
      </Routes>
    </Router>
  );
}
