
import React, { useContext } from 'react';
import Sidebar from '../components/chat/Sidebar';
import ChatWindow from '../components/chat/ChatWindow';
import ChatHeader from '../components/chat/ChatHeader';
import { AppContext } from '../contexts/AppContext';
import CallView from '../components/chat/CallView';
import Modal from '../components/common/Modal';
import Avatar from '../components/chat/Avatar';

const ChatPage: React.FC = () => {
  const context = useContext(AppContext);

  const renderModalContent = () => {
    if (!context?.modalState.data) return null;
    const { type, data: user } = context.modalState;

    switch (type) {
      case 'userDetails':
        return (
          <div className="text-white space-y-4">
            <div className="flex flex-col items-center">
                <Avatar user={user} size="lg" />
                <p className="mt-4 text-2xl font-bold">{user.name}</p>
            </div>
            <div className="space-y-2 text-left">
              <p><strong className="text-[#FFDE59] w-20 inline-block">Email:</strong> {user.email}</p>
              <p><strong className="text-[#FFDE59] w-20 inline-block">Gender:</strong> {user.gender}</p>
              <p><strong className="text-[#FFDE59] w-20 inline-block">Status:</strong> {user.status}</p>
            </div>
          </div>
        );
      case 'profilePhoto':
        return (
          <div className="flex flex-col items-center">
            <img src={user.avatar.replace('150', '300')} alt={user.name} className="rounded-lg w-64 h-64 object-cover" />
            <p className="mt-4 text-xl font-bold text-white">{user.name}</p>
          </div>
        );
      default:
        return null;
    }
  };

  const getModalTitle = () => {
    if (!context?.modalState.type) return '';
    switch (context.modalState.type) {
      case 'userDetails': return 'User Details';
      case 'profilePhoto': return 'Profile Photo';
      default: return '';
    }
  };

  return (
    <>
      <div className="h-screen w-screen flex flex-col p-2 md:p-4 gap-2 md:gap-4 max-w-[1400px] mx-auto">
          <ChatHeader />
          {context?.callState.isActive ? (
            <CallView />
          ) : (
            <div className="flex-1 flex gap-2 md:gap-4 overflow-hidden">
                <Sidebar />
                <main className="flex-1 flex flex-col bg-[#3E1B6B]/50 rounded-lg border border-[#764ABC]/50 overflow-hidden">
                    {context?.activeChat ? (
                        <ChatWindow />
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
                            <i className="fa-solid fa-comments text-7xl text-[#FFDE59] mb-4"></i>
                            <h2 className="text-2xl font-bold text-white">Welcome to Tittoos!</h2>
                            <p className="text-gray-300 mt-2">Select a buddy or a room from the list on the left to start chatting.</p>
                            <p className="text-xs text-gray-400 mt-8">Remember the good old days? We do.</p>
                        </div>
                    )}
                </main>
            </div>
          )}
      </div>
      {context?.modalState.type && context.modalState.data && (
        <Modal
          isOpen={!!context.modalState.type}
          onClose={context.closeModal}
          title={getModalTitle()}
        >
          {renderModalContent()}
        </Modal>
      )}
    </>
  );
};

export default ChatPage;
