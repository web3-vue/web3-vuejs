import type { Actions, Connector } from '@web3-react/types';
import { storeToRefs } from 'pinia';
import { useWeb3Store } from "./store";

export function initializeConnector<T extends Connector>(
  f: (actions: Actions) => T
): [T, ReturnType<typeof storeToRefs>, ReturnType<typeof useWeb3Store>] {
  const store = useWeb3Store();

  const connector = f(store);

  return [connector, storeToRefs(store), store];
}