const WETH = "0xc00592aA41D32D137dC480d9f6d0Df19b860104F"; // WEOS
const USDT = "0x33b57dc70014fd7aa6e1ed3080eed2b619632b8e";

/**
 * @type import('./config').NetworkConfig
 */
module.exports = {
  network: "eosevm",
  WETH: WETH.toLowerCase(),
  v1: {
    WETH_USDC_03_POOL: "0xed93D8b3951F73D6707919E649EF59235E64bEB6".toLowerCase(),
    contracts: {
      factory: {
        address: "0x9f3118af733Ea3Fe4f9Ed71033F25B6bcF7F49e9".toLowerCase(),
      },
    },
    stableCoins: [USDT].map((token) => token.toLowerCase()),
    whitelistAddresses: [
      WETH,
      USDT, // USDT
    ].map((token) => token.toLowerCase()),
  },
};
