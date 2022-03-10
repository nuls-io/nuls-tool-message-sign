<template>
  <div class="encrypt-wrapper flex-layout" v-loading="loading">
    <div class="page-content">
      <Textarea :placeholder="$t('encrypt.encrypt1')" v-model="encryptVal" />
      <el-input v-model="encryptPub" :placeholder="$t('encrypt.encrypt2')"></el-input>
    </div>
    <Button
      :title="$t('tab.Encrypt')"
      :disabled="!encryptVal || !encryptPub"
      @click="submit"
    ></Button>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import Textarea from '@/components/Textarea/index.vue';
import Button from '@/components/Button/index.vue';
import { NTransfer } from '@/utils/api';
import { ElMessage } from 'element-plus';
import { getCurrentAccount } from '@/utils/util';

const props = defineProps<{
  chain: string;
  address: string;
  pub: string;
}>();

const emit = defineEmits<{
  (e: 'showDialog', show: boolean, title: string, value: string): void
}>();

const { t } = useI18n();

const encryptVal = ref('');
const encryptPub = ref('');
const loading = ref(false);

// const pri = '4594348e3482b751aa235b8e580efef69db465b3a291c5662ceda6459ed12e39';
// const pub = '0369b20002bc58c74cb6fd5ef564f603834393f53bed20c3314b4b7aba8286a7e0

async function submit() {
  const transfer = new NTransfer({chain: 'NULS'});
  loading.value = true;
  try {
    const currentAccount = getCurrentAccount(props.address);
    const encrypted = await transfer.encryptMsg(
      encryptVal.value,
      currentAccount.pub
    );
    emit('showDialog', true, t('encrypt.encrypt3'), encrypted);
  } catch (e) {
    ElMessage.error(e.message || e);
  }
  loading.value = false;
}

function resetFields() {
  encryptVal.value = '';
  encryptPub.value = '';
}

defineExpose({
  resetFields
});
</script>

<style lang="scss">
.encrypt-wrapper {
  .n-textarea {
    margin-bottom: 20px;
  }
}
</style>
