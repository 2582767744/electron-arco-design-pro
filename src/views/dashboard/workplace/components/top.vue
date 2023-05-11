<template>
    <div class="list">
        <div class="crad" v-for="item in topList" :key="item.key">
            <div class="side" :style="item.style">
            </div>
            <div class="main_part">
                <Content :item="item" />
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import Content from './top/content.vue'

const topList = ref([
    {
        key: '1',
        style: {
            'background-color': 'red',
        },
        fontStyle: {
            'color': 'red',
            'font-weight': 700
        },
        title: '今日预警次数',
        number:10,
        content:'高风险预警 0次',
        chatType:'line',
    },
    {
        key: '2',
        style: {
            'background-color': 'blue',
        },
        fontStyle: {
            'color': 'blue',
        },
        title: '今日工作任务',
        number:10,
        content:'未完成 5',
        chatType:'bar',
    },
    {
        key: '3',
        style: {
            'background-color': 'red',
        },
        fontStyle: {
            'color': 'red',
        },
        title: '逾期未完成任务',
        number:10,
        content:'临期未完成 26',
        chatType:'line',
    },
    {
        key: '4',
        style: {
            'background-color': 'greenyellow',
        },
        fontStyle: {
            'color': 'greenyellow',
        },
        title: '今日巡检任务',
        number:10,
        content:'未完成 5',
        chatType:'bar',
    },
    {
        key: '5',
        style: {
            'background-color': 'greenyellow',
        },
        fontStyle: {
            'color': 'greenyellow',
        },
        title: '逾期未整改数',
        number:2,
        content:'临期未整改 15',
        chatType:'line',
    },
])

const optionKey = ref('day')
const click = (key: string) => {
    optionKey.value = key
}
</script>

<style lang="less">
.list {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    height: 100%;
}

.crad {
    display: flex;
    flex-direction: row;
    width: calc(100% / 5 - 20px);

    .side {
        width: 5px;
    }

    .main_part {
        display: flex;
        flex-direction: column;
        width: 100%;
        padding: 15px 10px 5px 20px;
        background-color: #fff;
    }
}
</style>