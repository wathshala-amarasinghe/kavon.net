import { Request, Response } from 'express';
import Settings from '../models/Settings';

const LEGACY_PROMO_TEXT = "FREE EXPEDITED DEPLOYMENT ON ALL ORDERS OVER LKR 10,000";
const CURRENT_PROMO_TEXT = "FREE STANDARD DELIVERY FROM LKR 10,000 IN COLOMBO / LKR 15,000 OUTSTATION";

const getAllowedSettings = (body: Record<string, unknown>) => {
  const allowedKeys = [
    'promoBanner',
    'popupBanner',
    'maintenanceMode',
    'contactEmail',
    'contactPhone',
    'activeAlert',
    'heroSlides',
    'heroCountdown',
  ] as const;

  return Object.fromEntries(
    allowedKeys
      .filter((key) => Object.prototype.hasOwnProperty.call(body, key))
      .map((key) => [key, body[key]])
  );
};

// @desc    Get global settings
// @route   GET /api/settings
// @access  Public
export const getSettings = async (req: Request, res: Response) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create({});
    } else if (settings.promoBanner?.text === LEGACY_PROMO_TEXT) {
      settings.promoBanner.text = CURRENT_PROMO_TEXT;
      await settings.save();
    }
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: "Settings retrieval failed" });
  }
};

// @desc    Update global settings
// @route   PUT /api/settings
// @access  Private/Admin
export const updateSettings = async (req: Request, res: Response) => {
  try {
    const updates = getAllowedSettings(req.body || {});
    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings(updates);
    } else {
      Object.assign(settings, updates);
    }
    await settings.save();
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: "Settings update failed" });
  }
};
