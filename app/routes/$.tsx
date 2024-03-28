import { notFound } from "~/http";

export function loader() {
  return notFound();
}

export default function NotFound() {
  return <h1>Not Found!</h1>;
}
