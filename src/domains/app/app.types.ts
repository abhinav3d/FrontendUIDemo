export const USER_ROLE = {
  ADMIN: "ADMIN",
  ARTIST: "ARTIST",
  CUSTOMER: "CUSTOMER",
} as const;

export type UserRole = typeof USER_ROLE[keyof typeof USER_ROLE];
