"use client";

import React, { useState, useEffect } from 'react';
import { Zap, Plus, Clock, Target, Calendar, Edit2, Trash2, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';
import { getCampaigns, createCampaign, updateCampaign, deleteCampaign } from '@/lib/api';
import CampaignForm from '@/components/drops/CampaignForm';
import { ConfirmModal } from '@/components/ui/ConfirmModal';

export default function DropsPage() {
    const [campaigns, setCampaigns] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingCampaign, setEditingCampaign] = useState<any>(null);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [campaignToDelete, setCampaignToDelete] = useState<string | null>(null);

    const fetchCampaigns = async () => {
        setIsLoading(true);
        try {
            const data = await getCampaigns();
            setCampaigns(data);
        } catch (error) {
            toast.error("DATABASE_SYNC_FAILURE");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCampaigns();
    }, []);

    const handleSubmit = async (formData: any) => {
        const token = localStorage.getItem('kavon-admin-token') || "";
        try {
            if (editingCampaign) {
                await updateCampaign(editingCampaign._id, formData, token);
                toast.success("CAMPAIGN_MODIFIED");
            } else {
                await createCampaign(formData, token);
                toast.success("CAMPAIGN_INITIALIZED");
            }
            fetchCampaigns();
        } catch (error) {
            toast.error("SYNCHRONIZATION_ERROR");
        }
    };

    const handleDeleteClick = (id: string) => {
        setCampaignToDelete(id);
        setIsConfirmOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!campaignToDelete) return;
        const token = localStorage.getItem('kavon-admin-token') || "";
        try {
            await deleteCampaign(campaignToDelete, token);
            toast.success("CAMPAIGN_TERMINATED");
            fetchCampaigns();
        } catch (error) {
            toast.error("TERMINATION_FAILURE");
        } finally {
            setCampaignToDelete(null);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Active': return 'text-brand-volt border-brand-volt/30 bg-brand-volt/10';
            case 'Scheduled': return 'text-blue-500 border-blue-500/30 bg-blue-500/10';
            case 'Completed': return 'text-white/40 border-white/10 bg-white/5';
            default: return 'text-white/40 border-white/10 bg-white/5';
        }
    };

    return (
        <div className="space-y-10">
            <header className="flex justify-between items-end">
                <div className="space-y-2">
                    <span className="font-mono text-[13px] text-white/40 uppercase tracking-[0.4em]">Node_Status / Campaigns</span>
                    <h1 className="text-4xl font-black italic uppercase tracking-tighter text-white">Tactical<span className="text-brand-volt">_Drops</span></h1>
                </div>
                <button 
                    onClick={() => {
                        setEditingCampaign(null);
                        setIsFormOpen(true);
                    }}
                    className="bg-brand-volt text-black px-8 py-4 font-black uppercase text-[13px] tracking-[0.2em] flex items-center gap-3 hover:brightness-110 transition-all active:scale-95"
                >
                    Initialize_New_Drop <Plus size={16} />
                </button>
            </header>

            {isLoading ? (
                <div className="p-40 flex flex-col items-center justify-center gap-6">
                    <div className="w-16 h-16 border-2 border-brand-volt border-t-transparent rounded-full animate-spin" />
                    <span className="font-mono text-brand-volt text-[10px] tracking-[0.5em] uppercase animate-pulse">Synchronizing_Drops...</span>
                </div>
            ) : campaigns.length === 0 ? (
                <div className="tactical-glass p-20 flex flex-col items-center justify-center text-center space-y-6">
                    <div className="w-20 h-20 bg-brand-volt/10 border border-brand-volt/20 rounded-full flex items-center justify-center text-brand-volt">
                        <Zap size={40} />
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-2xl font-black uppercase tracking-tight">No_Active_Campaigns</h2>
                        <p className="font-mono text-xs text-white/40 uppercase tracking-[0.2em] max-w-md mx-auto">
                            The campaign database is currently empty. Initialize a new mission drop to begin deployment.
                        </p>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {campaigns.map((campaign) => (
                        <div key={campaign._id} className="tactical-glass p-6 group space-y-6">
                            <div className="flex justify-between items-start">
                                <div className={`px-3 py-1 border font-mono text-[9px] uppercase tracking-widest ${getStatusColor(campaign.status)}`}>
                                    {campaign.status}
                                </div>
                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button 
                                        onClick={() => {
                                            setEditingCampaign(campaign);
                                            setIsFormOpen(true);
                                        }}
                                        className="p-2 bg-white/5 hover:bg-brand-volt hover:text-black transition-all"
                                    >
                                        <Edit2 size={14} />
                                    </button>
                                    <button 
                                        onClick={() => handleDeleteClick(campaign._id)}
                                        className="p-2 bg-white/5 hover:bg-red-500 hover:text-white transition-all"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-xl font-black italic uppercase tracking-tighter text-white">{campaign.name}</h3>
                                <div className="space-y-2 font-mono text-[11px] text-white/40">
                                    <div className="flex items-center gap-2">
                                        <Clock size={12} className="text-brand-volt" />
                                        <span>STARTS: {new Date(campaign.startDate).toLocaleString()}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Clock size={12} className="text-red-500" />
                                        <span>ENDS: {new Date(campaign.endDate).toLocaleString()}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Target size={12} className="text-white/60" />
                                        <span>ASSETS: {campaign.products.length} Units</span>
                                    </div>
                                </div>
                            </div>

                            {campaign.bannerImage && (
                                <div className="w-full h-32 bg-black border border-white/5 overflow-hidden">
                                    <img src={campaign.bannerImage} className="w-full h-full object-cover opacity-60" alt="" />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            <CampaignForm 
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                onSubmit={handleSubmit}
                initialData={editingCampaign}
                title={editingCampaign ? 'Modify_Deployment' : 'New_Drop_Initialization'}
            />

            <ConfirmModal 
                isOpen={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                onConfirm={handleDeleteConfirm}
                title="Terminate Campaign"
                message="Are you sure you want to terminate this tactical drop? All scheduled data will be permanently removed."
                confirmText="Terminate Drop"
                type="danger"
            />
        </div>
    );
}
