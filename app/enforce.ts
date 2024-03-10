export function enforce<T>(value: T | null | undefined, message: string): T {
  if (!value) {
    throw new Error(`Failed to enforce requirement: "${message}"`);
  }
}
