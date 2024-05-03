import { TWeb3Dependencies } from '@_types/hooks';
import {
  hookFactory as createAccountHook,
  TUseAccountHook,
} from './useAccount';

export type TWeb3Hooks = {
  useAccount: TUseAccountHook;
};

export type SetupHooks = {
  (d: TWeb3Dependencies): TWeb3Hooks;
};

export const setupHooks: SetupHooks = (deps) => {
  return {
    useAccount: createAccountHook(deps),
  };
};
