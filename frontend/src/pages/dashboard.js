import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
// Import ABI Code to interact with smart contract
import axios from "axios";
import { Loading } from 'notiflix/build/notiflix-loading-aio';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import InfoToken from "../components/infoToken.js";
import MetaMaskButton from "../components/metamaskButton.js";
import TokenList from "../components/tokens.js";
import Asset from "./../artifacts/contracts/Asset.sol/DJKNAssetToken.json";
// The contract address
const smartContractAddress = "0xB7f8BC63BbcaD18155201308C8f3540b07f84F5e";
// The backend address
const URL = "http://localhost:5000"
export default function Dashboard() {
    // Property Variables
    let provider, account;
    const [loading, setLoading] = useState(false);
    const [institutions, setInstitutions] = useState([]);
    const [assetsOwned, setAssetsOwned] = useState([]);
    const [institutionLoggedIn, setInstitutionLoggedIn] = useState("");
    const [address, setAddress] = useState("");
    const [totalSupply, setTotalSupply] = useState("");
    const [nftName, setNftName] = useState("");
    const [nftOwner, setNftOwner] = useState("");
    const [nftSysmbol, setNftSymbol] = useState("");
    const [formData, setFormData] = useState({
        idAsset: '',
        toAddress: '',
        assetType: '',
        assetName: '',
        assetDesc: '',
        location: '',
        valueEstimation: '',
        institutionName: '',
        institutionWallet: '',
        transferTo: ''
    });
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        // Kirim data ke backend)
        axios
            .post(`${URL}/api/v1/assets`, formData)
            .then((response) => {
                const assetId = response.data.data._id
                mint(formData, assetId)
            }).catch((error) => {
                Notify.failure(`Terjadi kesalahan: ${error.response.data.message}`);
                setLoading(false);
            })
    };
    async function handleTransfer(e) {
        e.preventDefault();
        // Kirim data ke backend
        const itemId = formData.idAsset
        const to = formData.transferTo
        setLoading(true);
        const checkOwner = await axios.get(`${URL}/api/v1/assets/${itemId}`)
        const owner = checkOwner.data.data.toAddress
        if (nftOwner !== owner) {
            Notify.failure(`Transfer hanya bisa dilakukan oleh pemilik asset`);
            setLoading(false);
        } else {
            if (typeof window.ethereum !== "undefined") {
                try {
                    const provider = new ethers.providers.Web3Provider(window.ethereum);
                    const signer = provider.getSigner();
                    const contract = new ethers.Contract(smartContractAddress, Asset.abi, signer);
                    const transaction = await contract.transferAssetOwnership(String(itemId), String(to));
                    await transaction.wait();
                    await axios.put(`${URL}/api/v1/assets/${itemId}`, { toAddress: to })
                    Notify.success('Berhasil mentransfer NFT!');
                    setLoading(false);
                } catch (error) {
                    console.log("Error: ", error)
                    Notify.failure(`Terjadi kesalahan: ${error.response.data.message}`);
                    setLoading(false);
                }
            }
        }
    };
    const handleInstitution = (e) => {
        e.preventDefault();
        // Kirim data ke backend
        const institutionData = {
            name: formData.institutionName,
            walletAddress: formData.institutionWallet
        }
        setLoading(true);
        axios
            .post(`${URL}/api/v1/institutions`, institutionData)
            .then((response) => {
                Notify.success('Berhasil menyimpan!');
                setLoading(false);
            }).catch((error) => {
                console.log("Error:", error.response.data.message);
                Notify.failure(`Terjadi kesalahan: ${error.response.data.message}`);
                setLoading(false);
            })
    }
    const handleRemove = (id) => {
        axios
            .delete(`${URL}/api/v1/assets/${id}`)
            .then((response) => {
                console.log("Deleted successfully");
            }).catch((error) => {
                console.log("Error delete:", error.response.data.message);
            })
    }
    // Fetches the current value store in greeting
    async function getInfoToken() {
        // If MetaMask exists
        if (typeof window.ethereum !== "undefined") {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const contract = new ethers.Contract(
                smartContractAddress,
                Asset.abi,
                provider
            );

            const supply = await contract.totalSupply();
            setTotalSupply(String(supply));
            const owner = await contract.owner();
            setNftOwner(String(owner));
            const name = await contract.name();
            setNftName(String(name));
            const symbol = await contract.symbol();
            setNftSymbol(String(symbol));
            if (address !== process.env.REACT_APP_PUBLIC_KEY) {
                getAllTokensByOwner()
            } else {
                getAllTokens()
                console.log(assetsOwned)
            }
        }
    }

    // Sets the greeting from input text box
    async function mint(data, itemId) {
        const to = data.toAddress;
        const itemName = data.assetName;
        const location = data.location;
        const estimatedValue = data.valueEstimation;

        const currentDate = new Date();
        const timestamp = currentDate.getTime();
        const timestampInteger = Math.floor(timestamp);
        const acquisitionDate = timestampInteger;
        // If MetaMask exists
        if (typeof window.ethereum !== "undefined") {
            try {
                setLoading(true);
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                const signer = provider.getSigner();
                const contract = new ethers.Contract(smartContractAddress, Asset.abi, signer);
                const transaction = await contract.mint(String(to), String(itemName), String(location), 11, parseInt(estimatedValue, 10), String(itemId));

                await transaction.wait();
                console.log("Success minted!");
                Notify.success('Berhasil membuat NFT!');
                setLoading(false);
            } catch (error) {
                console.log("Error: ", error)
                Notify.failure(`Terjadi kesalahan: ${error}`);
                handleRemove(itemId)
                setLoading(false);
            }
        }
    }
    async function connectToMetamask() {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        provider = new ethers.providers.Web3Provider(window.ethereum);
        account = await provider.getSigner().getAddress();
        setAddress(account);
    }

    async function getAllTokensByOwner() {
        if (typeof window.ethereum !== "undefined") {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const contract = new ethers.Contract(smartContractAddress, Asset.abi, signer);
            const tokens = await contract.getOwnedAsset(address);
            // Membuat array dari promise yang dihasilkan oleh getTokenFromDB
            const fetchPromises = tokens.map(id => getTokenFromDB(id));

            try {
                // Menunggu semua promise selesai
                const startIndex = 1; // Ganti dengan indeks awal yang Anda inginkan
                const assetDataArray = await Promise.all(fetchPromises);

                // Mengambil sebagian array mulai dari indeks startIndex hingga akhir
                const partialArray = assetDataArray.slice(startIndex);

                console.log(assetDataArray);

                setAssetsOwned(assetDataArray);

            } catch (error) {
                console.error("Error fetching asset data:", error);
            }
        }
    }
    async function getAllTokens() {
        if (typeof window.ethereum !== "undefined") {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const contract = new ethers.Contract(smartContractAddress, Asset.abi, signer);
            const tokens = await contract.getAllItems();
            // Membuat array dari promise yang dihasilkan oleh getTokenFromDB
            const fetchPromises = tokens.map(id => getTokenFromDB(id));

            try {
                // Menunggu semua promise selesai
                const startIndex = 1; // Ganti dengan indeks awal yang Anda inginkan
                const assetDataArray = await Promise.all(fetchPromises);

                // Mengambil sebagian array mulai dari indeks startIndex hingga akhir
                const partialArray = assetDataArray.slice(startIndex);

                console.log(partialArray);

                setAssetsOwned(partialArray);
            } catch (error) {
                console.error("Error fetching asset data:", error);
            }
        }
    }
    async function getTokenFromDB(id) {
        try {
            const response = await axios.get(`${URL}/api/v1/assets/${id}`, formData);
            return response.data.data;
        } catch (error) {
            console.log("Error:", error.response?.data?.message || "Unknown error");
            return null; // Atau tindakan kesalahan lainnya sesuai kebutuhan
        }
    }
    async function disconnectFromMetaMask() {
        if (typeof window.ethereum !== "undefined") {
            try {
                await window.ethereum.request({
                    method: "wallet_requestPermissions",
                    params: [{
                        eth_accounts: {},
                    }],
                });
                Notify.success('Disconnected from MetaMask');
            } catch (error) {
                Notify.failure(`Error disconnecting from MetaMask: ${error}`);
            }
        } else {
            Notify.warning(`MetaMask not detected`);
        }
    }
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${URL}/api/v1/institutions`);
                const data = await response.json();
                setInstitutions(data.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        const getInstitutionLoggedIn = async () => {
            if (address !== "") {
                const response = await axios.get(`${URL}/api/v1/institutions/${address}`);
                setInstitutionLoggedIn(response.data.data.name)
            }
        }
        fetchData();
        getInstitutionLoggedIn();
    }, [address])
    return (
        <>
            <Helmet>
                <title> Dashboard </title>
            </Helmet>
            {loading ? Loading.dots() : Loading.remove()}
            <div className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                <h1>Welcome {institutionLoggedIn}!</h1>
                <h3></h3>
                <h6>Your wallet address: {address}</h6>
                <div className="mt-10 flex items-center justify-center gap-x-6">
                    <button
                        onClick={disconnectFromMetaMask}
                        className="rounded-md bg-red-700 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xl hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                        (5) Logout
                    </button>
                </div>
                {address === "" ? <MetaMaskButton onClick={connectToMetamask()} /> : ""}
            </div>
            <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-1 lg:grid-cols-2">
                <div>
                    <InfoToken nftName={nftName} owner={nftOwner} symbol={nftSysmbol} totalSupply={totalSupply} />
                    <div className="mt-10 flex items-center gap-x-6">
                        <button
                            onClick={getInfoToken}
                            className="rounded-md bg-cyan-700 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xl hover:bg-cyan-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >
                            (1) Get Info Token - Assets
                        </button>
                    </div>
                    <form onSubmit={handleInstitution}>
                        <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                            <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                                <div className="sm:flex sm:items-start">
                                    <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">

                                        <div className="border-b border-gray-900/10 pb-12">
                                            <h2 className="text-base font-semibold leading-7 text-gray-900">Register Institution!</h2>
                                            <div className="mt-3 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                                                <div className="sm:col-span-3">
                                                    <label htmlFor="institutionName" className="block text-sm font-medium leading-6 text-gray-900">
                                                        Institution Name
                                                    </label>
                                                    <div className="mt-2">
                                                        <input
                                                            type="text"
                                                            name="institutionName"
                                                            id="institutionName"
                                                            value={formData.institutionName}
                                                            onChange={handleChange}
                                                            required
                                                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="sm:col-span-3">
                                                    <label htmlFor="institutionWallet" className="block text-sm font-medium leading-6 text-gray-900">
                                                        Wallet Address
                                                    </label>
                                                    <div className="mt-2">
                                                        <input
                                                            type="text"
                                                            name="institutionWallet"
                                                            id="institutionWallet"
                                                            value={formData.institutionWallet}
                                                            onChange={handleChange}
                                                            required
                                                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                        />
                                                    </div>
                                                </div>

                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="mt-10 flex items-center gap-x-6">
                            <button
                                className="rounded-md bg-yellow-700 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xl hover:bg-yellow-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            >
                                (2) Save Institution!
                            </button>
                        </div>
                    </form>
                    <form onSubmit={handleTransfer}>
                        <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                            <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                                <div className="sm:flex sm:items-start">
                                    <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">

                                        <div className="border-b border-gray-900/10 pb-12">
                                            <h2 className="text-base font-semibold leading-7 text-gray-900">Transfer Asset!</h2>
                                            <div className="mt-3 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                                                <div className="sm:col-span-3">
                                                    <label htmlFor="idAsset" className="block text-sm font-medium leading-6 text-gray-900">
                                                        ID Assets
                                                    </label>
                                                    <div className="mt-2">
                                                        <input
                                                            type="text"
                                                            name="idAsset"
                                                            id="idAsset"
                                                            value={formData.idAsset}
                                                            onChange={handleChange}
                                                            required
                                                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="sm:col-span-3">
                                                    <label htmlFor="transferTo" className="block text-sm font-medium leading-6 text-gray-900">
                                                        Transfer To (address)
                                                    </label>
                                                    <div className="mt-2">
                                                        <select
                                                            id="transferTo"
                                                            name="transferTo"
                                                            onChange={handleChange}
                                                            required
                                                            class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6">
                                                            {institutions.map((institution) => (
                                                                <option key={institution._id} value={institution.walletAddress}>
                                                                    {institution.name}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                </div>

                                            </div>
                                            <div className="mt-3 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                                                Wallet: {formData.transferTo}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="mt-10 flex items-center gap-x-6">
                            <button
                                className="rounded-md bg-violet-700 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xl hover:bg-violet-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            >
                                (4) Transfer Responsibility (Owner)!
                            </button>
                            {institutions?.map((item) => {
                                <h6>item: {item.name}</h6>
                            })}
                        </div>
                    </form>
                </div>
                <div>
                    {address === process.env.REACT_APP_PUBLIC_KEY ? (<form onSubmit={handleSubmit}>
                        <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                            <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                                <div className="sm:flex sm:items-start">
                                    <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">

                                        <div className="border-b border-gray-900/10 pb-12">
                                            <h2 className="text-base font-semibold leading-7 text-gray-900">Turn an asset into NFT!</h2>
                                            <div className="mt-3 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                                                <div className="sm:col-span-3">
                                                    <label htmlFor="toAddress" className="block text-sm font-medium leading-6 text-gray-900">
                                                        To Address
                                                    </label>
                                                    <div className="mt-2">
                                                        <select
                                                            id="toAddress"
                                                            name="toAddress"
                                                            onChange={handleChange}
                                                            required
                                                            class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6">
                                                            {institutions.map((institution) => (
                                                                <option key={institution._id} value={institution.walletAddress}>
                                                                    {institution.name}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                    <div className="mt-2">
                                                        {formData.toAddress}
                                                    </div>
                                                </div>

                                                <div className="sm:col-span-3">
                                                    <label htmlFor="assetType" className="block text-sm font-medium leading-6 text-gray-900">
                                                        Asset Type
                                                    </label>
                                                    <div className="mt-2">
                                                        <select
                                                            id="assetType"
                                                            name="assetType"
                                                            value={formData.assetType}
                                                            onChange={handleChange}
                                                            defaultValue="Tanah/Bangunan"
                                                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                                                        >
                                                            <option disabled value="">Choose</option>
                                                            <option value="LandBuilding">Land/Building</option>
                                                            <option value="Transportation">Transportation</option>
                                                            <option value="Electronics">Electronics</option>
                                                        </select>
                                                    </div>
                                                </div>

                                                <div className="sm:col-span-3">
                                                    <label htmlFor="assetName" className="block text-sm font-medium leading-6 text-gray-900">
                                                        Asset Name
                                                    </label>
                                                    <div className="mt-2">
                                                        <input
                                                            type="text"
                                                            name="assetName"
                                                            id="assetName"
                                                            value={formData.assetName}
                                                            onChange={handleChange}
                                                            required
                                                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="sm:col-span-3">
                                                    <label htmlFor="assetDesc" className="block text-sm font-medium leading-6 text-gray-900">
                                                        Asset Description
                                                    </label>
                                                    <div className="mt-2">
                                                        <textarea
                                                            type="text"
                                                            name="assetDesc"
                                                            id="assetDesc"
                                                            value={formData.assetDesc}
                                                            onChange={handleChange}
                                                            required
                                                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="sm:col-span-3">
                                                    <label htmlFor="location" className="block text-sm font-medium leading-6 text-gray-900">
                                                        Location/Address/Coordinate
                                                    </label>
                                                    <div className="mt-2">
                                                        <input
                                                            type="text"
                                                            name="location"
                                                            id="location"
                                                            value={formData.location}
                                                            onChange={handleChange}
                                                            required
                                                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="sm:col-span-3">
                                                    <label htmlFor="valueEstimation" className="block text-sm font-medium leading-6 text-gray-900">
                                                        Value Estimation
                                                    </label>
                                                    <div className="mt-2">
                                                        <input
                                                            type="number"
                                                            name="valueEstimation"
                                                            id="valueEstimation"
                                                            value={formData.valueEstimation}
                                                            onChange={handleChange}
                                                            required
                                                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                        />
                                                    </div>
                                                </div>

                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="mt-10 flex items-center gap-x-6">
                            <button
                                className="rounded-md bg-green-700 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xl hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            >
                                (3) Jadikan NFT!
                            </button>
                        </div>
                    </form>) : ""}

                </div>

            </div>
            <div className="mt-6">
                <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">Assets: {totalSupply}</h2>
                {assetsOwned ? <TokenList tokens={assetsOwned} /> : ""}
            </div>
        </>

    );
}