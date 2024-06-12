import React, {
  FunctionComponent,
  ReactElement,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import {
  Web3State,
  createInitialState,
  createWeb3State,
  loadContract,
} from './utils';
import { ethers } from 'ethers';
import { MetaMaskInpageProvider } from '@metamask/providers';

type IProps = {
  children: ReactElement;
};

const pageReload = () => window.location.reload();

const handleAccount = (ethereum: MetaMaskInpageProvider) => async () => {
  const isLocked = !(await ethereum._metamask.isUnlocked());
  if (isLocked) return pageReload();
};

const setGlobalListners = (ethereum: MetaMaskInpageProvider) => {
  ethereum.on('chainChanged', pageReload);
  ethereum.on('accountsChanged', handleAccount(ethereum));
};

const removeGlobalListners = (ethereum: MetaMaskInpageProvider) => {
  ethereum?.removeListener('chainChanged', pageReload);
  ethereum?.removeListener('accountsChanged', handleAccount(ethereum));
};

const Web3Context = createContext<Web3State>(createInitialState());

const Web3Provider: FunctionComponent<IProps> = ({ children }) => {
  const [web3Api, setWeb3Api] = useState<Web3State>(createInitialState());

  useEffect(() => {
    async function initWeb3() {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const contract = await loadContract('NftMarket', provider);

        setGlobalListners(window.ethereum);
        setWeb3Api(
          createWeb3State({
            ethereum: window.ethereum,
            provider,
            contract,
            isLoading: false,
          })
        );
      } catch (error) {
        console.error('Error: Please connect to MetaMask wallet!');
        setWeb3Api((api) =>
          createWeb3State({
            ...(api as any),
            isLoading: false,
          })
        );
      }
    }
    initWeb3();
    return () => removeGlobalListners(window.ethereum);
  }, []);

  return (
    <Web3Context.Provider value={web3Api}>{children}</Web3Context.Provider>
  );
};

export function useWeb3() {
  return useContext(Web3Context);
}

export function useHooks() {
  const { hooks } = useWeb3();
  return hooks;
}

export default Web3Provider;
