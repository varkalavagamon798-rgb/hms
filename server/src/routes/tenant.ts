import { Router, Response } from 'express';
import { AuthRequest, authMiddleware } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';

const router = Router();

/**
 * GET /tenants/:tenantId
 * Get tenant information (branding, configuration)
 */
router.get('/:tenantId', async (req: AuthRequest, res: Response) => {
  try {
    const { tenantId } = req.params;

    // Mock tenant data - replace with actual database query
    const tenantData = {
      tenant_id: tenantId,
      hospital_name: 'City General Hospital',
      app_name: 'HMS Platform',
      primary_color: '#2E75B6',
      secondary_color: '#1B3A5C',
      logo_url: 'https://example.com/logo.png',
      support_email: 'support@hms.app',
      login_tagline: 'Streamline every workflow — from patient registration to discharge — in one unified platform.',
    };

    res.json({
      success: true,
      data: tenantData,
    });
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({
        success: false,
        message: error.message,
        code: error.code,
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Failed to fetch tenant information',
        code: 'TENANT_FETCH_ERROR',
      });
    }
  }
});

/**
 * POST /tenants
 * Create a new tenant (admin only)
 */
router.post('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    // Only super-admin can create tenants
    if (req.user?.role !== 'super-admin') {
      throw new AppError(403, 'Only super-admin can create tenants', 'FORBIDDEN');
    }

    const { hospital_name, app_name, primary_color, secondary_color } = req.body;

    if (!hospital_name || !app_name) {
      throw new AppError(400, 'Hospital name and app name are required', 'MISSING_FIELDS');
    }

    // Mock tenant creation - replace with actual database insert
    const newTenant = {
      tenant_id: `tenant-${Date.now()}`,
      hospital_name,
      app_name,
      primary_color: primary_color || '#2E75B6',
      secondary_color: secondary_color || '#1B3A5C',
      created_at: new Date().toISOString(),
    };

    res.status(201).json({
      success: true,
      data: newTenant,
    });
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({
        success: false,
        message: error.message,
        code: error.code,
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Failed to create tenant',
        code: 'TENANT_CREATE_ERROR',
      });
    }
  }
});

export default router;
