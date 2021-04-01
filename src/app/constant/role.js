export const ROLES = {
  ADMIN: 'brandAdmin',
  OWNER: 'brandOwner',
  SUPERADMIN: 'systemAdmin'
}

export const ROLE_DETAIL = {
  brandAdmin: {
    label: 'Admin',
    level: 2
  },
  brandOwner: {
    label: 'Owner',
    level: 1
  },
  systemAdmin: {
    label: 'Super Admin',
    level: 3
  }
}

export const PERMISSIONS = {
  CONNECT_SOURCE: 'connectSource',
  CREATE_BRAND: 'createBrand',
  DISCONNECT_SOURCE: 'disconnectSource',
  INTERNAL_REPORT: 'internalReport',
  INVITE_TO_BE_ADMIN: 'inviteTobeAdmin',
  READ_ADMIN_BRAND: 'readAdminBrand',
  READ_ALL_BRAND: 'readAllBrand',
  READ_OWNER_BRAND: 'readOwnerBrand',
  REVENUE_STATISTICS: 'revenueStat',
  UPDATE_ADMIN_BRAND: 'updateAdminBrand',
  READ_FINANCE: 'readFinance',
  WRITE_FINANCE: 'writeFinance',
  PROCESS_SETTING: 'processSetting'
}