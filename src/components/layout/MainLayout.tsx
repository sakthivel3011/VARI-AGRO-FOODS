import { Outlet } from "react-router-dom";
import { TopBar } from "@/components/layout/TopBar";
import { NavBar } from "@/components/layout/NavBar";
import { Footer } from "@/components/layout/Footer";
import { AnonymousChatWidget } from "@/components/chat/AnonymousChatWidget";
import { VoiceOrderWidget } from "@/components/voice/VoiceOrderWidget";
import { ChatbotWidget } from "@/components/chatbot/ChatbotWidget";

export const MainLayout = () => {
  return (
    <>
      <TopBar />
      <NavBar />
      <main>
        <Outlet />
      </main>
      <Footer />
      <div className="md:hidden">
        <ChatbotWidget />
      </div>
      <div className="hidden md:block lg:hidden">
        <AnonymousChatWidget />
        <ChatbotWidget />
      </div>
      <div className="hidden lg:block">
        <AnonymousChatWidget />
        <VoiceOrderWidget />
        <ChatbotWidget />
      </div>
    </>
  );
};
