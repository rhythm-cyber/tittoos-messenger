import React, { useContext } from 'react';
import { AppContext } from '../../contexts/AppContext';
import { Message } from '../../types';
import Avatar from './Avatar';
import { format } from 'date-fns';

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const context = useContext(AppContext);
  const { currentUser, users } = context!;

  const isCurrentUser = message.senderId === currentUser?.id;
  const sender = users.find(u => u.id === message.senderId);

  if (!sender) return null;

  return (
    <div className={`flex items-start gap-3 ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
      {!isCurrentUser && <Avatar user={sender} size="sm" />}
      <div className={`flex flex-col ${isCurrentUser ? 'items-end' : 'items-start'}`}>
        <div className={`p-2 rounded-2xl max-w-xs md:max-w-md ${isCurrentUser ? 'bg-[#764ABC] rounded-br-none' : 'bg-[#2D1654] rounded-bl-none'}`}>
          {!isCurrentUser && <p className="text-sm font-bold text-[#FFDE59] mb-1 px-2">{sender.name}</p>}
          
          {message.imageUrl && (
            <img src={message.imageUrl} alt="Sent content" className="rounded-lg max-h-64 object-cover w-full cursor-pointer" onClick={() => window.open(message.imageUrl, '_blank')} />
          )}
          
          {message.text && (
            <p className="text-white whitespace-pre-wrap px-2 py-1">{message.text}</p>
          )}
        </div>
        <p className="text-xs text-gray-400 mt-1">{format(new Date(message.timestamp), 'p')}</p>
      </div>
    </div>
  );
};

export default MessageBubble;
