import mongoose, { Schema, Document } from 'mongoose';

export interface IEmailJob extends Document {
    type: 'marketing' | 'operational' | 'verification' | 'announcement';
    recipient: string;
    recipientName: string;
    subject: string;
    htmlContent: string;
    textContent: string;
    status: 'Pending' | 'Processing' | 'Sent' | 'Failed' | 'Cancelled';
    deliveryEvent: 'Delivered' | 'Opened' | 'Clicked' | 'Bounced' | 'Rejected' | 'Spam' | 'Unsubscribed' | 'None';
    attempts: number;
    providerMessageId?: string;
    lastError?: string;
    sentAt?: Date;
}

const EmailJobSchema: Schema = new Schema(
    {
        type: { 
            type: String, 
            enum: ['marketing', 'operational', 'verification', 'announcement'],
            required: true 
        },
        recipient: { type: String, required: true, trim: true, lowercase: true },
        recipientName: { type: String, required: true },
        subject: { type: String, required: true },
        htmlContent: { type: String, required: true },
        textContent: { type: String, required: true },
        status: { 
            type: String, 
            enum: ['Pending', 'Processing', 'Sent', 'Failed', 'Cancelled'],
            default: 'Pending'
        },
        deliveryEvent: { 
            type: String, 
            enum: ['Delivered', 'Opened', 'Clicked', 'Bounced', 'Rejected', 'Spam', 'Unsubscribed', 'None'],
            default: 'None'
        },
        attempts: { type: Number, default: 0 },
        providerMessageId: { type: String },
        lastError: { type: String },
        sentAt: { type: Date }
    },
    { timestamps: true }
);

export default mongoose.models.EmailJob || mongoose.model<IEmailJob>('EmailJob', EmailJobSchema);
