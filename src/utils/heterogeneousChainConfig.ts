import config from '@/config';

import NULSLogo from '@/assets/img/chainLogo/NULS.png';
import NERVELogo from '@/assets/img/chainLogo/NERVE.png';
import ETHLogo from '@/assets/img/chainLogo/ETH.png';
import BSCLogo from '@/assets/img/chainLogo/BSC.jpg';
import HecoLogo from '@/assets/img/chainLogo/Heco.png';
import OECLogo from '@/assets/img/chainLogo/OEC.png';
import HarmonyLogo from '@/assets/img/chainLogo/Harmony.png';
import PolygonLogo from '@/assets/img/chainLogo/Polygon.png';
import KCCLogo from '@/assets/img/chainLogo/KCC.png';

const isBeta = config.isBeta;

const NERVEOrigin = isBeta
  ? 'http://beta.scan.nerve.network'
  : 'https://scan.nerve.network';
const NULSOrigin = isBeta ? 'http://beta.nulscan.io' : 'https://nulscan.io';
const ETHOrigin = isBeta
  ? 'https://ropsten.etherscan.io'
  : 'https://etherscan.io';
const BSCOrigin = isBeta
  ? 'https://testnet.bscscan.com'
  : 'https://bscscan.com';
const HecoOrigin = isBeta
  ? 'https://testnet.hecoinfo.com'
  : 'https://hecoinfo.com';
const OECOrigin = isBeta
  ? 'https://www.oklink.com/okexchain-test'
  : 'https://www.oklink.com/okexchain';
const HarmonyOrigin = isBeta
  ? 'https://explorer.pops.one'
  : 'https://explorer.harmony.one';
const PolygonOrigin = isBeta
  ? 'https://mumbai.polygonscan.com'
  : 'https://polygonscan.com';
const KCCOrigin = isBeta
  ? 'https://scan-testnet.kcc.network'
  : 'https://explorer.kcc.io';

export const _networkInfo = {
  Ethereum: {
    name: 'Ethereum',
    chainId: 101,
    assetKey: isBeta ? '5-2' : '9-2',
    origin: ETHOrigin,
    color: '#5e5e5e',
    mainAsset: 'ETH',
    nativeId: isBeta ? '0x5' : '0x1',
    supported: true,
    logo: ETHLogo,
    decimals: 18,
    rpcUrl: isBeta
      ? 'https://ethereum-goerli.publicnode.com'
      : 'https://eth.drpc.org'
  },
  BSC: {
    name: 'BSC',
    chainId: 102,
    assetKey: isBeta ? '5-8' : '9-25',
    origin: BSCOrigin,
    color: '#e7b941',
    mainAsset: 'BNB',
    nativeId: isBeta ? '0x61' : '0x38',
    supported: true,
    logo: BSCLogo,
    decimals: 18,
    rpcUrl: isBeta
      ? 'https://data-seed-prebsc-1-s1.binance.org:8545'
      : 'https://bsc-dataseed.binance.org/'
  },
  Polygon: {
    name: 'Polygon',
    chainId: 106,
    assetKey: isBeta ? '5-34' : '9-160',
    origin: PolygonOrigin,
    color: '#7449df',
    mainAsset: 'MATIC',
    nativeId: isBeta ? '0x13881' : '0x89',
    supported: true,
    logo: PolygonLogo,
    decimals: 18,
    rpcUrl: isBeta
      ? 'https://polygon-testnet.public.blastapi.io'
      : 'https://polygon-rpc.com'
  },
  Heco: {
    name: 'Heco',
    chainId: 103,
    assetKey: isBeta ? '5-9' : '9-55',
    origin: HecoOrigin,
    color: '#336adb',
    mainAsset: 'HT',
    nativeId: isBeta ? '0x100' : '0x80',
    supported: true,
    logo: HecoLogo,
    decimals: 18,
    rpcUrl: isBeta
      ? 'https://http-testnet.hecochain.com'
      : 'https://http-mainnet.hecochain.com'
  },
  OKTC: {
    name: 'OKTC',
    chainId: 104,
    assetKey: isBeta ? '5-12' : '9-87',
    origin: OECOrigin,
    color: '#4883ed',
    mainAsset: 'OKT',
    nativeId: isBeta ? '0x41' : '0x42',
    supported: true,
    logo: OECLogo,
    decimals: 18,
    rpcUrl: isBeta
      ? 'https://exchaintestrpc.okex.org'
      : 'https://exchainrpc.okex.org'
  },
  Harmony: {
    name: 'Harmony',
    chainId: 105,
    assetKey: isBeta ? '5-33' : '9-159',
    origin: HarmonyOrigin,
    color: '#5cc9c0',
    mainAsset: 'ONE',
    nativeId: isBeta ? '0x6357d2e0' : '0x63564c40',
    supported: true,
    logo: HarmonyLogo,
    decimals: 18,
    rpcUrl: isBeta ? 'https://api.s0.b.hmny.io' : 'https://api.harmony.one'
  },
  KCC: {
    name: 'KCC',
    chainId: 107,
    assetKey: isBeta ? '5-35' : '9-161',
    origin: KCCOrigin,
    color: '#66ac90',
    mainAsset: 'KCS',
    nativeId: isBeta ? '0x142' : '0x141',
    supported: true,
    logo: KCCLogo,
    decimals: 18,
    rpcUrl: isBeta
      ? 'https://rpc-testnet.kcc.network'
      : 'https://rpc-mainnet.kcc.network'
  },
  NULS: {
    name: 'NULS',
    chainId: isBeta ? 2 : 1,
    assetKey: isBeta ? '2-1' : '1-1',
    origin: NULSOrigin,
    color: '#00da9d',
    mainAsset: 'NULS',
    nativeId: '0x-1',
    supported: true,
    logo: NULSLogo
  },
  NERVE: {
    name: 'NERVE',
    chainId: isBeta ? 5 : 9,
    assetKey: isBeta ? '5-1' : '9-1',
    origin: NERVEOrigin,
    color: '#56bff3',
    mainAsset: 'NVT',
    nativeId: '0x-2',
    supported: true,
    logo: NERVELogo
  }
};
