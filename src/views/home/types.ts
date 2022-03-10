export enum Tabs {
  Sign = 'Sign',
  Verify = 'Verify',
  Encrypt = 'Encrypt',
  Decrypt = 'Decrypt'
}

interface AddressItem {
  EVM: string;
  NULS: string;
  NERVE: string;
}

export interface AccountItem {
  pub: string;
  address: AddressItem;
}
