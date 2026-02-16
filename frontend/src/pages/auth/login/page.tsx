import { useState } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, Loader2, Eye, EyeOff, ArrowRight } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { Link } from "react-router";
import { LoginIllustration } from "./_components/login-illusation";
import RHFTextField from "@/components/custom/hook-form/RHFTextField";
import FormProvider from "@/components/custom/hook-form/FormProvider";
import type { ApiResponse } from "@/hooks/formHandler";
import useFormSubmitHandler from "@/hooks/formHandler";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  loginFormDefault,
  loginFormSchema,
  type LoginFormType,
} from "@/schema/authSchema";
import type { LoginResponseData } from "@/types/auth";
import RHFPasswordField from "@/components/custom/hook-form/RHFPasswordField";
import PrimaryButton from "@/components/custom/button/PrimaryButton";

const LoginPage = () => {
  const { user, login, error, isLoading, clearError } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{
    email?: string;
    password?: string;
  }>({});

  const methods = useForm<LoginFormType>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: loginFormDefault,
    mode: "onChange",
  });

  const loginFun = (data: LoginFormType): LoginResponseData => {
    return {
      accessToken: "mock-access-token",
      refreshToken: "mock-refresh-token",
    };
  };

  const onCompleteFormsSuccess = (
    response: ApiResponse<LoginResponseData, unknown>,
  ) => {};

  const submitHandler = useFormSubmitHandler<
    LoginFormType,
    LoginResponseData,
    unknown
  >(loginFun, onCompleteFormsSuccess);

  const onSubmit = async (data: LoginFormType) => {
    await submitHandler(data);
  };

  const handleSubmit = () => {};

  return (
    <div className="flex-1 flex items-center justify-center p-4 lg:p-0">
      <div className="w-full grid lg:grid-cols-2 gap-0 max-w-7xl">
        {/* Left Side - Form */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-center p-8 lg:p-12"
        >
          <div className="w-full max-w-sm">
            {/* Heading */}
            <h1 className="text-4xl font-bold text-foreground mb-2">
              Welcome back
            </h1>
            <p className="text-muted-foreground mb-8">
              Sign in to your TaskTrack account to continue
            </p>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 flex items-start gap-3 rounded-lg border border-red-500/50 bg-red-500/10 p-4"
              >
                <AlertCircle className="size-5 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-600 dark:text-red-400">
                  {error}
                </p>
              </motion.div>
            )}

            {/* Form */}
            <FormProvider onSubmit={handleSubmit} methods={methods}>
              {/* Email Field */}
              <div className="space-y-5">
                <RHFTextField
                  type="email"
                  name="email"
                  label="Email"
                  isRequired={true}
                  placeholder="Enter your email"
                  value={email}
                />

                {/* Password Field */}
                <RHFPasswordField
                  name="password"
                  label="Password"
                  isRequired={true}
                  placeholder="Enter your password"
                />
              </div>

              {/* Forgot Password */}
              <div className="flex mt-5 justify-end">
                <Link
                  to="#"
                  className="text-sm text-primary hover:text-primary/80 font-medium transition-colors"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Submit Button */}
              <PrimaryButton
                type="submit"
                className="w-full mt-6"
                isLoading={isLoading}
                loadingText="Signing in..."
                icon={<ArrowRight className="size-4" />}
                iconPosition="right"
              >
                Sign In
              </PrimaryButton>
            </FormProvider>

            {/* Demo Credentials */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="rounded-lg border border-border/50 bg-secondary/20 p-4 mb-8"
            >
              <p className="text-xs font-medium text-muted-foreground mb-3">
                Demo Credentials
              </p>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Email:</span>
                  <span className="text-xs font-mono text-foreground">
                    demo@example.com
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    Password:
                  </span>
                  <span className="text-xs font-mono text-foreground">
                    password123
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Sign Up Link */}
            <p className="text-center text-sm text-muted-foreground pt-2">
              Don't have an account?{" "}
              <Link
                to="#"
                className="text-primary font-medium hover:text-primary/80 transition-colors"
              >
                Create one
              </Link>
            </p>
          </div>
        </motion.div>

        {/* Right Side - Illustration */}
        <LoginIllustration />
      </div>
    </div>
  );
};

export default LoginPage;
