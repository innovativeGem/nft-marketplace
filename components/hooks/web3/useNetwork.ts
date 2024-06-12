import { TCryptoHookFactory } from '@_types/hooks';
import useSWR from 'swr';

const NETWORK: { [key: string]: string } = {
  1: 'Ethereum Mainnet',
  3: 'Ropsten',
  4: 'Rinkeby',
  5: 'Goerli',
  42: 'Kovan',
  56: 'Binance Smart Chain',
  1337: 'Ganache',
};

const targetId = process.env.NEXT_PUBLIC_NETWORK_CHAIN_ID as string;
const targetNetwork = NETWORK[targetId];

type UseNetworkResponse = {
  isLoading: boolean;
  isSupported: boolean;
  targetNetwork: string;
};

type TNetworkHookFactory = TCryptoHookFactory<string, UseNetworkResponse>;

export type TUseNetworkHook = ReturnType<TNetworkHookFactory>;

export const hookFactory: TNetworkHookFactory =
  ({ provider, isLoading }) =>
  () => {
    const { data, isValidating, ...swrRes } = useSWR(
      provider ? 'web3/useNetwork' : null,
      async () => {
        const chainId = (await provider!.getNetwork()).chainId;
        if (!chainId) {
          throw 'Cannot retrieve network! Please, connect to web3 wallet.';
        }
        return NETWORK[chainId];
      },
      {
        revalidateOnFocus: false,
      }
    );

    return {
      ...swrRes,
      data,
      isValidating,
      isLoading: isLoading as boolean,
      targetNetwork,
      isSupported: data === targetNetwork,
    };
  };
