export enum UserStatus {
  Online = 'Online',
  Busy = 'Busy',
  Invisible = 'Invisible',
  Offline = 'Offline',
}

export interface User {
  id: string;
  name: string;
  email: string;
  gender: string;
  avatar: string;
  status: UserStatus;
  friends: string[];
}

export interface Room {
  id: string;
  name: string;
  type: 'group' | 'main_lobby';
  participants: string[];
}

export interface Message {
  id: string;
  senderId: string;
  chatId: string; // Can be a roomId or another userId for 1-to-1
  text: string;
  imageUrl?: string;
  timestamp: number;
  read: boolean;
}

export interface ActiveChat {
  id: string;
  type: 'room' | 'user';
  name: string;
}

export interface CallState {
  isActive: boolean;
  type: 'voice' | 'video' | null;
  chatId: string | null;
}

export interface ModalState {
  type: 'userDetails' | 'profilePhoto' | null;
  data: User | null;
}
