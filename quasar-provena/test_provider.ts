import { ElectrumNetworkProvider, Network } from 'cashscript';

async function test() {
    const provider = new ElectrumNetworkProvider(Network.MAINNET);
    console.log(Object.keys(provider));
    console.log(typeof provider.sendRawTransaction);
}

test().catch(console.error);
