// Google Analytics Setup for React (Vite)
// Place this in: src/App.tsx or src/App.jsx

import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { pageview } from './lib/analytics';

function App() {
  const location = useLocation();

  // Track page views on route change
  useEffect(() => {
    pageview(location.pathname + location.search);
  }, [location]);

  return <div className="App">{/* Your app components */}</div>;
}

export default App;
