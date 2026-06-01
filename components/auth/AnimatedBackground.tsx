const AnimatedBackground = () => {
    return (
        <div className="fixed inset-0 -z-10 overflow-hidden bg-background">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(15,23,42,0.08),transparent_42%),radial-gradient(circle_at_20%_18%,rgba(20,184,166,0.10),transparent_30%),radial-gradient(circle_at_80%_8%,rgba(20,184,166,0.08),transparent_24%),linear-gradient(to_bottom,rgba(255,255,255,0.78),rgba(255,255,255,0.94))] dark:bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.06),transparent_42%),radial-gradient(circle_at_20%_18%,rgba(20,184,166,0.12),transparent_30%),radial-gradient(circle_at_80%_8%,rgba(20,184,166,0.08),transparent_24%),linear-gradient(to_bottom,rgba(9,9,11,0.84),rgba(9,9,11,1))]" />
            <div className="absolute inset-0 bg-[linear-gradient(rgba(15,23,42,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,0.045)_1px,transparent_1px)] bg-[size:30px_30px] opacity-35 [mask-image:radial-gradient(circle_at_center,black_52%,transparent_100%)] dark:bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)]" />
        </div>
    );
};

export default AnimatedBackground;
