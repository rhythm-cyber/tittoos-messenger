
import React, { useContext } from 'react';
import { AppContext } from '../../contexts/AppContext';

interface TypingIndicatorProps {
  chatId: string;
}

const TypingIndicator: React.FC<TypingIndicatorProps> = ({ chatId }) => {
  const { typingUsers, users } = useContext(AppContext)!;
  const currentTypingUsers = typingUsers[chatId] || [];

  if (currentTypingUsers.length === 0) return null;

  const getTypingNames = () => {
      const names = currentTypingUsers
          .map(userId => users.find(u => u.id === userId)?.name || 'Someone')
          .filter(name => name !== 'bot'); // Don't show the bot's name
          
      if(currentTypingUsers.includes('bot') && names.length === 0) {
        return 'The chat bot is typing';
      }

      if(names.length === 0) return null;
      if (names.length === 1) return `${names[0]} is typing`;
      if (names.length === 2) return `${names[0]} and ${names[1]} are typing`;
      return `${names.slice(0, 2).join(', ')} and others are typing`;
  }
  
  const typingText = getTypingNames();
  
  if(!typingText) return null;

  return (
    <div className="flex items-center gap-2 px-2 text-sm text-gray-400">
      <span>{typingText}</span>
      <div className="flex gap-1 items-end">
        <span className="w-1 h-1 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
        <span className="w-1 h-1 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
        <span className="w-1 h-1 bg-gray-400 rounded-full animate-bounce"></span>
      </div>
    </div>
  );
};

export default TypingIndicator;
