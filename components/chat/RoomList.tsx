import React, { useContext, useState } from 'react';
import { AppContext } from '../../contexts/AppContext';
import { Room } from '../../types';

interface CollapsibleSectionProps {
  title: string;
  rooms: Room[];
  icon: string;
}

const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({ title, rooms, icon }) => {
    const [isOpen, setIsOpen] = useState(true);
    const { switchChat, activeChat } = useContext(AppContext)!;

    return (
        <div>
            <button onClick={() => setIsOpen(!isOpen)} className="w-full flex justify-between items-center px-2 py-1 text-sm font-bold text-[#FFDE59] uppercase tracking-wider">
                <span><i className={`${icon} mr-2`}></i>{title}</span>
                <i className={`fas fa-chevron-down transition-transform ${isOpen ? 'rotate-180' : ''}`}></i>
            </button>
            {isOpen && (
                <ul className="mt-1 space-y-1">
                    {rooms.map(room => (
                        <li key={room.id}>
                            <button
                                onClick={() => switchChat(room.id, 'room')}
                                className={`w-full text-left p-2 pl-4 rounded-md transition-colors text-white flex justify-between items-center ${activeChat?.id === room.id ? 'bg-[#764ABC]' : 'hover:bg-[#764ABC]/50'}`}
                            >
                                <span className="truncate pr-2"># {room.name}</span>
                                {room.participants.length > 0 && (
                                    <span className="flex-shrink-0 text-xs text-gray-300 bg-[#2D1654] px-2 py-0.5 rounded-full">
                                        {room.participants.length}
                                    </span>
                                )}
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};


const RoomList: React.FC = () => {
  const context = useContext(AppContext);

  if (!context) return null;

  const { rooms } = context;

  const mainLobbyRooms = rooms.filter(r => r.type === 'main_lobby');
  const stateRooms = rooms.filter(r => r.id.startsWith('room-state-'));
  const languageRooms = rooms.filter(r => r.id.startsWith('room-lang-'));


  return (
    <div className="p-2 space-y-4">
        <CollapsibleSection title="Main Lobbies" rooms={mainLobbyRooms} icon="fas fa-globe-americas" />
        <CollapsibleSection title="Indian States" rooms={stateRooms} icon="fas fa-map-marker-alt" />
        <CollapsibleSection title="Languages" rooms={languageRooms} icon="fas fa-language" />
    </div>
  );
};

export default RoomList;