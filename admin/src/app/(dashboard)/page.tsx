"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Activity, DollarSign, Package, Users, ArrowUpRight, ShieldCheck, RefreshCcw, Zap } from 'lucide-react';
import Link from 'next/link';
import DeploymentHeatmap from '@/components/dashboard/DeploymentHeatmap';
import { getCampaigns, getOrders, getUsers } from '@/lib/api';
import { FormattedPrice } from '@/components/ui/FormattedPrice';

export default function OverviewPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [heatmapData, setHeatmapData] = useState<number[][]>([]);
  const [activeDrop, setActiveDrop] = useState<any>(null);
  const [userCount, setUserCount] = useState(0);
  const [syncError, setSyncError] = useState(false);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('kavon-admin-token');
        if (token) {
          const [data, users, campaigns] = await Promise.all([
            getOrders(token),
            getUsers(token),
            getCampaigns(),
          ]);
          setOrders(data);
          setUserCount(Array.isArray(users) ? users.length : 0);


          const matrix = Array.from({ length: 7 }, () => Array.from({ length: 24 }, () => 0));
          data.forEach((order: any) => {
            const date = new Date(order.createdAt);
            const day = (date.getDay() + 6) % 7;
            const hour = date.getHours();
            if (day >= 0 && day < 7 && hour >= 0 && hour < 24) {
              matrix[day][hour]++;
            }
          });
          setHeatmapData(matrix);


          const now = Date.now();
          const activeCampaign = (Array.isArray(campaigns) ? campaigns : []).find((campaign: any) =>
            campaign.status === 'Active' &&
            new Date(campaign.startDate).getTime() <= now &&
            new Date(campaign.endDate).getTime() >= now
          );
          const campaignProduct = activeCampaign?.products?.[0];
          setActiveDrop(campaignProduct ? { ...campaignProduct, campaignName: activeCampaign.name } : null);
        }
      } catch (err) {
        console.error("Dashboard sync failure:", err);
        setSyncError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const stats = [
    {
      label: 'GROSS_REVENUE',
      value: orders
        .filter((order) => !['Cancelled', 'Refunded'].includes(order.status))
        .reduce((sum, order) => sum + Number(order.totalPrice || 0), 0),
      isPrice: true,
      change: 'LIVE',
      icon: <DollarSign className="text-brand-volt" />
    },
    {
      label: 'ACTIVE_ORDERS',
      value: orders.filter(o => o.status !== 'Delivered' && o.status !== 'Cancelled').length,
      change: 'LIVE',
      icon: <Package className="text-brand-volt" />
    },
    {
      label: 'OPERATOR_COUNT',
      value: userCount,
      change: 'LIVE',
      icon: <Users className="text-brand-volt" />
    },
    {
      label: 'API_CONNECTION',
      value: syncError ? 'DEGRADED' : 'ONLINE',
      change: syncError ? 'CHECK' : 'STABLE',
      icon: <Activity className="text-brand-volt" />
    },
  ];

  return (
    <div className="space-y-12">
      <header className="flex justify-between items-end border-l-2 border-brand-volt pl-8">
        <div className="space-y-2">
          <span className="font-mono text-[13px] text-white/40 uppercase tracking-[0.4em]">Node_Status / Overview</span>
          <h1 className="text-5xl font-black italic uppercase tracking-tighter">Tactical<span className="text-brand-volt">_Summary</span></h1>
        </div>
        <div className="flex items-center gap-4 text-right">
          <div className="space-y-1">
            <p className="font-mono text-[12px] text-white/40 uppercase tracking-widest">Global_Sync_Status</p>
            <p className="font-mono text-xs text-brand-volt uppercase font-bold">
              {loading ? 'SYNCING_LOGISTICS...' : 'READY_FOR_DEPLOYMENT'}
            </p>
          </div>
          <div className={`w-12 h-12 rounded-full border border-white/10 flex items-center justify-center ${loading ? 'animate-spin' : ''}`}>
            {loading ? <RefreshCcw size={20} className="text-brand-volt" /> : <ShieldCheck size={20} className="text-brand-volt" />}
          </div>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-8 tactical-glass group hover:border-brand-volt/20 transition-all"
          >
            <div className="flex justify-between items-start mb-6">
              <div className="p-3 bg-white/5 rounded-sm group-hover:bg-brand-volt/10 transition-colors">
                {stat.icon}
              </div>
              <span className={`font-mono text-[12px] ${stat.change === 'LIVE' || stat.change === 'STABLE' ? 'text-brand-volt' : 'text-white/40'}`}>
                {stat.change}
              </span>
            </div>
            <div className="space-y-1">
              <p className="font-mono text-[12px] text-white/40 uppercase tracking-widest">{stat.label}</p>
              <div className="text-2xl font-black italic uppercase text-white">
                {stat.isPrice ? (
                  <FormattedPrice amount={Number(stat.value)} />
                ) : (
                  stat.value
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Secondary Intelligence Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 p-10 tactical-glass space-y-8">
          <div className="flex justify-between items-center border-b border-white/5 pb-6">
            <h3 className="font-black italic uppercase tracking-wider">Deployment_Heatmap</h3>
            <Link
              href="/orders"
              className="font-mono text-[12px] text-brand-volt uppercase tracking-widest flex items-center gap-2 hover:opacity-50 transition-opacity"
            >
              View_Full_Data <ArrowUpRight size={14} />
            </Link>
          </div>
          <div className="min-h-80 w-full flex items-center justify-center">
            {loading ? (
              <div className="flex flex-col items-center gap-4">
                <RefreshCcw size={24} className="text-brand-volt animate-spin" />
                <span className="font-mono text-[12px] text-brand-volt/40 uppercase tracking-[0.5em]">Syncing_Telemetry...</span>
              </div>
            ) : (
              <DeploymentHeatmap data={heatmapData} />
            )}
          </div>
        </div>

        <div className="flex flex-col gap-8">
          <div className="p-10 tactical-glass space-y-6 border-l-2 border-brand-volt">
            <div className="flex items-center gap-3 text-brand-volt">
              <Zap size={18} className="animate-pulse" />
              <h3 className="font-black uppercase tracking-widest text-sm">Active_Tactical_Drop</h3>
            </div>
            {activeDrop ? (
              <div className="space-y-4">
                <div className="aspect-square bg-white/5 border border-white/10 overflow-hidden">
                  <img src={activeDrop.images?.[0]} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all" alt="" />
                </div>
                <div className="space-y-1">
                  <p className="font-mono text-[9px] text-white/30 uppercase tracking-widest">{activeDrop.campaignName}</p>
                  <p className="font-bold text-xs uppercase tracking-wider">{activeDrop.name}</p>
                  <p className="font-mono text-[10px] text-brand-volt uppercase font-bold">
                    LKR {Number(activeDrop.price || 0).toLocaleString()}
                  </p>
                </div>
                <Link
                  href="/inventory"
                  className="block w-full py-3 border border-white/10 text-center font-mono text-[10px] uppercase tracking-widest hover:bg-white hover:text-black transition-all"
                >
                  Modify_Deployment
                </Link>
              </div>
            ) : (
              <div className="py-10 text-center border border-dashed border-white/10">
                <p className="font-mono text-[10px] text-white/20 uppercase tracking-[0.2em]">No_Active_Deployment</p>
              </div>
            )}
          </div>

          <div className="p-10 tactical-glass space-y-8 flex-1">
            <div className="flex justify-between items-center border-b border-white/5 pb-6">
              <h3 className="font-black italic uppercase tracking-wider">Recent_Manifests</h3>
              <Link
                href="/orders"
                className="font-mono text-[12px] text-brand-volt/40 uppercase tracking-widest flex items-center gap-2 hover:text-brand-volt transition-colors"
              >
                Logistics <ArrowUpRight size={14} />
              </Link>
            </div>
            <div className="space-y-6">
              {loading ? (
                [1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center justify-between py-4 border-b border-white/5 last:border-0 opacity-20 animate-pulse">
                    <div className="w-24 h-2 bg-white/10 rounded" />
                    <div className="w-16 h-2 bg-white/10 rounded" />
                  </div>
                ))
              ) : orders.length > 0 ? (
                orders.slice(0, 3).map((order) => (
                  <div key={order._id} className="flex items-center justify-between py-4 border-b border-white/5 last:border-0">
                    <div className="space-y-1">
                      <p className="font-mono text-[12px] text-white uppercase font-bold tracking-widest">
                        KVN-{order._id.substring(order._id.length - 4).toUpperCase()}
                      </p>
                      <p className="font-mono text-[10px] text-white/40 uppercase">
                        {order.status}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-mono text-[11px] text-brand-volt font-bold">
                        LKR {order.totalPrice.toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-4 text-center">
                  <p className="font-mono text-[12px] text-white/20 uppercase tracking-widest">Empty</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
