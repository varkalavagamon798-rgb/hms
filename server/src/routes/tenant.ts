import { Router, Response } from 'express';
import { AuthRequest } from '../middleware/auth';

const router = Router();

// Mock hospital data
const hospitals: Record<string, any> = {
  hospital1: {
    hospital_id: 'h-001',
    hospital_name: 'Apollo Hospitals',
    app_name: 'Apollo HMS',
    primary_color: '#0057A8',
    secondary_color: '#003876',
    login_banner_url: 'https://example.com/banner.jpg',
    login_tagline: 'Caring for life, enabled by technology.',
    logo_url: '/public/logo_colour.png',
    favicon_url: '/public/favicon.ico',
    support_phone: '+1-800-HOSPITAL',
    support_email: 'support@hospital.com',
  },
  default: {
    hospital_id: 'h-001',
    hospital_name: 'Default Hospital',
    app_name: 'HMS Platform',
    primary_color: '#2E75B6',
    secondary_color: '#1B3A5C',
    login_tagline: 'Unified Healthcare Management',
    logo_url: '/public/logo_colour.png',
    favicon_url: '/public/favicon.ico',
    support_phone: '+1-800-SUPPORT',
    support_email: 'support@hms.app',
  },
};

/**
 * GET /tenants/branding
 * Get hospital branding information by subdomain
 */
router.get('/branding', (req: AuthRequest, res: Response) => {
  try {
    const { subdomain } = req.query;
    const tenantSubdomain = subdomain as string || 'default';

    const branding = hospitals[tenantSubdomain] || hospitals['default'];

    res.json({
      success: true,
      data: branding,
    });
  } catch (error) {
    console.error('Error fetching branding:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch branding',
      code: 'BRANDING_ERROR',
    });
  }
});

export default router;
