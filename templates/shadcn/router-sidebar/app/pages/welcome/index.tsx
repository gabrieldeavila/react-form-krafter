import { SidebarInset } from "~/components/ui/sidebar";
import FormFeatures from "./formFeatures";
import Navbar from "~/components/internal/navbar/navbar";
import { BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator } from "~/components/ui/breadcrumb";

export function meta() {
  return [
    { title: "Welcome" },
    { name: "description", content: "Try doing something cool!" },
  ];
}

export default function Page() {
  return (
    <SidebarInset>
      <Navbar
        crumbChildren={
          <>
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink href="#">
                Building Your Application
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              <BreadcrumbPage>Data Fetching</BreadcrumbPage>
            </BreadcrumbItem>
          </>
        }
      />
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <FormFeatures />
      </div>
    </SidebarInset>
  );
}
