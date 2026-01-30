import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    images: [],
    count: 0,
  }),
  getters: {
    doubleCount(state) {
      return state.count * 2
    },
  },
  actions: {
    increment() {
      this.count++
    },
    initImages() {
      //递归匹配users/*/images下的所有图片.{png,jpg,jpeg}
      this.images = import.meta.glob('@/assets/users/**/images/**/*', {
        eager: true,
        as: 'url',
      })
      console.log('store.images: ', this.images)
    },
  },
})
