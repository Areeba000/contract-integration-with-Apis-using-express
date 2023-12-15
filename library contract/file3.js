const { ethers } = require('ethers');
require('dotenv').config();

const API_URL = process.env.API_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const contractADDRESS = process.env.CONTRACT_ADDRESS;

const provider = new ethers.providers.JsonRpcProvider('https://rpc.testnet.fantom.network');

const signer = new ethers.Wallet(PRIVATE_KEY, provider);

// Check if your ABI import path is correct
const abi = require('./contracts/library.json');
const contract1 = new ethers.Contract(contractADDRESS, abi, signer);
const abi1 = (`./contracts/salary.json`)
const erc20Interface = new ethers.utils.Interface(abi);
const express = require('express');
const app = express();
app.use(express.json());
app.post('/addBook', async (req, res) => {
    const { title, author } = req.body;

    try {

        const result = await contract1.addBook(title, author)

        res.json({ success: true, transactionHash: result.transactionHash });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: error.message });
    }
});
app.post('/borrowBook', async (req, res) => {
    const { bookId, daysToBorrow } = req.body;

    try {

        const result = await contract1.borrowBook(bookId, daysToBorrow).send({
            from: accounts[0],
            value: web3.utils.toWei('1', 'ether'), // Sending 1 ether along with the transaction
        });

        res.json({ success: true, transactionHash: result.transactionHash });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: error.message });
    }
});
app.post('/returnBook', async (req, res) => {
    const { bookId } = req.body;

    try {

        const result = await contract1.returnBook(bookId)

        res.json({ success: true, transactionHash: result.transactionHash });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: error.message });
    }
});
app.post('/withdraw', async (req, res) => {
    try {

        const result = await contract1.methods.withdraw().send({
            from: accounts[0],
        });

        res.json({ success: true, transactionHash: result.transactionHash });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: error.message });
    }
});
app.get('/bookCount', async (req, res) => {
    try {
        const result = await contract1.bookCount()

        res.json({ success: true, bookCount: result });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: error.message });
    }
});
const port = 3000; // Choose the port you want to run the server on
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
