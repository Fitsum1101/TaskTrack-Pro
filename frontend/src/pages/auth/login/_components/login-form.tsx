import { ArrowRight } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";

import RHFTextField from "@/components/custom/hook-form/RHFTextField";
import FormProvider from "@/components/custom/hook-form/FormProvider";
import RHFPasswordField from "@/components/custom/hook-form/RHFPasswordField";
import PrimaryButton from "@/components/custom/button/PrimaryButton";

import useFormSubmitHandler, { type ApiResponse } from "@/hooks/formHandler";

import {
  loginFormDefault,
  loginFormSchema,
  type LoginFormType,
} from "@/schema/authSchema";

import { useEffect, useState } from "react";
import { useLoginMutation } from "@/services/authApiSlice";

const LoginForm = () => {
  const navigate = useNavigate();

  const [login, { isLoading }] = useLoginMutation();

  const methods = useForm<LoginFormType>({
    defaultValues: loginFormDefault,
    resolver: zodResolver(loginFormSchema),
  });

  const handleSumbiot = useFormSubmitHandler(
    login,
    () => {
      navigate("/dashboard");
    },
    "login sucessful",
  );

  return (
    <FormProvider
      methods={methods}
      onSubmit={methods.handleSubmit(handleSumbiot)}>
      {/* Email Field */}

      <div className="space-y-5">
        <RHFTextField
          type="text"
          name="username"
          label="username"
          isRequired={true}
          placeholder="Enter your username"
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
          className="text-sm text-primary hover:text-primary/80 font-medium transition-colors">
          Forgot password?
        </Link>
      </div>

      {/* Submit Button */}
      <PrimaryButton
        type="submit"
        className="w-full cursor-pointer mt-6"
        isLoading={isLoading}
        loadingText="Signing in..."
        icon={<ArrowRight className="size-4" />}
        iconPosition="right">
        Sign In
      </PrimaryButton>
    </FormProvider>
  );
};

const LoginFormError = ({ isError }: { isError: boolean }) => {
  const [isErrorState, setIsErrorState] = useState(false);

  useEffect(() => {
    if (isError) {
      setIsErrorState(true);
      const timeoutId = setTimeout(() => {
        setIsErrorState(false);
      }, 5000);
      return () => clearTimeout(timeoutId);
    } else {
      setIsErrorState(false);
    }
  }, [isError]); // Add isError to dependency array

  return (
    <div className="flex items-center mb-4 justify-between">
      {isErrorState && (
        <p className="text-sm text-red-500">Invalid username or password.</p>
      )}
    </div>
  );
};
export default LoginForm;
