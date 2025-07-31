import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("pages/welcome/index.tsx"),
  route("developer", "pages/developer/index.tsx"),
] satisfies RouteConfig;
