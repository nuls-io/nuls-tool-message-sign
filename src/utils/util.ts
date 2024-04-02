import { BigNumber } from 'bignumber.js';
import copy from 'copy-to-clipboard';
import config from '@/config';
import storage from '@/utils/storage';
import { _networkInfo } from '@/utils/heterogeneousChainConfig';

interface Obj {
  [key: string]: unknown;
}

type Big = BigNumber | string | number;

export function isValidKey(
  key: string | number | symbol,
  object: Obj
): key is keyof typeof object {
  return key in object;
}

// 10的N 次方
export const Power = (arg: Big) => {
  const newPower = new BigNumber(10);
  return newPower.pow(arg);
};

// 加法
export const Plus = (nu: Big, arg: Big) => {
  const newPlus = new BigNumber(nu);
  return newPlus.plus(arg);
};

// 减法
export const Minus = (nu: Big, arg: Big) => {
  const newMinus = new BigNumber(nu);
  return newMinus.minus(arg);
};

// 乘法
export const Times = (nu: Big, arg: Big) => {
  const newTimes = new BigNumber(nu);
  return newTimes.times(arg);
};

// 除法
export const Division = (nu: Big, arg: Big) => {
  const newDiv = new BigNumber(nu);
  return newDiv.div(arg);
};

// 数字乘以精度系数
export const timesDecimals = (nu: Big, decimals = 8) => {
  return new BigNumber(Times(nu, Power(decimals.toString()).toString()))
    .toFormat()
    .replace(/[,]/g, '');
};

/**
 * 数字除以精度系数
 */
export const divisionDecimals = (nu: Big, decimals = 8) => {
  return new BigNumber(Division(nu, Power(decimals.toString()).toString()))
    .toFormat()
    .replace(/[,]/g, '');
};

export function divisionAndFix(nu: Big, decimals = 8, fix = 6) {
  const newFix = fix ? fix : Number(decimals);
  const str = new BigNumber(Division(nu, Power(decimals))).toFixed(newFix);
  const pointIndex = str.indexOf('.');
  let lastStr = str.substr(str.length - 1);
  let lastIndex = str.length;
  while (lastStr === '0' && lastIndex >= pointIndex) {
    lastStr = str.substr(lastIndex - 1, 1);
    if (lastStr === '0') {
      lastIndex = lastIndex - 1;
    }
  }
  lastIndex = str.substr(lastIndex - 1, 1) === '.' ? lastIndex - 1 : lastIndex;
  return str.substring(0, lastIndex);
}

export function fixNumber(str: string, fix = 8) {
  str = '' + str;
  const int = str.split('.')[0];
  let float = str.split('.')[1];
  if (!float || !Number(float)) return int;
  float = float.slice(0, fix).replace(/(0+)$/g, '');
  return Number(float) ? int + '.' + float : int;
}

export const copys = (val: string) => {
  return copy(val);
};

export const superLong = (str: string, len: number) => {
  if (str && str.length > 10) {
    return (
      str.substr(0, len) + '....' + str.substr(str.length - len, str.length)
    );
  } else {
    return str;
  }
};

export function getIconSrc(icon: string) {
  return 'https://nuls-cf.oss-us-west-1.aliyuncs.com/icon/' + icon + '.png';
}

export function genId() {
  return Math.floor(Math.random() * 1000);
}

export function getCurrentAccount(address: string | null): any {
  if (!address) return null;
  const accountList = storage.get('accountList') || [];
  return accountList.find((item: any) => {
    return Object.keys(item.address).find(
      v => item.address[v].toLowerCase() === address.toLowerCase()
    );
  });
}

export function debounce(fn: any, delay: number) {
  let timer: number;
  return function () {
    const args = arguments;
    if (timer) {
      clearTimeout(timer);
    }
    timer = window.setTimeout(() => {
      // @ts-ignore
      fn.apply(this, args);
    }, delay);
  };
}

export const isBeta = config.isBeta;

export function isNULSOrNERVE(chainName: string) {
  return chainName === 'NULS' || chainName === 'NERVE';
}

export function toUrl(chain: string, type = 'address', query: string) {
  let url = _networkInfo[chain].origin;
  if (type === 'address') {
    url +=
      (isNULSOrNERVE(chain) ? '/address/info?address=' : '/address/') + query;
  } else if (type === 'hash') {
    url += (isNULSOrNERVE(chain) ? '/transaction/info?hash=' : '/tx/') + query;
  }
  window.open(url);
}
