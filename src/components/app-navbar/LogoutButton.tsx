import { signOut } from "next-auth/react";
import { useRouter } from "next/router";
import { LogOut } from "lucide-react";
import { toast } from "react-toastify";

import { Button } from "@mantine/core";

export const LogoutButton = () => {
  const router = useRouter();

  const handleLogout = async () => {
    await signOut();
    toast.success("Logout successfull");
    router.push("/login");
  };

  return (
    <Button
      leftIcon={<LogOut size={16} />}
      variant="outline"
      color="red"
      onClick={handleLogout}
    >
      Logout
    </Button>
  );
};
