// Code generated by protoc-gen-as. DO NOT EDIT.
// Versions:
//   protoc-gen-as v1.3.0

import { Writer, Reader } from "as-proto/assembly";
import { TokenInfo } from "./TokenInfo";

export class Token {
  static encode(message: Token, writer: Writer): void {
    writer.uint32(10);
    writer.string(message.addressErc20);

    writer.uint32(18);
    writer.string(message.addressErc223);

    const tokenInfo = message.tokenInfo;
    if (tokenInfo !== null) {
      writer.uint32(26);
      writer.fork();
      TokenInfo.encode(tokenInfo, writer);
      writer.ldelim();
    }
  }

  static decode(reader: Reader, length: i32): Token {
    const end: usize = length < 0 ? reader.end : reader.ptr + length;
    const message = new Token();

    while (reader.ptr < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.addressErc20 = reader.string();
          break;

        case 2:
          message.addressErc223 = reader.string();
          break;

        case 3:
          message.tokenInfo = TokenInfo.decode(reader, reader.uint32());
          break;

        default:
          reader.skipType(tag & 7);
          break;
      }
    }

    return message;
  }

  addressErc20: string;
  addressErc223: string;
  tokenInfo: TokenInfo | null;

  constructor(
    addressErc20: string = "",
    addressErc223: string = "",
    tokenInfo: TokenInfo | null = null
  ) {
    this.addressErc20 = addressErc20;
    this.addressErc223 = addressErc223;
    this.tokenInfo = tokenInfo;
  }
}