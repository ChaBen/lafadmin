import Vue from 'vue'
import Router from 'vue-router'

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirect in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
**/
export const constantRouterMap = [
  { path: '/login', component: () => import('@/views/login/index'), hidden: true },
  { path: '/404', component: () => import('@/views/404'), hidden: true },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    name: 'Dashboard',
    hidden: true,
    children: [{
      path: 'dashboard',
      component: () => import('@/views/dashboard/index')
    }]
  },

  {
    path: '/site',
    component: Layout,
    redirect: '/site/press',
    name: 'Site',
    meta: { title: 'Site', icon: 'example' },
    children: [
      {
        path: 'press',
        name: 'Press',
        component: () => import('@/views/press/index'),
        meta: { title: 'Press', icon: 'table' }
      },
      {
        path: 'Tickets',
        name: 'Tickets',
        component: () => import('@/views/tickets/index'),
        meta: { title: 'Tickets', icon: 'table' }
      },
      {
        path: 'channel',
        name: 'Channel',
        component: () => import('@/views/channel/index'),
        meta: { title: 'Channel', icon: 'table' }
      },
      {
        path: 'artists',
        name: 'Artists',
        component: () => import('@/views/artists/index'),
        meta: { title: 'Artists', icon: 'table' }
      }
    ]
  },
  {
    path: 'external-link',
    component: Layout,
    children: [
      {
        path: 'https://panjiachen.github.io/vue-element-admin-site/#/',
        meta: { title: 'External Link', icon: 'link' }
      }
    ]
  },

  { path: '*', redirect: '/404', hidden: true }
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  mode: 'history',
  routes: constantRouterMap
})
