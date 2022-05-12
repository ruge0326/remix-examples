import WalletConnect from "@walletconnect/client";
import QRCodeModal from "@walletconnect/qrcode-modal";
import { Buffer } from "buffer";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";

// polyfill Buffer for client
if (!window.Buffer) window.Buffer = Buffer;

// Create a connector
const connector = new WalletConnect({
  bridge: "https://bridge.walletconnect.org", // Required
  qrcodeModal: QRCodeModal,
});

const walletconnect = new WalletConnectConnector({
  infuraId: "a5fc4506ae1e4400b52b814f9faad4ad",
  bridge: "https://bridge.walletconnect.org",
  qrcode: true,
});

// ref: https://github.com/kiliman/remix-walletconnect

export { connector, walletconnect, Buffer };
