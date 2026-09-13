import { useEffect, useState } from "react";

export type AppRoute =
  | { name: "library" }
  | { name: "new-collection" }
  | { name: "upload"; collectionId: string }
  | { name: "workspace"; collectionId: string }
  | { name: "settings"; collectionId: string };

function readRoute(): AppRoute | null {
  const match = window.location.hash.match(/^#app(?:\/(.*))?$/);
  if (!match) return null;
  const segments = (match[1] ?? "library").split("/").filter(Boolean);
  if (segments[0] === "new") return { name: "new-collection" };
  if (segments[0] === "collections" && segments[1]) {
    if (segments[2] === "upload") return { name: "upload", collectionId: segments[1] };
    if (segments[2] === "settings") return { name: "settings", collectionId: segments[1] };
    return { name: "workspace", collectionId: segments[1] };
  }
  return { name: "library" };
}

export function routeHref(route: AppRoute) {
  if (route.name === "library") return "#app";
  if (route.name === "new-collection") return "#app/new";
  if (route.name === "upload") return `#app/collections/${route.collectionId}/upload`;
  if (route.name === "settings") return `#app/collections/${route.collectionId}/settings`;
  return `#app/collections/${route.collectionId}`;
}

export function navigate(route: AppRoute) {
  window.location.hash = routeHref(route).slice(1);
}

export function useAppRoute() {
  const [route, setRoute] = useState<AppRoute | null>(readRoute);
  useEffect(() => {
    const update = () => setRoute(readRoute());
    window.addEventListener("hashchange", update);
    return () => window.removeEventListener("hashchange", update);
  }, []);
  return route;
}