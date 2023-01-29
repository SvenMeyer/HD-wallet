
// generate accounts from seed words
//
// Resources :
// https://ethereum.stackexchange.com/questions/84615/recover-all-the-account-under-mnemonic-using-ethers-js
// https://github.com/bethanyuo/HD-wallet/blob/master/eth-hd-wallet.js
// https://medium.com/coinmonks/hd-wallets-in-ethers-js-e173190e4858

async function main() {

    let ethers = require('ethers');
    let alchemySDK = require('alchemy-sdk');

    // console.log(alchemySDK.Network);  // Does NOT work with these values !!

    let derivePath = ethers.utils.defaultPath; // "m/44'/60'/0'/0/0"

    let mnemonic;
    let n = 10;
    let network;
    let networkish;
    const networks = new Set(["mainnet","goerli"]); // need more networks here !!

    let index;
    let path;
    let hdnode;
    let wallet;
    let address;
    let pk;
    let balance = ethers.BigNumber.from(0);
    let balanceString;
    let apiKeyAlchemy = "demo";

    if (process.argv.length >= 3) {
	    mnemonic = process.argv[2];
        console.log("mnemonic =", mnemonic);
    } else {
        throw("usage : 'seed words string ...' number-of-accounts network");
    }

    if (process.argv.length >= 4) {
	    n = process.argv[3];
    }
    console.log("accounts to generate =", n);

    if (process.env.ALCHEMY_API_KEY.length == 32) {
        apiKeyAlchemy = process.env.ALCHEMY_API_KEY;
    }

    console.log("API KEY = ", apiKeyAlchemy);

    if (process.argv.length >= 5) {
	    networkish = process.argv[4];
        console.log("network name / chainId =", networkish);

        if (isNaN(parseInt(networkish))) {
            network = ethers.providers.getNetwork(networkish);
        } else {
            network = ethers.providers.getNetwork(parseInt(networkish));
        }
            
        provider = new ethers.providers.AlchemyProvider(network, apiKeyAlchemy);
        console.log("network to get account balances from =", provider.network);
    }

    path = derivePath; // ethers.utils.defaultPath; // "m/44'/60'/0'/0/0"
    wallet = ethers.Wallet.fromMnemonic(mnemonic, path);
    console.log("  0", (path + "  ").substring(0,18), "  ?", wallet.address + ' <== to be expected for index 0');

    path = "m/44'/60'/0'/0/1"
    wallet = ethers.Wallet.fromMnemonic(mnemonic, path);
    console.log("  1", (path + "  ").substring(0,18), "  ?", wallet.address + ' <== to be expected for index 1 (MetaMask compatible)');

    path = "m/44'/60'/1'/0/0"
    wallet = ethers.Wallet.fromMnemonic(mnemonic, path);
    console.log("  1", (path + "  ").substring(0,18), "  ?", wallet.address + ' <== to be expected for index 1');
    
    console.log();

    // HDNode version

    let hdnodeParent = ethers.utils.HDNode.fromMnemonic(mnemonic);

    for (i=0; i<n; i++) {
        path = derivePath.slice(0,-1) + i;
        hdnode = hdnodeParent.derivePath( path );
        index =  hdnode.index;
        // address = hdnode.publicKey;
        pk = hdnode.privateKey;
        wallet = new ethers.Wallet(pk);
    //  wallet = ethers.Wallet.fromMnemonic(mnemonic, path); // simpler version (see below)
        if (networkish !== undefined) {
            balance = await provider.getBalance(wallet.address);
            balanceString = ethers.utils.formatUnits(balance) + " ETH";
        } else {
            balanceString = "";
        }
        console.log(("  " + i).slice(-3), (path + "  ").substring(0,18), ("  " + index).slice(-3), wallet.address, wallet.privateKey, balanceString);
    }

    // ether.wallet version

    /*
    for (i=0; i<n; i++) {
        path = derivePath.slice(0,-1) + i;
        wallet = ethers.Wallet.fromMnemonic(mnemonic, path);
        if (networkish !== undefined) {
            balance = await provider.getBalance(wallet.address);
            balanceString = ethers.utils.formatUnits(balance) + " ETH";
        } else {
            balanceString = "";
        }
        console.log(("  " + i).slice(-3), (path + "  ").substring(0,18), wallet.address, wallet.privateKey, balanceString); // wallet.index is not available
    }
    */

}

main();

