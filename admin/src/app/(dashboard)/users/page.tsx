"use client";

import React, { useState, useEffect } from 'react';
import { getUsers, deleteUser, updateUserRole } from '@/lib/api';
import { Users, Shield, ShieldCheck, Trash2, Mail, Award, Search, MoreVertical } from 'lucide-react';
import toast from 'react-hot-toast';
import { ConfirmModal } from '@/components/ui/ConfirmModal';

export default function PersonnelPage() {
    const [personnel, setPersonnel] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [confirmConfig, setConfirmConfig] = useState<any>(null);

    const fetchPersonnel = async () => {
        try {
            const token = localStorage.getItem('kavon-admin-token') || "";
            const data = await getUsers(token);
            setPersonnel(data);
        } catch (e) {
            toast.error("PERSONNEL_SYNC_FAILURE");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchPersonnel();
    }, []);

    const handleDelete = (id: string) => {
        setConfirmConfig({
            title: "Terminate Operator",
            message: "Are you sure you want to remove this operator from the system? This action cannot be undone.",
            confirmText: "Terminate",
            type: "danger",
            onConfirm: async () => {
                try {
                    const token = localStorage.getItem('kavon-admin-token') || "";
                    await deleteUser(id, token);
                    setPersonnel(personnel.filter(p => p._id !== id));
                    toast.success("OPERATOR_REMOVED_FROM_SECTOR");
                } catch (e) {
                    toast.error("TERMINATION_FAILED");
                }
            }
        });
        setIsConfirmOpen(true);
    };

    const handleRoleUpdate = (id: string, currentRole: string) => {
        const newRole = currentRole === 'admin' ? 'user' : 'admin';
        const action = newRole === 'admin' ? "PROMOTE" : "DEMOTE";
        
        setConfirmConfig({
            title: "Update Clearance",
            message: `Are you sure you want to ${action.toLowerCase()} this operator's security clearance level?`,
            confirmText: action,
            type: "warning",
            onConfirm: async () => {
                try {
                    const token = localStorage.getItem('kavon-admin-token') || "";
                    await updateUserRole(id, newRole, token);
                    toast.success(`CLEARANCE_UPDATED: Operator ${action}D`);
                    fetchPersonnel();
                } catch (e) {
                    toast.error("CLEARANCE_UPDATE_FAILED");
                }
            }
        });
        setIsConfirmOpen(true);
    };

    const filteredPersonnel = personnel.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        p.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-10">
            <header className="flex justify-between items-end border-l-2 border-brand-volt pl-8">
                <div className="space-y-2">
                    <span className="font-mono text-[13px] text-white/40 uppercase tracking-[0.4em]">Node_Status / Personnel</span>
                    <h1 className="text-4xl font-black italic uppercase tracking-tighter text-white">Operator<span className="text-brand-volt">_Oversight</span></h1>
                </div>
                <div className="px-6 py-4 tactical-glass flex items-center gap-3">
                    <Users size={16} className="text-brand-volt" />
                    <span className="font-mono text-[13px] uppercase tracking-widest text-white/60">Total_Operators: {personnel.length}</span>
                </div>
            </header>

            {/* Filter Bar */}
            <div className="p-4 tactical-glass">
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                    <input 
                        type="text" 
                        placeholder="SEARCH_OPERATOR_BY_NAME_OR_CIPHER..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-black/40 border border-white/5 p-4 pl-12 font-mono text-xs uppercase focus:border-brand-volt outline-none transition-all text-white"
                    />
                </div>
            </div>

            <div className="tactical-glass overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-white/5 border-b border-white/5 font-mono text-[12px] uppercase tracking-widest text-white/40">
                        <tr>
                            <th className="p-6">Operator_ID</th>
                            <th className="p-6">Contact_Ciphers</th>
                            <th className="p-6">Clearance_Level</th>
                            <th className="p-6">Division_Credits</th>
                            <th className="p-6 text-right">Security_Ops</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {isLoading ? (
                            Array.from({ length: 5 }).map((_, i) => (
                                <tr key={i} className="animate-pulse"><td colSpan={5} className="p-8 h-20 bg-white/[0.01]" /></tr>
                            ))
                        ) : filteredPersonnel.length === 0 ? (
                            <tr><td colSpan={5} className="p-20 text-center text-white/20 font-mono text-xs uppercase tracking-[0.5em]">NO_PERSONNEL_DETECTED_IN_SECTOR</td></tr>
                        ) : filteredPersonnel.map((user) => (
                            <tr key={user._id} className="hover:bg-white/[0.02] transition-colors group">
                                <td className="p-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-brand-volt/10 border border-brand-volt/20 flex items-center justify-center text-brand-volt font-black italic">
                                            {user.name.charAt(0)}
                                        </div>
                                        <div className="space-y-1">
                                            <p className="font-bold text-xs uppercase tracking-wider">{user.name}</p>
                                            <p className="font-mono text-[11px] text-white/20 uppercase tracking-tighter">ID: {user._id.toUpperCase()}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-6">
                                    <div className="flex items-center gap-2 text-white/60">
                                        <Mail size={12} className="text-white/20" />
                                        <span className="font-mono text-xs lowercase">{user.email}</span>
                                    </div>
                                </td>
                                <td className="p-6">
                                    <div className={`flex items-center gap-2 font-mono text-[12px] uppercase tracking-widest ${user.role === 'admin' ? 'text-brand-volt' : 'text-white/40'}`}>
                                        {user.role === 'admin' ? <ShieldCheck size={14} /> : <Shield size={14} />}
                                        {user.role}
                                    </div>
                                </td>
                                <td className="p-6">
                                    <div className="flex items-center gap-2 text-brand-volt">
                                        <Award size={14} />
                                        <span className="font-mono text-xs font-black">{user.loyaltyPoints?.toLocaleString() || 0} CR</span>
                                    </div>
                                </td>
                                <td className="p-6 text-right">
                                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button 
                                            onClick={() => handleRoleUpdate(user._id, user.role)}
                                            className="p-2 hover:bg-brand-volt/10 transition-all text-white/20 hover:text-brand-volt" 
                                            title="UPDATE_CLEARANCE"
                                        >
                                            <Shield size={16} />
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(user._id)}
                                            className="p-2 hover:bg-red-500/10 transition-all text-white/20 hover:text-red-500" 
                                            title="TERMINATE_OPERATOR"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <ConfirmModal 
                isOpen={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                onConfirm={confirmConfig?.onConfirm || (() => {})}
                title={confirmConfig?.title || ""}
                message={confirmConfig?.message || ""}
                confirmText={confirmConfig?.confirmText}
                type={confirmConfig?.type}
            />
        </div>
    );
}
