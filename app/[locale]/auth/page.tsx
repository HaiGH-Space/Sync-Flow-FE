import AnimatedBackground from "@/components/auth/AnimatedBackground";
import AuthCard from "@/components/auth/AuthCard";

export default function SignInPage() {
    return (
        <main className="relative flex min-h-dvh items-center justify-center px-4 py-8 sm:px-6 sm:py-12">
            <AnimatedBackground />
            <div className="relative z-10 w-full flex justify-center">
                <AuthCard />
            </div>
        </main>
    );
}