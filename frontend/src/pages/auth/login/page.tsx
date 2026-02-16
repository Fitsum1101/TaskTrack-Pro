import { Link } from "react-router";
import { motion } from "framer-motion";

import { LoginIllustration } from "./_components/login-illusation";
import LoginForm from "./_components/login-form";

const LoginPage = () => {
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

            {/* Form */}
            <LoginForm />

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

        <LoginIllustration />
      </div>
    </div>
  );
};

export default LoginPage;
