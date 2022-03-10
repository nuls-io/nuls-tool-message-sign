<template>
  <div class="copy-dialog">
    <el-dialog
      v-model="visible"
      :title="props.title"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
      width="90%"
    >
      <el-input ref="inputRef" type="textarea" :value="parsedValue" readonly autosize resize="none"></el-input>
      <Button :title="$t('public.public7')" @click="copyContent" />
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, watch } from 'vue';
import Button from '@/components/Button/index.vue';
import useCopy from '@/hooks/useCopy';

const props = defineProps<{
  modelValue: boolean;
  title: string;
  copyValue: any;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', visible: boolean): void;
}>();

const { copy } = useCopy();

const visible = computed({
  get() {
    return props.modelValue;
  },
  set(val) {
    emit('update:modelValue', val);
  }
});

const parsedValue = computed(() => {
  // console.log(typeof props.copyValue);
  if (typeof props.copyValue === 'string') {
    return props.copyValue;
  } else {
    return JSON.stringify(props.copyValue, null, 2);
  }
});

const inputRef = ref();
function copyContent() {
  if (!props.copyValue) return;
  copy(parsedValue.value);
  visible.value = false;
}
</script>

<style lang="scss">
.copy-dialog {
  .el-dialog__header {
    text-align: center;
    margin-right: 0;
    padding-bottom: 0;
    color: #333;
    .el-dialog__title {
      font-size: 16px;
    }
  }
  .el-dialog__body {
    padding: 10px 20px;
  }
  .el-textarea__inner {
    min-height: 180px !important;
    font-size: 13px;
  }
  .el-dialog__body .button-wrapper {
    margin-top: 30px;
    margin-bottom: 0;
  }
  .button-wrapper {
    margin: 0;
  }
}
</style>
