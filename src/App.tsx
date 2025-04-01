import { useState, useEffect, use } from 'react';
import { FaHome, FaUsers, FaTrophy, FaPencilAlt, FaTrash } from 'react-icons/fa';
import { FiSun, FiMoon } from 'react-icons/fi';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { TeamSelection } from './components/TeamSelection';
import { TeamPlayers } from './components/TeamPlayers';
import { Teams } from './pages/Teams';
import { Standings } from './pages/Standings';
import SplashScreen from './components/SplashScreen';
import PageTransition from './components/PageTransition';
import { Footer } from './components/Footer';
import { fetchHomeContent, type HomeContent } from './services/api';
import './App.css';

type Page = 'home' | 'teams' | 'standings';

function Layout() {
  const { theme, toggleTheme } = useTheme();
  const [showTeamSelection, setShowTeamSelection] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<string | null>(() => {
    return localStorage.getItem('selectedTeamId');
  });
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [isPageVisible, setIsPageVisible] = useState(true);
  const [homeContent, setHomeContent] = useState<HomeContent | null>(null);
  const [homeLoading, setHomeLoaading] = useState(true);
  const [homeError, setHomeError] = useState<string | null>(null);

  useEffect(() => {
    const loadHomeContent = async () => {
      try {
        const content = await fetchHomeContent();
        setHomeContent(content);
        setHomeLoaading(false);
      } catch (error) {
        console.error(error);
        setHomeError('Failed to load content');
        setHomeLoaading(false);
      }
    };

    if (currentPage === 'home') {
      loadHomeContent();
    }
  }, [currentPage]);

  useEffect(() => {
    setIsPageVisible(false);
    const timer = setTimeout(() => {
      setIsPageVisible(true);
    }, 50);
    return () => clearTimeout(timer);
  }, [currentPage, showTeamSelection]);

  const handleTeamSelect = (teamId: string) => {
    setSelectedTeam(teamId);
    localStorage.setItem('selectedTeamId', teamId);
    setShowTeamSelection(false);
  };

  const handleCancel = () => {
    setShowTeamSelection(false);
  };

  const handleClearTeam = () => {
    setSelectedTeam(null);
    localStorage.removeItem('selectedTeamId');
  };

  const handlePageChange = (page: Page) => {
    if (page === currentPage) return;

    setIsPageVisible(false);
    setTimeout(() => {
      setCurrentPage(page);
    }, 300);
  };

  const cleanContent = (content: string) => {
    return content.replace(/\\n/g, '').replace(/\/n\/n\/n\/n/g, '');
  };

  const renderPage = () => {
    if (showTeamSelection) {
      return (
        <PageTransition isVisible={isPageVisible}>
          <TeamSelection onSelectTeam={handleTeamSelect} onCancel={handleCancel} />
        </PageTransition>
      );
    }

    const content = (() => {
      switch (currentPage) {
        case 'home':
          return (
            <div className="container">
              <div className="home-header">
                <h1 className="page-title">
                  {homeLoading ? 'Loading...' : homeError ? 'Error' : homeContent?.title.rendered || 'Welcome to Hockey Stats'}
                </h1>
                {selectedTeam && (
                  <div className="team-actions">
                    <span className="team-actions-hint">Edit or clear your team selection</span>
                    <button className="icon-button" onClick={() => setShowTeamSelection(true)} title="Edit Team Selection">
                      <FaPencilAlt />
                    </button>
                    <button className="icon-button danger" onClick={handleClearTeam} title="Remove Team">
                      <FaTrash />
                    </button>
                  </div>
                )}
              </div>
              {homeContent  && (
                <div 
                  className="page-content"
                  dangerouslySetInnerHTML={{__html: cleanContent(homeContent.content.rendered)}}
                  />
              )}
              {!selectedTeam && (
                <button className="select-team-button" onClick={() => setShowTeamSelection(true)}>
                  Select Team
                </button>
              )}
              {selectedTeam && <TeamPlayers teamId={selectedTeam} />}
            </div>
          );
        case 'teams':
          return <Teams />;
        case 'standings':
          return <Standings />;
        default:
          return null;
      }
    })();

    return (
      <PageTransition isVisible={isPageVisible}>
        {content}
      </PageTransition>
    );
  };

  return (
    <div className="app">
      <SplashScreen />
      <nav className="sidebar">
        <img src="/logo.svg" alt="Hockey Logo" className="logo" />
        <div className="nav-items">
          <div
            className={`nav-item ${currentPage === 'home' ? 'active' : ''}`}
            onClick={() => handlePageChange('home')}
          >
            <FaHome />
          </div>
          <div
            className={`nav-item ${currentPage === 'teams' ? 'active' : ''}`}
            onClick={() => handlePageChange('teams')}
          >
            <FaUsers />
          </div>
          <div
            className={`nav-item ${currentPage === 'standings' ? 'active' : ''}`}
            onClick={() => handlePageChange('standings')}
          >
            <FaTrophy />
          </div>
        </div>
        <button
          className="theme-toggle"
          data-theme={theme}
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          <FiSun className="icon" />
          <FiMoon className="icon" />
        </button>
      </nav>
      
      <main className="main-content">
        {renderPage()}
        <Footer />
      </main>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <Layout />
    </ThemeProvider>
  );
}

export default App;
