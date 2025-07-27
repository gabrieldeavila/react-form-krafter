import { Welcome } from "../welcome/welcome";

export function meta() {
  return [
    { title: "New React Form Krafter App" },
    { name: "description", content: "Welcome to React Form Krafter!" },
  ];
}

export default function Home() {
  return <Welcome />;
}
