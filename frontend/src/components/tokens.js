// React component
export default function TokenList({ tokens }) {
    return (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {tokens.map((token, index) => (
                <div key={index} className="bg-white p-4 rounded-md shadow-md">
                    <h2 className="text-xl font-semibold mb-2">{token.assetName}</h2>
                    <p className="text-gray-600 mb-2">ID Asset: {token._id}</p>
                    <p className="text-gray-600 mb-2">Owner: {token.toAddress}</p>
                    <p className="text-gray-600 mb-2">Institution: {token.institution}</p>
                    <p className="text-gray-600 mb-2">Category: {token.assetType}</p>
                    <p className="text-gray-600 mb-2">Location: {token.location}</p>
                    <p className="text-gray-600 mb-2">Estimated Value: {token.valueEstimation}</p>
                    <p className="text-gray-600 mb-2">Description: {token.assetDesc}</p>
                </div>
            ))}
        </div>
    );
}  