# QuickHire Platform

**"Students meet opportunities. Clients meet talent."**

A comprehensive gig marketplace platform connecting students with clients for short-term projects, featuring milestone-based payments, real-time chat, and secure transactions.

## 🚀 Features

### For Students
- Browse and apply for gigs
- Portfolio management
- Real-time chat with clients
- Milestone-based work submission
- Secure payment reception
- Rating and review system

### For Clients
- Post gigs with detailed requirements
- Review student applications
- Milestone-based project tracking
- Secure escrow payments
- Real-time communication
- Rate and review students

### Platform Features
- **Secure Payments**: Razorpay/Stripe integration with escrow
- **Real-Time Chat**: Filtered messaging to prevent payment bypass
- **Milestone System**: Partial payment releases on approval
- **Premium Membership**: Featured gigs, reduced commission (10% vs 15%)
- **Commission Model**: Platform earns 10-15% on transactions
- **Content Filtering**: Automatic blocking of phone numbers, UPI IDs, payment info

## 🛠️ Technology Stack

### Frontend
- React 18 with TypeScript
- Vite for build tooling
- Material-UI (MUI) for components
- Redux Toolkit for state management
- React Router v6 for navigation
- Firebase SDK for real-time features
- React Hook Form + Zod for validation

### Backend
- Node.js with Express.js
- TypeScript
- Firebase Admin SDK
- Firebase Firestore (Database)
- Firebase Authentication
- Firebase Storage
- Razorpay/Stripe for payments

### Infrastructure
- Firebase Hosting/Vercel (Frontend)
- Firebase Functions (Backend)
- Firebase Firestore (Database)
- Firebase Storage (Files)
- Cloudflare CDN

## 📦 Project Structure

```
quickhire-platform/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── services/       # API services
│   │   ├── store/          # Redux store
│   │   ├── utils/          # Utility functions
│   │   └── types/          # TypeScript types
│   ├── public/             # Static assets
│   └── package.json
│
├── backend/                 # Node.js backend application
│   ├── src/
│   │   ├── routes/         # API routes
│   │   ├── controllers/    # Route controllers
│   │   ├── middleware/     # Express middleware
│   │   ├── services/       # Business logic
│   │   ├── utils/          # Utility functions
│   │   └── types/          # TypeScript types
│   ├── functions/          # Firebase Functions
│   └── package.json
│
├── shared/                  # Shared types and utilities
│   └── types/
│
└── docs/                   # Documentation
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Firebase account
- Razorpay/Stripe account

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/neeteshpandit01-blip/quickhire-platform.git
cd quickhire-platform
```

2. **Install dependencies**
```bash
# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install
```

3. **Configure Firebase**
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase project
firebase init
```

4. **Set up environment variables**

Create `.env` files in both frontend and backend directories:

**frontend/.env**
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_API_URL=http://localhost:5000/api
VITE_RAZORPAY_KEY_ID=your_razorpay_key
```

**backend/.env**
```env
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_PRIVATE_KEY=your_private_key
FIREBASE_CLIENT_EMAIL=your_client_email
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
STRIPE_SECRET_KEY=your_stripe_secret_key
PORT=5000
NODE_ENV=development
```

5. **Run the application**

```bash
# Terminal 1 - Run backend
cd backend
npm run dev

# Terminal 2 - Run frontend
cd frontend
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend: http://localhost:5000

## 📚 API Documentation

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `POST /api/auth/verify-email` - Verify email
- `POST /api/auth/reset-password` - Reset password

### Gigs
- `GET /api/gigs` - List all gigs
- `POST /api/gigs` - Create new gig (Client only)
- `GET /api/gigs/:id` - Get gig details
- `PUT /api/gigs/:id` - Update gig
- `DELETE /api/gigs/:id` - Delete gig
- `POST /api/gigs/:id/apply` - Apply for gig (Student only)
- `POST /api/gigs/:id/accept-applicant` - Accept applicant (Client only)

### Milestones
- `POST /api/milestones/:id/submit` - Submit milestone work
- `POST /api/milestones/:id/approve` - Approve milestone
- `POST /api/milestones/:id/request-revision` - Request revision

### Payments
- `POST /api/payments/create-order` - Create payment order
- `POST /api/payments/verify` - Verify payment
- `POST /api/payments/release` - Release milestone payment

### Chat
- `GET /api/chats` - List user chats
- `GET /api/chats/:id/messages` - Get chat messages
- `POST /api/chats/:id/messages` - Send message

### Users
- `GET /api/users/:id` - Get user profile
- `PUT /api/users/:id` - Update user profile
- `POST /api/users/upgrade-premium` - Upgrade to premium

## 🔒 Security Features

1. **Payment Security**
   - Escrow system for secure transactions
   - PCI DSS compliance via Razorpay/Stripe
   - Webhook signature verification
   - Fraud detection

2. **Chat Security**
   - Automatic filtering of phone numbers
   - UPI ID redaction
   - Payment keyword blocking
   - Audit trail for filtered messages

3. **Data Security**
   - Firebase Authentication
   - Role-based access control
   - Encrypted sensitive data
   - Secure Firebase rules

## 💰 Revenue Model

- **Standard Commission**: 15% on all transactions
- **Premium Commission**: 10% on all transactions
- **Premium Subscription**: 
  - Monthly: ₹299
  - Quarterly: ₹799
  - Annual: ₹2,499

## 🧪 Testing

```bash
# Run frontend tests
cd frontend
npm test

# Run backend tests
cd backend
npm test

# Run e2e tests
npm run test:e2e
```

## 📦 Deployment

### Frontend (Vercel)
```bash
cd frontend
npm run build
vercel --prod
```

### Backend (Firebase Functions)
```bash
cd backend
firebase deploy --only functions
```

### Database (Firebase Firestore)
```bash
firebase deploy --only firestore:rules
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **Platform Architecture**: Technical Team
- **Design**: UX Team
- **Development**: Full Stack Team

## 📞 Support

For support, email support@quickhire.com or join our Slack channel.

## 🗺️ Roadmap

### Phase 1 (Current)
- ✅ User authentication
- ✅ Gig posting and browsing
- ✅ Application system
- ✅ Milestone-based payments
- ✅ Real-time chat
- ✅ Premium membership

### Phase 2 (Q2 2024)
- 🔄 Mobile applications (React Native)
- 🔄 Video call integration
- 🔄 AI-powered recommendations
- 🔄 Skill assessment tests

### Phase 3 (Q3 2024)
- 📋 Team collaboration
- 📋 Project templates
- 📋 Learning resources
- 📋 Referral program

---

**Made with ❤️ by the QuickHire Team**
