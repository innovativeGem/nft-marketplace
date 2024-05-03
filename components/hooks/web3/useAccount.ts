import { TCryptoHookFactory } from '@_types/hooks';
import useSWR from 'swr';

type TAccountHookFactory = TCryptoHookFactory<string, string>;

export type TUseAccountHook = ReturnType<TAccountHookFactory>;

export const hookFactory: TAccountHookFactory = (deps) => (params) => {
  const swrRes = useSWR('web3/useAccount', () => {
    console.log(deps);
    console.log(params);
    return 'Test User';
  });
  return swrRes;
};
