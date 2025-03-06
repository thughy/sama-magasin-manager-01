
import { ReactNode } from "react";
import { Sidebar } from "./Sidebar";

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 md:ml-20 lg:ml-72 transition-all duration-300 animate-fade-in">
        <div className="p-6 md:p-8">{children}</div>
      </main>
    </div>
  );
}
