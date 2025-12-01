import { Router, Response } from 'express';
import { db } from '../config/firebase';
import { authenticate, authorize, AuthRequest } from '../middleware/auth';
import { validateMilestoneAmounts } from '../utils/commission';
import admin from 'firebase-admin';

const router = Router();

/**
 * GET /api/gigs
 * Get all gigs with optional filters
 */
router.get('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { category, experienceLevel, minBudget, maxBudget, search, status } = req.query;
    
    let query = db.collection('gigs').orderBy('createdAt', 'desc');

    // Apply filters
    if (category) {
      query = query.where('category', '==', category) as any;
    }
    if (experienceLevel) {
      query = query.where('experienceLevel', '==', experienceLevel) as any;
    }
    if (status) {
      query = query.where('status', '==', status) as any;
    }

    const snapshot = await query.get();
    let gigs = snapshot.docs.map(doc => ({ gigId: doc.id, ...doc.data() }));

    // Apply budget filters
    if (minBudget) {
      gigs = gigs.filter((g: any) => g.budget >= parseInt(minBudget as string));
    }
    if (maxBudget) {
      gigs = gigs.filter((g: any) => g.budget <= parseInt(maxBudget as string));
    }

    // Apply search filter
    if (search) {
      const searchLower = (search as string).toLowerCase();
      gigs = gigs.filter((g: any) => 
        g.title.toLowerCase().includes(searchLower) ||
        g.description.toLowerCase().includes(searchLower)
      );
    }

    res.json({ success: true, gigs });
  } catch (error: any) {
    console.error('Get gigs error:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch gigs' });
  }
});

/**
 * GET /api/gigs/:gigId
 * Get a specific gig by ID
 */
router.get('/:gigId', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { gigId } = req.params;
    
    const gigDoc = await db.collection('gigs').doc(gigId).get();
    
    if (!gigDoc.exists) {
      return res.status(404).json({ error: 'Gig not found' });
    }

    res.json({ success: true, gig: { gigId: gigDoc.id, ...gigDoc.data() } });
  } catch (error: any) {
    console.error('Get gig error:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch gig' });
  }
});

/**
 * POST /api/gigs
 * Create a new gig (Client only)
 */
router.post('/', authenticate, authorize(['client']), async (req: AuthRequest, res: Response) => {
  try {
    const {
      title,
      description,
      category,
      budget,
      deadline,
      skillsRequired,
      experienceLevel,
      milestones,
    } = req.body;

    // Validate required fields
    if (!title || !description || !budget || !category || !deadline || !milestones) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Validate budget
    if (budget < 500) {
      return res.status(400).json({ error: 'Minimum budget is ₹500' });
    }

    // Validate milestones
    const validation = validateMilestoneAmounts(milestones, budget);
    if (!validation.valid) {
      return res.status(400).json({ error: validation.message });
    }

    // Create gig document
    const gigData = {
      clientId: req.user.userId,
      title,
      description,
      category,
      budget,
      currency: 'INR',
      status: 'draft',
      deadline: new Date(deadline),
      skillsRequired: skillsRequired || [],
      experienceLevel: experienceLevel || 'beginner',
      isFeatured: false,
      applicants: [],
      milestones: milestones.map((m: any, index: number) => ({
        milestoneId: `milestone_${Date.now()}_${index}`,
        title: m.title,
        description: m.description,
        amount: m.amount,
        dueDate: new Date(m.dueDate),
        status: 'pending',
      })),
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    const gigRef = await db.collection('gigs').add(gigData);

    // Update user's posted gigs
    await db.collection('users').doc(req.user.userId).update({
      postedGigs: admin.firestore.FieldValue.arrayUnion(gigRef.id),
    });

    res.status(201).json({
      success: true,
      gigId: gigRef.id,
      message: 'Gig created successfully',
    });
  } catch (error: any) {
    console.error('Create gig error:', error);
    res.status(500).json({ error: error.message || 'Failed to create gig' });
  }
});

/**
 * PUT /api/gigs/:gigId
 * Update a gig (Client only, own gigs)
 */
router.put('/:gigId', authenticate, authorize(['client']), async (req: AuthRequest, res: Response) => {
  try {
    const { gigId } = req.params;
    const updates = req.body;

    const gigDoc = await db.collection('gigs').doc(gigId).get();
    
    if (!gigDoc.exists) {
      return res.status(404).json({ error: 'Gig not found' });
    }

    const gigData = gigDoc.data();
    
    if (gigData?.clientId !== req.user.userId) {
      return res.status(403).json({ error: 'Unauthorized to update this gig' });
    }

    // Don't allow updates if gig is in progress or completed
    if (['in_progress', 'completed', 'cancelled'].includes(gigData?.status)) {
      return res.status(400).json({ error: 'Cannot update gig in current status' });
    }

    await db.collection('gigs').doc(gigId).update({
      ...updates,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.json({ success: true, message: 'Gig updated successfully' });
  } catch (error: any) {
    console.error('Update gig error:', error);
    res.status(500).json({ error: error.message || 'Failed to update gig' });
  }
});

/**
 * DELETE /api/gigs/:gigId
 * Delete a gig (Client only, own gigs, only if draft)
 */
router.delete('/:gigId', authenticate, authorize(['client']), async (req: AuthRequest, res: Response) => {
  try {
    const { gigId } = req.params;

    const gigDoc = await db.collection('gigs').doc(gigId).get();
    
    if (!gigDoc.exists) {
      return res.status(404).json({ error: 'Gig not found' });
    }

    const gigData = gigDoc.data();
    
    if (gigData?.clientId !== req.user.userId) {
      return res.status(403).json({ error: 'Unauthorized to delete this gig' });
    }

    if (gigData?.status !== 'draft') {
      return res.status(400).json({ error: 'Can only delete draft gigs' });
    }

    await db.collection('gigs').doc(gigId).delete();

    // Remove from user's posted gigs
    await db.collection('users').doc(req.user.userId).update({
      postedGigs: admin.firestore.FieldValue.arrayRemove(gigId),
    });

    res.json({ success: true, message: 'Gig deleted successfully' });
  } catch (error: any) {
    console.error('Delete gig error:', error);
    res.status(500).json({ error: error.message || 'Failed to delete gig' });
  }
});

/**
 * POST /api/gigs/:gigId/publish
 * Publish a gig (Client only)
 */
router.post('/:gigId/publish', authenticate, authorize(['client']), async (req: AuthRequest, res: Response) => {
  try {
    const { gigId } = req.params;

    const gigDoc = await db.collection('gigs').doc(gigId).get();
    
    if (!gigDoc.exists) {
      return res.status(404).json({ error: 'Gig not found' });
    }

    const gigData = gigDoc.data();
    
    if (gigData?.clientId !== req.user.userId) {
      return res.status(403).json({ error: 'Unauthorized to publish this gig' });
    }

    if (gigData?.status !== 'draft') {
      return res.status(400).json({ error: 'Gig is already published' });
    }

    await db.collection('gigs').doc(gigId).update({
      status: 'published',
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.json({ success: true, message: 'Gig published successfully' });
  } catch (error: any) {
    console.error('Publish gig error:', error);
    res.status(500).json({ error: error.message || 'Failed to publish gig' });
  }
});

/**
 * POST /api/gigs/:gigId/apply
 * Apply for a gig (Student only)
 */
router.post('/:gigId/apply', authenticate, authorize(['student']), async (req: AuthRequest, res: Response) => {
  try {
    const { gigId } = req.params;
    const { coverLetter, proposedBudget } = req.body;

    if (!coverLetter) {
      return res.status(400).json({ error: 'Cover letter is required' });
    }

    const gigDoc = await db.collection('gigs').doc(gigId).get();
    
    if (!gigDoc.exists) {
      return res.status(404).json({ error: 'Gig not found' });
    }

    const gigData = gigDoc.data();
    
    if (gigData?.status !== 'published') {
      return res.status(400).json({ error: 'Gig is not available for applications' });
    }

    // Check if already applied
    const existingApplication = gigData?.applicants?.find(
      (a: any) => a.studentId === req.user.userId
    );

    if (existingApplication) {
      return res.status(400).json({ error: 'You have already applied for this gig' });
    }

    // Add application
    await db.collection('gigs').doc(gigId).update({
      applicants: admin.firestore.FieldValue.arrayUnion({
        studentId: req.user.userId,
        appliedAt: admin.firestore.FieldValue.serverTimestamp(),
        coverLetter,
        proposedBudget: proposedBudget || gigData?.budget,
        status: 'pending',
      }),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.json({ success: true, message: 'Application submitted successfully' });
  } catch (error: any) {
    console.error('Apply for gig error:', error);
    res.status(500).json({ error: error.message || 'Failed to apply for gig' });
  }
});

/**
 * POST /api/gigs/:gigId/accept-applicant
 * Accept an applicant (Client only)
 */
router.post('/:gigId/accept-applicant', authenticate, authorize(['client']), async (req: AuthRequest, res: Response) => {
  try {
    const { gigId } = req.params;
    const { studentId } = req.body;

    if (!studentId) {
      return res.status(400).json({ error: 'Student ID is required' });
    }

    const gigDoc = await db.collection('gigs').doc(gigId).get();
    
    if (!gigDoc.exists) {
      return res.status(404).json({ error: 'Gig not found' });
    }

    const gigData = gigDoc.data();
    
    if (gigData?.clientId !== req.user.userId) {
      return res.status(403).json({ error: 'Unauthorized to accept applicants for this gig' });
    }

    if (gigData?.status !== 'published') {
      return res.status(400).json({ error: 'Gig is not in published status' });
    }

    // Update applicant status
    const updatedApplicants = gigData?.applicants?.map((a: any) => ({
      ...a,
      status: a.studentId === studentId ? 'accepted' : 'rejected',
    }));

    await db.collection('gigs').doc(gigId).update({
      status: 'assigned',
      assignedStudentId: studentId,
      applicants: updatedApplicants,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    // Create chat for client and student
    await db.collection('chats').add({
      gigId,
      clientId: req.user.userId,
      studentId,
      isActive: true,
      unreadCount: { client: 0, student: 0 },
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.json({ success: true, message: 'Applicant accepted successfully' });
  } catch (error: any) {
    console.error('Accept applicant error:', error);
    res.status(500).json({ error: error.message || 'Failed to accept applicant' });
  }
});

/**
 * POST /api/gigs/:gigId/feature
 * Feature a gig (Premium users only)
 */
router.post('/:gigId/feature', authenticate, authorize(['client']), async (req: AuthRequest, res: Response) => {
  try {
    const { gigId } = req.params;
    const { duration } = req.body; // duration in days

    if (!req.user.isPremium) {
      return res.status(403).json({ error: 'Premium membership required to feature gigs' });
    }

    const gigDoc = await db.collection('gigs').doc(gigId).get();
    
    if (!gigDoc.exists) {
      return res.status(404).json({ error: 'Gig not found' });
    }

    const gigData = gigDoc.data();
    
    if (gigData?.clientId !== req.user.userId) {
      return res.status(403).json({ error: 'Unauthorized to feature this gig' });
    }

    const featuredUntil = new Date();
    featuredUntil.setDate(featuredUntil.getDate() + (duration || 7));

    await db.collection('gigs').doc(gigId).update({
      isFeatured: true,
      featuredUntil,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.json({ success: true, message: 'Gig featured successfully', featuredUntil });
  } catch (error: any) {
    console.error('Feature gig error:', error);
    res.status(500).json({ error: error.message || 'Failed to feature gig' });
  }
});

/**
 * GET /api/gigs/:gigId/applicants
 * Get all applicants for a gig (Client only)
 */
router.get('/:gigId/applicants', authenticate, authorize(['client']), async (req: AuthRequest, res: Response) => {
  try {
    const { gigId } = req.params;

    const gigDoc = await db.collection('gigs').doc(gigId).get();
    
    if (!gigDoc.exists) {
      return res.status(404).json({ error: 'Gig not found' });
    }

    const gigData = gigDoc.data();
    
    if (gigData?.clientId !== req.user.userId) {
      return res.status(403).json({ error: 'Unauthorized to view applicants' });
    }

    // Get student details for each applicant
    const applicantsWithDetails = await Promise.all(
      (gigData?.applicants || []).map(async (applicant: any) => {
        const studentDoc = await db.collection('users').doc(applicant.studentId).get();
        return {
          ...applicant,
          student: studentDoc.data(),
        };
      })
    );

    res.json({ success: true, applicants: applicantsWithDetails });
  } catch (error: any) {
    console.error('Get applicants error:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch applicants' });
  }
});

export default router;
