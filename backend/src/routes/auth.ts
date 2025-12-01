import { Router, Request, Response } from 'express';
import { auth, db } from '../config/firebase';

const router = Router();

/**
 * POST /api/auth/register
 * Register a new user
 */
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { email, password, name, role, phone, companyName, university } = req.body;

    // Validate required fields
    if (!email || !password || !name || !role) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (!['client', 'student'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }

    // Create Firebase user
    const userRecord = await auth.createUser({
      email,
      password,
      displayName: name,
    });

    // Create user document in Firestore
    const userData: any = {
      userId: userRecord.uid,
      email,
      name,
      role,
      phone: phone || null,
      profilePicture: null,
      isPremium: false,
      rating: 0,
      totalReviews: 0,
      createdAt: new Date(),
      lastActive: new Date(),
      isVerified: false,
    };

    // Add role-specific fields
    if (role === 'client') {
      userData.companyName = companyName || null;
      userData.industry = null;
      userData.postedGigs = [];
      userData.totalSpent = 0;
    } else {
      userData.university = university || null;
      userData.skills = [];
      userData.completedGigs = [];
      userData.totalEarned = 0;
      userData.portfolio = null;
    }

    await db.collection('users').doc(userRecord.uid).set(userData);

    // Send email verification
    const link = await auth.generateEmailVerificationLink(email);

    res.status(201).json({
      success: true,
      userId: userRecord.uid,
      message: 'User registered successfully',
      verificationLink: link,
    });
  } catch (error: any) {
    console.error('Registration error:', error);
    res.status(500).json({ error: error.message || 'Registration failed' });
  }
});

/**
 * POST /api/auth/login
 * Login user (handled by Firebase on client side, this is for additional checks)
 */
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Get user by email
    const userRecord = await auth.getUserByEmail(email);
    const userDoc = await db.collection('users').doc(userRecord.uid).get();

    if (!userDoc.exists) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update last active
    await db.collection('users').doc(userRecord.uid).update({
      lastActive: new Date(),
    });

    res.json({
      success: true,
      user: userDoc.data(),
    });
  } catch (error: any) {
    console.error('Login error:', error);
    res.status(500).json({ error: error.message || 'Login failed' });
  }
});

/**
 * POST /api/auth/verify-email
 * Verify user email
 */
router.post('/verify-email', async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    await db.collection('users').doc(userId).update({
      isVerified: true,
    });

    res.json({
      success: true,
      message: 'Email verified successfully',
    });
  } catch (error: any) {
    console.error('Email verification error:', error);
    res.status(500).json({ error: error.message || 'Verification failed' });
  }
});

/**
 * POST /api/auth/reset-password
 * Send password reset email
 */
router.post('/reset-password', async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const link = await auth.generatePasswordResetLink(email);

    res.json({
      success: true,
      message: 'Password reset link sent',
      resetLink: link,
    });
  } catch (error: any) {
    console.error('Password reset error:', error);
    res.status(500).json({ error: error.message || 'Password reset failed' });
  }
});

export default router;
