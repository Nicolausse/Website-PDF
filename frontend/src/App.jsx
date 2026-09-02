import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ToolPage from './pages/ToolPage';
import { checkHealth } from './services/api';

export function App() {
  const [currentToolId, setCurrentToolId] = useState(null);
  const [currentCategory, setCurrentCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [serverStatus, setServerStatus] = useState('checking');
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark' || 
      (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  // Theme synchronization
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  // URL Hash Routing Support
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#/tool/')) {
        const id = hash.replace('#/tool/', '');
        setCurrentToolId(id);
      } else if (hash.startsWith('#/category/')) {
        const cat = hash.replace('#/category/', '');
        setCurrentCategory(cat);
        setCurrentToolId(null);
      } else {
        setCurrentToolId(null);
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Health check ping
  useEffect(() => {
    const ping = async () => {
      const res = await checkHealth();
      setServerStatus(res.status === 'online' ? 'online' : 'offline');
    };
    ping();
    const interval = setInterval(ping, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleSelectTool = (id) => {
    window.location.hash = `#/tool/${id}`;
    setCurrentToolId(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectCategory = (catId) => {
    setCurrentCategory(catId);
    if (currentToolId) {
      window.location.hash = `#/category/${catId}`;
      setCurrentToolId(null);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGoHome = () => {
    window.location.hash = '#/';
    setCurrentToolId(null);
    setSearchQuery('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 bg-grid-pattern transition-colors duration-200">
      {/* Top Navbar */}
      <Navbar
        currentTab={currentCategory}
        onSelectCategory={handleSelectCategory}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        isDarkMode={isDarkMode}
        toggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        onGoHome={handleGoHome}
        serverStatus={serverStatus}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentToolId ? (
          <ToolPage
            toolId={currentToolId}
            onGoHome={handleGoHome}
            onSelectTool={handleSelectTool}
          />
        ) : (
          <HomePage
            currentCategory={currentCategory}
            onSelectCategory={handleSelectCategory}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onSelectTool={handleSelectTool}
          />
        )}
      </main>

      {/* Footer */}
      <Footer onSelectTool={handleSelectTool} />
    </div>
  );
}

export default App;
