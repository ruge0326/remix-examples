import {
  Web3ReactProvider,
  useWeb3React,
  UnsupportedChainIdError,
} from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";

import React, { useEffect } from "react";
import { InjectedConnector } from "@web3-react/injected-connector";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";
import { Buffer } from "./../libs/wallet.client";

export const Content = function () {
  const web3React = useWeb3React();

  console.log("web3React", web3React);

  useEffect(() => {
    const walletconnect = new WalletConnectConnector({
      infuraId: "a5fc4506ae1e4400b52b814f9faad4ad",
      bridge: "https://bridge.walletconnect.org",
      qrcode: true,
    });

    web3React.activate(walletconnect);
    console.log("run");
  }, []);

  useEffect(() => {
    console.log("new chain id ", web3React.chainId);
  }, [web3React.chainId]);

  useEffect(() => {
    console.log("new account ", web3React.account);

    if (web3React.account) {
      web3React.library
        .getSigner(web3React.account)
        .signMessage("👋")
        .then((signature: any) => {
          window.alert(`Success!\n\n${signature}`);
        });
    }
  }, [web3React.account]);

  return (
    <div className="App">
      <h1>Hello CodeSandbox</h1>
      <h2>Start editing to see some magic happen!</h2>
    </div>
  );
};

function getLibrary(provider: any) {
  const library = new Web3Provider(provider);
  library.pollingInterval = 12000;
  return library;
}

export default function App() {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <Content />
    </Web3ReactProvider>
  );
}
