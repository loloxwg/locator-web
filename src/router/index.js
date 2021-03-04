import Vue from 'vue'
import VueRouter from 'vue-router'
const Login = () => import('@/views/Login.vue')
const EmployeeInfo = () => import('@/views/EmployeeInfo')
const WiFiInfo = () => import('@/views/WiFiInfo')
const SiteInfo = () => import('@/views/SiteInfo')
const SiteCard = () => import('@/views/SiteInfo/SiteCard')
const SiteMap = () => import('@/views/SiteInfo/SiteMap')
const EmployeeList = () => import('@/views/EmployeeInfo/EmployeeList')
const EmployeeSite = () => import('@/views/EmployeeInfo/EmployeeSite')
const EmployeeUDSI = () =>
  import('@/views/EmployeeInfo/EmployeeList/EmployeeUDSI')
const AssignTask = () => import('@/views/EmployeeInfo/EmployeeList/AssignTask')

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Login',
    components: {
      main: Login
    }
  },
  {
    path: '/employeeinfo',
    name: 'EmployeeInfo',
    components: { main: EmployeeInfo },
    children: [
      {
        path: 'employeelist',
        name: 'EmployeeList',
        components: { employeelist: EmployeeList },
        children: [
          {
            path: 'employeeudsi',
            name: 'EmployeeUDSI',
            components: { employeeudsi: EmployeeUDSI }
          },
          {
            path: 'assigntask',
            name: 'AssignTask',
            components: { assigntask: AssignTask }
          }
        ]
      },
      {
        path: 'employeesite',
        name: 'EmployeeSite',
        components: { employeesite: EmployeeSite }
      }
    ]
  },
  {
    path: '/wifiinfo',
    name: 'WiFiInfo',
    components: { main: WiFiInfo }
  },
  {
    path: '/siteinfo',
    name: 'SiteInfo',
    components: { main: SiteInfo },
    children: [
      {
        path: '',
        name: 'SiteCard',
        components: { siteinfo: SiteCard }
      },
      {
        path: 'sitemap',
        name: 'SiteMap',
        components: { siteinfo: SiteMap }
      }
    ]
  }
]

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes
})

const auth = {
  isLogin() {
    return true
  }
}

router.beforeEach((to, from, next) => {
  if (auth.isLogin()) {
    next()
  } else {
    next('/')
  }
})
// 连续访问相同路由会报错的解决方法
const routerPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  if (typeof location === 'string') {
    var Separator = '&'
    if (location.indexOf('?') === -1) {
      Separator = '?'
    }
    location = location + Separator + 'random=' + Math.random()
  } // if这段也可以没有
  return routerPush.call(this, location).catch(error => error)
}

export default router
