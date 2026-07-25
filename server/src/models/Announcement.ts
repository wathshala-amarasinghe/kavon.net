import mongoose, { Schema, Document } from 'mongoose';

export interface IAnnouncement extends Document {
    title: string;
    message: string;
    type: 'offer' | 'maintenance' | 'delivery' | 'security';
    targetAudience: 'all' | 'consented' | 'affected';
    channels: ('banner' | 'email')[];
    startDate: Date;
    endDate?: Date;
    status: 'draft' | 'scheduled' | 'active' | 'completed' | 'cancelled';
    emailSentCount: number;
}

const AnnouncementSchema: Schema = new Schema(
    {
        title: { type: String, required: true, trim: true },
        message: { type: String, required: true },
        type: { 
            type: String, 
            enum: ['offer', 'maintenance', 'delivery', 'security'],
            required: true 
        },
        targetAudience: { 
            type: String, 
            enum: ['all', 'consented', 'affected'],
            required: true 
        },
        channels: [{ 
            type: String, 
            enum: ['banner', 'email']
        }],
        startDate: { type: Date, required: true },
        endDate: { type: Date },
        status: { 
            type: String, 
            enum: ['draft', 'scheduled', 'active', 'completed', 'cancelled'],
            default: 'draft'
        },
        emailSentCount: { type: Number, default: 0 }
    },
    { timestamps: true }
);

export default mongoose.models.Announcement || mongoose.model<IAnnouncement>('Announcement', AnnouncementSchema);
