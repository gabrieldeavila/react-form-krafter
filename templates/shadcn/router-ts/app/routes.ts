import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("developer", "pages/developer/index.tsx"),
] satisfies RouteConfig;
