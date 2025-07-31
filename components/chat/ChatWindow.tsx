
import React, { useContext, useEffect, useRef } from 'react';
import { AppContext } from '../../contexts/AppContext';
import MessageBubble from './MessageBubble';
import MessageInput from './MessageInput';
import TypingIndicator from './TypingIndicator';
import Avatar from './Avatar';
import { UserStatus } from '../../types';

const ChatWindow: React.FC = () => {
  const context = useContext(AppContext);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [context?.messages, context?.typingUsers]);

  if (!context || !context.activeChat) return null;

  const { activeChat, messages, users, currentUser, rooms, startCall, blockedUsers } = context;

  const chatMessages = messages.filter(m => m.chatId === activeChat.id && !blockedUsers.includes(m.senderId));

  const getChatPartner = () => {
    if (activeChat.type === 'user') {
      return users.find(u => u.id === activeChat.id);
    }
    return null;
  }

  const getRoom = () => {
    if (activeChat.type === 'room') {
      return rooms.find(r => r.id === activeChat.id);
    }
    return null;
  }

  const chatPartner = getChatPartner();
  const room = getRoom();

  const getStatusInfo = (status: UserStatus) => {
    switch (status) {
      case UserStatus.Online: return 'text-green-400';
      case UserStatus.Busy: return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full">
      <header className="p-4 border-b border-[#764ABC]/50 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          {chatPartner && <Avatar user={chatPartner} size="md" />}
          {room && <div className="w-10 h-10 rounded-full bg-[#764ABC] flex items-center justify-center font-bold text-xl text-[#FFDE59]">#</div>}
          <div>
              <h2 className="text-xl font-bold text-white">{activeChat.name}</h2>
              {chatPartner && <p className={`text-sm ${getStatusInfo(chatPartner.status)}`}>{chatPartner.status}</p>}
              {room && <p className="text-sm text-gray-400">{room.participants.length} members</p>}
          </div>
        </div>
        <div className="flex items-center gap-3">
            {activeChat.type === 'user' && (
                <>
                    <button onClick={() => startCall(activeChat.id, 'voice')} className="p-2 rounded-full hover:bg-[#764ABC]/50 transition-colors" aria-label="Start voice call">
                        <i className="fas fa-phone text-xl text-[#FFDE59]"></i>
                    </button>
                    <button onClick={() => startCall(activeChat.id, 'video')} className="p-2 rounded-full hover:bg-[#764ABC]/50 transition-colors" aria-label="Start video call">
                        <i className="fas fa-video text-xl text-[#FFDE59]"></i>
                    </button>
                </>
            )}
            {activeChat.type === 'room' && (
                <button onClick={() => startCall(activeChat.id, 'voice')} className="p-2 rounded-full hover:bg-[#764ABC]/50 transition-colors" aria-label="Join voice chat">
                    <i className="fas fa-phone-volume text-xl text-[#FFDE59]"></i>
                </button>
            )}
        </div>
      </header>
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {chatMessages.map(msg => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
        <TypingIndicator chatId={activeChat.id} />
        <div ref={messagesEndRef} />
      </div>
      <MessageInput chatId={activeChat.id} />
    </div>
  );
};

export default ChatWindow;
