import { TWeb3Dependencies } from '@_types/hooks';
import {
  hookFactory as createAccountHook,
  TUseAccountHook,
} from './useAccount';
import {
  hookFactory as createNetworkHook,
  TUseNetworkHook,
} from './useNetwork';

export type TWeb3Hooks = {
  useAccount: TUseAccountHook;
  useNetwork: TUseNetworkHook;
};

export type SetupHooks = {
  (d: TWeb3Dependencies): TWeb3Hooks;
};

export const setupHooks: SetupHooks = (deps) => {
  return {
    useAccount: createAccountHook(deps),
    useNetwork: createNetworkHook(deps),
  };
};
