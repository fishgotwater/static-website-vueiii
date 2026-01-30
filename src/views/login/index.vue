<template>
  <div class="loginWrapper">
    <van-form @submit="onSubmit">
      <van-cell-group inset>
        <van-field v-model="username" name="username" label="用户名" placeholder="请输入用户名"
          :rules="[{ required: true, message: '请输入用户名' }]" />
        <van-field v-model="password" type="password" name="password" label="密码" placeholder="请输入密码"
          :rules="[{ required: true, message: '请输入密码' }]" />
      </van-cell-group>
      <div class="btnWrapper">
        <van-button round block type="primary" native-type="submit">
          提交
        </van-button>
      </div>
    </van-form>
    <van-dialog v-model:show="show" title="温馨提示" message="用户名或密码错误，请稍后再试。"></van-dialog>
  </div>
  <van-overlay :show="visible" @click="visible = false">
    <div class="loginWrapper">
      <van-loading vertical color="#f50057" text-color="#969799">
        <template #icon>
          <van-icon name="like-o" size="30" />
        </template>
        登录中...
      </van-loading>
    </div>
  </van-overlay>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import usersData from '@/data/users.json';
/**
 * @description: 登录表单
 * 登录状态 sessionStorage 存储 token
 * 密码安全 bcryptjs
 * 防暴力破解 登录失败次数过多，锁定账号一段时间
 * 数据存储 外部加密JSON文件
 * 登录成功后初始化数据
 */

const username = ref('');
const password = ref('');
const show = ref(false);
const visible = ref(false);
const router = useRouter();

const onSubmit = (values) => {
  visible.value = true;
  const user = usersData.find(item => item.name === values.username);
  if (values.username && user && values.password === user.date) {
    sessionStorage.setItem('userName', values.username);
    sessionStorage.setItem('isLoggedIn', values.password);
    router.push({ path: `/album/${values.username}`, replace: true })
  } else {
    show.value = true;
    visible.value = false;
  }
}
</script>

<style scoped>
.loginWrapper {
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-bottom: 10vh;
}

.btnWrapper {
  margin: 28px 16px 0 16px;
}
</style>
