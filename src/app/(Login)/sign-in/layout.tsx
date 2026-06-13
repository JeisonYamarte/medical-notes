import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
export default async function SignInLayout({ children }: { children: React.ReactNode }) {
    const session = await getServerSession(authOptions);
    

    if (session !== null) {
        redirect("/dashboard");
    }
    
    return (
        <div className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden px-4 py-10 sm:px-6 md:px-12 lg:px-16 xl:px-24">
            <div className="pointer-events-none absolute -left-10 top-6 h-56 w-56 rounded-full bg-secondary/35 blur-3xl" />
            <div className="pointer-events-none absolute -right-14 bottom-4 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />
            {children}
        </div>
    );
}