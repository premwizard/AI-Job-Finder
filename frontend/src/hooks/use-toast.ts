import { useState } from "react";

export function useToast() {
  const [toasts, setToasts] = useState<any[]>([]);

  const toast = ({ title, description, variant = "default" }: { title: string; description?: string; variant?: "default" | "destructive" }) => {
    // Fallback to browser alert for now
    if (variant === "destructive") {
      alert(`Error: ${title}\n${description || ""}`);
    } else {
      alert(`${title}\n${description || ""}`);
    }
  };

  return { toast, toasts };
}
