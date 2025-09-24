import React from 'react';

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from '@/components/app-sidebar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <SidebarProvider>
            <div className="flex h-screen w-full">
                <AppSidebar />
                <div className="flex-1 flex flex-col h-full overflow-hidden">
                    <SidebarTrigger className="mb-4 flex-shrink-0 p-6" />
                    <div className="flex-1 px-6 pb-6 overflow-hidden">
                        {children}
                    </div>
                </div>
            </div>
        </SidebarProvider>
    );
}