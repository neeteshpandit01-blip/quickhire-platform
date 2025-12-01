import { useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, where } from 'firebase/firestore';
import { db } from '../services/firebase';
import { useAppDispatch, useAppSelector } from './redux';
import { setMessages, addMessage, setCurrentChat } from '../store/slices/chatSlice';

export const useChat = (chatId: string | null) => {
  const dispatch = useAppDispatch();
  const { currentChat, messages } = useAppSelector((state) => state.chat);
  const { user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (!chatId) return;

    // Subscribe to chat document
    const chatRef = collection(db, 'chats');
    const chatQuery = query(chatRef, where('__name__', '==', chatId));
    
    const unsubscribeChat = onSnapshot(chatQuery, (snapshot) => {
      if (!snapshot.empty) {
        const chatData = { id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as any;
        dispatch(setCurrentChat(chatData));
      }
    });

    // Subscribe to messages
    const messagesRef = collection(db, 'chats', chatId, 'messages');
    const messagesQuery = query(messagesRef, orderBy('timestamp', 'asc'));

    const unsubscribeMessages = onSnapshot(messagesQuery, (snapshot) => {
      const newMessages = snapshot.docs.map((doc) => ({
        messageId: doc.id,
        ...doc.data(),
      })) as any[];
      
      dispatch(setMessages(newMessages));
    });

    return () => {
      unsubscribeChat();
      unsubscribeMessages();
    };
  }, [chatId, dispatch]);

  return { currentChat, messages, user };
};
