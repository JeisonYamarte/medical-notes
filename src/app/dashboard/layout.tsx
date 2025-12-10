import React from 'react';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from 'next/navigation';

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from '@/components/app-sidebar';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
    const session = await getServerSession(authOptions);
    console.log("layout dashboard pre if");
    if (session === null) {
        console.log("layout dashboard entro en el if");
        redirect('/sign-in');
    }
    console.log("layout dashboard post if");
    return (
        <SidebarProvider>
            <div className="flex  w-full">
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