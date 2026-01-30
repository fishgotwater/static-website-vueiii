import { createRouter, createWebHistory } from 'vue-router'
import usersData from '@/data/users.json'
import { useUserStore } from '@/stores/user'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: () => import('@/views/login/index.vue'),
    },
    {
      path: '/album/:user',
      name: 'album',
      component: () => import('@/views/album/index.vue'),
    },
  ],
})

router.addRoute({
  path: '/:catchAll(.*)',
  redirect: { name: 'login' },
})

router.beforeEach(async (to, from, next) => {
  console.log('to, from: ', to, from)
  try {
    const userName = sessionStorage.getItem('userName')
    const isLoggedIn = sessionStorage.getItem('isLoggedIn')
    const user = usersData.find((item) => item.name === userName)
    let hasLoggedIn = isLoggedIn ? user && user.date === isLoggedIn : false
    if (to.path === '/') {
      if (hasLoggedIn) {
        // 已登录去相册页面
        next({ name: 'album', params: { user: userName }, replace: true })
      } else {
        sessionStorage.clear()
        // 未登录去登录页面
        next()
      }
    } else {
      if (!hasLoggedIn) {
        // 未登录去登录页面
        next({ name: 'login', replace: true })
      } else {
        const userStore = useUserStore()
        if (to.name === 'album' && userStore.images.length === 0) {
          userStore.initImages()
        }
        // 已登录去相册页面
        next()
      }
    }
    next()
  } catch (error) {
    console.error(error)
    next(false)
  }
})

export default router
