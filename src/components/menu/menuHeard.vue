<template>
    <div class="left-side">
        <img alt="logo"
            src="https://p3-armor.byteimg.com/tos-cn-i-49unhts6dw/dfdba5317c0c20ce20e64fac803d52bc.svg~tplv-49unhts6dw-image.image" />
        <a-typography-title :style="{ margin: 0, fontSize: '20px' }" :heading="5">
            安全预警智能工具
        </a-typography-title>
    </div>
</template>

<script lang="ts" setup>

</script>

<style lang="less" scoped>
.left-side {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 220px;
    padding-bottom: 10px;

    img{
        padding: 10px;
    }

    h5.arco-typography{
        color: #666;
        font-weight: 700;
        line-height: 28px;
        text-align: center;
    }
}

</style>