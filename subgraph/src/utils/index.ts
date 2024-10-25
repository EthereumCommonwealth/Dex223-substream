import { BigDecimal, BigInt } from "@graphprotocol/graph-ts";

import { Transaction as TransactionStream } from "../pb/dex223/v1/Transaction";
import { Transaction } from "../../generated/schema";
import { ONE_BD, ZERO_BD, ZERO_BI } from "./constants";

export function exponentToBigDecimal(decimals: BigInt): BigDecimal {
  let resultString = "1";

  for (let i = 0; i < decimals.toI32(); i++) {
    resultString += "0";
  }

  return BigDecimal.fromString(resultString);
}

// return 0 if denominator is 0 in division
export function safeDiv(amount0: BigDecimal, amount1: BigDecimal): BigDecimal {
  if (amount1.equals(ZERO_BD)) {
    return ZERO_BD;
  } else {
    return amount0.div(amount1);
  }
}

/**
 * Implements exponentiation by squaring
 * (see https://en.wikipedia.org/wiki/Exponentiation_by_squaring )
 * to minimize the number of BigDecimal operations and their impact on performance.
 */
export function fastExponentiation(value: BigDecimal, power: i32): BigDecimal {
  if (power < 0) {
    const result = fastExponentiation(value, -power);
    return safeDiv(ONE_BD, result);
  }

  if (power == 0) {
    return ONE_BD;
  }

  if (power == 1) {
    return value;
  }

  const halfPower = power / 2;
  const halfResult = fastExponentiation(value, halfPower);

  // Use the fact that x ^ (2n) = (x ^ n) * (x ^ n) and we can compute (x ^ n) only once.
  let result = halfResult.times(halfResult);

  // For odd powers, x ^ (2n + 1) = (x ^ 2n) * x
  if (power % 2 == 1) {
    result = result.times(value);
  }
  return result;
}

export function tokenAmountToDecimal(
  tokenAmount: BigInt,
  exchangeDecimals: BigInt
): BigDecimal {
  if (exchangeDecimals == ZERO_BI) {
    return tokenAmount.toBigDecimal();
  }
  return tokenAmount.toBigDecimal().div(exponentToBigDecimal(exchangeDecimals));
}

export function priceToDecimal(
  amount: BigDecimal,
  exchangeDecimals: BigInt
): BigDecimal {
  if (exchangeDecimals == ZERO_BI) {
    return amount;
  }
  return safeDiv(amount, exponentToBigDecimal(exchangeDecimals));
}

export function equalToZero(value: BigDecimal): boolean {
  const formattedVal = parseFloat(value.toString());
  const zero = parseFloat(ZERO_BD.toString());
  if (zero == formattedVal) {
    return true;
  }
  return false;
}

export const NULL_ETH_HEX_STRING =
  "0x0000000000000000000000000000000000000000000000000000000000000001";

export function isNullEthValue(value: string): boolean {
  return value == NULL_ETH_HEX_STRING;
}

export function bigDecimalExp18(): BigDecimal {
  return BigDecimal.fromString("1000000000000000000");
}

export function convertTokenToDecimal(
  tokenAmount: BigInt,
  exchangeDecimals: BigInt
): BigDecimal {
  if (exchangeDecimals == ZERO_BI) {
    return tokenAmount.toBigDecimal();
  }
  return tokenAmount.toBigDecimal().div(exponentToBigDecimal(exchangeDecimals));
}

export function convertEthToDecimal(eth: BigInt): BigDecimal {
  return eth.toBigDecimal().div(exponentToBigDecimal(BigInt.fromI32(18)));
}

export function loadTransaction(tx: TransactionStream): Transaction {
  const txHash = "0x" + tx.id;
  let transaction = Transaction.load(txHash);
  if (transaction === null) {
    transaction = new Transaction(txHash);
  }
  transaction.blockNumber = BigInt.fromI32(tx.blockNumber as i32);
  transaction.timestamp = BigInt.fromI32(tx.timestamp as i32);
  transaction.gasUsed = BigInt.zero(); //needs to be moved to transaction receipt
  transaction.gasPrice = BigInt.fromString(tx.gasPrice as string);
  transaction.save();
  return transaction as Transaction;
}
