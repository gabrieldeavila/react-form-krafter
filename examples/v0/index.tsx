import "./index.css";
import { lazy, Suspense, useMemo, useState } from "react";

const ExampleV0BasicAsync = lazy(() => import("./basic_async"));
const ExampleV0Basic = lazy(() => import("./basic"));

const OPTIONS = {
  basic: {
    title: "Basic Example",
    component: ExampleV0Basic,
  },
  basicAsync: {
    title: "Basic Async Example",
    component: ExampleV0BasicAsync,
  },
};

function Example() {
  const [example, setExample] = useState<keyof typeof OPTIONS>("basic");

  const currentExample = useMemo(() => {
    return OPTIONS[example] || null;
  }, [example]);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="example-selector">
        <h1>Select an Example</h1>
        <select
          value={example}
          onChange={(e) => setExample(e.target.value as keyof typeof OPTIONS)}
        >
          {Object.entries(OPTIONS).map(([key, { title }]) => (
            <option key={key} value={key}>
              {title}
            </option>
          ))}
        </select>
      </div>

      {currentExample ? (
        <currentExample.component />
      ) : (
        <div className="error">Example not found</div>
      )}
    </Suspense>
  );
}

export default Example;
