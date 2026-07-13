import { toast as sonnerToast } from "sonner";

interface ToastOptions {
  title: string;
  description?: string;
  variant?: "default" | "destructive";
}

/**
 * Wrapper around sonner's toast API that matches the shadcn/ui useToast interface.
 * This allows components written against the useToast pattern to work seamlessly
 * with sonner's global toast rendering.
 */
export function useToast() {
  const toast = ({ title, description, variant }: ToastOptions) => {
    if (variant === "destructive") {
      sonnerToast.error(title, { description });
    } else {
      sonnerToast.success(title, { description });
    }
  };

  return { toast };
}
