import { ROLE_DETAIL, PERMISSIONS } from "../../app/constant/role"
export default {
  header: {
    self: {},
    items: [
    ],
  },
  aside: {
    self: {},
    items: [
      {
        title: 'Dashboard',
        icon: 'flaticon-analytics',
        page: 'dashboard',
        permissions: [PERMISSIONS.REVENUE_STATISTICS]
      },
      {
        title: 'Finance',
        icon: 'flaticon-piggy-bank',
        permissions: [PERMISSIONS.READ_FINANCE, PERMISSIONS.WRITE_FINANCE],
        submenu: [
          {
            title: "Overview",
            page: 'finance-overview',
            icon: 'flaticon2-menu-3',
            permissions: [PERMISSIONS.READ_FINANCE, PERMISSIONS.WRITE_FINANCE],
          },
          {
            title: "Bank Management",
            page: "bank-list",
            icon: 'flaticon-notepad',
            permissions: [PERMISSIONS.READ_FINANCE, PERMISSIONS.WRITE_FINANCE],
          },
        ]
      },
      {
        title: 'Internal Report',
        icon: 'flaticon2-paper',
        page: 'internal-report',
        permissions: [PERMISSIONS.INTERNAL_REPORT]
      },
      {
        title: 'Pricing',
        icon: 'flaticon-diagram',
        submenu: [
          {
            title: 'Compare',
            icon: 'flaticon2-size',
            page: 'compare',
            permissions: [],
            role: ROLE_DETAIL.systemAdmin.level,
          },
          {
            title: 'Product Pool',
            icon: 'flaticon-list-2',
            page: 'product-pool',
            role: ROLE_DETAIL.systemAdmin.level
          },
          {
            title: 'Group',
            icon: 'flaticon-layers',
            page: 'group',
            role: ROLE_DETAIL.systemAdmin.level
          },
        ]
      },
      {
        title: 'Crawl Setting',
        icon: 'flaticon-search',
        permissions: [],
        submenu: [
          {
            title: 'Crawl',
            icon: 'flaticon-search',
            page: 'crawl-data',
            permissions: []
          },
          {
            title: 'Crawl History',
            icon: 'flaticon-interface-4',
            page: 'crawl-history',
            role: ROLE_DETAIL.systemAdmin.level
          },
        ]
      },
      {
        title: 'Collections',
        icon: 'flaticon-more-v2',
        permissions: [PERMISSIONS.READ_ALL_BRAND, PERMISSIONS.READ_ADMIN_BRAND, PERMISSIONS.READ_OWNER_BRAND],
        submenu: [
          {
            title: "Quản lý brand",
            page: "brand",
            icon: 'flaticon-book',
            permissions: [PERMISSIONS.READ_ALL_BRAND, PERMISSIONS.READ_ADMIN_BRAND, PERMISSIONS.READ_OWNER_BRAND]
          },
          {
            title: 'Shops',
            icon: 'flaticon2-architecture-and-city',
            page: 'shops',
            role: ROLE_DETAIL.systemAdmin.level
          },
          {
            title: 'Permissions',
            icon: 'flaticon-users-1',
            page: 'permissions',
            role: ROLE_DETAIL.systemAdmin.level
          },
        ]
      },
      {
        title: "Post",
        page: "post",
        icon: 'flaticon-notes',
        role: ROLE_DETAIL.systemAdmin.level
      },
      {
        title: "Campaign",
        page: "campaign",
        icon: 'flaticon-earth-globe',
        role: ROLE_DETAIL.systemAdmin.level
      },
      {
        title: 'Live streaming',
        icon: 'flaticon-laptop',
        page: 'live-streaming',
        role: ROLE_DETAIL.systemAdmin.level,
      },
      {
        title: 'Users',
        icon: 'flaticon-users-1',
        page: 'users',
        role: ROLE_DETAIL.systemAdmin.level
      },
      {
        title: 'Activity logs',
        icon: 'flaticon-list-3',
        page: 'log',
        role: ROLE_DETAIL.systemAdmin.level
      },
      {
        title: 'Departments',
        icon: 'flaticon-buildings',
        page: 'departments',
        role: ROLE_DETAIL.systemAdmin.level,
        permissions: [PERMISSIONS.PROCESS_SETTING]
      },
      {
        title: 'Process',
        icon: 'flaticon2-group',
        role: ROLE_DETAIL.systemAdmin.level,
        permissions: [PERMISSIONS.PROCESS_SETTING],
        submenu: [
          {
            title: 'Process Dasboard',
            icon: 'flaticon-car',
            page: 'process-dashboard',
            role: ROLE_DETAIL.systemAdmin.level,
            permissions: [PERMISSIONS.PROCESS_SETTING],
          },
          {
            title: 'Process Setting',
            icon: 'flaticon2-group',
            page: 'process-setting',
            role: ROLE_DETAIL.systemAdmin.level,
            permissions: [PERMISSIONS.PROCESS_SETTING],
          },
        ]
      },
      {
        title: 'Request',
        icon: 'flaticon2-send-1',
        role: ROLE_DETAIL.systemAdmin.level,
        permissions: [PERMISSIONS.PROCESS_SETTING],
        submenu: [
          {
            title: 'Request Dashboard',
            icon: 'flaticon-car',
            page: 'request-dashboard',
            role: ROLE_DETAIL.systemAdmin.level,
            permissions: [PERMISSIONS.PROCESS_SETTING],
          },
          {
            title: 'Request Setting',
            icon: 'flaticon2-send-1',
            page: 'requests',
            role: ROLE_DETAIL.systemAdmin.level,
            permissions: [PERMISSIONS.PROCESS_SETTING],
          },
        ]
      },
    ],
  },
}
