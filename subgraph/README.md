# Subgraph

## Change network

1. Open dir subgraph and change `config/{NETWORK_NAME}.js` in this repo use `eosevm.js` </br>
   Change values all contract note:

   - `WETH_USDC_03_POOL` - address pool WEOS/USDT you can
   - `WETH` - address WETH, WEOS, WBNB

   You can declare other stablecoins

2. Create `.env` file and add

   - `NETWORK` - eosevm, seploia ... check value
   - `SUBGRAPH_KEY` - value from TheGraph studio

3. You should run command

   ```bash
   yarn install
   yarn template
   yarn codegen
   yarn build
   ```
