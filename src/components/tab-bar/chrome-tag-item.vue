<template>
    <div class="tag-item">

        {{ $t(item.title) }}
    </div>
</template>

<script lang="ts" setup>
import { ref, defineProps, PropType } from 'vue'
import type { ModelProps } from '@/store/modules/model-tag/types';
const props = defineProps({
    item: {
        type: Object as PropType<ModelProps>,
        default() {
            return [];
        },
    },
    index: {
        type: Number,
        default: 0,
    },
})

</script>

<style scoped>
.tag-item {
    display: flex;
    align-items: center;
    width: 120px;
    height: 100%;
    padding-left: 10px;

    /* background: #0000004a; */
}
</style>