<template>
  <div class="main-wrapper pd-15">
    <template v-if="!props.providerType">
      <ConnectWallet @connect="type => emit('connect', type)" />
    </template>
    <template v-else-if="!props.address">
      <Button title="Switch Chain" @click="emit('connect', 'NaboxWallet')" />
    </template>
    <template v-else>
      <CopyWrapper :prefix="$t('public.public3')" :content="props.pub" />
      <el-tabs v-model="currentTab" stretch @tab-click="tabChange">
        <el-tab-pane :label="$t('tab.Sign')" :name="Tabs.Sign">
          <Sign
            ref="SignRef"
            :chain="props.chain"
            :address="props.address"
            :pub="props.pub"
            @showDialog="showCopyDialog"
          />
        </el-tab-pane>
        <el-tab-pane :label="$t('tab.Verify')" :name="Tabs.Verify">
          <Verify
            ref="VerifyRef"
            :chain="props.chain"
            :address="props.address"
          />
        </el-tab-pane>
        <el-tab-pane :label="$t('tab.Encrypt')" :name="Tabs.Encrypt">
          <Encrypt
            ref="EncryptRef"
            :chain="props.chain"
            :address="props.address"
            :pub="props.pub"
            @showDialog="showCopyDialog"
          />
        </el-tab-pane>
        <el-tab-pane :label="$t('tab.Decrypt')" :name="Tabs.Decrypt">
          <Decrypt ref="DecryptRef" :address="props.address" />
        </el-tab-pane>
      </el-tabs>
    </template>
    <CopyDialog v-model="showCopy" :copy-value="copyValue" :title="copyTitle" />
  </div>
</template>

<script lang="ts" setup>
import { nextTick, ref, watch } from 'vue';
import ConnectWallet from './ConnectWallet/index.vue';
import Button from '@/components/Button/index.vue';
import CopyWrapper from '@/components/CopyWrapper/index.vue';
import CopyDialog from '@/components/CopyDialog/index.vue';
import Sign from './Sign/index.vue';
import Verify from './Verify/index.vue';
import Encrypt from './Encrypt/index.vue';
import Decrypt from './Decrypt/index.vue';
import { Tabs } from './types';

const props = defineProps<{
  providerType: string;
  address: string;
  pub: string;
  chain: string;
}>();

// const emit = defineEmits(['createAccount', 'connect']);
const emit = defineEmits<{
  (e: 'createAccount'): void;
  (e: 'connect', type: string): void;
}>();

watch(
  () => [props.chain, props.address],
  () => {
    nextTick(resetFields);
  }
);

function createAccount() {
  emit('createAccount');
}

const currentTab = ref(Tabs.Sign);

const SignRef = ref<InstanceType<typeof Sign>>();
const VerifyRef = ref<InstanceType<typeof Verify>>();
const EncryptRef = ref<InstanceType<typeof Encrypt>>();
const DecryptRef = ref<InstanceType<typeof Decrypt>>();
function tabChange() {
  // console.log(item.paneName);
  // const tab = item.paneName;
  resetFields();
}

const showCopy = ref(false);
const copyTitle = ref('');
const copyValue = ref('');
function showCopyDialog(show: boolean, title: string, value: any) {
  showCopy.value = show;
  copyTitle.value = title;
  copyValue.value = value;
}

function resetFields() {
  SignRef.value?.resetFields();
  VerifyRef.value?.resetFields();
  EncryptRef.value?.resetFields();
  DecryptRef.value?.resetFields();
}
</script>

<style lang="scss">
.main-wrapper {
  //
}
</style>
