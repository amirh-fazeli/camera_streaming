// src/pages/LoginPage.jsx
import React, { useState } from 'react';
import './LoginPage.css';
import { useTranslation } from 'react-i18next';

export default function LoginPage({ onLogin }) {
   const { t, i18n } = useTranslation();
   const [username, setUsername] = useState('');
   const [password, setPassword] = useState('');
   const [error, setError]     = useState('');

   const switchLang = () => {
     i18n.changeLanguage(i18n.language === 'en' ? 'fa' : 'en');
   };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    let body;
    try {
      const res = await fetch(`/auth/login`, 
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password }),
        }
      );
      body = await res.json();
      if (!res.ok) {
        setError(body.message || t('wrong_username_or_password'));
        return;
      }
    } catch (err) {
      setError(t('network_error'));
      return;
    }

    localStorage.setItem('jwt', body.token);
    localStorage.setItem('username', body.username || username);

    // tell the app we're now logged in
    onLogin();
  };

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <label>
        {t('username')}
        <input
          type="text"
          value={username}
          onChange={e => setUsername(e.target.value)}
        />
      </label>

      <label>
        {t('password')}
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
      </label>

      <button type="submit">{t('enter')}</button>
      {error && <p className="login-error">{error}</p>}

      <button type="button" onClick={switchLang}>
        🌐 Switch to {i18n.language === 'en' ? 'Persian' : 'English'}
      </button>
    </form>
  );
}
