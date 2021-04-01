import { PERMISSIONS, ROLE_DETAIL } from "../constant/role"
import Dashboard from '../pages/home/statistics/Dashboard'
import BrandDetail from '../pages/home/BrandDetail'
import BrandList from '../pages/home/BrandList'
import ConnectMarket from '../pages/home/ConnectMarket'
import Profile from '../pages/home/Profile'
import Authorization from '../pages/home/Authorization'
import ActivityLog from '../pages/home/ActivityLog'
import ShopList from '../pages/home/ShopList'
import PermissionList from '../pages/home/PermissionList'
import UserList from '../pages/home/UserList'
import InternalReport from '../pages/home/InternalReport'
import BankAccountDetail from '../../app/pages/home/finance/BankAccountDetail'
import BankDetail from '../../app/pages/home/finance/BankDetail'
import BankManagement from '../../app/pages/home/finance/BankManagement'
import FinanceReport from '../../app/pages/home/finance/FinanceReport'
import FinanceOverview from '../../app/pages/home/finance/FinanceOverview'
import Deparments from '../../app/pages/home/Deparments'
import ProcessSetting from '../../app/pages/home/ProcessSetting'
import RequestPage from '../../app/pages/home/RequestPage'
import CreateProcess from '../../app/pages/home/CreateProcess'
import RequestDetail from '../../app/pages/home/RequestDetail'
import ProcessDashboard from '../pages/home/ProcessDashboard'
import RequestDashboard from '../pages/home/RequestDashboard'
import LiveStreaming from '../pages/home/livestream/LiveStreaming'
import Compare from '../pages/home/pricing/Compare'
import PostManagement from '../pages/home/post/PostManagement'
import PostDetail from '../pages/home/post/PostDetail'
import CampaignManagement from '../pages/home/livestream/CampaignManagement'
import CrawlHistory from '../pages/crawl/CrawlHistory'
import ProductPool from '../pages/home/pricing/ProductPool'
import Group from '../pages/home/pricing/Group'

export const HOME_ROUTER_CONFIG = [
    {
        component: Dashboard,
        url: '/dashboard',
        permissons: [PERMISSIONS.REVENUE_STATISTICS]
    },
    // {
    //     component: RevenueStatistics,
    //     url: '/board/:brandId?',
    //     permissons: [PERMISSIONS.REVENUE_STATISTICS]
    // },
    {
        component: BrandList,
        url: '/brand',
        permissons: [PERMISSIONS.READ_ADMIN_BRAND, PERMISSIONS.READ_ALL_BRAND, PERMISSIONS.READ_OWNER_BRAND]
    },
    {
        component: BrandDetail,
        url: '/brand-detail/:brandId',
        permissons: [PERMISSIONS.UPDATE_ADMIN_BRAND]
    },
    {
        component: ConnectMarket,
        url: '/connect-market/:brandId',
        permissons: [PERMISSIONS.CONNECT_SOURCE]
    },
    {
        component: Profile,
        url: '/profile',
        permissons: [],

    },
    {
        component: Authorization,
        url: '/authorization',
        permissons: [PERMISSIONS.INVITE_TO_BE_ADMIN]
    },
    {
        component: ActivityLog,
        url: '/log',
        permissons: [],
        role: ROLE_DETAIL.systemAdmin.level
    },
    {
        component: ShopList,
        url: '/shops',
        permissons: [],
        role: ROLE_DETAIL.systemAdmin.level
    },
    {
        component: PermissionList,
        url: '/permissions',
        permissons: [],
        role: ROLE_DETAIL.systemAdmin.level
    },
    {
        component: UserList,
        url: '/users',
        permissons: [],
        role: ROLE_DETAIL.systemAdmin.level
    },
    {
        component: InternalReport,
        url: '/internal-report',
        permissons: [PERMISSIONS.INTERNAL_REPORT],

    },
    {
        component: LiveStreaming,
        url: '/live-streaming',
        role: ROLE_DETAIL.systemAdmin.level,

    },
    {
        component: FinanceOverview,
        url: '/finance-overview',
        permissons: [],
    },
    {
        component: BankAccountDetail,
        url: '/account_number/:bankAccountId',
        permissons: [],
    },
    {
        component: BankManagement,
        url: '/bank-list',
        permissons: [],
    },
    {
        component: BankDetail,
        url: '/bank/:bankId',
        permissons: [],
    },
    {
        component: FinanceReport,
        url: '/finance-report',
        permissons: [],
    },
    {
        component: Deparments,
        url: '/departments',
        permissons: [],
        role: ROLE_DETAIL.systemAdmin.level
    },
    {
        component: ProcessSetting,
        url: '/process-setting',
        permissons: [],
        role: ROLE_DETAIL.systemAdmin.level
    },
    {
        component: RequestPage,
        url: '/requests',
        permissons: [],
        role: ROLE_DETAIL.systemAdmin.level
    },
    {
        component: CreateProcess,
        url: '/process/:processId',
        permissons: [],
        role: ROLE_DETAIL.systemAdmin.level
    },
    {
        component: RequestDetail,
        url: '/request/:requestId',
        permissons: [],
        role: ROLE_DETAIL.systemAdmin.level
    },
    {
        component: ProcessDashboard,
        url: '/process-dashboard',
        permissons: [],
        role: ROLE_DETAIL.systemAdmin.level
    },
    {
        component: RequestDashboard,
        url: '/request-dashboard',
        permissons: [],
        role: ROLE_DETAIL.systemAdmin.level
    },
    {
        component: Compare,
        url: '/compare',
        role: ROLE_DETAIL.systemAdmin.level,
    },
    {
        component: ProductPool,
        url: '/product-pool',
        role: ROLE_DETAIL.systemAdmin.level,
    },
    {
        component: PostManagement,
        url: '/post',
        permissons: []
    },
    {
        component: PostDetail,
        url: '/post-detail/:postId',
        isExact: true,
        permissons: []
    },
    {
        component: CampaignManagement,
        url: '/campaign',
        permissons: []
    },
    {
        component: CrawlHistory,
        url: '/crawl-history',
        role: ROLE_DETAIL.systemAdmin.level,
    },
    {
        component: Group,
        url: '/group',
        role: ROLE_DETAIL.systemAdmin.level,
    },
]