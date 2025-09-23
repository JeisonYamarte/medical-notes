
export default function SignInLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center p-24">
            {children}
        </div>
    );
}