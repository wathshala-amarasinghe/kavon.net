import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import Campaign from '../models/Campaign';

export const getCampaigns = async (req: Request, res: Response) => {
    try {
        const campaigns = await Campaign.find({})
            .populate('products')
            .sort({ createdAt: -1 });
        res.json(campaigns);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const createCampaign = async (req: AuthRequest, res: Response) => {
    try {
        const campaign = new Campaign(req.body);
        const createdCampaign = await campaign.save();
        res.status(201).json(createdCampaign);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const updateCampaign = async (req: AuthRequest, res: Response) => {
    try {
        const campaign = await Campaign.findById(req.params.id);
        if (campaign) {
            Object.assign(campaign, req.body);
            const updatedCampaign = await campaign.save();
            res.json(updatedCampaign);
        } else {
            res.status(404).json({ message: 'Campaign not found' });
        }
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const deleteCampaign = async (req: AuthRequest, res: Response) => {
    try {
        const campaign = await Campaign.findById(req.params.id);
        if (campaign) {
            await campaign.deleteOne();
            res.json({ message: 'Campaign removed' });
        } else {
            res.status(404).json({ message: 'Campaign not found' });
        }
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
