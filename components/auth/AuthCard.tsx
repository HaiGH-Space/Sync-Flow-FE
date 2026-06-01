"use client";
import {
  AnimatePresence,
  LazyMotion,
  domAnimation,
  m,
  type Variants,
} from "framer-motion";
import { useState } from "react";
import { useRef } from "react";
import LightBeam from "./LightBeam";
import z from "zod";
import { toast } from "sonner";
import { useForm } from "@tanstack/react-form";
import { LockIcon, MailIcon, UserIcon } from "lucide-react";
import AuthField from "./FieldAnimation";
import { Button } from "../ui/button";
import LogoAppAnimation from "../shared/LogoAppAnimation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useUserStore } from "@/lib/store/use-user-profile";
import { authService } from "@/lib/api/auth";
import SuccessState from "./SuccessState";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";

type AuthMode = "login" | "register";
type AuthState = "idle" | "loading" | "error" | "success";

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30,
    },
  },
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.15,
    },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.2 },
  },
};

const createLoginSchema = (
  tValidation: ReturnType<typeof useTranslations<"validation">>,
) =>
  z.object({
    email: z.email(tValidation("auth.email_invalid")),
    password: z.string().min(1, tValidation("auth.password_required")),
    name: z.string(),
  });

const createRegisterSchema = (
  tValidation: ReturnType<typeof useTranslations<"validation">>,
) =>
  z.object({
    email: z.email(tValidation("auth.email_invalid")),
    password: z.string().min(8, tValidation("auth.password_min")),
    name: z.string().min(2, tValidation("auth.name_min")),
  });

const toastId = "auth-toast";

type LoginValues = {
  email: string;
  password: string;
};

type RegisterValues = {
  email: string;
  password: string;
  name: string;
};

const defaultValues = {
  email: "",
  password: "",
  name: "",
};

const AuthCard = () => {
  const queryClient = useQueryClient();
  const { push } = useRouter();
  const [mode, setMode] = useState<AuthMode>("login");
  const [authState, setAuthState] = useState<AuthState>("idle");
  const tAuth = useTranslations("auth");
  const tValidation = useTranslations("validation");
  const { setUserProfile, userProfile } = useUserStore();
  const autoRedirectTimerRef = useRef<number | null>(null);
  const redirectTo =
    typeof window === "undefined"
      ? "/dashboard"
      : new URLSearchParams(window.location.search).get("redirectTo") ||
        "/dashboard";
  const currentSchema =
    mode === "login"
      ? createLoginSchema(tValidation)
      : createRegisterSchema(tValidation);
  const switchMode = (newMode: AuthMode) => {
    setMode(newMode);
    form.reset();
  };

  const loginMutation = useMutation({
    mutationFn: (data: LoginValues) => authService.login(data),
    onSuccess: (response) => {
      queryClient.setQueryData(["userProfile"], response.data);
      setUserProfile(response.data);
      setAuthState("success");
      toast.dismiss(toastId);

      if (response.data.hasSeenWelcome) {
        if (autoRedirectTimerRef.current !== null) {
          window.clearTimeout(autoRedirectTimerRef.current);
        }

        autoRedirectTimerRef.current = window.setTimeout(() => {
          push(redirectTo);
        }, 3000);
      }
    },
    onError: (error: Error) => {
      toast.error(error.message, { id: toastId });
      setAuthState("error");
    },
  });

  const registerMutation = useMutation({
    mutationFn: (data: RegisterValues) => authService.register(data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["userProfile"] });
      toast.success(tAuth("toast.register_success"), { id: toastId });
      setAuthState("success");
      setTimeout(() => {
        setAuthState("idle");
        switchMode("login");
      }, 3 * 1000);
    },
    onError: (error: Error) => {
      toast.error(error.message, { id: toastId });
      setAuthState("error");
    },
  });

  const form = useForm({
    defaultValues,
    validators: {
      onSubmit: currentSchema,
      onChange: currentSchema,
    },
    onSubmit: async ({ value }) => {
      setAuthState("loading");
      toast.loading(
        mode === "login"
          ? tAuth("toast.logging_in")
          : tAuth("toast.registering"),
        { id: toastId },
      );
      if (mode === "login") {
        loginMutation.mutate({ email: value.email, password: value.password });
      } else {
        registerMutation.mutate({
          email: value.email,
          password: value.password,
          name: value.name,
        });
      }
    },
  });

  return (
    <LazyMotion features={domAnimation}>
      <m.div
        layout
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="relative w-full max-w-md overflow-hidden rounded-[1.75rem] border border-border/70 bg-card/90 p-6 shadow-[0_28px_80px_-36px_rgba(15,23,42,0.55)] backdrop-blur-xl sm:p-8"
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(20,184,166,0.08),transparent_42%)] dark:bg-[radial-gradient(circle_at_top,rgba(20,184,166,0.14),transparent_42%)]" />
        <LightBeam />
        <AnimatePresence mode="wait">
          {authState === "success" ? (
            <>
              <m.div
                key="success"
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="text-center"
              >
                <SuccessState
                  isLogin={mode === "login"}
                  userName={userProfile?.name}
                  redirectTo={redirectTo}
                />
              </m.div>
            </>
          ) : (
            <m.div
              initial="hidden"
              animate="visible"
              exit="exit"
              key={mode}
              variants={containerVariants}
              className="relative"
            >
              <m.div variants={itemVariants} className="mb-8 space-y-4">
                <div className="space-y-2 text-center sm:text-left">
                  <p className="text-xs font-medium tracking-[0.24em] text-muted-foreground/80">
                    {tAuth("workspace_access")}
                  </p>
                  <LogoAppAnimation />
                </div>
                <p className="max-w-sm text-center text-sm leading-6 text-muted-foreground sm:text-left text-balance">
                  {mode === "login"
                    ? tAuth("login.subtitle")
                    : tAuth("register.subtitle")}
                </p>
                <p className="text-center text-xs text-muted-foreground sm:text-left">
                  {tAuth("workspace_support")}
                </p>
              </m.div>
              <form id="auth-form" action={form.handleSubmit} className="space-y-4">
                <AnimatePresence key={"form"}>
                  {mode === "register" && (
                    <AuthField
                      form={form}
                      name="name"
                      key="name"
                      variants={itemVariants}
                      placeholder={tAuth("register.name_placeholder")}
                      icon={UserIcon}
                    />
                  )}
                </AnimatePresence>
                <AuthField
                  form={form}
                  name="email"
                  key="email"
                  variants={itemVariants}
                  placeholder={
                    mode === "login"
                      ? tAuth("login.email_placeholder")
                      : tAuth("register.email_placeholder")
                  }
                  icon={MailIcon}
                />
                <AuthField
                  form={form}
                  name="password"
                  type="password"
                  key="password"
                  variants={itemVariants}
                  placeholder={
                    mode === "login"
                      ? tAuth("login.password_placeholder")
                      : tAuth("register.password_placeholder")
                  }
                  icon={LockIcon}
                />
                <m.div variants={itemVariants} className="mt-4">
                  <Button
                    className="h-11 w-full cursor-pointer rounded-xl text-sm font-medium transition-all hover:-translate-y-0.5 hover:shadow-lg active:translate-y-px"
                    type="submit"
                  >
                    {mode === "login"
                      ? tAuth("login.submit")
                      : tAuth("register.submit")}
                  </Button>
                </m.div>

                {/* Divider */}
                <m.div variants={itemVariants} className="flex items-center gap-4 py-2">
                  <div className="flex-1 h-px bg-border" />
                  <span className="text-xs font-medium tracking-[0.18em] text-muted-foreground">
                    {tAuth("login.divider_text")}
                  </span>
                  <div className="flex-1 h-px bg-border" />
                </m.div>

                <m.p
                  variants={itemVariants}
                  className="text-center text-sm text-muted-foreground"
                >
                  {mode === "login" ? (
                    <>
                      {tAuth("login.no_account")}{" "}
                      <button
                        type="button"
                        onClick={() => switchMode("register")}
                        className="cursor-pointer rounded-sm bg-transparent p-0 font-medium text-primary transition-colors hover:text-primary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
                      >
                        {tAuth("login.go_to_register")}
                      </button>
                    </>
                  ) : (
                    <>
                      {tAuth("login.have_account")}{" "}
                      <button
                        type="button"
                        onClick={() => switchMode("login")}
                        className="cursor-pointer rounded-sm bg-transparent p-0 font-medium text-primary transition-colors hover:text-primary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
                      >
                        {tAuth("login.go_to_login")}
                      </button>
                    </>
                  )}
                </m.p>
              </form>
            </m.div>
          )}
        </AnimatePresence>
      </m.div>
    </LazyMotion>
  );
};
export default AuthCard;
