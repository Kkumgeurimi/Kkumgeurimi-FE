// src/layouts/AppShell.jsx
import React from 'react';
import { Outlet, useNavigate, useLocation, Link, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '../store/auth.store';
import { ROUTES } from '../config/constants';
import { NAV_ITEMS } from '../config/nav';
import BottomNavigation from '../components/BottomNavigation/BottomNavigation.jsx'
import logoutIcon from '../assets/icons/logout.svg';
import backIcon from '../assets/icons/back.svg';
import './AppShell.css';

const AppShell = () => {
  const { isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  const handleLogout = async () => {
    await logout();
    navigate(ROUTES.HOME);
  };

  // 뒤로가기 버튼 핸들러
  const handleBackToCareer = () => {
    setSearchParams({});
  };

  // 페이지별 제목 결정
  const getPageTitle = () => {
    if (pathname === ROUTES.HOME) {
      return '꿈그리미';
    }
    
    const currentNavItem = NAV_ITEMS.find(item => item.path === pathname);
    return currentNavItem ? currentNavItem.label : '꿈그리미';
  };

  const isHome = pathname === ROUTES.HOME;
  const isCareerMap = pathname === '/careermap';
  const isCareerDetail = isCareerMap && searchParams.get('interest');

  return (
  <div className="app-shell">
    {/* 헤더 */}
    <header className={`app-shell__header ${isCareerMap ? 'app-shell__header--transparent' : ''}`}>
      <div className="app-shell__header-content">
        <div className="app-shell__logo">
          {isCareerDetail ? (
            <div className="app-shell__back-section">
              <button className="app-shell__back-btn" onClick={handleBackToCareer}>
                <img src={backIcon} alt="뒤로가기" />
              </button>
              <span className="app-shell__page-title">{getPageTitle()}</span>
            </div>
          ) : pathname === ROUTES.HOME ? (
            <Link to={ROUTES.HOME} className="brand-wordmark">꿈그리미</Link>
          ) : (
            <span className="app-shell__page-title">{getPageTitle()}</span>
          )}
        </div>

        <div className="app-shell__actions">
          {isAuthenticated ? (
            <button className="app-shell__logout-btn" onClick={handleLogout}>
              <img src={logoutIcon} alt="로그아웃" className="app-shell__logout-icon" />
            </button>
          ) : (
            <button className="app-shell__signin-btn" onClick={() => navigate(ROUTES.SIGNIN)}>로그인</button>
          )}
        </div>
      </div>
    </header>

    {/* 메인 */}
    <main className={`app-shell__main ${isHome ? 'app-shell__main--home' : ''} ${isCareerMap ? 'app-shell__main--careermap' : ''}`}>
      <Outlet />
    </main>

    {/* 모바일 하단 네비 (모바일 전용) */}
    <div className="app-shell__bottomnav">
      <BottomNavigation />
    </div>
  </div>
);
};

export default AppShell;
