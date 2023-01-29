
// generate accounts from seed words
//
// Resources :
// https://ethereum.stackexchange.com/questions/84615/recover-all-the-account-under-mnemonic-using-ethers-js
// https://github.com/bethanyuo/HD-wallet/blob/master/eth-hd-wallet.js

async function main() {

    let ethers = require('ethers');

    let derivePath = ethers.utils.defaultPath; // "m/44'/60'/0'/0/0"

    let mnemonic;
    let n = 10;
    let network;
    const networks = new Set(["mainnet","goerli"]);

    let index;
    let path;
    let hdnode;
    let wallet;
    let address;
    let pk;
    let balance = ethers.BigNumber.from(0);
    let balanceString;

    if (process.argv.length >= 2) {
	    mnemonic = process.argv[2];
        console.log("mnemonic =", mnemonic);
    } else {
        throw new Error("usage : 'seed words string ...' number-of-accounts network");
    }

    if (process.argv.length >= 3) {
	    n = process.argv[3];
    }
    console.log("accounts to generate =", n);

    if (process.argv.length >= 4) {
	    network = process.argv[4];
        provider = new ethers.providers.AlchemyProvider(network, 'demo');
    }
    console.log("network to get ETH account balances from =", network);

    wallet = ethers.Wallet.fromMnemonic(mnemonic);
    console.log("  0", (derivePath + "  ").substring(0,18), "  0", wallet.address + ' <== to be expected for index 0');

    let hdnodeParent = ethers.utils.HDNode.fromMnemonic(mnemonic);

    for (i=0; i<n; i++) {
        path = derivePath.slice(0,-1) + i;
        hdnode = hdnodeParent.derivePath( path );
        index = hdnode.index;
        address = hdnode.publicKey;
        pk = hdnode.privateKey;
        wallet = new ethers.Wallet(pk);
        if (network !== undefined && networks.has(network)) {
            balance = await provider.getBalance(wallet.address);
            balanceString = ethers.utils.formatUnits(balance) + " ETH";
        } else {
            balanceString = "";
        }
        console.log(("  " + i).slice(-3), (path + "  ").substring(0,18), ("  " + index).slice(-3), wallet.address, pk, balanceString);
    }
}

main();

