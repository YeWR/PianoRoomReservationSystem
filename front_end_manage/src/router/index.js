import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/views/layout/Layout'

/* Router Modules */
// import componentsRouter from './modules/components'
// import chartsRouter from './modules/charts'
// import nestedRouter from './modules/nested'

/** note: Submenu only appear when children.length>=1
 *  detail see  https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 **/

/**
 * hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
 *                                if not set alwaysShow, only more than one route under the children
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noredirect           if `redirect:noredirect` will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']     will control the page roles (you can set multiple roles)
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
    noCache: true                if true ,the page will no be cached(default is false)
  }
 **/
export const constantRouterMap = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/authredirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/errorPage/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/errorPage/401'),
    hidden: true
  },
  {
    path: '',
    component: Layout,
    redirect: 'dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'Dashboard',
        meta: { title: 'dashboard', icon: 'dashboard', noCache: true }
      }
    ]
  }
  // {
  //   path: '/documentation',
  //   component: Layout,
  //   redirect: '/documentation/index',
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/documentation/index'),
  //       name: 'Documentation',
  //       meta: {title: 'documentation', icon: 'documentation', noCache: true}
  //     }
  //   ]
  // },
  // {
  //   path: '/guide',
  //   component: Layout,
  //   redirect: '/guide/index',
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/guide/index'),
  //       name: 'Guide',
  //       meta: {title: 'guide', icon: 'guide', noCache: true}
  //     }
  //   ]
  // }
]

export default new Router({
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

export const asyncRouterMap = [
  {
    path: '/item',
    component: Layout,
    alwaysShow: true,
    redirect: '/item/scan',
    name: 'Item',
    meta: {
      title: 'itemManagement',
      icon: 'component'
    },
    children: [
      {
        path: 'scan',
        component: () => import('@/views/item/itemScan'),
        name: 'itemScan',
        meta: { title: 'itemScan' }
      },
      {
        path: 'all',
        component: () => import('@/views/item/itemAll'),
        name: 'itemAll',
        meta: { title: 'itemList' }
      }
    ]
  },
  {
    path: '/user',
    component: Layout,
    redirect: '/user/all',
    name: 'User',
    meta: {
      title: 'userManagement',
      icon: 'peoples'
    },
    children: [
      {
        path: 'all',
        component: () => import('@/views/user/userAll'),
        name: 'userAll',
        meta: { title: 'userList' }
      },
      {
        path: 'black',
        component: () => import('@/views/user/blackLIST'),
        name: 'blackLIST',
        meta: { title: 'blackList' }
      }
    ]
  },
  {
    path: '/notice',
    component: Layout,
    redirect: '/notice/list',
    name: 'notice',
    meta: {
      title: 'Notice',
      icon: 'message'
    },
    children: [
      {
        path: 'list',
        component: () => import('@/views/notice/noticeList'),
        name: 'Notice',
        meta: { title: 'Notice' }
      }
    ]
  },
  {
    path: '/room',
    component: Layout,
    redirect: '/room/list',
    name: 'room',
    meta: {
      title: 'Room',
      icon: 'list'
    },
    children: [
      {
        path: 'list',
        component: () => import('@/views/room/roomList'),
        name: 'Room',
        meta: { title: 'Room' }
      }
    ]
  },
  {
    path: '/check',
    component: Layout,
    redirect: '/check/ticket',
    name: 'checkTicket',
    meta: {
      title: 'CheckTicket',
      icon: 'password'
    },
    children: [
      {
        path: 'ticket',
        component: () => import('@/views/check/checkTicket'),
        name: 'CheckTicket',
        meta: { title: 'CheckTicket' }
      }
    ]
  },
  { path: '*', redirect: '/404', hidden: true }
]

export const asyncCheckRouterMap = [
  {
    path: '/item',
    component: Layout,
    alwaysShow: true,
    redirect: '/item/scan',
    name: 'Item',
    meta: {
      title: 'itemManagement',
      icon: 'table'
    },
    children: [
      {
        path: 'scan',
        component: () => import('@/views/item/itemScan'),
        name: 'itemScan',
        meta: { title: 'itemScan' }
      },
      {
        path: 'all',
        component: () => import('@/views/item/itemAll'),
        name: 'itemAll',
        meta: { title: 'itemList' }
      }
    ]
  },
  {
    path: '/check',
    component: Layout,
    redirect: '/check/ticket',
    name: 'checkTicket',
    meta: {
      title: 'CheckTicket',
      icon: 'table'
    },
    children: [
      {
        path: 'ticket',
        component: () => import('@/views/check/checkTicket'),
        name: 'CheckTicket',
        meta: { title: 'CheckTicket' }
      }
    ]
  }
]
