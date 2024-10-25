import { BigDecimal, BigInt } from "@graphprotocol/graph-ts";

import { Tick } from "../../generated/schema";
import { MintEvent } from "../pb/dex223/v1/MintEvent";
import { Transaction } from "../pb/dex223/v1/Transaction";
import { fastExponentiation, safeDiv } from ".";
import { ONE_BD, ZERO_BI } from "./constants";

export function createTick(
  tickId: string,
  tickIdx: i32,
  poolId: string,
  event: MintEvent
): Tick {
  const tick = new Tick(tickId);
  const tx = event.tx as Transaction;
  tick.tickIdx = BigInt.fromI32(tickIdx);
  tick.pool = poolId;
  tick.poolAddress = poolId;

  tick.createdAtTimestamp = BigInt.fromI32(tx.timestamp as i32);
  tick.createdAtBlockNumber = BigInt.fromI32(tx.blockNumber as i32);
  tick.liquidityGross = ZERO_BI;
  tick.liquidityNet = ZERO_BI;

  tick.price0 = ONE_BD;
  tick.price1 = ONE_BD;

  // 1.0001^tick is token1/token0.
  const price0 = fastExponentiation(BigDecimal.fromString("1.0001"), tickIdx);
  tick.price0 = price0;
  tick.price1 = safeDiv(ONE_BD, price0);

  return tick;
}

export function feeTierToTickSpacing(feeTier: BigInt): BigInt {
  if (feeTier.equals(BigInt.fromI32(10000))) {
    return BigInt.fromI32(200);
  }
  if (feeTier.equals(BigInt.fromI32(3000))) {
    return BigInt.fromI32(60);
  }
  if (feeTier.equals(BigInt.fromI32(500))) {
    return BigInt.fromI32(10);
  }
  if (feeTier.equals(BigInt.fromI32(100))) {
    return BigInt.fromI32(1);
  }

  throw new Error("Unexpected fee tier");
}
