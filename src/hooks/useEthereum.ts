import { reactive, toRefs, onUnmounted } from 'vue';
import Nabox from '@/assets/img/provider/nabox.svg';

import { ethers } from 'ethers';
import nerve from 'nerve-sdk-js';
import storage from '@/utils/storage';
import { getCurrentAccount } from '@/utils/util';
import { _networkInfo } from '@/utils/heterogeneousChainConfig';
import config from '@/config';

interface State {
  address: string;
  providerType: string;
  pub: string;
  currentChain: string;
  chainId: string;
  networkError: string;
}

interface NativeCurrency {
  name: string;
  symbol: string;
  decimals: number;
}

export interface AddChain {
  chainId: string;
  rpcUrls: string[];
  chainName: string;
  nativeCurrency: NativeCurrency;
  blockExplorerUrls: string[];
}

interface SwitchChain {
  chainId: string;
}

interface GenerateAddressConfig {
  chainId: number;
  assetId: number;
  prefix: string;
}

const isMobile = /Android|webOS|iPhone|iPod|BlackBerry/i.test(
  navigator.userAgent
);

const NaboxProvier = 'NaboxWallet';

export const providerList = [
  { name: 'Nabox', src: Nabox, provider: NaboxProvier }
];

export function getProvider1(type?: string): any {
  if (type) return window[type];
  const providerType = storage.get('providerType');
  return providerType ? window[providerType] : null;
}

export function getProvider() {
  const network = storage.get('network');
  if (network === 'NULS' || network === 'NERVE') {
    return getNULSProvider();
  } else {
    return getEVMProvider();
  }
}

export function getEVMProvider() {
  return window.NaboxWallet || null;
}

export function getNULSProvider() {
  return window.NaboxWallet?.nai || null;
}

export function getAccountAndChainId() {
  const provider = getProvider();
  const address = provider?.selectedAddress;
  const currentAccount = address ? getCurrentAccount(address) : null;
  return {
    currentAccount,
    chainId: provider.chainId
  };
}

export default function useEthereum() {
  const state: State = reactive({
    address: '',
    providerType: storage.get('providerType') || '',
    pub: '',
    currentChain: '',
    chainId: '',
    networkError: ''
  });

  onUnmounted(() => {
    removeListener();
  });

  function initProvider(setListen = true) {
    const network = storage.get('network') || 'NULS AI';
    const { currentAccount, chainId } = getAccountAndChainId();
    state.chainId = chainId;
    state.currentChain = network;
    if (currentAccount) {
      const _network = network === 'NULS AI' ? 'NULS' : network;
      state.address =
        currentAccount.address[_network] || currentAccount.address.EVM;
      state.pub = currentAccount.pub;
      if (setListen) {
        removeListener();
        listenAccountChange();
        listenNetworkChange();
      }
    } else {
      state.address = '';
      state.pub = '';
    }
    // console.log(state, 111)
  }

  function listenAccountChange() {
    const provider = getProvider();
    provider?.on('accountsChanged', handleAccountChange);
  }

  function listenNetworkChange() {
    const provider = getProvider();
    provider?.on('chainChanged', handleChainChange);
  }

  function handleAccountChange(accounts: string) {
    console.log('===accounts===');
    initProvider(false);
    if (!accounts.length) {
      disconnect();
    }
  }
  function handleChainChange(chainId: string) {
    console.log('===chainId===');
    if (chainId) {
      initProvider(false);
    }
  }

  function removeListener() {
    const EVMProvider = getEVMProvider();
    const NULSProvider = getNULSProvider();
    if (EVMProvider) {
      EVMProvider.off('accountsChanged', handleAccountChange);
      EVMProvider.off('chainChanged', handleChainChange);
      NULSProvider.off('accountsChanged', handleAccountChange);
      NULSProvider.off('chainChanged', handleChainChange);
    }
  }

  async function connect(providerType: string) {
    const provider = getNULSProvider();
    const result = await provider?.createSession();
    await provider.switchChain({ chainId: config.NULS.chainId });
    state.address = result[0];
    storage.set('network', 'NULS AI');
    storage.set('providerType', providerType);
    state.providerType = providerType;
  }

  function disconnect() {
    storage.remove('providerType');
    storage.remove('network');
    state.address = '';
    state.providerType = '';
  }

  async function addEthereumChain(params: AddChain) {
    const { provider } = getEVMProvider();
    try {
      await provider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: params.chainId }]
      });
    } catch (e: any) {
      if (e.code === 4902) {
        await provider.request({
          method: 'wallet_addEthereumChain',
          params: [params]
        });
      }
    }
  }

  async function switchEthereumChain(params: SwitchChain) {
    const provider = getEVMProvider();
    await provider.request({
      method: 'wallet_switchEthereumChain',
      params: [params]
    });
  }

  async function switchNULSChain(chainId: number) {
    const provider = getNULSProvider();
    provider.switchChain({ chainId });
  }

  async function switchChain(chainItem: AddChain) {
    const { chainName } = chainItem;
    const oldNetwork = storage.get('network');
    if (chainName === 'NULS AI' || chainName === 'NERVE') {
      const chain = _networkInfo[chainName];
      await switchNULSChain(chain.chainId);
      storage.set('network', chainName);
      if (oldNetwork !== 'NULS AI' && oldNetwork !== 'NERVE') {
        window.location.reload();
      }
    } else {
      await addEthereumChain(chainItem);
      storage.set('network', chainName);
      if (oldNetwork === 'NULS AI' || oldNetwork === 'NERVE') {
        window.location.reload();
      }
    }
    // state.currentChain = chainName;
    // const { currentAccount } = getAccountAndChainId();
    // const addresses = currentAccount.address;
    // state.address = addresses[chain] || addresses.EVM;
    // state.chainId = chainId;
    // storage.set('currentChain', chain);
  }

  async function generateAddress(
    NERVEConfig: GenerateAddressConfig,
    NULSConfig: GenerateAddressConfig
  ) {
    const provider = getProvider();
    const address = provider?.selectedAddress;
    if (!address) {
      disconnect();
      throw 'Pls connect a provider first';
    }

    const pub = await window.nabox.getPub({
      address
    });
    const EVMAddress = ethers.utils.computeAddress(
      ethers.utils.hexZeroPad(ethers.utils.hexStripZeros('0x' + pub), 33)
    );

    const { chainId, assetId = 1, prefix } = NERVEConfig;
    const NERVEAddress = nerve.getAddressByPub(chainId, assetId, pub, prefix);
    const NULSAddress = nerve.getAddressByPub(
      NULSConfig.chainId,
      NULSConfig.assetId,
      pub,
      NULSConfig.prefix
    );
    state.address = address;
    state.pub = pub;
    return {
      address: {
        EVM: EVMAddress,
        NERVE: NERVEAddress,
        NULS: NULSAddress
      },
      pub
    };
  }

  return {
    initProvider,
    connect,
    disconnect,
    ...toRefs(state),
    addEthereumChain,
    switchEthereumChain,
    generateAddress,
    switchChain
  };
}
