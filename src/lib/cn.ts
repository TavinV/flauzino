/** Junta classes condicionais sem dependência externa. */
export function cn(
  ...parts: Array<string | boolean | number | bigint | null | undefined>
): string {
  return parts.filter((p): p is string => typeof p === "string" && p.length > 0).join(" ");
}
