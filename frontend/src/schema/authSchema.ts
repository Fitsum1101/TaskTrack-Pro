import { z } from "zod";
import { fieldValidators } from "./common";

// LOGIN
export const loginFormSchema = z.object({
  userName: fieldValidators.username(true),
  password: fieldValidators.password(6, true),
});
export type LoginFormType = z.infer<typeof loginFormSchema>;

export const loginFormDefault: LoginFormType = {
  userName: "",
  password: "",
};
