const ABIs = {
    erc20ABI: ["function decimals() external view returns (uint8)"],
    factoryABI: ["function getPair(address tokenA, address tokenB) external view returns (address pair)"],
    routerABI: ["function getAmountsOut(uint amountIn, address[] memory path) public view returns (uint[] memory amounts)"]
}

module.exports = ABIs;