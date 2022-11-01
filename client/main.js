const ethers = require("ethers");
const ABIs = require("./abiList");
const ADDRs = require("./addressList");

const provider = new ethers.providers.JsonRpcProvider("https://bsc-dataseed.binance.org/");


const getPrice = async (amountInHuman, router, addressFrom, addressTo) => {
    // convert amounts In 
    const tokenContractFrom = new ethers.Contract(addressFrom, ABIs.erc20ABI, provider); // instantaite token contract 
    const fromTokenDecimals = await tokenContractFrom.decimals();
    const amountIn = ethers.utils.parseUnits(amountInHuman, fromTokenDecimals).toString();

    // get amounts out 
    const amountOut = await router.getAmountsOut(amountIn, [addressFrom, addressTo]);

    // convert amounts out 
    const tokenContractTo = new ethers.Contract(addressTo, ABIs.erc20ABI, provider);
    const toTokenDecimals = await tokenContractTo.decimals();
    const amountsOutHuman = ethers.utils.formatUnits(amountOut[1].toString(), toTokenDecimals);

    return amountsOutHuman;
}

const getPercentage = (price1, price2) => {
    const V1 = parseFloat(price1);
    const V2 = parseFloat(price2);
    const total = V1 + V2;
    const diff = V1 - V2;

    const percentage = (diff / total) * 100;

    return percentage;
}

async function main() {
    const amountHuman = "500";
    // instanciate touter contracts
    const pancakeRouterContract = new ethers.Contract(ADDRs.services.pancakeRouter, ABIs.routerABI, provider);
    const apeRouterContract = new ethers.Contract(ADDRs.services.apeSwapRouter, ABIs.routerABI, provider);

    const pancakePrice = await getPrice(amountHuman, pancakeRouterContract, ADDRs.tokens.BUSD, ADDRs.tokens.WBNB);
    const apePrice = await getPrice(amountHuman, apeRouterContract, ADDRs.tokens.BUSD, ADDRs.tokens.WBNB);

    console.log("One BUSD to WBNB on Pancakswap is: ", pancakePrice);
    console.log("One BUSD to WBNB on Apeswap is: ", apePrice);

    //compare prices
    if (pancakePrice > apePrice) {
        // get percentage decide to do arbitrage
        const percentage = getPercentage(pancakePrice, apePrice)
        if (percentage > 0.5) {
            console.log("!!! STARTING ARBITRAGE !!!")
        }
        console.log("Pancakeswap price is highter with: " + percentage + "% difference");
    }

    if (apePrice > pancakePrice) {
        // get percentage and decide to arbitrage
        const percentage = getPercentage(apePrice, pancakePrice)
        if (percentage > 0.5) {
            console.log("!!! STARTING ARBITRAGE !!!")
        }
        console.log("Apeswap price is highter with: " + percentage + "% difference");
    }
}


main();