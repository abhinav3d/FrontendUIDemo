import { USER_ROLE, type UserRole } from "@/src/domains/app/app.types";

export interface UserCoreDTO {
  userId: string;
  shopifyCustomerId: string | null;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  avatarUrl: string | null;
}

export function isUserCoreDTO(value: unknown): value is UserCoreDTO {
  if (typeof value !== "object" || value === null) return false;

  const obj = value as Record<string, unknown>;

  return (
    typeof obj.userId === "string" &&
    (typeof obj.shopifyCustomerId === "string" || obj.shopifyCustomerId === null) &&
    typeof obj.email === "string" &&
    typeof obj.firstName === "string" &&
    typeof obj.lastName === "string" &&
    (typeof obj.avatarUrl === "string" || obj.avatarUrl === null) &&
    Object.values(USER_ROLE).includes(obj.role as UserRole)
  );
}
