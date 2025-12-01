export const GIG_CATEGORIES = [
  'Web Development',
  'Mobile Development',
  'UI/UX Design',
  'Graphic Design',
  'Content Writing',
  'Digital Marketing',
  'Data Entry',
  'Video Editing',
  'Photography',
  'Translation',
  'Virtual Assistant',
  'Social Media Management',
  'SEO',
  'Other',
];

export const EXPERIENCE_LEVELS = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
];

export const GIG_STATUS = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
  ASSIGNED: 'assigned',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  DISPUTED: 'disputed',
};

export const GIG_STATUS_LABELS = {
  draft: 'Draft',
  published: 'Published',
  assigned: 'Assigned',
  in_progress: 'In Progress',
  completed: 'Completed',
  cancelled: 'Cancelled',
  disputed: 'Disputed',
};

export const GIG_STATUS_COLORS = {
  draft: 'default',
  published: 'info',
  assigned: 'primary',
  in_progress: 'warning',
  completed: 'success',
  cancelled: 'error',
  disputed: 'error',
};

export const MILESTONE_STATUS = {
  PENDING: 'pending',
  SUBMITTED: 'submitted',
  APPROVED: 'approved',
  REVISION_REQUESTED: 'revision_requested',
};

export const MILESTONE_STATUS_LABELS = {
  pending: 'Pending',
  submitted: 'Submitted',
  approved: 'Approved',
  revision_requested: 'Revision Requested',
};

export const MILESTONE_STATUS_COLORS = {
  pending: 'default',
  submitted: 'info',
  approved: 'success',
  revision_requested: 'warning',
};

export const COMMISSION_RATES = {
  STANDARD: 0.15,
  PREMIUM: 0.10,
};

export const PREMIUM_PLANS = [
  {
    id: 'monthly',
    name: 'Monthly',
    price: 299,
    duration: 30,
    features: [
      'Featured gigs for 7 days',
      'Reduced commission (10%)',
      'Priority support',
      'Advanced analytics',
      'Unlimited applications',
      'Verified badge',
    ],
  },
  {
    id: 'quarterly',
    name: 'Quarterly',
    price: 799,
    duration: 90,
    savings: 11,
    features: [
      'All monthly features',
      '11% savings',
      'Extended featured duration',
    ],
  },
  {
    id: 'annual',
    name: 'Annual',
    price: 2499,
    duration: 365,
    savings: 30,
    features: [
      'All monthly features',
      '30% savings',
      'Maximum featured duration',
      'Dedicated account manager',
    ],
  },
];

export const SKILLS = [
  'React',
  'Node.js',
  'Python',
  'JavaScript',
  'TypeScript',
  'HTML/CSS',
  'UI/UX Design',
  'Figma',
  'Adobe Photoshop',
  'Adobe Illustrator',
  'Content Writing',
  'SEO',
  'Digital Marketing',
  'Social Media',
  'Video Editing',
  'Photography',
  'Data Entry',
  'Excel',
  'Translation',
  'Customer Support',
];

export const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID;

export const FILE_SIZE_LIMIT = 10 * 1024 * 1024; // 10MB
export const ALLOWED_FILE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];
