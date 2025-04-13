import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Map from "./Map/Map";
import scss from "./style.module.scss";
import Icon from "./modified_icons/icon";
import { left_arrow } from "./modified_icons/ICONS";
import Panel from "./Panel/Panel";
import { useState } from "react";
import { ConfigProvider, Button } from 'antd';
import LoginPage from './components/LoginPage';  // Import your LoginPage component
import RegisterPage from './components/RegisterPage';  // Import your RegisterPage component
import "./index.scss";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [panelOpened, setPanelOpened] = useState<boolean>(false);

  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/login'); // Navigate to the login page
  };

  const handleRegister = () => {
    navigate('/register'); // Navigate to the register page
  };

  return (
    <ConfigProvider
      button={{
        style: {}
      }}
      collapse={{
        style: { outline: "none", userSelect: "none" }
      }}
    >
      <div className={scss.container}>
        <div className={scss.container2}>
          {/* Check if the user is logged in */}
          <>
            {/* Кнопки авторизації показуються, якщо користувач не залогінений */}
            {!isLoggedIn && (
              <div className={scss.authContainer}>
                <Button className={scss.authButton} onClick={handleLogin}>
                  Log In
                </Button>
                <Button className={scss.authButton} onClick={handleRegister}>
                  Register
                </Button>
              </div>
            )}

            {/* Карта та панель завжди доступні */}
            <Map />
            <div>
              <Icon
                className={scss.panelToggle}
                path={left_arrow}
                onClick={() => {
                  setPanelOpened(true);
                }}
              />
            </div>
            <Panel opened={panelOpened} setOpened={setPanelOpened} />
          </>
        </div>
      </div>
    </ConfigProvider>
  );
}

function AppWithRouter() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage/>} />
      </Routes>
    </Router>
  );
}

export default AppWithRouter;
