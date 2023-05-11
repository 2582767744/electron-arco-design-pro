<template>
  <div class="banner">
    <div class="banner-inner">
      <div class="carousel-item">
        <!-- <div class="carousel-title">{{ carouselItem[0].slogan }}</div>
        <div class="carousel-sub-title">{{ carouselItem[0].subSlogan }}</div> -->
        <img class="carousel-image" :src="name" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import name from './assets/name.png';
</script>

<style lang="less" scoped>
.banner {
  display: flex;
  align-items: center;
  justify-content: center;
  background:#fff0;
  background-image: url('./assets/background.png');

  &-inner {
    flex: 1;
    height: 100%;
  }
}

.carousel {
  height: 100%;

  &-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
  }

  &-image {
    width: 320px;
    margin-top: 30px;
  }
}
</style>
