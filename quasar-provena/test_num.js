const n = BigInt('27424454798701168');
console.log('Hex:', n.toString(16));
console.log('Ascii:', Buffer.from(n.toString(16), 'hex').toString('ascii'));
