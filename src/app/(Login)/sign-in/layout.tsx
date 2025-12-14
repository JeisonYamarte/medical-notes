import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
export default async function SignInLayout({ children }: { children: React.ReactNode }) {
    const session = await getServerSession(authOptions);
    

    if (session !== null) {
        redirect("/dashboard");
    }
    
    return (
        <div className="flex min-h-dvh flex-col items-center justify-center p-4 sm:p-6 md:p-12 lg:p-16 xl:p-24">
            {children}
        </div>
    );
}