
export default function SignUpLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden px-4 py-10 sm:px-6 md:px-12 lg:px-16 xl:px-24">
            <div className="pointer-events-none absolute -left-8 top-10 h-52 w-52 rounded-full bg-accent/30 blur-3xl" />
            <div className="pointer-events-none absolute -right-10 bottom-8 h-60 w-60 rounded-full bg-primary/20 blur-3xl" />
            {children}
        </div>
    );
}