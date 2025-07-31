
import React, { useContext, useState } from 'react';
import { AppContext } from '../../contexts/AppContext';
import Avatar from './Avatar';
import { UserStatus } from '../../types';

const StatusOption: React.FC<{status: UserStatus, setStatus: (s: UserStatus) => void, icon: string, color: string, text: string}> = ({status, setStatus, icon, color, text}) => (
    <button
      onClick={() => setStatus(status)}
      className="flex items-center w-full px-4 py-2 text-sm text-left text-gray-200 hover:bg-[#764ABC]/50"
    >
      <i className={`fas ${icon} ${color} mr-3 w-4 text-center`}></i> {text}
    </button>
);

const ChatHeader: React.FC = () => {
  const context = useContext(AppContext);
  const [showStatusMenu, setShowStatusMenu] = useState(false);

  if (!context || !context.currentUser) return null;
  const { currentUser, logout, changeStatus } = context;

  const handleStatusChange = (status: UserStatus) => {
    changeStatus(status);
    setShowStatusMenu(false);
  };
  
  const getStatusInfo = (status: UserStatus) => {
    switch (status) {
      case UserStatus.Online: return { icon: 'fa-circle', color: 'text-green-500' };
      case UserStatus.Busy: return { icon: 'fa-minus-circle', color: 'text-red-500' };
      case UserStatus.Invisible: return { icon: 'fa-circle', color: 'text-gray-500' };
      default: return { icon: 'fa-circle', color: 'text-gray-500' };
    }
  };
  
  const statusInfo = getStatusInfo(currentUser.status);

  return (
    <header className="flex items-center justify-between p-3 bg-[#3E1B6B]/50 rounded-lg border border-[#764ABC]/50">
      <div className="flex items-center gap-4">
        <div className="relative">
          <button onClick={() => setShowStatusMenu(!showStatusMenu)} className="flex items-center gap-4">
            <Avatar user={currentUser} size="md" />
            <div>
              <h2 className="font-bold text-lg text-white text-left">{currentUser.name}</h2>
              <div className="flex items-center gap-2 text-sm text-gray-300">
                 <i className={`fas ${statusInfo.icon} ${statusInfo.color}`}></i>
                 <span>{currentUser.status}</span>
                 <i className="fas fa-chevron-down text-xs"></i>
              </div>
            </div>
          </button>
          {showStatusMenu && (
            <div 
              className="absolute top-full left-0 mt-2 w-64 bg-[#2D1654] border border-[#764ABC] rounded-md shadow-lg z-20"
              onMouseLeave={() => setShowStatusMenu(false)}
            >
              <div className="p-3 border-b border-[#764ABC]/50">
                  <div className="flex items-center gap-3">
                      <Avatar user={currentUser} size="md" />
                      <div>
                          <p className="font-bold text-white truncate">{currentUser.name}</p>
                          <p className="text-xs text-gray-400 truncate">{currentUser.email}</p>
                          <p className="text-xs text-gray-400 truncate">{currentUser.gender}</p>
                      </div>
                  </div>
              </div>
              <div className="py-1">
                  <p className="px-4 pt-2 pb-1 text-xs font-bold text-gray-500 uppercase">Set Status</p>
                  <StatusOption status={UserStatus.Online} setStatus={handleStatusChange} icon="fa-circle" color="text-green-500" text="Online" />
                  <StatusOption status={UserStatus.Busy} setStatus={handleStatusChange} icon="fa-minus-circle" color="text-red-500" text="Busy" />
                  <StatusOption status={UserStatus.Invisible} setStatus={handleStatusChange} icon="fa-circle" color="text-gray-500" text="Invisible" />
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="flex items-center gap-4">
        <h1 className="hidden md:block text-2xl font-bold text-center">
            <span className="text-white tracking-wider">Tittoos!</span>
            <span className="text-[#FFDE59]">Messenger</span>
        </h1>
      </div>
      <button
        onClick={logout}
        className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-bold rounded-lg transition-colors"
      >
        <i className="fas fa-sign-out-alt mr-2 hidden md:inline"></i>
        Sign Out
      </button>
    </header>
  );
};

export default ChatHeader;