import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema({
  promoBanner: {
    enabled: { type: Boolean, default: true },
    text: { type: String, default: "FREE STANDARD DELIVERY FROM LKR 10,000 IN COLOMBO / LKR 15,000 OUTSTATION" },
    link: { type: String, default: "/shop" }
  },
  popupBanner: {
    enabled: { type: Boolean, default: false },
    title: { type: String, default: "JOIN THE DIVISION" },
    text: { type: String, default: "Get exclusive access to archival drops and tactical intel." },
    buttonText: { type: String, default: "SECURE ACCESS" },
    buttonLink: { type: String, default: "/shop" },
    image: { type: String, default: "/logo/story-main.jpeg" }
  },
  maintenanceMode: { type: Boolean, default: false },
  contactEmail: { type: String, default: "hq@kavon.net" },
  contactPhone: { type: String, default: "+94 77 123 4567" },
  activeAlert: {
    enabled: { type: Boolean, default: false },
    message: { type: String, default: "" },
    type: { type: String, enum: ['info', 'warning', 'critical'], default: 'info' }
  },
  heroSlides: {
    type: [{
      id: String,
      video: String,
      title: String,
      tagline: String,
      tag: String,
      desc: String
    }],
    default: [
      {
        id: "01",
        video: "/videos/hero-1.mp4",
        title: "KAVON",
        tagline: "WEAR POWER. WEAR KAVON.",
        tag: "SHADOW_UNIT",
        desc: "TACTICAL ADAPTATION FOR THE URBAN NOMAD. ENGINEERED IN THE VOID."
      }
    ]
  },
  heroCountdown: { type: Date, default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) }
}, { timestamps: true });

const Settings = mongoose.models.Settings || mongoose.model('Settings', settingsSchema);
export default Settings;
