export const ROLES = {
  ADMIN: "admin",
  VENDOR: "vendor",
};

export const canAccessUsers = (role) => role === ROLES.ADMIN;
export const canAccessPromoCodes = (role) =>
  role === ROLES.ADMIN || role === ROLES.VENDOR;
