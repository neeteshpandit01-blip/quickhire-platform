import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Message {
  messageId: string;
  senderId: string;
  senderRole: 'client' | 'student';
  content: string;
  isFiltered: boolean;
  attachmentUrl?: string;
  attachmentType?: 'document' | 'image';
  isRead: boolean;
  timestamp: Date;
}

interface Chat {
  chatId: string;
  gigId: string;
  clientId: string;
  studentId: string;
  isActive: boolean;
  lastMessage?: {
    content: string;
    senderId: string;
    timestamp: Date;
  };
  unreadCount: {
    client: number;
    student: number;
  };
  createdAt: Date;
}

interface ChatState {
  chats: Chat[];
  currentChat: Chat | null;
  messages: Message[];
  loading: boolean;
  error: string | null;
}

const initialState: ChatState = {
  chats: [],
  currentChat: null,
  messages: [],
  loading: false,
  error: null,
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setChats: (state, action: PayloadAction<Chat[]>) => {
      state.chats = action.payload;
    },
    setCurrentChat: (state, action: PayloadAction<Chat | null>) => {
      state.currentChat = action.payload;
    },
    setMessages: (state, action: PayloadAction<Message[]>) => {
      state.messages = action.payload;
    },
    addMessage: (state, action: PayloadAction<Message>) => {
      state.messages.push(action.payload);
    },
    updateMessage: (state, action: PayloadAction<Message>) => {
      const index = state.messages.findIndex((m) => m.messageId === action.payload.messageId);
      if (index !== -1) {
        state.messages[index] = action.payload;
      }
    },
    markAsRead: (state, action: PayloadAction<string>) => {
      const message = state.messages.find((m) => m.messageId === action.payload);
      if (message) {
        message.isRead = true;
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setChats,
  setCurrentChat,
  setMessages,
  addMessage,
  updateMessage,
  markAsRead,
  setLoading,
  setError,
} = chatSlice.actions;

export default chatSlice.reducer;
