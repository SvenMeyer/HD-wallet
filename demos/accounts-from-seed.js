
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

    let index;
    let path;
    let hdnode;
    let wallet;
    let address;
    let pk;
    let balance = ethers.BigNumber.from(0);
    let balanceString;

    if (process.argv.length <2 ) {
	    console.log("usage : 'seed words string ...' number-of-accounts network");
        console.log("process.argv[0] =", process.argv[0]);
        console.log("process.argv[1] =", process.argv[1]);
        console.log("process.argv[2] =", process.argv[2]);
        console.log("process.argv[3] =", process.argv[3]);
        console.log("process.argv[4] =", process.argv[4]);
    }

    if (process.argv.length >= 2) {
	    mnemonic = process.argv[2];
        console.log("mnemonic =", mnemonic);
    } else {
        throw new Error("no mnemonic provided");
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
    let hdnodeParent = ethers.utils.HDNode.fromMnemonic(mnemonic);
    
    console.log(0, derivePath, 0, wallet.address + ' <== to be expected for index 0');

    for (i=0; i<n; i++) {
        path = derivePath.slice(0,-1) + i;
        hdnode = hdnodeParent.derivePath( path );
        index = hdnode.index;
        address = hdnode.publicKey;
        pk = hdnode.privateKey;
        wallet = new ethers.Wallet(pk);
        if (network != "") {
            balance = await provider.getBalance(wallet.address);
            balanceString = ethers.utils.formatUnits(balance) + " ETH";
        }
        console.log(i, path, index, wallet.address, pk, balanceString);
    }
}

main();
