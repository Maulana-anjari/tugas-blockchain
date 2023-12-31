export default function InfoToken({ nftName, owner, symbol, totalSupply }) {
    return (
        <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
            <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                    <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                        NFT (ERC-721) Name: {nftName}
                        <div className="mt-2">
                            <p className="text-sm text-gray-500">Owner: {owner}</p>
                        </div>
                        <div className="mt-2">
                            <p className="text-sm text-gray-500">Symbol: {symbol}</p>
                        </div>
                        <div className="mt-2">
                            <p className="text-sm text-gray-500">Total Supply: {totalSupply} assets</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}