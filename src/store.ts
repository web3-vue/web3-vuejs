import { getAddress } from '@ethersproject/address'
import type { Web3ReactState, Web3ReactStateUpdate } from '@web3-react/types'
import { defineStore } from 'pinia'


export const MAX_SAFE_CHAIN_ID = 4503599627370476

function validateChainId(chainId: number): void {
  if (!Number.isInteger(chainId) || chainId <= 0 || chainId > MAX_SAFE_CHAIN_ID) {
    throw new Error(`Invalid chainId ${chainId}`)
  }
}

function validateAccount(account: string): string {
  return getAddress(account)
}

function computeIsActive({ chainId, accounts, activating }: Web3ReactState) {
  return Boolean(chainId && accounts && !activating)
}

const DEFAULT_STATE = {
  chainId: undefined,
  accounts: undefined,
  activating: false,
}

export const useWeb3Store = defineStore('web3Store', {

  state: () => (DEFAULT_STATE),

  getters: {

    account(): string | undefined {
      return this.accounts?.[0]
    },

    isActive(state): boolean {
      return computeIsActive(state)
    },
  },

  actions: {
    startActivation() {
      // console.log('startActivation')
      Object.assign(this, {
        ...DEFAULT_STATE,
        activating: true
      });

      return () => {
        this.activating = false
      }
    },

    update(stateUpdate: Web3ReactStateUpdate) {
      // console.log('update', stateUpdate)

      // validate chainId statically, independent of existing state
      if (stateUpdate.chainId !== undefined) {
        validateChainId(stateUpdate.chainId)
      }

      // validate accounts statically, independent of existing state
      if (stateUpdate.accounts !== undefined) {
        for (let i = 0; i < stateUpdate.accounts.length; i++) {
          stateUpdate.accounts[i] = validateAccount(stateUpdate.accounts[i])
        }
      }

      // determine the next chainId and accounts
      const chainId = stateUpdate.chainId ?? this.chainId
      const accounts = stateUpdate.accounts ?? this.accounts

      // ensure that the activating flag is cleared when appropriate
      let activating = this.activating
      if (activating && chainId && accounts) {
        activating = false
      }

      Object.assign(this, { chainId, accounts, activating });
    },

    resetState() {
      // console.log('resetState')

      Object.assign(this, DEFAULT_STATE);
    },
  },
})