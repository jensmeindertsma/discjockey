import { json } from "@remix-run/node";

export function badRequest<T>(data: T, init?: Omit<ResponseInit, "status">) {
  return json(data, { status: 400, ...init });
}
