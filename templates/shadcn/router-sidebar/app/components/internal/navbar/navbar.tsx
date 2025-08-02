import { Separator } from "@radix-ui/react-separator";
import React from "react";
import {
  Breadcrumb,
  BreadcrumbList
} from "~/components/ui/breadcrumb";
import { SidebarTrigger } from "~/components/ui/sidebar";
import { cn } from "~/lib/utils";

function Navbar({ crumbChildren }: { crumbChildren?: React.ReactNode }) {
  return (
    <header
      className={cn(
        "bg-background sticky top-0 z-10 border-b border-border data-[orientation=vertical]:border-r data-[orientation=vertical]:border-b-0",
        "mb-5",
        "flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12"
      )}
    >
      <div className="flex items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mr-2 data-[orientation=vertical]:h-4"
        />
        <Breadcrumb>
          <BreadcrumbList>{crumbChildren}</BreadcrumbList>
        </Breadcrumb>
      </div>
    </header>
  );
}

export default Navbar;
