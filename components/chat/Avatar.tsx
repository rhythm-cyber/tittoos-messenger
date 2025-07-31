
import React from 'react';
import { User, UserStatus } from '../../types';

interface AvatarProps {
  user: User;
  size?: 'sm' | 'md' | 'lg';
}

const Avatar: React.FC<AvatarProps> = ({ user, size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  };

  const statusColor = {
    [UserStatus.Online]: 'bg-green-500',
    [UserStatus.Busy]: 'bg-red-500',
    [UserStatus.Invisible]: 'bg-gray-500',
    [UserStatus.Offline]: 'bg-gray-500',
  };

  const statusPosition = {
      sm: 'bottom-0 right-0 w-2.5 h-2.5',
      md: 'bottom-0 right-0 w-3.5 h-3.5',
      lg: 'bottom-1 right-1 w-4 h-4',
  }

  return (
    <div className={`relative flex-shrink-0 ${sizeClasses[size]}`}>
      <img
        src={user.avatar}
        alt={user.name}
        className="w-full h-full rounded-full object-cover border-2 border-[#764ABC]"
      />
      {user.status !== UserStatus.Offline && (
        <span className={`absolute ${statusPosition[size]} ${statusColor[user.status]} rounded-full border-2 border-[#3E1B6B]`}></span>
      )}
    </div>
  );
};

export default Avatar;
