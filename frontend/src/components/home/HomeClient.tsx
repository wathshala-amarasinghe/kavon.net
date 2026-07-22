"use client";

import React, { useEffect, useState } from 'react';
import HeroSection from "@/sections/Hero";
import { BrandMarquee } from '@/sections/BrandMarquee';
import { FeaturedCollections } from '@/sections/FeaturedCollections';
import { BestSellers } from '@/sections/BestSellers';
import { NewDrops } from '@/sections/NewDrops';
import { ActiveCampaign } from '@/sections/ActiveCampaign';
import { BrandStory } from '@/sections/BrandStory';
import { LookbookBanner } from '@/sections/LookbookBanner';
import { Testimonials } from '@/sections/Testimonials';
import { Newsletter } from '@/sections/Newsletter';
import { CommunityUGC } from '@/sections/CommunityUGC';
import { PromoBanner } from '@/components/home/PromoBanner';
import { HomePopup } from '@/components/home/HomePopup';
import { getProducts, getCampaigns } from '@/lib/api';
import { CatalogProduct } from '@/types/product';
import { Campaign } from '@/sections/ActiveCampaign';

export default function HomeClient() {
  const [bestSellers, setBestSellers] = useState<CatalogProduct[]>([]);
  const [newDrops, setNewDrops] = useState<CatalogProduct[]>([]);
  const [activeCampaign, setActiveCampaign] = useState<Campaign | null>(null);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const [bestData, newData, campaignData] = await Promise.all([
          getProducts({ isBestSeller: true, limit: 8 }),
          getProducts({ isNewDrop: true, limit: 8 }),
          getCampaigns()
        ]);
        
        setBestSellers(bestData.products || []);
        setNewDrops(newData.products || []);
        
        const now = Date.now();
        const active = campaignData.find((campaign: Campaign) =>
          campaign.status === 'Active' &&
          new Date(campaign.startDate).getTime() <= now &&
          new Date(campaign.endDate).getTime() >= now
        );
        setActiveCampaign(active || null);
      } catch (error) {
        console.error("Failed to sync home sectors:", error);
      }
    };
    fetchHomeData();
  }, []);

  return (
    <div className="bg-brand-black text-white min-h-screen font-body selection:bg-[#df0715ff] selection:text-black">
      <main className="relative">
        <HomePopup />
        <section className="relative z-20">
          <HeroSection />
          <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-brand-black to-transparent" />
        </section>

        <div className="relative z-30 -mt-6 mb-20 rotate-[-1deg] scale-[1.02] bg-brand-black py-4 shadow-2xl border-y border-white/5">
          <BrandMarquee />
        </div>

        <div className="container mx-auto px-6">
          {activeCampaign && <ActiveCampaign campaign={activeCampaign} />}
          <FeaturedCollections />
        </div>

        <div className="relative py-32 flex items-center justify-center">
          <div className="absolute left-0 w-full h-px bg-white/10" />
          <div className="relative px-8 bg-brand-black flex flex-col items-center gap-2">
            <span className="text-[10px] tracking-[0.4em] text-[#df0715ff] uppercase font-bold animate-pulse">
              Curated Excellence
            </span>
            <div className="w-1 h-12 bg-gradient-to-b from-[#df0715ff] to-transparent" />
          </div>
        </div>

        <section className="bg-white/5 backdrop-blur-md py-20 rounded-t-[3rem]">
          <BestSellers products={bestSellers} />
        </section>

        <PromoBanner />

        <div className="relative py-24 bg-brand-black">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#df0715ff]/5 blur-[120px] rounded-full pointer-events-none" />
          <NewDrops products={newDrops} />
        </div>

        <section className="relative overflow-hidden border-y border-white/5">
          <div className="absolute left-0 top-0 w-1 h-full bg-[#df0715ff]/40" />
          <BrandStory />
        </section>

        <div className="relative my-20">
          <div className="absolute inset-0 bg-black/20 z-10 pointer-events-none" />
          <LookbookBanner />
        </div>

        <div className="container mx-auto px-6 py-20">
          <div className="flex items-baseline gap-4 mb-12">
            <h2 className="text-4xl font-light tracking-tighter">Voices of <span className="italic">Kavon</span></h2>
            <div className="flex-1 h-px bg-gradient-to-r from-white/20 to-transparent" />
          </div>
          <Testimonials />
        </div>

        <CommunityUGC />

        <section className="relative mt-20 bg-brand-black py-24 text-white rounded-t-[4rem] border-t border-white/5">
          <div className="absolute top-8 left-1/2 -translate-x-1/2 flex gap-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="w-1.5 h-1.5 rounded-full bg-white/20 animate-bounce" style={{ animationDelay: `${i * 0.2}s` }} />
            ))}
          </div>
          <Newsletter />
        </section>
      </main>

      <div className="fixed inset-0 pointer-events-none z-[100]">
        <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]" />
      </div>
    </div>
  );
}
