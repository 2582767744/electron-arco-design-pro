<template>
    <div class="container" :style="{ display: 'flex', width: '100%', height: '100%' }">
        <a-card :style="{ width: '100%', height: '100%' }" title="部门列表">
            <template #extra>
                <a-button type="primary" @click="$modal.info({ title: '新增', content: '新增部门' })">
                    <template #icon>
                        <icon-plus />
                    </template>
                </a-button>
            </template>
            <a-table :data="renderList" stripe :pagination="false" :bordered="false" page-position="bottom"
                :style="{ height: '100%' }">
                <template #columns>
                    <a-table-column title="ID" data-index="key"></a-table-column>
                    <a-table-column title="部门名称" data-index="name"></a-table-column>
                    <a-table-column title="部门职能" data-index="description"></a-table-column>
                    <a-table-column title="排序" data-index="sort"></a-table-column>
                    <a-table-column title="上级部门" data-index="pid"></a-table-column>
                    <a-table-column title="操作">
                        <template #cell="{ record }">
                            <a-button type="text" @click="$modal.info({ title: '编辑', content: record.name })">编辑</a-button>
                        </template>
                    </a-table-column>
                </template>
            </a-table>
            <a-pagination :total="total" show-total show-jumper show-page-size :style="{ justifyContent: 'center' }"
                @change="((current: number) => pageChange(current))"
                @page-size-change="((pageSize: number) => pageSizeChange(pageSize))" />
        </a-card>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import useLoading from '@/hooks/loading';
import type { TableData } from '@arco-design/web-vue/es/table/interface';
import { data } from './dept.json';

const renderList = ref<any>();
const { loading, setLoading } = useLoading();
let total = 0;
let pageSize = 10;
const fetchData = async (type: string) => {
    try {
        console.log(type)
        setLoading(true);
        renderList.value = data.slice(0, 10);
        total = data.length;
    } catch (err) {
        // you can report use errorHandler or other
        console.log(err)
    } finally {
        setLoading(false);
    }
};

const pageChange = async (currentChange: number) => {
    console.log("current", currentChange)
    const nowNum = currentChange * pageSize;
    const oldNum = (currentChange - 1) * pageSize;
    if (nowNum <= total) {
        renderList.value = data.slice(oldNum, nowNum)
    } else {
        renderList.value = data.slice(oldNum, data.length)
        // console.log(`val*4>this.cameraLists.cameras.length: `, this.cameraLists);
    }
}
const pageSizeChange = async (sizeChange: number) => {
    pageSize = 0;
    console.log("pageSize", sizeChange)
    renderList.value = data.slice(0, sizeChange);
}
fetchData("开始渲染")
</script>
<script lang="ts">
  export default {
    name: 'Dept', // If you want the include property of keep-alive to take effect, you must name the component
  };
</script>

<style lang="less" scoped>
.container {
    display: flex;
    padding: 16px 20px;
    padding-bottom: 0;
    background-color: var(--color-fill-2);
}
</style>