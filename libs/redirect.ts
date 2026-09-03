import { DOMAIN_NAME } from "@/app/config";

export function getRedirectUrl(path: string) {
  return new URL(path, DOMAIN_NAME);
}
