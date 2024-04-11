import React, {
  FunctionComponent,
  ReactElement,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import { Web3State, createInitialState } from './utils';
import { ethers } from 'ethers';

type IProps = {
  children: ReactElement;
};

const Web3Context = createContext<Web3State>(createInitialState());

const Web3Provider: FunctionComponent<IProps> = ({ children }) => {
  const [web3Api, setWeb3Api] = useState<Web3State>(createInitialState());

  useEffect(() => {
    function initWeb3() {
      const provider = new ethers.BrowserProvider(window.ethereum);
      setWeb3Api({
        ethereum: window.ethereum,
        provider,
        contract: null,
        isLoading: false,
      });
    }
    initWeb3();
  }, []);

  return (
    <Web3Context.Provider value={web3Api}>{children}</Web3Context.Provider>
  );
};

export function useWeb3() {
  return useContext(Web3Context);
}

export default Web3Provider;
