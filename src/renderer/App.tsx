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
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    (async () => {
      const result = await sessionStorage.getItem('sessionId');
      if (result === 'locked') {
        setUser(false);
      }
      if (result) {
        const response = await window.electron.ipcRenderer.getUser(result);
        if (response.success) {
          setUser(response.user);
        }
      }
      setLoading(false);
    })();
  }, []);

  return (
    <Router>
      <Routes>
        {!loading ? (
          <>
            <Route element={<ProtectedRoute user={user} />}>
              <Route path="/" element={<Home />} />
            </Route>
            <Route
              path="/auth"
              element={<Auth setUser={setUser} user={user} />}
            />
          </>
        ) : (
          <Route path="*" element={<div></div>} />
        )}
      </Routes>
    </Router>
  );
}
