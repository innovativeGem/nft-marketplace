import { TWeb3Hooks, setupHooks } from '@hooks/web3/setupHooks';
import { TWeb3Dependencies } from '@_types/hooks';
import { MetaMaskInpageProvider } from '@metamask/providers';
import { Contract, ethers, providers } from 'ethers';

declare global {
  interface Window {
    ethereum: MetaMaskInpageProvider;
  }
}

type Nullable<T> = {
  [P in keyof T]: T[P] | null;
};

export type Web3State = {
  isLoading: boolean;
  hooks: TWeb3Hooks;
} & Nullable<TWeb3Dependencies>;

export const createInitialState = () => {
  return {
    ethereum: null,
    provider: null,
    contract: null,
    isLoading: true,
    hooks: setupHooks({ isLoading: true } as any),
  };
};

export const createWeb3State = ({
  ethereum,
  provider,
  contract,
  isLoading,
}: TWeb3Dependencies) => {
  return {
    ethereum,
    provider,
    contract,
    isLoading,
    hooks: setupHooks({ ethereum, provider, contract, isLoading }),
  };
};

const NETWORK_ID = process.env.NEXT_PUBLIC_NETWORK_ID;

export const loadContract = async (
  name: string,
  provider: providers.Web3Provider
): Promise<Contract> => {
  if (!NETWORK_ID) {
    return Promise.reject('Network ID not found');
  }

  try {
    const res = await fetch(`/contracts/${name}.json`);
    const Artifact = await res.json();
    if (Artifact.networks[NETWORK_ID]?.address) {
      const contract = new ethers.Contract(
        Artifact.networks[NETWORK_ID]?.address,
        Artifact.abi,
        provider
      );
      return contract;
    } else {
      return Promise.reject(`Contract ${name} cannot be loaded!`);
    }
  } catch (error) {
    return Promise.reject(error);
  }
};
