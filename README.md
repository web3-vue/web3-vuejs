# web3-vuejs
web3-react Vue version, forked from [web3-react V8](https://github.com/Uniswap/web3-react), Fully compatible with web3-react(V8)'s connectors.

The state of web3-vuejs is managed by Pinia.

## Example

You can Reach the example at [web3-vuejs-example](https://github.com/web3-vuejs/web3-vuejs-example)


## Getting Started

### installation

Add packages
``` shell
yarn add pinia, web3-vuejs
```
Use Pinia 
``` javascript
import { createPinia } from 'pinia'
import { createApp } from 'vue'
import App from './App.vue'
import './style.css'

const pinia = createPinia()
const app = createApp(App)

app.use(pinia)

app.mount('#app')
```

### Create a Connector
eg. create a `connectors/metamask`
```
import { MetaMask } from '@web3-react/metamask';
import { initializeConnector } from 'web3-vuejs';

let connectorCached: ReturnType<typeof initializeConnector>;

export const useConnector = () => {
  connectorCached ||= initializeConnector<MetaMask>((actions) => new MetaMask({ actions }));
  return connectorCached;
}
```
### Use Connector
``` vue
<script setup lang="ts">
import { onMounted } from "vue";
import { useConnector } from "../connectors/metaMask";

const [connector, { chainId, accounts, account }, store] = useConnector();

onMounted(() => {
  void connector.connectEagerly().catch(() => {
    console.debug("Failed to connect eagerly to metamask");
  });
});
</script>

<template>
  <div class="card">
    <div>chainId: {{ chainId }}</div>
    <div>accounts: {{ accounts }}</div>
    <div>account: {{ account }}</div>

    <button type="button" @click="connector.activate">activate</button>
  </div>
</template>
```

### TODO 
[ ] useProvider
[ ] useENS