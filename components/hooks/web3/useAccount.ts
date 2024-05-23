import { TCryptoHookFactory } from '@_types/hooks';
import { useEffect } from 'react';
import useSWR from 'swr';

type UseAccountResponse = {
  connect: () => void;
  isLoading: boolean;
  isValidating: boolean;
};

type TAccountHookFactory = TCryptoHookFactory<string, UseAccountResponse>;

export type TUseAccountHook = ReturnType<TAccountHookFactory>;

export const hookFactory: TAccountHookFactory =
  ({ provider, ethereum, isLoading }) =>
  () => {
    const { data, mutate, isValidating, ...swrRes } = useSWR(
      provider ? 'web3/useAccount' : null,
      async () => {
        // const accounts = await provider!.send('eth_requestAccounts', []);
        const accounts = await provider!.listAccounts();
        const account = accounts[0].address;

        if (!account) {
          throw 'Cannot retreive account! Please, connect to web3 wallet.';
        }
        return account;
      },
      {
        revalidateOnFocus: false,
      }
    );

    useEffect(() => {
      ethereum?.on('accountsChanged', handleAccountChanged);
      return () => {
        ethereum?.removeListener('accountsChanged', handleAccountChanged);
      };
    });

    const handleAccountChanged = (...args: unknown[]) => {
      const accounts = args[0] as string[];
      if (accounts.length === 0) {
        console.error('Please, connect to Web3 wallet');
      } else if (accounts[0] !== data) {
        console.log('Account changed: ', accounts[0]);
        mutate(accounts[0]);
      }
    };

    const connect = () => {
      try {
        ethereum?.request({ method: 'eth_requestAccounts' });
      } catch (error) {
        console.error(error);
      }
    };

    return {
      ...swrRes,
      data,
      mutate,
      isValidating,
      isLoading: isLoading || isValidating,
      isInstalled: ethereum?.isMetaMask || false,
      connect,
    };
  };
