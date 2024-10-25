use anyhow::{Ok, Result};
use substreams_ethereum::Abigen;

fn main() -> Result<(), anyhow::Error> {
    Abigen::new("factory", "abis/factory.json")?
        .generate()?
        .write_to_file("src/abi/factory.rs")?;
    Abigen::new("pool", "abis/pool.json")?
        .generate()?
        .write_to_file("src/abi/pool.rs")?;

    Abigen::new("erc20_erc223", "abis/ERC20andERC223.json")?
        .generate()?
        .write_to_file("src/abi/erc20_erc223.rs")?;
    Abigen::new("token_converter", "abis/TokenConverter.json")?
        .generate()?
        .write_to_file("src/abi/token_converter.rs")?;

    Ok(())
}
