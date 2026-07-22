import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import Campaign from '../models/Campaign';
import Product from '../models/Product';
import mongoose from 'mongoose';

const normalizeCampaign = async (body: any) => {
    const startDate = new Date(body.startDate);
    const endDate = new Date(body.endDate);
    const products = Array.isArray(body.products)
        ? [...new Set(body.products.map((id: any) => String(id)))]
        : [];

    if (!String(body.name || '').trim()) throw new Error('Campaign name is required');
    if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime()) || endDate <= startDate) {
        throw new Error('Campaign end date must be later than its start date');
    }
    if (products.length === 0 || products.some((id) => !mongoose.isValidObjectId(id))) {
        throw new Error('Select at least one valid product');
    }

    const productCount = await Product.countDocuments({ _id: { $in: products } });
    if (productCount !== products.length) throw new Error('One or more selected products no longer exist');

    return {
        name: String(body.name).trim(),
        description: String(body.description || '').trim(),
        startDate,
        endDate,
        status: ['Scheduled', 'Active', 'Completed'].includes(body.status) ? body.status : 'Scheduled',
        products,
        bannerImage: String(body.bannerImage || '').trim(),
    };
};

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
        const campaign = new Campaign(await normalizeCampaign(req.body));
        const createdCampaign = await campaign.save();
        res.status(201).json(createdCampaign);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const updateCampaign = async (req: AuthRequest, res: Response) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({ message: 'Invalid campaign ID' });
        }
        const campaign = await Campaign.findById(req.params.id);
        if (campaign) {
            Object.assign(campaign, await normalizeCampaign(req.body));
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
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({ message: 'Invalid campaign ID' });
        }
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
