import React, { useEffect, useState } from "react";

function ClientOnly({ children }: { children: React.ReactNode }) {
  const [hasMounted, setHasMounted] = useState(false);
  useEffect(() => setHasMounted(true), []);
  return hasMounted ? <>{children}</> : null;
}

export default ClientOnly;
