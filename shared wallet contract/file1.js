const { ethers } = require('ethers');
require('dotenv').config();

const API_URL = process.env.API_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const contractADDRESS = process.env.CONTRACT_ADDRESS;

const provider = new ethers.providers.JsonRpcProvider('https://rpc.testnet.fantom.network');

const signer = new ethers.Wallet(PRIVATE_KEY, provider);

// Check if your ABI import path is correct
const abi = require('./contracts/sharedwallet.json');
const contract1 = new ethers.Contract(contractADDRESS, abi, signer);
const abi1 = (`./contracts/salary.json`)
const erc20Interface = new ethers.utils.Interface(abi);
const express = require('express');
const app = express();
app.use(express.json());
app.post('/setOwner', async (req, res) => {
    try {
        const { owner } = req.body;

        // Assuming setowner function is present in your smart contract ABI
        const tx = await contract1.setowner(owner)

        res.json({ success: true, transactionHash: tx.transactionHash });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})
app.post('/removeOwner', async (req, res) => {
    try {
        const { owner } = req.body;

        // Assuming removeOwner function is present in your smart contract ABI
        const tx = await contract1.removeOwner(owner)

        res.json({ success: true, transactionHash: tx.transactionHash });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
app.post('/transferTo', async (req, res) => {
    try {
        const { to, amount } = req.body;

        // Assuming transferTo function is present in your smart contract ABI
        const tx = await contract1.transferTo(to, amount)

        res.json({ success: true, transactionHash: tx.transactionHash });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
app.post('/withdraw', async (req, res) => {
    try {
        const { amount } = req.body;

        // Assuming withdraw function is present in your smart contract ABI
        const tx = await contract1.withdraw(amount)

        res.json({ success: true, transactionHash: tx.transactionHash });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
const port = 3000; // Choose the port you want to run the server on
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});