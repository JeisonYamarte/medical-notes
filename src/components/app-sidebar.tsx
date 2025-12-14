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
import { HomeIcon, FileText, CloudUpload, LogOut} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import Image from "next/image";



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
]


function AppSidebar() {
    const router = useRouter();

    const handleSignOut = () => {
        signOut().then(() => {
            router.push('/sign-in');
        }
        );
    };

    return (
            <Sidebar>
                <SidebarContent className="h-full"> 
                    <SidebarHeader className="flex flex-row items-center gap-2 p-3 sm:p-4">
                        <Image className="w-7 h-7 sm:w-8 sm:h-8"  width={32} height={32} src="/v1765285713/icono_nota_medica_nezds1.svg"  alt="logo" />
                        <h3 className="text-sm sm:text-base font-semibold">Medical Notes</h3>
                    </SidebarHeader>
                    <SidebarGroup>
                    <SidebarGroupLabel className="text-xs sm:text-sm">Application</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                        {items.map((item) => (
                            <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton asChild className="text-sm sm:text-base">
                                <Link href={item.url}>
                                <item.icon className="w-4 h-4 sm:w-5 sm:h-5" />
                                <span>{item.title}</span>
                                </Link>
                            </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                    </SidebarGroup>
                    <SidebarFooter className="mt-auto mb-4 sm:mb-5 px-2 sm:px-3">
                        <Button onClick={handleSignOut} className="bg-red-500 text-sm sm:text-base w-full"><LogOut className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />Logout</Button>
                    </SidebarFooter>
                </SidebarContent>
            </Sidebar>
    )
}

export { AppSidebar }