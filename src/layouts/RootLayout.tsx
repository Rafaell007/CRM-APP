import { Outlet } from "@tanstack/react-router";
import { useAuth } from "../context/authContext";
import ChatWidget from "../features/chat/components/ChatWidget";

// Wraps every page; the chat is shown only to a logged-in user, so never on /login
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
