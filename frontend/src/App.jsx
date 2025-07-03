import { useState } from 'react';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import './App.css';


function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [cameraCount, setCameraCount] = useState(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    setLoggedIn(true);
  };

  const handleCameraSubmit = (e) => {
    e.preventDefault();
    const count = parseInt(e.target.elements.camcount.value);
    if (!isNaN(count) && count > 0) {
      setCameraCount(count);
    }
  };

  return (
    <div className="app-container">
      {!loggedIn && (
        <LoginPage
          username={username}
          setUsername={setUsername}
          password={password}
          setPassword={setPassword}
          onLogin={handleLogin}
        />
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