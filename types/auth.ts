export type UserRole = "admin" | "editor" | "user"

export interface UserPermissions {
  canCreateCategory: boolean
  canEditCategory: boolean
  canDeleteCategory: boolean
  canCreateColoringPage: boolean
  canEditColoringPage: boolean
  canDeleteColoringPage: boolean
}

export const ROLE_PERMISSIONS: Record<UserRole, UserPermissions> = {
  admin: {
    canCreateCategory: true,
    canEditCategory: true,
    canDeleteCategory: true,
    canCreateColoringPage: true,
    canEditColoringPage: true,
    canDeleteColoringPage: true,
  },
  editor: {
    canCreateCategory: false,
    canEditCategory: true,
    canDeleteCategory: false,
    canCreateColoringPage: true,
    canEditColoringPage: true,
    canDeleteColoringPage: false,
  },
  user: {
    canCreateCategory: false,
    canEditCategory: false,
    canDeleteCategory: false,
    canCreateColoringPage: false,
    canEditColoringPage: false,
    canDeleteColoringPage: false,
  },
}
