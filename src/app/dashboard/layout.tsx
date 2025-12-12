import React from 'react';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from 'next/navigation';

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from '@/components/app-sidebar';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
    const session = await getServerSession(authOptions);
    if (session === null) {
        redirect('/sign-in');
    }
    return (
        <SidebarProvider>
            <div className="flex w-full min-h-dvh">
                <AppSidebar />
                <div className="flex-1 flex flex-col h-full overflow-hidden">
                    <SidebarTrigger className="mb-3 sm:mb-4 flex-shrink-0 p-3 sm:p-4 md:p-5 lg:p-6" />
                    <div className="flex-1 px-3 sm:px-4 md:px-5 lg:px-6 pb-3 sm:pb-4 md:pb-5 lg:pb-6 overflow-hidden">
                        {children}
                    </div>
                </div>
            </div>
        </SidebarProvider>
    );
}