import { useState, useEffect } from "react";
import { ethers, utils } from "ethers";
import abi from "../contracts/Bank.json";
import { NextPage } from "next";

const App: NextPage = () => {
	const [isWalletConnected, setIsWalletConnected] = useState(false);
	const [isBankerOwner, setIsBankerOwner] = useState(false);
	const [inputValue, setInputValue] = useState({
		withdraw: "",
		deposit: "",
		bankName: "",
	});
	const [bankOwnerAddress, setBankOwnerAddress] = useState(null);
	const [customerTotalBalance, setCustomerTotalBalance] = useState(null);
	const [currentBankName, setCurrentBankName] = useState(null);
	const [customerAddress, setCustomerAddress] = useState(null);
	const [error, setError] = useState(null);

	const contractAddress = "0x456e7aA88D3D20E9aeAb354481E0B53bfc70376B";
	const contractABI = abi.abi;

	const checkIfWalletIsConnected = async () => {
		try {
			if (window.ethereum) {
				const accounts = await window.ethereum.request({
					method: "eth_requestAccounts",
				});
				const account = accounts[0];
				setIsWalletConnected(true);
				setCustomerAddress(account);
				console.log(account);
			} else {
				setError("Please install a Metamask wallet to use our bank.");
				console.log("No Metamask detected");
			}
		} catch (error) {
			console.log(error);
		}
	};

	const getBankContract = () => {
		const provider = new ethers.providers.Web3Provider(window.ethereum);
		const signer = provider.getSigner();
		const bankContract = new ethers.Contract(
			contractAddress,
			contractABI,
			signer
		);

		return bankContract;
	};

	const getBankName = async () => {
		try {
			if (window.ethereum) {
				const bankContract = getBankContract();

				let bankName = await bankContract.bankName();
				bankName = utils.parseBytes32String(bankName);
				setCurrentBankName(bankName.toString());
			} else {
				console.log("Ethereum object not found, install Metamask");
				setError("Please install a MetaMask");
			}
		} catch (err) {
			console.log(err);
		}
	};

	const setbankNameHandler = async (event) => {
		event.preventDefault();
		try {
			if (window.ethereum) {
				const bankContract = getBankContract();

				const txn = await bankContract.setBankName(
					utils.formatBytes32String(inputValue.bankName)
				);
				console.log("Setting Bank Name...");
				await txn.wait();
				console.log("Bank Name Changed", txn.hash);
				await getBankName();
			} else {
				console.log("Ethereum object not found");
			}
		} catch (err) {
			console.log(err);
		}
	};

	const getBankOwnerHandler = async () => {
		try {
			if (window.ethereum) {
				const bankContract = getBankContract();

				let owner = await bankContract.bankOwner();
				setBankOwnerAddress(owner);

				const [account] = await window.ethereum.request({
					method: "eth_requestAccounts",
				});

				if (owner.toLowerCase() == account.toLowerCase()) {
					setIsBankerOwner(true);
				}
			} else {
				console.log("Not found");
			}
		} catch (err) {
			console.log(err);
		}
	};

	const customerBalanceHandler = async () => {
		try {
			if (window.ethereum) {
				const bankContract = getBankContract()
				let balance = await bankContract.getCustomerBalance()
				setCustomerTotalBalance(utils.formatEther(balance))
				console.log(balance)
			}
		}
	}

	return <></>;
};

export default App;
