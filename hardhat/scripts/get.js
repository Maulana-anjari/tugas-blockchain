const { ethers } = require("hardhat");

async function main() {
    // Dapatkan instance dari kontrak pintar
    const tokenFactory = await ethers.getContractFactory("DJKNAssetToken");
    const token = await tokenFactory.attach("0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9");

    // Contoh memanggil fungsi pada kontrak
    const balance = await token.balanceOf("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266");
    console.log("Balance:", balance.toString());
    // const mint = await token.mint(
    //     "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
    //     "Tanah Z",
    //     "Bandung",
    //     12, 12, "123123"
    // );
    // const transferOwnership = await token.transferAssetOwnership(1, "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC");
    const tokens = await token.getOwnedAssetsCount("0x70997970C51812dc3A010C7d01b50e0d17dc79C8");
    console.log(tokens)
    const tokenDetail = await token.getTokenDetails(1);
    console.log("Token Detail:", tokenDetail.toString());
    const supply = await token.totalSupply();
    console.log("Token Total:", supply.toString());
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
