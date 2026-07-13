import { useState } from "react";
import { useAuthStore } from "@/store/auth";

export function useRestrictedFeature() {
  const user = useAuthStore((state) => state.user);
  const [showVerificationDialog, setShowVerificationDialog] = useState(false);

  const checkAccess = (callback: () => void) => {
    if (user && user.is_verified) {
      callback();
    } else {
      setShowVerificationDialog(true);
    }
  };

  return {
    isVerified: user?.is_verified ?? false,
    checkAccess,
    showVerificationDialog,
    setShowVerificationDialog,
  };
}
