// src/App.jsx
import { useState } from 'react';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import './App.css';

function App() {
  const [loggedIn, setLoggedIn]     = useState(false);
  const [username, setUsername]     = useState('');
  const [cameraCount, setCameraCount] = useState(null);

  // called with (username) when login succeeds
  const handleLogin = (user) => {
    setUsername(user);
    setLoggedIn(true);
  };

  const handleCameraSubmit = (e) => {
    e.preventDefault();
    const count = parseInt(e.target.elements.camcount.value, 10);
    if (!isNaN(count) && count > 0) {
      setCameraCount(count);
    }
  };

  return (
    <div className="app-container">
      {!loggedIn && (
        <LoginPage onLogin={handleLogin} />
      )}

      {loggedIn && cameraCount === null && (
        <Dashboard onSubmit={handleCameraSubmit} />
      )}

      {cameraCount !== null && (
        <Dashboard cameraCount={cameraCount} />
      )}
    </div>
  );
}

export default App;
