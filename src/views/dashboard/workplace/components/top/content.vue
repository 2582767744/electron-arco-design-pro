<template>
    <div class="title">
        <div style="color:#999;font-weight: 400;font-family: '微软雅黑'">{{ item.title }}</div>
        <div class="select">
            <div class="option heard" @click="click('day')" :class="{ 'selected': optionKey === 'day' }">今日
            </div>
            <div class="option center" @click="click('week')" :class="{ 'selected': optionKey === 'week' }">本周
            </div>
            <div class="option end" @click="click('month')" :class="{ 'selected': optionKey === 'month' }">本月
            </div>
        </div>
    </div>
    <div class="center">
        <p>
            <span style="color: #747171;font-weight: 700;font-size:28px;">{{ item.number }}</span>
            <span style="margin-left:10px;font-size: 20px;" :style="item.fontStyle">{{ item.content }}</span>
        </p>
    </div>
    <div>

    </div>
</template>

<script lang="ts" setup>
import { defineProps, ref } from 'vue'

const props = defineProps({
    item: {
        type: Object,
        default: () => { },
    },
})

const optionKey = ref('')
const click = (key: string) => {
    optionKey.value = key
}

</script>

<style lang="less">
.title {
    display: flex;
    flex-direction: row;
    align-items: start;
    justify-content: space-between;

    .select {
        display: flex;
        flex-direction: row;
        color: #31A7FF;

        .heard {
            border-right: 0;
            border-radius: 5px;
            border-top-right-radius: 0;
            border-bottom-right-radius: 0;
        }

        .end {
            margin-left: 1px;
            border-radius: 5px;
            border-top-left-radius: 0;
            border-bottom-left-radius: 0;
        }
    }

    .option {
        padding: 2px;
        color: #31A7FF;
        font-weight: 400;
        font-size: 12px;
        font-family: '微软雅黑';
        font-style: normal;
        border: 1px solid rgb(49 167 255 / 100%);
    }

    .selected {
        color: #fff;
        background-color: rgb(49 167 255 / 100%);
    }
}

.center{
    display:block;
}
</style>