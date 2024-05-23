import { MetaMaskInpageProvider } from '@metamask/providers';
import { Contract, providers } from 'ethers';
import { SWRResponse } from 'swr';

export type TWeb3Dependencies = {
  ethereum: MetaMaskInpageProvider;
  provider: providers.Web3Provider;
  contract: Contract;
  isLoading: boolean;
};

export type TCryptoHookFactory<D = any, R = any, P = any> = {
  (d: Partial<TWeb3Dependencies>): TCryptoHandlerHook<D, R, P>;
};

export type TCryptoHandlerHook<D, R, P> = (
  params?: P
) => TCryptoSWRResponse<D, R>;

export type TCryptoSWRResponse<D, R> = SWRResponse<D> & R;
