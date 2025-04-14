<template>
  <div class="n-textarea">
    <el-input
      v-model="inputVal"
      :rows="5"
      autosize
      type="textarea"
      :placeholder="props.placeholder"
    />
    <span class="clear-all" @click="inputVal = ''">
      {{ $t('public.public8') }}
    </span>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';

const props = defineProps<{
  modelValue: string;
  placeholder: string;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue'): void;
}>();

const inputVal = computed({
  get() {
    return props.modelValue;
  },
  set(val) {
    emit('update:modelValue', val);
  }
});
</script>

<style lang="scss">
@import '../../assets/css/theme';
.n-textarea {
  position: relative;
  .el-textarea .el-textarea__inner {
    min-height: 160px !important;
    padding-bottom: 20px;
  }
  .clear-all {
    position: absolute;
    right: 10px;
    bottom: 6px;
    font-size: 13px;
    color: $BASE_NULS;
    cursor: pointer;
  }
}
</style>
