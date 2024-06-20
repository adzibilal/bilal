import ChatComponent from "@/components/chat";
import Image from "next/image";

export default function Home() {
  return (
   <div className="w-screen h-screen flex items-center justify-center">
    <ChatComponent />
   </div>
  );
}
