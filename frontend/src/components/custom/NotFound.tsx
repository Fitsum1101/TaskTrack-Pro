import { XCircle } from "lucide-react";
import { Link } from "react-router-dom";

const notFound = {
  code: "404",
  title: "Page Not Found",
  description: "The page you are looking for does not exist.",
  buttonText: "Go Home",
};

const NotFound = () => {
  if (!notFound) return <></>;

  const { code, title, description, buttonText } = notFound;
  console.log({ code, title, description, buttonText });
  return (
    <div className="relative z-10 text-center px-6 py-12 rounded-3xl shadow-2xl border border-border dark:border-border-dark max-w-xl transition-colors">
      <div className="flex justify-center mb-6">
        <XCircle className="h-20 w-20 text-destructive dark:text-destructive-dark animate-bounce transition-colors" />
      </div>
      <h1 className="text-7xl font-extrabold text-destructive dark:text-destructive-dark mb-4">
        {code}
      </h1>
      <h2 className="text-3xl font-semibold text-foreground dark:text-foreground-dark mb-4">
        {title}
      </h2>
      <p className="text-muted-foreground dark:text-muted-foreground-dark mb-8">
        {description}
      </p>
      <Link
        to="/"
        className="inline-block px-8 py-3 bg-primary dark:bg-primary-dark text-primary-foreground dark:text-primary-foreground-dark font-semibold rounded-lg hover:bg-primary-hover dark:hover:bg-primary-dark-hover transition-colors shadow-lg"
      >
        {buttonText}
      </Link>
    </div>
  );
};

export default NotFound;
