import Link from 'next/link';

export default function PrivacyPage() {
    return (
        <main className="min-h-screen bg-black px-6 pb-24 pt-44 text-white">
            <div className="mx-auto max-w-4xl">
                <p className="mb-4 font-mono text-xs uppercase tracking-[0.4em] text-brand-volt">Legal // Privacy</p>
                <h1 className="mb-12 text-5xl font-black uppercase italic">Privacy Policy</h1>
                <div className="space-y-10 font-mono text-sm leading-relaxed text-white/60">
                    <section>
                        <h2 className="mb-3 font-bold uppercase tracking-widest text-white">Information we use</h2>
                        <p>We use account, contact, delivery, order, and support information to operate the store, fulfill orders, prevent misuse, and provide customer service.</p>
                    </section>
                    <section>
                        <h2 className="mb-3 font-bold uppercase tracking-widest text-white">Payments and storage</h2>
                        <p>Cash on Delivery is currently the available payment method, so this website does not collect payment-card credentials. Account messages are stored separately for each signed-in user on the device.</p>
                    </section>
                    <section>
                        <h2 className="mb-3 font-bold uppercase tracking-widest text-white">Service providers</h2>
                        <p>Information may be processed by hosting, database, image-storage, email, and delivery providers only as needed to run the service. We do not claim to sell customer information.</p>
                    </section>
                    <section>
                        <h2 className="mb-3 font-bold uppercase tracking-widest text-white">Your choices</h2>
                        <p>Contact KAVON to ask about your account information or request an update. Security and retention practices may change as the service develops.</p>
                    </section>
                </div>
                <Link href="/contact" className="mt-12 inline-block border border-brand-volt px-6 py-3 font-mono text-xs uppercase tracking-widest text-brand-volt">
                    Contact KAVON
                </Link>
            </div>
        </main>
    );
}
