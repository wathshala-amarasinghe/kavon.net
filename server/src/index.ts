import app from "./app";
import { startAnnouncementScheduler } from "./utils/scheduler";

const PORT = Number(process.env.PORT) || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    startAnnouncementScheduler();
});