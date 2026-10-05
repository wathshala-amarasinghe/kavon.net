import mongoose, { Schema, Document } from 'mongoose';

export interface ICampaign extends Document {
    name: string;
    description: string;
    startDate: Date;
    endDate: Date;
    status: 'Scheduled' | 'Active' | 'Completed';
    products: mongoose.Types.ObjectId[];
    bannerImage: string;
}

const CampaignSchema: Schema = new Schema(
    {
        name: { type: String, required: true, trim: true },
        description: { type: String },
        startDate: { type: Date, required: true },
        endDate: { type: Date, required: true },
        status: { 
            type: String, 
            enum: ['Scheduled', 'Active', 'Completed'], 
            default: 'Scheduled' 
        },
        products: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product'
        }],
        bannerImage: { type: String, trim: true }
    },
    { timestamps: true }
);

export default mongoose.models.Campaign || mongoose.model<ICampaign>('Campaign', CampaignSchema);
