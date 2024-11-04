import { Events } from "./pb/dex223/v1/Events";
import { Protobuf } from "as-proto/assembly";
import { handlePoolCreated } from "./mappings/factory";
import { log } from "@graphprotocol/graph-ts";
import {
  handleInitialize,
  handleBurn,
  handleCollect,
  handleSwap,
  handleMint,
} from "./mappings/pool";
import {
  handleERC20WrapperCreated,
  handleERC223WrapperCreated,
} from "./mappings/token-converter";

import { PoolCreatedEvent } from "./pb/dex223/v1/PoolCreatedEvent";
import { InitializeEvent } from "./pb/dex223/v1/InitializeEvent";
import { SwapEvent } from "./pb/dex223/v1/SwapEvent";
import { MintEvent } from "./pb/dex223/v1/MintEvent";
import { BurnEvent } from "./pb/dex223/v1/BurnEvent";
import { CollectEvent } from "./pb/dex223/v1/CollectEvent";
import { ERC20WrapperCreatedEvent } from "./pb/dex223/v1/ERC20WrapperCreatedEvent";
import { ERC223WrapperCreatedEvent } from "./pb/dex223/v1/ERC223WrapperCreatedEvent";

function processEvents<T>(events: Array<T>, handler: (event: T) => void): void {
  if (events === null || events.length === 0) {
    return;
  }
  for (let i = 0; i < events.length; i++) {
    log.info("Processing event {}", [i.toString()]);
    handler(events[i]);
  }
}

export function handleEvents(bytes: Uint8Array): void {
  // Decode events from bytes array
  const eventsProto: Events = Protobuf.decode<Events>(bytes, Events.decode);
  if (eventsProto === null) {
    log.error("Failed to decode events", []);
    return;
  }

  const poolCreatedEvents = eventsProto.poolCreatedEvents;
  const initializeEvents = eventsProto.initializeEvents;
  const swapEvents = eventsProto.swapEvents;
  const mintEvents = eventsProto.mintEvents;
  const burnEvents = eventsProto.burnEvents;
  const collectEvents = eventsProto.collectEvents;
  const erc20WrapperCreatedEvents = eventsProto.erc20WrapperCreatedEvents;
  const erc223WrapperCreatedEvents = eventsProto.erc223WrapperCreatedEvents;

  processEvents<PoolCreatedEvent>(poolCreatedEvents, handlePoolCreated);
  processEvents<InitializeEvent>(initializeEvents, handleInitialize);
  processEvents<SwapEvent>(swapEvents, handleSwap);
  processEvents<MintEvent>(mintEvents, handleMint);
  processEvents<BurnEvent>(burnEvents, handleBurn);
  processEvents<CollectEvent>(collectEvents, handleCollect);
  processEvents<ERC20WrapperCreatedEvent>(
    erc20WrapperCreatedEvents,
    handleERC20WrapperCreated
  );
  processEvents<ERC223WrapperCreatedEvent>(
    erc223WrapperCreatedEvents,
    handleERC223WrapperCreated
  );
}
