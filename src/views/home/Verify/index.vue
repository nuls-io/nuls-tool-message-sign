<template>
  <div class="verify-wrapper flex-layout">
    <div class="page-content">
      <Textarea :placeholder="$t('verify.verify1')" v-model="verifyVal" />
      <div class="verify-error" v-if="verifyError">
        {{ $t('verify.verify4') }}
      </div>
      <div class="verified-info copy-wrapper-content" v-if="signer && !verifyError">
        <div class="signer">
          <div class="flex-between">
            <span class="label">{{ $t('verify.verify2') }}</span>
            <span class="click" @click="copy(signer)">{{ $t('public.public7') }}</span>
          </div>
          <p>{{ signer }}</p>
        </div>
        <div class="signer-msg">
          <div class="flex-between">
            <span class="label">{{ $t('verify.verify3') }}</span>
            <span class="click" @click="copy(signMsg)">{{ $t('public.public7') }}</span>
          </div>
          <p>{{ signMsg }}</p>
        </div>
      </div>
    </div>
    <Button
      :title="$t('tab.Verify')"
      :disabled="!verifyVal"
      @click="submit"
    ></Button>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';
import Textarea from '@/components/Textarea/index.vue';
import useCopy from '@/hooks/useCopy';
import Button from '@/components/Button/index.vue';
import { ETransfer, NTransfer } from '@/utils/api';


const props = defineProps<{
  chain: string;
  address: string;
}>();

const { copy } = useCopy();
const verifyVal = ref('');

const signer = ref('');
const signMsg = ref('');
const verifyError = ref(false);

watch(
  () => verifyVal.value,
  () => {
    signer.value = '';
    signMsg.value = '';
    verifyError.value = false;
  }
);

function submit() {
  signer.value = '';
  signMsg.value = '';
  verifyError.value = false;
  try {
    const signedVal = JSON.parse(verifyVal.value);
    if (typeof signedVal === 'object' && signedVal !== null) {
      const { msg, sig } = signedVal;
      if (!msg || !sig) {
        verifyError.value = true;
      } else {
        if (!props.address.startsWith('0x')) {
          const transfer = new NTransfer({ chain: props.chain });
          const recoverAddress = transfer.verifySignedMessage(sig);
          signer.value = recoverAddress;
          signMsg.value = transfer.toUtf8String(msg);
        } else {
          const transfer = new ETransfer();
          const recoverAddress = transfer.verifySignedMessage(msg, sig);
          console.log(recoverAddress, 8877);
          signer.value = recoverAddress;
          signMsg.value = transfer.toUtf8String(msg);
        }
      }
    } else {
      verifyError.value = true;
    }
  } catch (e) {
    console.log(e, 'verify failed');
    verifyError.value = true;
  }
}

function resetFields() {
  verifyVal.value = '';
  signer.value = '';
  signMsg.value = '';
  verifyError.value = false;
}

defineExpose({
  resetFields
});
</script>

<style lang="scss">
.verify-wrapper {
  .verify-error {
    text-align: center;
    color: #f56c6c;
    font-size: 13px;
    margin-top: 10px;
  }
  .verified-info {
    .signer {
      margin-bottom: 10px;
    }
  }
}
</style>
