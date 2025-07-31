import React, { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { User, Room, Message, UserStatus, ActiveChat, CallState, ModalState } from '../types';
import { INITIAL_USERS, INITIAL_ROOMS, MESSAGE_SOUND_URL, NOTIFICATION_SOUND_URL } from '../constants';

interface AppContextType {
  currentUser: User | null;
  users: User[];
  rooms: Room[];
  messages: Message[];
  activeChat: ActiveChat | null;
  typingUsers: { [chatId: string]: string[] };
  callState: CallState;
  localStream: MediaStream | null;
  mutedUsers: string[];
  blockedUsers: string[];
  modalState: ModalState;
  login: (details: { name: string; email: string; gender: string; }) => void;
  logout: () => void;
  switchChat: (id: string, type: 'room' | 'user') => void;
  sendMessage: (content: { text: string; imageUrl?: string }, chatId: string) => void;
  changeStatus: (status: UserStatus) => void;
  startCall: (chatId: string, type: 'voice' | 'video') => void;
  endCall: () => void;
  toggleMuteUser: (userId: string) => void;
  toggleBlockUser: (userId: string) => void;
  openModal: (type: 'userDetails' | 'profilePhoto', data: User) => void;
  closeModal: () => void;
}

export const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [rooms, setRooms] = useState<Room[]>(INITIAL_ROOMS);
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeChat, setActiveChat] = useState<ActiveChat | null>(null);
  const [typingUsers, setTypingUsers] = useState<{ [chatId: string]: string[] }>({});
  const [callState, setCallState] = useState<CallState>({ isActive: false, type: null, chatId: null });
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [mutedUsers, setMutedUsers] = useState<string[]>([]);
  const [blockedUsers, setBlockedUsers] = useState<string[]>([]);
  const [modalState, setModalState] = useState<ModalState>({ type: null, data: null });

  useEffect(() => {
    const unlockAudio = () => {
      const silentSound = new Audio("data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA");
      silentSound.play().catch(() => {});
      document.removeEventListener('click', unlockAudio);
      document.removeEventListener('keydown', unlockAudio);
      document.removeEventListener('touchstart', unlockAudio);
    };

    document.addEventListener('click', unlockAudio);
    document.addEventListener('keydown', unlockAudio);
    document.addEventListener('touchstart', unlockAudio);

    return () => {
      document.removeEventListener('click', unlockAudio);
      document.removeEventListener('keydown', unlockAudio);
      document.removeEventListener('touchstart', unlockAudio);
    };
  }, []);

  const playSound = (url: string) => {
    new Audio(url).play().catch(e => console.error("Error playing sound:", e));
  };

  const login = (details: { name: string; email: string; gender: string; }) => {
    const newUser: User = {
      id: `user-${Date.now()}`,
      name: details.name,
      email: details.email,
      gender: details.gender,
      avatar: `https://i.pravatar.cc/150?u=${details.name}`,
      status: UserStatus.Online,
      friends: ['user-2', 'user-3'],
    };
    setCurrentUser(newUser);
    setUsers(prev => [...prev, newUser]);
    playSound(NOTIFICATION_SOUND_URL);
  };

  const logout = () => {
    if (currentUser) {
        endCall(); // Ensure any active call is terminated on logout
        const currentUserId = currentUser.id;
        setUsers(prev => prev.map(u => u.id === currentUserId ? {...u, status: UserStatus.Offline} : u));
        setRooms(prevRooms => prevRooms.map(r => ({
            ...r,
            participants: r.participants.filter(pId => pId !== currentUserId)
        })));
    }
    setCurrentUser(null);
    setActiveChat(null);
  };

  const switchChat = (id: string, type: 'room' | 'user') => {
    if (type === 'user' && blockedUsers.includes(id)) {
      return; // Do not open chat with a blocked user
    }
    let name = '';
    if (type === 'room') {
      const room = rooms.find(r => r.id === id);
      name = room?.name || 'Unknown Room';
      if (currentUser && room && !room.participants.includes(currentUser.id)) {
        setRooms(prevRooms => prevRooms.map(r => 
          r.id === id 
          ? { ...r, participants: [...r.participants, currentUser.id] }
          : r
        ));
      }
    } else {
      name = users.find(u => u.id === id)?.name || 'Unknown User';
    }
    setActiveChat({ id, type, name });
  };
  
  const sendMessage = (content: { text: string; imageUrl?: string }, chatId: string) => {
    if (!currentUser) return;
    if (!content.text.trim() && !content.imageUrl) return; // Don't send empty messages

    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      senderId: currentUser.id,
      chatId,
      text: content.text,
      imageUrl: content.imageUrl,
      timestamp: Date.now(),
      read: true,
    };
    setMessages(prev => [...prev, newMessage]);
    playSound(MESSAGE_SOUND_URL);
  };
  
  const changeStatus = (status: UserStatus) => {
    if(currentUser){
      setCurrentUser(prev => prev ? { ...prev, status } : null);
      setUsers(prev => prev.map(u => u.id === currentUser.id ? { ...u, status } : u));
    }
  };

  const startCall = async (chatId: string, type: 'voice' | 'video') => {
    if (!currentUser) return;
    try {
      const constraints = {
        audio: true,
        video: type === 'video' ? { width: 1280, height: 720 } : false
      };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      setLocalStream(stream);
      setCallState({ isActive: true, type, chatId });
    } catch (err) {
      console.error("Error starting call:", err);
      alert("Could not start call. Please ensure you have given camera and microphone permissions.");
    }
  };

  const endCall = () => {
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
    }
    setLocalStream(null);
    setCallState({ isActive: false, type: null, chatId: null });
  };

  const toggleMuteUser = (userId: string) => {
    setMutedUsers(prev =>
      prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
    );
  };

  const toggleBlockUser = (userId: string) => {
    setBlockedUsers(prev => {
      const newBlockedUsers = prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId];
      
      // If we just blocked the user in the active chat, close the chat
      if (activeChat?.id === userId && newBlockedUsers.includes(userId)) {
        setActiveChat(null);
      }
      return newBlockedUsers;
    });
  };

  const openModal = (type: 'userDetails' | 'profilePhoto', data: User) => {
    setModalState({ type, data });
  };

  const closeModal = () => {
    setModalState({ type: null, data: null });
  };

  useEffect(() => {
    if (!currentUser || messages.length === 0 || !activeChat) return;
    
    const lastMessage = messages[messages.length - 1];

    if (activeChat.type === 'user' && blockedUsers.includes(activeChat.id)) {
      return;
    }
    
    if (lastMessage.senderId === currentUser.id) {
      const recipientId = activeChat.type === 'user' ? activeChat.id : 'bot';
      const chatId = activeChat.id;

      setTypingUsers(prev => ({...prev, [chatId]: [...(prev[chatId] || []), recipientId]}));

      const timeout = setTimeout(() => {
        const botReplyText = lastMessage.imageUrl
          ? `Hey ${currentUser.name}! I received your image. Looks great!`
          : `Hey ${currentUser.name}! I got your message: "${lastMessage.text}". This is a simulated reply.`;

        const botReply: Message = {
          id: `msg-bot-${Date.now()}`,
          senderId: recipientId,
          chatId: chatId,
          text: botReplyText,
          timestamp: Date.now(),
          read: false,
        };
        setMessages(prev => [...prev, botReply]);
        setTypingUsers(prev => ({...prev, [chatId]: (prev[chatId] || []).filter(id => id !== recipientId)}));
        
        if(document.visibilityState === 'visible' && !mutedUsers.includes(recipientId)) {
          playSound(MESSAGE_SOUND_URL);
        }
      }, 1500 + Math.random() * 1000);

      return () => clearTimeout(timeout);
    }
  }, [messages, currentUser, activeChat, blockedUsers, mutedUsers]);

  useEffect(() => {
    if (!currentUser) return;
    const interval = setInterval(() => {
      setUsers(prevUsers => 
        prevUsers.map(user => {
          if(user.id === currentUser.id) return user;
          if (Math.random() < 0.1) {
            const statuses = [UserStatus.Online, UserStatus.Busy, UserStatus.Offline];
            const newStatus = statuses[Math.floor(Math.random() * statuses.length)];
            if (newStatus === UserStatus.Online && user.status === UserStatus.Offline && !mutedUsers.includes(user.id)) {
              playSound(NOTIFICATION_SOUND_URL);
            }
            return { ...user, status: newStatus };
          }
          return user;
        })
      );
    }, 5000);
    return () => clearInterval(interval);
  }, [currentUser, mutedUsers]);

  return (
    <AppContext.Provider value={{ currentUser, users, rooms, messages, activeChat, typingUsers, login, logout, switchChat, sendMessage, changeStatus, callState, localStream, startCall, endCall, mutedUsers, blockedUsers, modalState, toggleMuteUser, toggleBlockUser, openModal, closeModal }}>
      {children}
    </AppContext.Provider>
  );
};
