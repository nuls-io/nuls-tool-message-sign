<template>
  <div class="decrypt-wrapper flex-layout" v-loading="loading">
    <div class="page-content">
      <Textarea :placeholder="$t('decrypt.decrypt1')" v-model="decryptVal" />
      <div class="decrypt-error" v-if="decryptError">
        {{ $t('decrypt.decrypt3') }}
      </div>
      <div class="decrypted-info copy-wrapper-content" v-if="!decryptError && decryptedVal">
        <div class="flex-between">
          <span class="label">{{ $t('decrypt.decrypt2') }}</span>
          <span class="click" @click="copy(decryptedVal)">{{ $t('public.public7') }}</span>
        </div>
        <p>{{ decryptedVal }}</p>
      </div>
    </div>
    <Button
      :title="$t('tab.Decrypt')"
      :disabled="!decryptVal"
      @click="submit"
    ></Button>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import Textarea from '@/components/Textarea/index.vue';
import useCopy from '@/hooks/useCopy';
import { NTransfer } from '@/utils/api';
import { getCurrentAccount } from '@/utils/util';
import { ElMessage } from 'element-plus';

const props = defineProps<{
  address: string;
}>();

const { copy } = useCopy();
const decryptVal = ref('');
const decryptedVal = ref('');
const loading = ref(false);
const decryptError = ref(false);

async function submit() {
  const transfer = new NTransfer({ chain: 'NULS' });
  loading.value = true;
  try {
    const currentAccount = getCurrentAccount(props.address);
    const NULSAddress = currentAccount.address.NULS;
    console.log(NULSAddress, 88)
    decryptedVal.value = await transfer.decryptMsg(
      NULSAddress,
      decryptVal.value
    );
  } catch (e) {
    ElMessage.error(e.message || e);
    decryptError.value = true;
  }
  loading.value = false;
}

function resetFields() {
  decryptVal.value = '';
  decryptedVal.value = '';
  decryptError.value = false;
}

defineExpose({
  resetFields
});
</script>

<style lang="scss">
.decrypt-wrapper {
  .decrypt-error {
    text-align: center;
    color: #f56c6c;
    font-size: 13px;
    margin-top: 10px;
  }
}
</style>
