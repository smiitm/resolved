"use client"
import { LoginButton, useAuthAction } from "@/components/auth/login-button"
import React from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { ArrowRight, SquareCheckBig, UserRoundSearch, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

interface AuroraBarsProps {
  className?: string;
}

export default function AuroraBars({ className }: AuroraBarsProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  const handleAuthAction = useAuthAction();
  const router = useRouter();

  React.useEffect(() => {
    setMounted(true);

    // Check if user is logged in and has a profile
    const checkAuth = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('username')
          .eq('id', user.id)
          .single();

        if (profile?.username) {
          router.push(`/${profile.username}`);
        }
      }
    };
    checkAuth();
  }, [router]);

  const isDark = mounted ? resolvedTheme === "dark" : true;

  // Heights relative to the container, creating a V-shape
  const bars = [
    { height: "65%", opacity: 0.3 },
    { height: "50%", opacity: 0.4 },
    { height: "40%", opacity: 0.5 },
    { height: "30%", opacity: 0.6 },
    { height: "25%", opacity: 0.7 },
    { height: "20%", opacity: 0.8 },
    { height: "15%", opacity: 0.9 }, // Center
    { height: "20%", opacity: 0.8 },
    { height: "25%", opacity: 0.7 },
    { height: "30%", opacity: 0.6 },
    { height: "40%", opacity: 0.5 },
    { height: "50%", opacity: 0.4 },
    { height: "65%", opacity: 0.3 },
  ];

  return (
    <div className={isDark ? "dark" : ""}>
      <div
        className={cn(
          "relative w-full min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white overflow-hidden font-sans selection:bg-violet-500/30",
          className
        )}
      >
        {/* Navbar */}
        <nav className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-4 sm:px-6 sm:py-6 max-w-7xl mx-auto w-full">
          {/* Logo */}
          <div className="flex items-center gap-1.5 sm:gap-2 font-bold text-base sm:text-xl tracking-tight">
            <SquareCheckBig strokeWidth={2.5} className="w-5 h-5 sm:w-6 sm:h-6" />
            Resolved
          </div>

          {/* Links */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-500 dark:text-zinc-400">
            <a
              href="#how-it-works"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer"
            >
              How it Works
            </a>
            <a
              href="#features"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer"
            >
              Features
            </a>
          </div>

          {/* Auth */}
          <div className="flex items-center gap-3 sm:gap-6 text-xs sm:text-sm font-medium">
            <LoginButton />
            <button
              onClick={() => setTheme(isDark ? "light" : "dark")}
              className="p-1.5 sm:p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-900 dark:text-white transition-colors"
            >
              {isDark ? <Sun className="w-4 h-4 sm:w-5 sm:h-5" /> : <Moon className="w-4 h-4 sm:w-5 sm:h-5" />}
            </button>
          </div>
        </nav>

        {/* Hero Section with Aurora Bars */}
        <div className="relative min-h-screen">
          {/* Bars Background */}
          <div className="absolute inset-0 flex items-end w-full h-full gap-0 justify-between pb-0 pointer-events-none">
            {bars.map((bar, index) => (
              <motion.div
                key={index}
                className="w-full rounded-t-sm bg-linear-to-t from-violet-400 via-violet-400/60 dark:from-violet-600 dark:via-violet-600/60 to-transparent"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: bar.height, opacity: 1 }}
                transition={{
                  duration: 0.8,
                  delay: Math.abs(index - Math.floor(bars.length / 2)) * 0.1,
                  ease: "easeOut",
                }}
              />
            ))}
          </div>

          {/* Gradient Overlay to fade top and bottom */}
          <div className="absolute inset-0 bg-linear-to-b from-white via-transparent to-white/60 dark:from-zinc-950 dark:via-transparent dark:to-zinc-950/30 pointer-events-none" />

          {/* Hero Content */}
          <div className="relative z-10 flex flex-col items-center justify-center min-h-screen text-center px-8 sm:px-4 pt-20">
            <h1 className="text-3xl sm:text-5xl md:text-7xl font-bold tracking-tight mb-4 sm:mb-8 max-w-5xl leading-tight">
              Don't just set goals <br className="hidden sm:block" /> Lock them in.
            </h1>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm sm:text-lg md:text-xl max-w-2xl mb-12 leading-relaxed">
              Accountability platform that forces you to stick to your word. <br className="hidden sm:block" /> 10 Goals at max. Public accountability. No turning back.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-6 mb-24">
              <button
                className="flex items-center justify-start gap-2 sm:gap-3 bg-zinc-900 dark:bg-white text-white dark:text-black py-1.5 sm:py-2 rounded-full text-sm sm:text-base font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all hover:scale-105 active:scale-95"
                style={{ paddingLeft: '4px', paddingRight: '16px' }}
                onClick={handleAuthAction}
              >
                <div className="bg-white dark:bg-black rounded-full p-1.5 sm:p-2 ml-0.5 sm:ml-1"><UserRoundSearch className="w-3 h-3 sm:w-4 sm:h-4 text-black dark:text-white" /></div>
                Claim your username
              </button>
            </div>

            <div className="flex flex-col items-center gap-8 w-full max-w-4xl mx-auto">
              <p className="text-zinc-500 dark:text-zinc-500 text-xs sm:text-sm font-medium tracking-wide uppercase">
                Goals lock on Jan 3rd. <span className="text-zinc-900 dark:text-white/80">Stay Resolved.</span>
              </p>
            </div>
          </div>
        </div>

        {/* How it Works Section */}
        <section id="how-it-works" className="relative z-10 py-20 sm:py-32 px-4 sm:px-6 bg-white dark:bg-zinc-950 scroll-mt-20">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16 sm:mb-20"
            >
              <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4">
                How it Works
              </h2>
              <p className="text-zinc-500 dark:text-zinc-400 text-sm sm:text-lg max-w-xl mx-auto">
                A simple 3-step process to lock in your goals
              </p>
            </motion.div>

            <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-center">
              {/* Left side - Sample Image */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="w-full lg:w-3/5 shrink-0"
              >
                <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-zinc-200 dark:border-zinc-800">
                  <img
                    src="/sample.png"
                    alt="Resolved App Preview"
                    className="w-full h-auto object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/20 to-transparent pointer-events-none" />
                </div>
              </motion.div>

              {/* Right side - Cards stacked vertically */}
              <div className="w-full lg:w-2/5 flex flex-col gap-4 sm:gap-6">
                {/* Step 1 */}
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="group"
                >
                  <div className="bg-zinc-50 dark:bg-zinc-900 border border-transparent hover:border-zinc-900/10 dark:hover:border-white/10 rounded-2xl p-5 sm:p-6 transition-colors duration-300">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 font-bold text-base sm:text-lg">
                        1
                      </span>
                      <span className="text-xs font-semibold uppercase tracking-wider text-violet-600 dark:text-violet-400">
                        The Commitment
                      </span>
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold mb-2 text-zinc-900 dark:text-white">
                      Define your year.
                    </h3>
                    <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed">
                      Set up to 10 core goals and 30 sub-goals. Be intentional—once you save, you can't change them just because it gets hard.
                    </p>
                  </div>
                </motion.div>

                {/* Step 2 */}
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="group"
                >
                  <div className="bg-zinc-50 dark:bg-zinc-900 border border-transparent hover:border-zinc-900/10 dark:hover:border-white/10 rounded-2xl p-5 sm:p-6 transition-colors duration-300">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 font-bold text-base sm:text-lg">
                        2
                      </span>
                      <span className="text-xs font-semibold uppercase tracking-wider text-violet-600 dark:text-violet-400">
                        The Lock
                      </span>
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold mb-2 text-zinc-900 dark:text-white">
                      The Jan 3rd Deadline.
                    </h3>
                    <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed">
                      After January 3rd, your goals are frozen. No deleting, no tweaking. Your roadmap is set in stone for the next 90 days.
                    </p>
                  </div>
                </motion.div>

                {/* Step 3 */}
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="group"
                >
                  <div className="bg-zinc-50 dark:bg-zinc-900 border border-transparent hover:border-zinc-900/10 dark:hover:border-white/10 rounded-2xl p-5 sm:p-6 transition-colors duration-300">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 font-bold text-base sm:text-lg">
                        3
                      </span>
                      <span className="text-xs font-semibold uppercase tracking-wider text-violet-600 dark:text-violet-400">
                        The Review
                      </span>
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold mb-2 text-zinc-900 dark:text-white">
                      Quarterly Windows.
                    </h3>
                    <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed">
                      Life happens. Every quarter, a 3-day window opens for you to adjust your trajectory. Edits are tracked publicly to keep you honest.
                    </p>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Highlights - Bento Grid */}
        <section id="features" className="relative z-10 py-20 sm:py-32 px-4 sm:px-6 bg-zinc-50 dark:bg-zinc-900/50 scroll-mt-20">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16 sm:mb-20"
            >
              <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4">
                Built for Accountability
              </h2>
              <p className="text-zinc-500 dark:text-zinc-400 text-sm sm:text-lg max-w-xl mx-auto">
                Features designed to keep you on track
              </p>
            </motion.div>

            {/* Bento Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {/* Feature A - Social Accountability (Large) */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="md:col-span-2 lg:col-span-2 group"
              >
                <div className="relative h-full overflow-hidden rounded-3xl bg-linear-to-br from-violet-500/10 via-purple-500/10 to-indigo-500/10 dark:from-violet-500/20 dark:via-purple-500/20 dark:to-indigo-500/20 border border-zinc-200 dark:border-zinc-800 p-6 sm:p-8 lg:p-10">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-violet-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-violet-500/30 transition-all duration-700" />
                  <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-2 h-2 rounded-full bg-violet-500 animate-pulse" />
                      <span className="text-xs font-semibold uppercase tracking-wider text-violet-600 dark:text-violet-400">
                        Social Accountability
                      </span>
                    </div>
                    <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-4 text-zinc-900 dark:text-white max-w-md">
                      Public Profile Pages
                    </h3>
                    <p className="text-zinc-600 dark:text-zinc-300 text-sm sm:text-base lg:text-lg leading-relaxed max-w-lg">
                      "Silence is comfortable. Public profile pages aren't. Share your <span className="font-mono text-violet-600 dark:text-violet-400 bg-violet-100 dark:bg-violet-900/30 px-2 py-0.5 rounded">/username</span> link and let your network keep you accountable."
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Feature B - Edited Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="group"
              >
                <div className="relative h-full overflow-hidden rounded-3xl bg-zinc-100 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 p-6 sm:p-8">
                  <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/20 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2 group-hover:bg-purple-500/30 transition-all duration-700" />
                  <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider bg-purple-500/20 dark:bg-purple-500/30 text-purple-600 dark:text-purple-400 rounded">
                        Edited
                      </span>
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold mb-3 text-zinc-900 dark:text-white">
                      The "Edited" Badge
                    </h3>
                    <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed">
                      "Changed your goal? We mark it. A subtle badge of shame—or realistic adjustment? You decide. Total transparency on your profile."
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Feature C - Visual Progress */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="md:col-span-2 lg:col-span-3 group"
              >
                <div className="relative h-full overflow-hidden rounded-3xl bg-linear-to-r from-indigo-500/10 via-violet-500/10 to-purple-500/10 dark:from-indigo-500/20 dark:via-violet-500/20 dark:to-purple-500/20 border border-zinc-200 dark:border-zinc-800 p-6 sm:p-8 lg:p-10">
                  <div className="absolute top-1/2 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-indigo-500/20 transition-all duration-700" />
                  <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                        <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                          Visual Progress
                        </span>
                      </div>
                      <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-4 text-zinc-900 dark:text-white">
                        Watch Your Year Fill Up
                      </h3>
                      <p className="text-zinc-600 dark:text-zinc-300 text-sm sm:text-base lg:text-lg leading-relaxed max-w-lg">
                        "Track progress with a clean, distraction-free interface. Mark sub-goals as complete and watch your year fill up."
                      </p>
                    </div>
                    {/* Visual Progress Bar Demo */}
                    <div className="shrink-0 w-full lg:w-80">
                      <div className="bg-white dark:bg-zinc-900 rounded-2xl p-4 sm:p-6 border border-zinc-200 dark:border-zinc-700 shadow-lg">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Q1 Progress</span>
                          <span className="text-xs font-bold text-violet-600 dark:text-violet-400">67%</span>
                        </div>
                        <div className="w-full h-2 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                          <motion.div
                            className="h-full bg-linear-to-r from-violet-500 to-indigo-500 rounded-full"
                            initial={{ width: 0 }}
                            whileInView={{ width: "67%" }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
                          />
                        </div>
                        <div className="mt-4 space-y-2">
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded bg-violet-500 flex items-center justify-center">
                              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                            <span className="text-xs text-zinc-600 dark:text-zinc-300 line-through">Learn TypeScript</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded bg-violet-500 flex items-center justify-center">
                              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                            <span className="text-xs text-zinc-600 dark:text-zinc-300 line-through">Build 3 projects</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded border-2 border-zinc-300 dark:border-zinc-600" />
                            <span className="text-xs text-zinc-600 dark:text-zinc-300">Get first client</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
