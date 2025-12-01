import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface User {
  userId: string;
  email: string;
  name: string;
  role: 'client' | 'student';
  phone?: string;
  profilePicture?: string;
  isPremium: boolean;
  premiumExpiry?: Date;
  rating: number;
  totalReviews: number;
  createdAt: Date;
  // Client-specific
  companyName?: string;
  industry?: string;
  totalSpent?: number;
  // Student-specific
  university?: string;
  skills?: string[];
  totalEarned?: number;
  portfolio?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: true,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
      state.loading = false;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
  },
});

export const { setUser, setLoading, logout, updateUser } = authSlice.actions;
export default authSlice.reducer;
