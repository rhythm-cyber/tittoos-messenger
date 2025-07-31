
import React, { useState } from 'react';
import BuddyList from './BuddyList';
import RoomList from './RoomList';

const Sidebar: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'buddies' | 'rooms'>('buddies');

    return (
        <aside className="w-1/3 md:w-1/4 lg:w-1/5 flex flex-col bg-[#3E1B6B]/50 rounded-lg border border-[#764ABC]/50 overflow-hidden">
            <div className="flex border-b border-[#764ABC]/50">
                <button 
                    onClick={() => setActiveTab('buddies')}
                    className={`flex-1 p-3 text-sm font-bold transition-colors ${activeTab === 'buddies' ? 'bg-[#FFDE59] text-[#3E1B6B]' : 'bg-transparent text-gray-300 hover:bg-[#764ABC]/30'}`}
                >
                    <i className="fas fa-user-friends mr-2"></i> Buddies
                </button>
                <button 
                    onClick={() => setActiveTab('rooms')}
                    className={`flex-1 p-3 text-sm font-bold transition-colors ${activeTab === 'rooms' ? 'bg-[#FFDE59] text-[#3E1B6B]' : 'bg-transparent text-gray-300 hover:bg-[#764ABC]/30'}`}
                >
                   <i className="fas fa-door-open mr-2"></i> Rooms
                </button>
            </div>
            <div className="flex-1 overflow-y-auto">
                {activeTab === 'buddies' ? <BuddyList /> : <RoomList />}
            </div>
        </aside>
    );
};

export default Sidebar;
