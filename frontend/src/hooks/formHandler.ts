import { toastColor } from "@/constant/toast-color";
import { toast } from "sonner";

/** Generic type for an API response */
export interface ApiResponse<Data = unknown, Error = unknown> {
  data?: Data;
  error?: Error;
}

// Type guard to check if the data is of type ApiFunctionWithMethod input
const isApiFunctionWithMethodData = <T>(
  data: T | { body: T; method: "POST" | "PUT" | "DELETE" | "PATCH" }
): data is { body: T; method: "POST" | "PUT" | "DELETE" | "PATCH" } => {
  return typeof data === "object" && data !== null && "method" in data;
};


/** Function types for API calls */
type ApiFunction<T, R = unknown, E = unknown> = (data: T) => Promise<ApiResponse<R, E>>;
type ApiFunctionWithMethod<T, R = unknown, E = unknown> = (data: {
  body: T;
  method: "POST" | "PUT" | "DELETE" | "PATCH";
}) => Promise<ApiResponse<R, E>>;

const useFormSubmitHandler = <T, R = unknown, E = unknown>(
  apiFunction: ApiFunction<T, R, E> | ApiFunctionWithMethod<T, R, E>,
  onSuccess: (response: ApiResponse<R, E>) => void,
  successMessage?: string,
  isSuccessToastVisible: boolean = true,
  onError?: (error: E) => void
) => {
  const handleSubmit = async (
    data: T | { body: T; method: "POST" | "PUT" | "DELETE" | "PATCH" }
  ): Promise<ApiResponse<R, E>> => {
    try {
      let response: ApiResponse<R, E>;

      // Handle API method overload
      if (isApiFunctionWithMethodData(data)) {
        response = await (apiFunction as ApiFunctionWithMethod<T, R, E>)(
          data as { body: T; method: "POST" | "PUT" | "DELETE" | "PATCH" }
        );
      } else {
        response = await (apiFunction as ApiFunction<T, R, E>)(data as T);
      }

      if (response.error) {
        if (onError) {
          // Try to extract error string safely
          const nestedError =
            (response.error as { data?: { data?: { error?: string }; message?: string } })?.data
              ?.data?.error;

          if (nestedError && nestedError.includes("deactivated")) {
            onError(response.error);
            return response;
          }
          onError(response.error);
        }

        const errorMessage =
          (response.error as { data?: { data?: { error?: string }; message?: string } })?.data
            ?.data?.error ||
          (response.error as { data?: { message?: string } })?.data?.message ||
          "Something went wrong";

        toast.error(errorMessage, toastColor.error);
      } else {
        if (isSuccessToastVisible) {
          const successMsg =
            (response.data as { data?: { message?: string }; message?: string })?.data?.message ||
            (response.data as { message?: string })?.message ||
            successMessage ||
            "Action completed successfully";

          toast.success(successMsg, toastColor.success);
        }
        onSuccess(response);
      }

      return response;
    } catch (error) {
      console.error(error);

      if (onError) {
        onError(error as E);
      }

      toast.error("Something went wrong", toastColor.error);
      return { error: error as E } as ApiResponse<R, E>;
    }
  };

  return handleSubmit;
};

export default useFormSubmitHandler;
