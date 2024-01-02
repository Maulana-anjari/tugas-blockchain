// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract DJKNAssetToken is ERC721Enumerable, Ownable {
    using Strings for uint256;

    uint256 private tokenIdCounter = 1;

    struct Asset {
        string itemName;
        string location;
        address owner;
        uint256 transferCount;
        uint256 acquisitionDate;
        uint256 estimatedValue;
        string itemId;
    }

    mapping(uint256 => Asset) public assets;
    mapping(address => uint256[]) private ownerAssets;

    event OwnershipTransferred(
        uint256 indexed tokenId,
        address indexed previousOwner,
        address indexed newOwner
    );

    constructor(
        address initialOwner
    ) ERC721("DJKNAssetToken", "GAT") Ownable(initialOwner) {}

    function mint(
        address to,
        string memory itemName,
        string memory location,
        uint256 acquisitionDate,
        uint256 estimatedValue,
        string memory itemId
    ) external onlyOwner {
        _mint(to, tokenIdCounter);
        assets[tokenIdCounter] = Asset({
            itemName: itemName,
            location: location,
            owner: to,
            transferCount: 0,
            acquisitionDate: acquisitionDate,
            estimatedValue: estimatedValue,
            itemId: itemId
        });
        ownerAssets[to].push(tokenIdCounter);
        tokenIdCounter++;
    }

    function getOwnedAssetsCount(
        address owner
    ) external view returns (uint256) {
        return ownerAssets[owner].length;
    }

    function getOwnedAssets(
        address owner
    ) external view returns (Asset[] memory) {
        // Dapatkan array ID aset yang dimiliki oleh pemilik
        uint256[] storage ownedAssetIds = ownerAssets[owner];

        // Deklarasi array storage untuk menyimpan aset-aset yang dimiliki
        Asset[] memory ownedAssets = new Asset[](ownedAssetIds.length);

        // Loop melalui ID aset dan dapatkan detail aset
        for (uint256 i = 0; i < ownedAssetIds.length; i++) {
            uint256 assetId = ownedAssetIds[i];
            ownedAssets[i] = assets[assetId];
        }

        // Kembalikan array ownedAssets
        return ownedAssets;
    }

    function getAllItems() external view returns (string[] memory) {
        uint256 totalAssets = tokenIdCounter;
        string[] memory allItems = new string[](totalAssets);

        for (uint256 i = 0; i < totalAssets; i++) {
            allItems[i] = assets[i].itemId;
        }

        return allItems;
    }

    function getOwnedAssetId(
        address owner,
        uint256 index
    ) external view returns (uint256) {
        require(index < ownerAssets[owner].length, "Index out of bounds");
        return ownerAssets[owner][index];
    }

    function transferAssetOwnership(
        string memory itemId,
        address newOwner
    ) external {
        require(newOwner != address(0), "Invalid new owner address");
        // Find the token ID based on the provided itemId
        uint256 tokenId = findTokenIdByItemId(itemId);
        require(
            msg.sender == ownerOf(tokenId),
            "Only owner can transfer ownership"
        );

        assets[tokenId].owner = newOwner;
        assets[tokenId].transferCount++;
        transferFrom(msg.sender, newOwner, tokenId);
        removeTokenFromOwner(msg.sender, tokenId);
        ownerAssets[newOwner].push(tokenId);

        emit OwnershipTransferred(tokenId, msg.sender, newOwner);
    }

    function getTokenDetails(
        uint256 tokenId
    ) external view returns (Asset memory) {
        return assets[tokenId];
    }

    // Custom function to remove a token from the owner's array
    function removeTokenFromOwner(address owner, uint256 tokenId) internal {
        uint256[] storage ownedTokens = ownerAssets[owner];
        for (uint256 i = 0; i < ownedTokens.length; i++) {
            if (ownedTokens[i] == tokenId) {
                // Move the last element to the position of the element to be removed
                ownedTokens[i] = ownedTokens[ownedTokens.length - 1];
                // Remove the last element
                ownedTokens.pop();
                return;
            }
        }
    }

    // Helper function to find token ID based on itemId
    function findTokenIdByItemId(
        string memory itemId
    ) internal view returns (uint256) {
        for (uint256 i = 1; i < tokenIdCounter; i++) {
            if (
                keccak256(bytes(assets[i].itemId)) == keccak256(bytes(itemId))
            ) {
                return i;
            }
        }
        revert("Asset with itemId not found");
    }
}
