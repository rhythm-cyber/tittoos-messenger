
import React, { useContext } from 'react';
import LoginPage from './pages/LoginPage';
import ChatPage from './pages/ChatPage';
import { AppContext } from './contexts/AppContext';

const App: React.FC = () => {
  const context = useContext(AppContext);

  if (!context) {
    return <div>Loading...</div>;
  }
  
  const { currentUser } = context;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2D1654] via-[#200A49] to-[#12052C] text-white">
      {currentUser ? <ChatPage /> : <LoginPage />}
    </div>
  );
};

export default App;
