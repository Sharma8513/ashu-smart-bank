// https://docs.metamask.io/guide/ethereum-provider.html#using-the-provider

import React, {useState} from 'react'
import {ethers} from 'ethers'
import bank_abi from './contract/Aman.json'

const BANK = () => {

	// deploy simple storage contract and paste deployed contract address here. This value is local ganache chain
	let contractAddress = '0x8B576E30B669a8AB0bD85341a445473962cFA4F8';

	const [errorMessage, setErrorMessage] = useState(null);
	const [defaultAccount, setDefaultAccount] = useState(null);
	const [connButtonText, setConnButtonText] = useState('Connect Wallet');

	const [currentContractVal, setCurrentContractVal] = useState(null);

	const [provider, setProvider] = useState(null);
	const [signer, setSigner] = useState(null);
	const [contract, setContract] = useState(null);
    let account;
	const connectWalletHandler = () => {
		if (window.ethereum && window.ethereum.isMetaMask) {

			window.ethereum.request({ method: 'eth_requestAccounts'})
			.then(result => {
				accountChangedHandler(result[0]);
                account = result[0];
			})
			.catch(error => {
				setErrorMessage(error.message);
			
			});

		} else {
			console.log('Need to install MetaMask');
			setErrorMessage('Please install MetaMask browser extension to interact');
		}
	}

	// update account, will cause component re-render
	const accountChangedHandler = (newAccount) => {
		setDefaultAccount(newAccount);
		updateEthers();
	}

	const chainChangedHandler = () => {
		// reload the page to avoid any errors with chain change mid use of application
		window.location.reload();
	}


	// listen for account changes
	window.ethereum.on('accountsChanged', accountChangedHandler);

	window.ethereum.on('chainChanged', chainChangedHandler);

	const updateEthers = () => {
		let tempProvider = new ethers.providers.Web3Provider(window.ethereum);
		setProvider(tempProvider);

		let tempSigner = tempProvider.getSigner();
		setSigner(tempSigner);

		let tempContract = new ethers.Contract(contractAddress, bank_abi, tempSigner);
		setContract(tempContract);	
	}

	const addBalance = (event) => {
		event.preventDefault();
		//console.log('sending ' + event.target.setText.value + ' to the contract');
        let amount = document.getElementById("addBal").value;
        const amt = { value: ethers.utils.parseEther(amount.toString()) };
		contract.depositEth(amt);
	}

    const withdrawBalance = (event) => {
		event.preventDefault();
		//console.log('sending ' + event.target.setText.value + ' to the contract');
        let amount = document.getElementById("withdrawBal").value;
        const amt = ethers.utils.parseEther(amount.toString());
		contract.withdraw(amt);
	}
   
	const getCurrentVal = async () => {
		let val = await contract.getContractBal();
        console.log(val);
        document.getElementById("balance").innerHTML =`Contract Balance: ${val}`
	}
	


	return (
		<>
		<div class="Container" style={{backgroundColor:'viloet'}}>
		{/* <h4> {"BANK POC"} </h4> */}
			{/* <h3 className="container my-4">BANK POC</h3> */}
			<div className="card my-3" style={{width:400, marginLeft:710}}>
     <img src="https://bitcoinworld.co.in/wp-content/uploads/2020/07/Bitcoin-banks.jpg.webp" class="card-img-top" alt="no image"/>
  <div class="card-body">
    <div><h3 className="container" style={{backgroundColor:'darkgray'}}>SMART BANK</h3></div>
  </div>
</div>
			<button onClick={connectWalletHandler}>{connButtonText}</button>
			<div class="container"style={{backgroundColor:"azure"}}>
				<h2 className='my-4'>Address: {defaultAccount}</h2>
			</div>
            <button class="btn btn-primary" onClick={getCurrentVal}>Total Balance</button>
			<div>
				<p id="balance">Balance:</p>
			</div>
			<form onSubmit={addBalance}>
				<input id="addBal" type="number" step="0.0001"/>
				<button class="btn btn-primary"type={"submit"}> Add amount </button>
			</form>
            <form onSubmit={withdrawBalance}>
				<input id="withdrawBal" type="number" step="0.0001"/>
				<button class="btn btn-primary my-3" type={"submit"}> Withdraw amount </button>
				
			</form>
		</div>
		</>
	);
}

export default BANK;