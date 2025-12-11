
export default function SignUpLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-dvh flex-col items-center justify-center p-4 sm:p-6 md:p-12 lg:p-16 xl:p-24">
            {children}
        </div>
    );
}