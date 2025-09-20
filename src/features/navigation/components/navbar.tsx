import { routes } from "@/app/routes";
import UseKeyboardOpen from "@/shared/hooks/use-keyboard-open";
import { useLocation, useNavigate } from "react-router-dom";
import NavButton from "./nav-button";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const showNavbar =
    !location.pathname.startsWith("/add-address") &&
    !location.pathname.startsWith("/language") &&
    !location.pathname.startsWith("/notifications");
  const isKeyboardOpen = UseKeyboardOpen();
  if (isKeyboardOpen) return null;

  const items = routes.slice(0, 4);

  return (
    showNavbar && (
      <div className="w-full border-t border-secondary-background/13 fixed bottom-0 left-0 right-0 bg-background overflow-y-clip">
        <div className="relative sm:max-w-[600px] sm:mx-auto z-50 flex justify-around items-start shadow-mds pb-safe-bottom">
          {items.map((path) => (
            <NavButton
              icon={path.icon!}
              label={path.label}
              active={location.pathname.startsWith(path.path)}
              key={path.path}
              onClick={() => navigate(path.path)}
            />
          ))}
        </div>
      </div>
    )
  );
}
