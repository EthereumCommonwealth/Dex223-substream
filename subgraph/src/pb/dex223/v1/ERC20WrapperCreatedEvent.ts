// Code generated by protoc-gen-as. DO NOT EDIT.
// Versions:
//   protoc-gen-as v1.3.0

import { Writer, Reader } from "as-proto/assembly";
import { Transaction } from "./Transaction";
import { Token } from "./Token";

export class ERC20WrapperCreatedEvent {
  static encode(message: ERC20WrapperCreatedEvent, writer: Writer): void {
    const tx = message.tx;
    if (tx !== null) {
      writer.uint32(10);
      writer.fork();
      Transaction.encode(tx, writer);
      writer.ldelim();
    }

    const token = message.token;
    if (token !== null) {
      writer.uint32(18);
      writer.fork();
      Token.encode(token, writer);
      writer.ldelim();
    }
  }

  static decode(reader: Reader, length: i32): ERC20WrapperCreatedEvent {
    const end: usize = length < 0 ? reader.end : reader.ptr + length;
    const message = new ERC20WrapperCreatedEvent();

    while (reader.ptr < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.tx = Transaction.decode(reader, reader.uint32());
          break;

        case 2:
          message.token = Token.decode(reader, reader.uint32());
          break;

        default:
          reader.skipType(tag & 7);
          break;
      }
    }

    return message;
  }

  tx: Transaction | null;
  token: Token | null;

  constructor(tx: Transaction | null = null, token: Token | null = null) {
    this.tx = tx;
    this.token = token;
  }
}
