
import React, { useContext, useState } from 'react';
import { AppContext } from '../../contexts/AppContext';
import { User, UserStatus } from '../../types';
import Avatar from './Avatar';
import ContextMenu from '../common/ContextMenu';

const BuddyList: React.FC = () => {
  const context = useContext(AppContext);
  const [contextMenu, setContextMenu] = useState<{ x: number, y: number, show: boolean, user: User | null }>({ x: 0, y: 0, show: false, user: null });

  if (!context || !context.currentUser) return null;

  const { currentUser, users, switchChat, activeChat, blockedUsers, mutedUsers, toggleBlockUser, toggleMuteUser, openModal } = context;

  const handleContextMenu = (e: React.MouseEvent, user: User) => {
    e.preventDefault();
    setContextMenu({ x: e.pageX, y: e.pageY, show: true, user });
  };

  const closeContextMenu = () => {
    setContextMenu({ x: 0, y: 0, show: false, user: null });
  };

  const friends = users.filter(u => currentUser.friends.includes(u.id) && !blockedUsers.includes(u.id));
  const onlineFriends = friends.filter(f => f.status === UserStatus.Online || f.status === UserStatus.Busy);
  const offlineFriends = friends.filter(f => f.status === UserStatus.Offline || f.status === UserStatus.Invisible);

  const contextMenuItems = contextMenu.user ? [
    { label: 'User Details', icon: 'fa-user-circle', onClick: () => openModal('userDetails', contextMenu.user!) },
    { label: 'View Profile Photo', icon: 'fa-image', onClick: () => openModal('profilePhoto', contextMenu.user!) },
    { label: mutedUsers.includes(contextMenu.user.id) ? 'Unmute' : 'Mute', icon: 'fa-bell-slash', onClick: () => toggleMuteUser(contextMenu.user!.id) },
    { label: 'Block', icon: 'fa-ban', onClick: () => toggleBlockUser(contextMenu.user!.id), className: 'text-red-400 hover:bg-red-500/50' },
  ] : [];

  const renderFriend = (friend: User) => (
    <li key={friend.id}>
      <button 
        onClick={() => switchChat(friend.id, 'user')}
        onContextMenu={(e) => handleContextMenu(e, friend)}
        className={`w-full flex items-center p-2 rounded-md transition-colors text-left ${activeChat?.id === friend.id ? 'bg-[#764ABC]' : 'hover:bg-[#764ABC]/50'}`}
      >
        <Avatar user={friend} size="sm" />
        <span className={`ml-3 font-medium truncate ${friend.status === UserStatus.Offline || friend.status === UserStatus.Invisible ? 'text-gray-400' : 'text-white'}`}>{friend.name}</span>
        {mutedUsers.includes(friend.id) && <i className="fas fa-bell-slash text-gray-500 ml-auto mr-2"></i>}
      </button>
    </li>
  );

  return (
    <>
      <div className="p-2 space-y-4">
        <div>
          <h3 className="px-2 text-sm font-bold text-[#FFDE59] uppercase tracking-wider">Online ({onlineFriends.length})</h3>
          <ul className="mt-1 space-y-1">
            {onlineFriends.map(renderFriend)}
          </ul>
        </div>
        <div>
          <h3 className="px-2 text-sm font-bold text-[#FFDE59] uppercase tracking-wider">Offline ({offlineFriends.length})</h3>
          <ul className="mt-1 space-y-1">
            {offlineFriends.map(renderFriend)}
          </ul>
        </div>
      </div>
      <ContextMenu 
        x={contextMenu.x}
        y={contextMenu.y}
        show={contextMenu.show}
        onClose={closeContextMenu}
        items={contextMenuItems}
      />
    </>
  );
};

export default BuddyList;
