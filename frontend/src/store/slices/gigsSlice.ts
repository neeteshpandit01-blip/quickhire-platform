import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Milestone {
  milestoneId: string;
  title: string;
  description: string;
  amount: number;
  dueDate: Date;
  status: 'pending' | 'submitted' | 'approved' | 'revision_requested';
  submissionUrl?: string;
  submittedAt?: Date;
  feedback?: string;
}

interface Applicant {
  studentId: string;
  appliedAt: Date;
  coverLetter: string;
  proposedBudget: number;
  status: 'pending' | 'accepted' | 'rejected';
}

interface Gig {
  gigId: string;
  clientId: string;
  title: string;
  description: string;
  category: string;
  budget: number;
  currency: string;
  status: 'draft' | 'published' | 'assigned' | 'in_progress' | 'completed' | 'cancelled' | 'disputed';
  deadline: Date;
  skillsRequired: string[];
  experienceLevel: 'beginner' | 'intermediate' | 'advanced';
  isFeatured: boolean;
  featuredUntil?: Date;
  applicants: Applicant[];
  assignedStudentId?: string;
  milestones: Milestone[];
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
}

interface GigsState {
  gigs: Gig[];
  currentGig: Gig | null;
  loading: boolean;
  error: string | null;
  filters: {
    category?: string;
    experienceLevel?: string;
    minBudget?: number;
    maxBudget?: number;
    search?: string;
  };
}

const initialState: GigsState = {
  gigs: [],
  currentGig: null,
  loading: false,
  error: null,
  filters: {},
};

const gigsSlice = createSlice({
  name: 'gigs',
  initialState,
  reducers: {
    setGigs: (state, action: PayloadAction<Gig[]>) => {
      state.gigs = action.payload;
      state.loading = false;
    },
    setCurrentGig: (state, action: PayloadAction<Gig | null>) => {
      state.currentGig = action.payload;
    },
    addGig: (state, action: PayloadAction<Gig>) => {
      state.gigs.unshift(action.payload);
    },
    updateGig: (state, action: PayloadAction<Gig>) => {
      const index = state.gigs.findIndex((g) => g.gigId === action.payload.gigId);
      if (index !== -1) {
        state.gigs[index] = action.payload;
      }
      if (state.currentGig?.gigId === action.payload.gigId) {
        state.currentGig = action.payload;
      }
    },
    removeGig: (state, action: PayloadAction<string>) => {
      state.gigs = state.gigs.filter((g) => g.gigId !== action.payload);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.loading = false;
    },
    setFilters: (state, action: PayloadAction<GigsState['filters']>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {};
    },
  },
});

export const {
  setGigs,
  setCurrentGig,
  addGig,
  updateGig,
  removeGig,
  setLoading,
  setError,
  setFilters,
  clearFilters,
} = gigsSlice.actions;

export default gigsSlice.reducer;
