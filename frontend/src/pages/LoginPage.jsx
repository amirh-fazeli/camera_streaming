import './LoginPage.css';
import { useTranslation } from 'react-i18next';

function LoginPage({ username, setUsername, password, setPassword, onLogin }) {
  const { t, i18n } = useTranslation();

  const switchLang = () => {
    const newLang = i18n.language === 'en' ? 'fa' : 'en';
    i18n.changeLanguage(newLang);
  };

  return (
    <form className="login-form" onSubmit={onLogin}>
      <label>
        {t('username')}
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </label>

      <label>
        {t('password')}
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </label>

      <button type="submit">{t('enter')}</button>
      <button type="button" onClick={switchLang}>
        🌐 Switch to {i18n.language === 'en' ? 'Persian' : 'English'}
      </button>
    </form>
  );
}

export default LoginPage;