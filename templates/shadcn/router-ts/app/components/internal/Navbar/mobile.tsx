import { Link } from "react-router";
import { cn } from "~/lib/utils";

function MobileNav({ navbarBounds }: { navbarBounds: DOMRect | null }) {
  return (
    <div
      style={{
        top: navbarBounds ? navbarBounds.bottom : "auto",
      }}
      className={cn(
        "flex justify-center lg:hidden",
        "absolute bottom-0 left-0 right-0 z-50"
      )}
    >
      <div className="container flex flex-col p-4 shadow-lg">
        <ul className="space-y-2 flex flex-col gap-2">
          <li className="border-b pb-3 border-dashed">
            <Link className="flex w-full" to="">Platform</Link>
          </li>
          <li className="border-b pb-3 border-dashed">
            <Link className="flex w-full" to="">Developer</Link>
          </li>
          <li className="border-b pb-3 border-dashed">
            <Link className="flex w-full" to="">Resources</Link>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default MobileNav;
