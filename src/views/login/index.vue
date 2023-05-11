<template>
  <div class="container">
    <div class="logo" v-show="!loginFlag">
      <svg-icon name="logo" style="width: 125px;height: 64.7px;opacity: 1;"/>
      <!-- <img alt="logo" :src="logoUrl"  /> -->
      <!-- <div class="logo-text">task manager</div> -->
    </div>
    <LoginBanner v-show="!loginFlag"/>
    <div class="content">
      <div class="content-inner">
        <LoginForm  @loginClick="loginClick"/>
      </div>
      <div class="footer">
        <Footer />
      </div>
    </div>
    <div class="quit">
      <a-button type="text" @click="quit" style="-webkit-app-region: no-drag">
        <template #icon>
          <icon-close style="color: #878a8f;" size="32" :strokeWidth="2" />
        </template>
      </a-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import Footer from '@/components/footer/index.vue';
import LoginBanner from './components/banner.vue';
import LoginForm from './components/login-form.vue';
const loginFlag = ref(false)
console.log(window.versions.ping())
window.versions.start()

const quit = () => {
  window.versions.loginQuit()
}

const loginClick = ()=>{
  console.log('开始传递')
  loginFlag.value = true
  console.log('开始传递')
}

</script>

<style lang="less" scoped>
.container {
  display: flex;
  height: 100vh;
  
  .banner {
    width: 550px;
    // background: linear-gradient(163.85deg, #1d2129 0%, #00308f 100%);
  }

  .content {
    position: relative;
    display: flex;
    flex: 1;
    align-items: center;
    justify-content: center;
    padding-bottom: 40px;
  }

  .footer {
    position: absolute;
    right: 0;
    bottom: 0;
    width: 100%;
  }
}

.logo {
  position: fixed;
  top: 28px;
  left: 22px;
  z-index: 1;
  display: inline-flex;
  align-items: center;
}

.quit {
  width: 32px;
  height: 32px;
  margin-top: 20px;
  margin-right: 20px;
}
</style>

<style lang="less" scoped>
// responsive
@media (max-width: @screen-lg) {
  .container {
    .banner {
      width: 25%;
    }
  }
}
</style>

