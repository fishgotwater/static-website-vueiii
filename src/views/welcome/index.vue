<template>
  <div class="welcome">
    <van-loading vertical color="#f50057" text-color="#969799">
      <template #icon>
        <van-icon name="like-o" size="30" />
      </template>
      等哈哟...
    </van-loading>
  </div>
</template>

<script>
import { useRouter } from 'vue-router';
import usersData from '@/data/users.json';
export default {
  setup() {
    return {}
  },

  mounted() {
    /**
     * 判断登录状态，未登录跳转登录页面，登录状态跳转功能页面
     */
    const router = useRouter();
    let userName = sessionStorage.getItem("userName");
    let isLoggedIn = sessionStorage.getItem("isLoggedIn");
    const user = usersData.find(item => item.name === userName);
    if (userName && user && isLoggedIn === user.date) {
      router.push({ path: `/album/${userName}`, replace: true })
    } else {
      setTimeout(() => {
        router.push({ path: '/login', replace: true })
      }, 1500)
    }
  }
}
</script>

<style scoped>
.welcome {
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
