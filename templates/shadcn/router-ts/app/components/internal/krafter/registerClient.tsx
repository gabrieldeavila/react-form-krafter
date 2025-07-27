import React from "react";
import ClientOnly from "~/lib/client";

function RegisterClient({ children }: { children: React.ReactNode }) {
  return (
    <ClientOnly>
      <Krafter>{children}</Krafter>
    </ClientOnly>
  );
}

export default RegisterClient;

const LazyKrafter = React.lazy(() => import("./register"));

const Krafter = ({ children }: { children: React.ReactNode }) => {
  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <LazyKrafter>{children}</LazyKrafter>
    </React.Suspense>
  );
};
