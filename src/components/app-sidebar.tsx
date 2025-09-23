"use client"
import { 
    Sidebar, 
    SidebarContent,
    SidebarHeader,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarGroupLabel
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { HomeIcon, FileText, CloudUpload, Settings, LogOut} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";



const items = [
    {
        title: 'Home',
        url: '/dashboard',
        icon: HomeIcon
    },
        {
        title: 'Note list',
        url: '/dashboard/notes',
        icon: FileText
    },
        {
        title: 'Create new note',
        url: '/dashboard/notes/new',
        icon: FileText
    },
    {
        title: 'Upload PDF',
        url: '/dashboard/upload',
        icon: CloudUpload
    },
    {
        title: 'Settings',
        url: '/dashboard/settings',
        icon: Settings
    }
]


function AppSidebar() {
    const router = useRouter();
    const signOut = () => {
        // Aquí iría la lógica para cerrar sesión, como limpiar tokens, redirigir, etc.
        console.log("User signed out");
        // Por ejemplo, podrías redirigir al usuario a la página de inicio de sesión:
        router.push('/');
    };

    return (
            <Sidebar>
                <SidebarContent className="h-full"> 
                    <SidebarHeader className="flex flex-row items-center gap-2">
                        <img className="w-8 h-8" src="https://cdn-icons-png.flaticon.com/512/11711/11711702.png" alt="logo" />
                        <h3>Medical Notes</h3>
                    </SidebarHeader>
                    <SidebarGroup>
                    <SidebarGroupLabel>Application</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                        {items.map((item) => (
                            <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton asChild>
                                <Link href={item.url}>
                                <item.icon />
                                <span>{item.title}</span>
                                </Link>
                            </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                    </SidebarGroup>
                    <SidebarFooter className="mt-auto mb-5">
                        <Button onClick={signOut} className="bg-red-500"><LogOut />Logout</Button>
                    </SidebarFooter>
                </SidebarContent>
            </Sidebar>
    )
}

export { AppSidebar }