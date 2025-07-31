
import React, { useContext, useRef, useEffect, useState } from 'react';
import { AppContext } from '../../contexts/AppContext';
import Avatar from './Avatar';

const CallView: React.FC = () => {
  const context = useContext(AppContext);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);

  if (!context) return null;

  const { localStream, endCall, callState, users, rooms, currentUser } = context;

  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  const getParticipants = () => {
    if (!callState.chatId) return [];
    if (callState.type === 'voice' || callState.type === 'video') {
      const room = rooms.find(r => r.id === callState.chatId);
      if (room) {
        return users.filter(u => room.participants.includes(u.id) && u.id !== currentUser?.id);
      }
      const user = users.find(u => u.id === callState.chatId);
      return user ? [user] : [];
    }
    return [];
  };

  const participants = getParticipants();

  const handleToggleMute = () => {
    if (localStream) {
      localStream.getAudioTracks().forEach(track => (track.enabled = !track.enabled));
      setIsMuted(prev => !prev);
    }
  };

  const handleToggleVideo = () => {
    if (localStream && callState.type === 'video') {
      localStream.getVideoTracks().forEach(track => (track.enabled = !track.enabled));
      setIsVideoOff(prev => !prev);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-black rounded-lg border border-[#764ABC]/50 overflow-hidden relative">
      <div className="absolute top-4 left-4 text-white z-10">
        <h2 className="text-2xl font-bold">
            {callState.type === 'video' ? 'Video Call' : 'Voice Chat'}
        </h2>
        <p className="text-gray-300">
            {callState.type === 'video' && participants.length > 0 ? `with ${participants[0].name}` : 
             callState.type === 'voice' && participants.length > 0 ? `with ${participants.length + 1} participants` : 'Connecting...'}
        </p>
      </div>

      {/* Main content: remote streams or participant avatars */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 place-items-center overflow-y-auto">
        {/* NOTE: This is a simulation. A real app would use WebRTC to show remote streams. */}
        {participants.length > 0 ? participants.map(p => (
          <div key={p.id} className="flex flex-col items-center justify-center text-center p-4 bg-[#2D1654]/50 rounded-lg w-full h-full">
            <Avatar user={p} size="lg" />
            <p className="mt-2 font-bold text-white">{p.name}</p>
            <p className="text-sm text-gray-400">Connecting...</p>
          </div>
        )) : (
            <div className="text-gray-400">Waiting for others to join...</div>
        )}
      </div>

      {/* Local video feed */}
      {localStream && (
        <div className="absolute bottom-24 md:bottom-4 right-4 w-48 h-36 md:w-64 md:h-48 z-20">
          <video
            ref={localVideoRef}
            autoPlay
            muted
            playsInline
            className={`w-full h-full object-cover rounded-lg border-2 border-[#FFDE59] transition-opacity ${isVideoOff ? 'opacity-0' : 'opacity-100'}`}
          ></video>
          {isVideoOff && callState.type === 'video' && (
             <div className="absolute inset-0 bg-black flex items-center justify-center rounded-lg border-2 border-[#FFDE59]">
                <i className="fas fa-video-slash text-white text-3xl"></i>
             </div>
          )}
        </div>
      )}

      {/* Control bar */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-black/50 flex justify-center items-center gap-4 z-10">
        <button
          onClick={handleToggleMute}
          className={`w-16 h-16 rounded-full flex items-center justify-center transition-colors ${isMuted ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-600 hover:bg-gray-700'}`}
          aria-label={isMuted ? 'Unmute' : 'Mute'}
        >
          <i className={`fas ${isMuted ? 'fa-microphone-slash' : 'fa-microphone'} text-2xl text-white`}></i>
        </button>

        {callState.type === 'video' && (
          <button
            onClick={handleToggleVideo}
            className={`w-16 h-16 rounded-full flex items-center justify-center transition-colors ${isVideoOff ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-600 hover:bg-gray-700'}`}
            aria-label={isVideoOff ? 'Turn camera on' : 'Turn camera off'}
          >
            <i className={`fas ${isVideoOff ? 'fa-video-slash' : 'fa-video'} text-2xl text-white`}></i>
          </button>
        )}

        <button
          onClick={endCall}
          className="w-20 h-16 bg-red-600 hover:bg-red-700 rounded-full flex items-center justify-center transition-colors"
          aria-label="Hang up"
        >
          <i className="fas fa-phone-slash text-2xl text-white"></i>
        </button>
      </div>
    </div>
  );
};

export default CallView;
