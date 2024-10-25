// Code generated by protoc-gen-as. DO NOT EDIT.
// Versions:
//   protoc-gen-as v1.3.0

import { Writer, Reader } from "as-proto/assembly";
import { Transaction } from "./Transaction";

export class FlashEvent {
  static encode(message: FlashEvent, writer: Writer): void {
    const tx = message.tx;
    if (tx !== null) {
      writer.uint32(10);
      writer.fork();
      Transaction.encode(tx, writer);
      writer.ldelim();
    }

    writer.uint32(18);
    writer.string(message.sender);

    writer.uint32(26);
    writer.string(message.recipient);

    writer.uint32(34);
    writer.string(message.amount0);

    writer.uint32(42);
    writer.string(message.amount1);

    writer.uint32(50);
    writer.string(message.paid0);

    writer.uint32(58);
    writer.string(message.paid1);

    writer.uint32(66);
    writer.string(message.poolAddress);
  }

  static decode(reader: Reader, length: i32): FlashEvent {
    const end: usize = length < 0 ? reader.end : reader.ptr + length;
    const message = new FlashEvent();

    while (reader.ptr < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.tx = Transaction.decode(reader, reader.uint32());
          break;

        case 2:
          message.sender = reader.string();
          break;

        case 3:
          message.recipient = reader.string();
          break;

        case 4:
          message.amount0 = reader.string();
          break;

        case 5:
          message.amount1 = reader.string();
          break;

        case 6:
          message.paid0 = reader.string();
          break;

        case 7:
          message.paid1 = reader.string();
          break;

        case 8:
          message.poolAddress = reader.string();
          break;

        default:
          reader.skipType(tag & 7);
          break;
      }
    }

    return message;
  }

  tx: Transaction | null;
  sender: string;
  recipient: string;
  amount0: string;
  amount1: string;
  paid0: string;
  paid1: string;
  poolAddress: string;

  constructor(
    tx: Transaction | null = null,
    sender: string = "",
    recipient: string = "",
    amount0: string = "",
    amount1: string = "",
    paid0: string = "",
    paid1: string = "",
    poolAddress: string = ""
  ) {
    this.tx = tx;
    this.sender = sender;
    this.recipient = recipient;
    this.amount0 = amount0;
    this.amount1 = amount1;
    this.paid0 = paid0;
    this.paid1 = paid1;
    this.poolAddress = poolAddress;
  }
}