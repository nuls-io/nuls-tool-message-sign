import { reactive, toRefs } from 'vue';
// import { Web3Provider } from "ethers";
import MetaMask from '@/assets/img/provider/metamask.svg';
import Nabox from '@/assets/img/provider/nabox.svg';

import { ethers } from 'ethers';
import nerve from 'nerve-sdk-js';
import storage from '@/utils/storage';
import { getCurrentAccount, evmNet } from '@/utils/util';
import { _networkInfo } from '@/utils/heterogeneousChainConfig';

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
const MetaMaskProvider = 'ethereum';
const NaboxProvier = 'NaboxWallet';
const OKExProvier = 'okexchain';

export const providerList = [
  // { name: 'MetaMask', src: MetaMask, provider: MetaMaskProvider },
  { name: 'Nabox', src: Nabox, provider: NaboxProvier }
];

export function getProvider(type?: string): any {
  if (type) return window[type];
  const providerType = storage.get('providerType');
  return providerType ? window[providerType] : null;
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

function getChainNameByChainId(chainId: string) {
  let chainName = 'NULS';
  Object.values(_networkInfo).map(v => {
    if (v[evmNet()] === chainId) {
      chainName = v.name;
    }
  });
  return chainName;
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

  function initProvider(setListen = true) {
    const { currentAccount, chainId } = getAccountAndChainId();
    state.chainId = chainId;
    state.currentChain = getChainNameByChainId(chainId);
    if (currentAccount) {
      state.address =
        currentAccount.address[state.currentChain] ||
        currentAccount.address.EVM;
      state.pub = currentAccount.pub;
      setListen && listenAccountChange();
      setListen && listenNetworkChange();
    } else {
      state.address = '';
      state.pub = '';
    }
    // console.log(state, 111)
  }

  // 监听插件账户变动
  function listenAccountChange() {
    const provider = getProvider();
    provider?.on('accountsChanged', (accounts: string) => {
      // console.log(accounts, '=======accountsChanged');
      initProvider(false);
      if (!accounts.length) {
        disconnect();
      }
    });
  }

  // 监听插件网络变动
  function listenNetworkChange() {
    const provider = getProvider();
    provider?.on('chainChanged', (chainId: string) => {
      console.log(chainId, '=======chainId');
      if (chainId) {
        initProvider(false);
      }
    });
  }

  // 连接provider
  async function connect(providerType: string) {
    const provider = getProvider(providerType);
    await provider?.request({ method: 'eth_requestAccounts' });
    storage.set('providerType', providerType);
    state.providerType = providerType;
    initProvider();
  }

  function disconnect() {
    storage.remove('providerType');
    state.providerType = '';
  }

  async function addEthereumChain(params: AddChain) {
    const provider = getProvider();
    await provider.request({
      method: 'wallet_addEthereumChain',
      params: [params]
    });
  }

  async function switchEthereumChain(params: SwitchChain) {
    const provider = getProvider();
    await provider.request({
      method: 'wallet_switchEthereumChain',
      params: [params]
    });
  }

  function switchChain(chain: string, chainId: string) {
    state.currentChain = chain;
    const { currentAccount } = getAccountAndChainId();
    const addresses = currentAccount.address;
    state.address = addresses[chain] || addresses.EVM;
    state.chainId = chainId;
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
    let heterogeneousAddress = '',
      pub = '';
    if (!address.startsWith('0x')) {
      if (!window.nabox) {
        throw 'Unknown error';
      }
      pub = await window.nabox.getPub({
        address: address
      });
      heterogeneousAddress = ethers.utils.computeAddress(
        ethers.utils.hexZeroPad(ethers.utils.hexStripZeros('0x' + pub), 33)
      );
    } else {
      const provider = getProvider();
      const EProvider = new ethers.providers.Web3Provider(provider);
      const jsonRpcSigner = EProvider.getSigner();
      let message = 'Generate address';
      const signature = await jsonRpcSigner.signMessage(message);
      const msgHash = ethers.utils.hashMessage(message);
      const msgHashBytes = ethers.utils.arrayify(msgHash);
      const recoveredPubKey = ethers.utils.recoverPublicKey(
        msgHashBytes,
        signature
      );
      if (recoveredPubKey.startsWith('0x04')) {
        const compressPub = ethers.utils.computePublicKey(
          recoveredPubKey,
          true
        );
        heterogeneousAddress = address;
        pub = compressPub.slice(2);
      } else {
        throw 'Sign error';
      }
    }
    const { chainId, assetId = 1, prefix } = NERVEConfig;
    const NERVEAddress = nerve.getAddressByPub(chainId, assetId, pub, prefix);
    const NULSAddress = nerve.getAddressByPub(
      NULSConfig.chainId,
      NULSConfig.assetId,
      pub,
      NULSConfig.prefix
    );
    const chain = storage.get('currentChain') || 'NULS';
    state.address = chain === 'NULS' ? NULSAddress : NERVEAddress;
    state.pub = pub;
    return {
      address: {
        EVM: heterogeneousAddress,
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
