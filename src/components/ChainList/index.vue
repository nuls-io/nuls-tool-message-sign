<template>
  <div class="chain-list" v-show="props.show" ref="wrapper">
    <ul>
      <li
        v-for="item in supportChainList"
        :key="item.chainName"
        @click.stop="switchChain(item)"
      >
        <p
          :class="{
            active: item.chainName === props.current
          }"
        >
          <img :src="item.logo" alt="" />
          {{ item.chainName }}
        </p>
      </li>
      <div class="pop-arrow"></div>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import useEthereum, { AddChain, getProvider } from '@/hooks/useEthereum';
import config from '@/config';

interface ChainItem extends AddChain {
  logo: string;
}

const props = defineProps<{
  show: boolean;
  chainList: any;
  current: string;
  chainId: string;
}>();

const emit = defineEmits<{
  (e: 'update:show', show: boolean): void;
  (e: 'change', chainName: string, chainId: string): void;
}>();

const wrapper = ref<HTMLElement>();

const supportChainList: ChainItem[] = [];
const net = config.isBeta ? 'ropsten' : 'homestead';
Object.values(props.chainList).map((v: any) => {
  if (v.supported) {
    supportChainList.push({
      chainId: v[net],
      rpcUrls: v.rpcUrl ? [v.rpcUrl[net]] : [],
      chainName: v.name,
      nativeCurrency: {
        name: v.name,
        symbol: v.mainAsset,
        decimals: v.decimals
      },
      blockExplorerUrls: [v.origin],
      logo: v.logo
    });
  }
});

onMounted(() => {
  window.addEventListener('click', e => {
    const target = e.target as HTMLElement;
    if (!props.show || !wrapper.value) return;
    if (!wrapper.value?.contains(target)) {
      emit('update:show', false);
    }
  });
});

async function switchChain(item: ChainItem) {
  const { addEthereumChain, switchEthereumChain } = useEthereum();
  if (item.chainId === props.chainId) return;
  try {
    emit('update:show', false);
    const providerChainId = getProvider().chainId;
    if (
      item.chainId === '0x-1' ||
      item.chainId === '0x-2' ||
      providerChainId === item.chainId
    ) {
      emit('change', item.chainName, item.chainId);
    } else if (item.chainName !== 'Ethereum') {
      const { logo, ...rest } = item;
      await addEthereumChain(rest);
    } else {
      await switchEthereumChain({ chainId: item.chainId });
    }
  } catch (e) {
    //
  }
}
</script>

<style scoped lang="scss">
.chain-list {
  position: absolute;
  top: 30px;
  left: 20px;
  z-index: 99999;
  width: 150px;
  padding: 6px 0;
  margin-top: 8px;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
  background-color: #fff;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);

  li {
    padding: 5px 0;

    p {
      display: flex;
      align-items: center;
      padding: 0 15px;

      img {
        width: 28px;
        margin-right: 10px;
      }

      &:hover {
        background-color: #f5f7fa;
      }

      &.active {
        color: #409eff;
        font-weight: 700;
      }

      &.disable {
        cursor: not-allowed;
        color: #c0c4cc;

        &:hover {
          background-color: #fff;
        }
      }
    }
  }

  .pop-arrow,
  .pop-arrow:after {
    position: absolute;
    display: block;
    width: 0;
    height: 0;
    border-width: 6px;
    border-top-width: 0;
    border-color: transparent;
    border-style: solid;
  }

  .pop-arrow {
    top: -6px;
    left: 30px;
    border-bottom-color: #ebeef5;

    &:after {
      content: ' ';
      top: 1px;
      margin-left: -6px;
      border-bottom-color: #fff;
    }
  }
}
</style>
