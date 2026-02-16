import { ArrowRight } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";

import RHFTextField from "@/components/custom/hook-form/RHFTextField";
import FormProvider from "@/components/custom/hook-form/FormProvider";
import RHFPasswordField from "@/components/custom/hook-form/RHFPasswordField";
import PrimaryButton from "@/components/custom/button/PrimaryButton";

import useFormSubmitHandler, { type ApiResponse } from "@/hooks/formHandler";
import type { LoginResponseData } from "@/types/auth";

import {
  loginFormDefault,
  loginFormSchema,
  type LoginFormType,
} from "@/schema/authSchema";

import { useLoginMutation } from "@/services/authApiSlice";

const LoginForm = () => {
  const navigate = useNavigate();

  const methods = useForm<LoginFormType>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: loginFormDefault,
    mode: "onChange",
  });

  const [login, { isLoading, error }] = useLoginMutation();

  if (error) {
    console.log("Login error:", error);
  }

  const onCompleteFormsSuccess = (
    response: ApiResponse<LoginResponseData, unknown>,
  ) => {
    const data = response?.data;
    if (data) {
      navigate("/dashboard");
    }
  };

  console.log("Login form errors:", methods.formState.errors);

  const submitHandler = useFormSubmitHandler<
    LoginFormType,
    LoginResponseData,
    unknown
  >(login, onCompleteFormsSuccess);

  const onSubmit = async (data: LoginFormType) => {
    await submitHandler(data);
  };

  return (
    <FormProvider onSubmit={methods.handleSubmit(onSubmit)} methods={methods}>
      {/* Email Field */}
      <div className="space-y-5">
        <RHFTextField
          type="text"
          name="userName"
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
          className="text-sm text-primary hover:text-primary/80 font-medium transition-colors"
        >
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
        iconPosition="right"
      >
        Sign In
      </PrimaryButton>
    </FormProvider>
  );
};

export default LoginForm;
