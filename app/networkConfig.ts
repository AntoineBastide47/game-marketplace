import { getFullnodeUrl } from "@mysten/sui/client";
import { DEVNET_COUNTER_PACKAGE_ID, TESTNET_COUNTER_PACKAGE_ID, MAINNET_COUNTER_PACKAGE_ID } from "./constants";
import { createNetworkConfig } from "@mysten/dapp-kit";

const { networkConfig, useNetworkVariable, useNetworkVariables } =
  createNetworkConfig({
    devnet: {
      url: getFullnodeUrl("devnet"),
      variables: {
        packageId: DEVNET_COUNTER_PACKAGE_ID,
        nodeUrl: "https://fullnode.devnet.sui.io"
      },
    },
    testnet: {
      url: getFullnodeUrl("testnet"),
      variables: {
        packageId: TESTNET_COUNTER_PACKAGE_ID,
        nodeUrl: "https://fullnode.testnet.sui.io"
      },
    },
    mainnet: {
      url: getFullnodeUrl("mainnet"),
      variables: {
        packageId: MAINNET_COUNTER_PACKAGE_ID,
        nodeUrl: "https://fullnode.mainnet.sui.io"
      },
    },
  });

export { useNetworkVariable, useNetworkVariables, networkConfig };
