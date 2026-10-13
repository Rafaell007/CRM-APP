import { Outlet } from "@tanstack/react-router";
import { useAuth } from "../context/authContext";
import ChatWidget from "../features/chat/components/ChatWidget";

const RootLayout = () => {
  const { user } = useAuth();

  return (
    <>
      <Outlet />
      {user && <ChatWidget author={user.email ?? "Unknown user"} />}
    </>
  );
};

export default RootLayout;
