import { MetaMaskInpageProvider } from '@metamask/providers';
import { Contract, providers } from 'ethers';
import { SWRResponse } from 'swr';

export type TWeb3Dependencies = {
  ethereum: MetaMaskInpageProvider;
  provider: providers.Web3Provider;
  contract: Contract;
};

export type TCryptoHookFactory<D = any, P = any> = {
  (d: Partial<TWeb3Dependencies>): TCryptoHandlerHook<D, P>;
};

export type TCryptoHandlerHook<D, P> = (params: P) => TCryptoSWRResponse<D>;

export type TCryptoSWRResponse<D> = SWRResponse<D>;
