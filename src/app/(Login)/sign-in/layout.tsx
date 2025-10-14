import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
export default async function SignInLayout({ children }: { children: React.ReactNode }) {
    const session = await getServerSession(authOptions);
    
    console.log(session);
    if (session) {
        redirect("/dashboard");
    }
    
    return (
        <div className="flex min-h-screen flex-col items-center justify-center p-24">
            {children}
        </div>
    );
}