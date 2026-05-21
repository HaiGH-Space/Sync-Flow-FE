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
    onSuccess: () => {
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
        className="shadow-primary/20 relative w-full max-w-xs sm:max-w-md bg-card/80 backdrop-blur-xl border border-border rounded-2xl p-8 shadow-md"
      >
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
            >
              <m.div variants={itemVariants} className="text-center mb-6">
                <LogoAppAnimation />
                <p className="mt-2 text-sm text-muted-foreground">
                  {mode === "login"
                    ? tAuth("login.subtitle")
                    : tAuth("register.subtitle")}
                </p>
              </m.div>
              <form
                id="auth-form"
                onSubmit={(e) => {
                  e.preventDefault();
                  form.handleSubmit();
                }}
              >
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
                  <Button className="w-full h-10 cursor-pointer" type="submit">
                    {mode === "login"
                      ? tAuth("login.submit")
                      : tAuth("register.submit")}
                  </Button>
                </m.div>

                {/* Divider */}
                <m.div
                  variants={itemVariants}
                  className="flex items-center gap-4 py-2"
                >
                  <div className="flex-1 h-px bg-border" />
                  <span className="uppercase text-xs text-muted-foreground tracking-wider">
                    {tAuth("login.divider_text")}
                  </span>
                  <div className="flex-1 h-px bg-border" />
                </m.div>

                <m.p
                  variants={itemVariants}
                  className="mt-4 text-sm text-center text-muted-foreground"
                >
                  {mode === "login" ? (
                    <>
                      {tAuth("login.no_account")}{" "}
                      <span
                        onClick={() => switchMode("register")}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            switchMode("register");
                          }
                        }}
                        role="button"
                        tabIndex={0}
                        className="text-primary hover:text-primary/80 cursor-pointer mt-4"
                      >
                        {tAuth("login.go_to_register")}
                      </span>
                    </>
                  ) : (
                    <>
                      {tAuth("login.have_account")}{" "}
                      <span
                        onClick={() => switchMode("login")}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            switchMode("login");
                          }
                        }}
                        role="button"
                        tabIndex={0}
                        className="text-primary hover:text-primary/80 cursor-pointer mt-4"
                      >
                        {tAuth("login.go_to_login")}
                      </span>
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
