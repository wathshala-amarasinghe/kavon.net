"use client";

import React from 'react';
import { ContactHero } from '@/components/contact/ContactHero';
import { ContactOptions } from '@/components/contact/ContactOptions';
import { ContactForm } from '@/components/contact/ContactForm';
import { SupportMessage } from '@/components/contact/SupportMessage';
import { FAQ } from '@/components/contact/FAQ';

export default function ContactPage() {
    return (
        <div className="bg-brand-black min-h-screen text-white selection:bg-brand-volt tracking-[0.05em]">

            <main className="pt-48 pb-20 px-6 max-w-[1400px] mx-auto space-y-32">
                <section className="tracking-tighter">
                    <ContactHero />
                </section>

                <section className="tracking-[0.1em]">
                    <ContactOptions />
                </section>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
                    <div className="tracking-wide">
                        <ContactForm />
                    </div>

                    <div className="space-y-20 tracking-normal">
                        <SupportMessage />
                        <FAQ />
                    </div>
                </div>
            </main>
        </div>
    );
}
