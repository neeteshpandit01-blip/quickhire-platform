import axios from 'axios';
import { auth } from './firebase';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use(async (config) => {
  const user = auth.currentUser;
  if (user) {
    const token = await user.getIdToken();
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth APIs
export const registerUser = async (data: {
  email: string;
  password: string;
  name: string;
  role: 'client' | 'student';
  phone?: string;
  companyName?: string;
  university?: string;
}) => {
  const response = await api.post('/auth/register', data);
  return response.data;
};

export const loginUser = async (email: string, password: string) => {
  const response = await api.post('/auth/login', { email, password });
  return response.data;
};

export const getUserProfile = async (userId: string) => {
  const response = await api.get(`/users/${userId}`);
  return response.data;
};

export const updateUserProfile = async (userId: string, data: any) => {
  const response = await api.put(`/users/${userId}`, data);
  return response.data;
};

// Gig APIs
export const getGigs = async (filters?: any) => {
  const response = await api.get('/gigs', { params: filters });
  return response.data;
};

export const getGigById = async (gigId: string) => {
  const response = await api.get(`/gigs/${gigId}`);
  return response.data;
};

export const createGig = async (data: any) => {
  const response = await api.post('/gigs', data);
  return response.data;
};

export const updateGig = async (gigId: string, data: any) => {
  const response = await api.put(`/gigs/${gigId}`, data);
  return response.data;
};

export const deleteGig = async (gigId: string) => {
  const response = await api.delete(`/gigs/${gigId}`);
  return response.data;
};

export const publishGig = async (gigId: string) => {
  const response = await api.post(`/gigs/${gigId}/publish`);
  return response.data;
};

export const applyForGig = async (gigId: string, data: { coverLetter: string; proposedBudget: number }) => {
  const response = await api.post(`/gigs/${gigId}/apply`, data);
  return response.data;
};

export const acceptApplicant = async (gigId: string, studentId: string) => {
  const response = await api.post(`/gigs/${gigId}/accept-applicant`, { studentId });
  return response.data;
};

export const featureGig = async (gigId: string, duration: number) => {
  const response = await api.post(`/gigs/${gigId}/feature`, { duration });
  return response.data;
};

// Milestone APIs
export const submitMilestone = async (milestoneId: string, data: { submissionUrl: string; notes?: string }) => {
  const response = await api.post(`/milestones/${milestoneId}/submit`, data);
  return response.data;
};

export const approveMilestone = async (milestoneId: string, feedback?: string) => {
  const response = await api.post(`/milestones/${milestoneId}/approve`, { feedback });
  return response.data;
};

export const requestRevision = async (milestoneId: string, feedback: string) => {
  const response = await api.post(`/milestones/${milestoneId}/request-revision`, { feedback });
  return response.data;
};

// Payment APIs
export const createPaymentOrder = async (gigId: string) => {
  const response = await api.post('/payments/create-order', { gigId });
  return response.data;
};

export const verifyPayment = async (data: {
  orderId: string;
  paymentId: string;
  signature: string;
  gigId: string;
}) => {
  const response = await api.post('/payments/verify', data);
  return response.data;
};

export const releasePayment = async (milestoneId: string) => {
  const response = await api.post('/payments/release', { milestoneId });
  return response.data;
};

// Chat APIs
export const getChats = async () => {
  const response = await api.get('/chats');
  return response.data;
};

export const getChatMessages = async (chatId: string) => {
  const response = await api.get(`/chats/${chatId}/messages`);
  return response.data;
};

export const sendMessage = async (chatId: string, content: string, attachmentUrl?: string) => {
  const response = await api.post(`/chats/${chatId}/messages`, { content, attachmentUrl });
  return response.data;
};

export const markMessageAsRead = async (messageId: string) => {
  const response = await api.put(`/messages/${messageId}/read`);
  return response.data;
};

// Premium APIs
export const upgradeToPremium = async (plan: 'monthly' | 'quarterly' | 'annual') => {
  const response = await api.post('/users/upgrade-premium', { plan });
  return response.data;
};

export const verifyPremiumPayment = async (data: {
  orderId: string;
  paymentId: string;
  signature: string;
  plan: string;
}) => {
  const response = await api.post('/users/premium-callback', data);
  return response.data;
};

// Transaction APIs
export const getTransactions = async (userId: string) => {
  const response = await api.get(`/users/${userId}/transactions`);
  return response.data;
};

// Review APIs
export const getReviews = async (userId: string) => {
  const response = await api.get(`/users/${userId}/reviews`);
  return response.data;
};

export const submitReview = async (data: {
  gigId: string;
  revieweeId: string;
  rating: number;
  comment: string;
}) => {
  const response = await api.post('/reviews', data);
  return response.data;
};

export default api;
