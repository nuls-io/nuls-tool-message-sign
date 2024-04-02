<template>
  <div class="sign-wrapper flex-layout" v-loading="loading">
    <div class="page-content">
      <Textarea :placeholder="$t('sign.sign1')" v-model="signVal" />
    </div>
    <Button
      :title="$t('tab.Sign')"
      :disabled="!signVal"
      @click="submit"
    ></Button>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import Textarea from '@/components/Textarea/index.vue';
import Button from '@/components/Button/index.vue';
import { ETransfer } from '@/utils/api';
import { ElMessage } from 'element-plus';
import { getCurrentAccount } from '@/utils/util';
// @ts-ignore
import sdk from 'nerve-sdk-js/lib/api/sdk';

const { t } = useI18n();

const props = defineProps<{
  address: string;
  pub: string;
}>();

const emit = defineEmits<{
  (e: 'showDialog', show: boolean, title: string, value: any): void;
}>();

const signVal = ref('');
const loading = ref(false);

async function submit() {
  loading.value = true;
  try {
    const transfer = new ETransfer();
    const currentAccount = getCurrentAccount(props.address);
    if (!currentAccount?.address?.EVM) {
      throw 'Unknown Error';
    }

    // const EVMAddress = currentAccount.address.EVM;
    const hexMsg = transfer.hexString(signVal.value);
    let sig = await transfer.signMessage(hexMsg, props.address);
    console.log(sig, '----signedVal----');
    if (!props.address.startsWith('0x')) {
      sig = sdk.appSplicingPub(sig, props.pub).toString('hex');
    } else {
      sig = sig.substr(2);
    }
    const signedVal = {
      address: props.address,
      msg: hexMsg,
      sig,
      version: '1',
      signer: 'Nabox'
    };
    emit('showDialog', true, t('sign.sign2'), signedVal);
  } catch (e) {
    ElMessage.error(e.message || e);
  }
  loading.value = false;
}

function resetFields() {
  signVal.value = '';
}

defineExpose({
  resetFields
});
</script>

<style lang="scss">
.sign-wrapper {
}
</style>
