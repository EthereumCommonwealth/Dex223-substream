# Substream dex223

## Install tools

0.1 Install substream https://docs.substreams.dev/documentation/consume/installing-the-cli
0.2 Create account in https://app.pinax.network/ and you have permision geting SUBSTREAMS_API_TOKEN="<YOUR-JWT-TOKEN>"
0.3 Install docker for up graph-node (only local)

### Substreams

1 Open `susbtreams/src/utils.rs` change `ADRESS_FACTORY` and `ADDRESS_CONVERTER`
You should change `address`, `name` `symbol` and `deciaml` token information in `susbtreams/src/static_token_definition.rs`
1.1 Aftre change values, run command in ./susbtreams

```bash
make all
```

1.2 Change `susbtreams/substreams.yaml` `initialBlock` for all modules, It's value block number when deploed Factory, but only module map_token_convertes initialBlock block number deploy TokenConverter
1.3 After change all files you should run command in dir susbtreams

```bash
make all
```

You should see logs in terminal for exampler:

```bash
substreams protogen ./substreams.yaml --exclude-paths="sf/substreams,google"
Running: buf generate /var/folders/bg/xmcjwwjx0zj3brttnwj6y4cw0000gn/T/dex223.tmp.spkg#format=bin --exclude-path sf/substreams,google
cargo build --target wasm32-unknown-unknown --release
Compiling dex223 v0.0.1 (/Users/ostapenkokostya/web3/dex223/dex223-subgraph/EthereumCommonwealth/dex223-substream/substreams)
Finished `release` profile [optimized] target(s) in 5.07s
substreams pack substreams.yaml 2.
```

1.4 You can tests your in dir `./substreams`

```bash
export SUBSTREAMS_API_TOKEN=<PINAX API Key>
```

```bash
substreams run dex223-v0.1.0.spkg map_events -e eosevm.substreams.pinax.network:443 --start-block 48409930 --stop-block +3
```

And you watch logs

```bash
stage 0 (0 jobs)           48404676  ::  48404676-48405000 48407000-48408000


----------- BLOCK #48,409,930 (fe580de4cd332cb9d7aab3f12309600cb5bccbf5f9bbe33cfae79ceef614c8d1) ---------------
                                                                                                                {
  "@module": "map_events",
  "@block": 48409930,
  "@type": "dex223.v1.Events",
  "@data": {
    "poolCreatedEvents": [
      {
        "tx": {
          "id": "6b8767371ffb25bf43cfca0d32bc3c136463f30b07d27261f580d08d4873a525",
          "blockNumber": "48409930",
          "timestamp": "1729071019",
          "gasUsed": "3659416",
          "gasPrice": "900000000000",
          "logOrdinal": "1",
          "address": "9f3118af733ea3fe4f9ed71033f25b6bcf7f49e9",
          "from": "88d4c3f9d2e5c2b77e25795ce4428df17ca2dcc4",
          "to": "cb53086f8d8532cd2253a02052314d07ec8d5b76"
        },
        "token0": {
          "addressErc20": "1e6951b73f44e7c71b43dfc1ffa63ca2eab2ceda",
          "addressErc223": "c7a152911ede7016b8c7b8705f4df66ec04cad78",
          "tokenInfo": {
            "name": "Dex223 Test token 1",
            "symbol": "DTST1",
            "decimals": "6",
            "inConverter": true,
            "totalSupply": "1000000000"
          }
        },
        "token1": {
          "addressErc20": "fccb28483d26eadb90a11cd50e09c12e553ffb22",
          "addressErc223": "6eeaa35da5c72d22fc8d99906c73a149c2cfb615",
          "tokenInfo": {
            "name": "Dex223 Test token 2",
            "symbol": "DTST2",
            "decimals": "18",
            "inConverter": true,
            "totalSupply": "1000000000000000000000"
          }
        },
        "fee": "3000",
        "poolAddress": "4f4479dd4ae31b425d0f18f8aaec713348c6f15b",
        "tickSpacing": 60
      }
    ],
    "initializeEvents": [
      {
        "tx": {
          "id": "6b8767371ffb25bf43cfca0d32bc3c136463f30b07d27261f580d08d4873a525",
          "blockNumber": "48409930",
          "timestamp": "1729071019",
          "gasUsed": "3659416",
          "gasPrice": "900000000000",
          "logOrdinal": "2",
          "address": "4f4479dd4ae31b425d0f18f8aaec713348c6f15b",
          "from": "88d4c3f9d2e5c2b77e25795ce4428df17ca2dcc4",
          "to": "cb53086f8d8532cd2253a02052314d07ec8d5b76"
        },
        "sqrtPriceX96": "79228162514264337593543950336000000",
        "tick": 276324,
        "poolAddress": "4f4479dd4ae31b425d0f18f8aaec713348c6f15b"
      }
    ]
  }
}

----------- BLOCK #48,409,931 (2f32d0ce253e791ef6a3cae604e432db98d39fed7e4ab6954120a3d6a77d2d75) ---------------
----------- BLOCK #48,409,932 (5b0fa861d6d7769d8faa8a460440280e59e1be6c2ea389e587716b83f246b295) ---------------
Total Read Bytes (server-side consumption): 1023451
```

### Graph-node local

If you only publish you can skip step

2.1 Open new terminal in `./subgraph/graph-node`
2.2 `./subgraph/graph-node` and create `.env` file

```bash
NETWORK=<NETWORK_NAME sepolia, eosemv ....>
SUBSTREAMS_ENDPOINT=https://eosevm.substreams.pinax.network:443
SUBSTREAMS_API_TOKEN=<SUBSTREAMS_API_TOKEN from Pinax>
ETH_MAINNET_RPC=<URL_RPC_NODE>
POSTGRES_DB=<POSTGRES_DB>
POSTGRES_USER=<POSTGRES_USER>
POSTGRES_PASSWORD=<POSTGRES_PASSWORD>
```

2.3

```bash
export $(xargs < .env)
bash ./substreams-config-gen.sh
bash ./start.sh
```

### Subgraph

2.1 Open dir subgraph and change `config/{NETWORK_NAME}.js` in this repo use `eosevm.js` </br>
Change values all contract note:

- `WETH_USDC_03_POOL` - address pool WEOS/USDT you can
- `WETH` - address WETH, WEOS, WBNB

You can declare other stablecoins
2.2 Create `.env` file and add

- `NETWORK` - eosevm, seploia ... check value
- `SUBGRAPH_KEY` - value from TheGraph explorer

  2.3 You should run command

```bash
yarn install
yarn template
yarn codegen
yarn build
```

2.4 Deploy local

```bash
yarn create-local
yarn deploy-local
```

2.5 If you want to publish use command

```bash
graph publish
```

Aftre publish you can get <SUBGRAPH ID> in TheGraph Explorer

```bash
graph publish --subgraph-id <SUBGRAPH ID>
```
