# Substreams

## Change network

This substream you can use only in EVM networks.

1. `./src/static_token_definition.rs` add custom values for StaticTokenDefinition.

   ```rust
   ...
   StaticTokenDefinition {
       address: hex_literal::hex!("e0b7927c4af23765cb51314a0e0521a9645f0e2a").to_vec(),
       symbol: "DGD".to_string(),
       name: "DGD".to_string(),
       decimals: 9,
   },
   ...

   ```

2. `./src/utils.rs` change address for `ADDRESS_FACTORY` and `ADDRESS_CONVERTER`

   ```rust
   pub const ADDRESS_FACTORY: [u8; 20] = hex!("9f3118af733Ea3Fe4f9Ed71033F25B6bcF7F49e9"); // EOS mainnet
   pub const ADDRESS_CONVERTER: [u8; 20] = hex!("Dd90b13bcb92950CA9b6b3e0407d439533eA0df2"); //  EOS mainnet
   ```

3. `./substreams.yaml`

   - Change all `initialBlock`. Block numbar should be block number when deploy smart contract `ADDRESS_FACTORY` or `ADDRESS_CONVERTER` (use minimal value for all modules)
   - Change `network: <NETWORK_NAME>`, you can find actual values in pinax.network

4. Run command.

   ```bash
   make all
   ```

   You will create new `dex223-v0.1.0.spkg`

## Test run

1.4 You can run test in dir `./substreams`

> [!NOTE] > `SUBSTREAMS_API_TOKEN` You should get token from dashbord pinax.network

```bash
export SUBSTREAMS_API_TOKEN=<SUBSTREAMS_API_TOKEN>
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
