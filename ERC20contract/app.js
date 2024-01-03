const { ethers } = require('ethers');
require('dotenv').config();

const API_URL = process.env.API_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const contractADDRESS = process.env.CONTRACT_ADDRESS;

const provider = new ethers.JsonRpcProvider('https://rpc-mumbai.maticvigil.com/');

const signer = new ethers.Wallet(PRIVATE_KEY, provider);

// Check if your ABI import path is correct
const  abi = require('./contracts/erc20.json');
const contract = new ethers.Contract(contractADDRESS, abi, signer);


const express = require('express');
const app = express();
app.use(express.json());

app.post('/mint', async (req, res) => {
    const { account, amount } = req.body;

    try {
        const result = await contract.mint(account, amount);
        console.log(result)
        res.json({ success: true, transactionHash: result.transactionHash });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: error.message });
    }
});
app.post('/burn', async (req, res) => {
    const { account, amount } = req.body;

    try {
        const result = await contract.burn(account, amount)
        res.json({ success: true, transactionHash: result.transactionHash });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: error.message });
    }
});
app.post('/getbalance', async (req, res) => {
    const { ownerAddress } = req.body;

    try {
        // Call the getbalanceOf function on the smart contract
        const balance = await contract.balanceOf(ownerAddress);

        // Convert the BigInt balance to a string
        const balanceString = balance.toString();

        res.json({ success: true, balance: balanceString });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: error.message });
    }
});
app.post('/transfer', async (req, res) => {
    const { recipient, amount } = req.body;

    try {
      
        const result = await contract.transfer(recipient, amount)

        res.json({ success: true, transactionHash: result.transactionHash });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: error.message });
    }
});
app.post('/approve', async (req, res) => {
    const { spender, amount } = req.body;

    try {
        const result = await contract.approve(spender, amount);

        res.json({ success: true, transactionHash: result.transactionHash });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: error.message });
    }
});
app.post('/allowance', async (req, res) => {
    const { owner, spender } = req.body;

    try {
        // Call the allowancefun function on the smart contract
        const allowance = await contract.allowancefun(owner, spender);

        // Convert the BigInt allowance to a string
        const allowanceString = allowance.toString();

        res.json({ success: true, allowance: allowanceString });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: error.message });
    }
});
app.post('/transferFrom', async (req, res) => {
    const { sender, recipient, amount } = req.body;
     console.log(req.body)
    try {
     
        const result = await contract.transferFrom(sender, recipient, amount);

        res.json({ success: true, transactionHash: result.transactionHash });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: error.message });
    }
});
 

const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });