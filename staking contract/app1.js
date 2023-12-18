const { ethers } = require('ethers');
require('dotenv').config();

const API_URL = process.env.API_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const contractADDRESS = process.env.CONTRACT_ADDRESS;

const provider = new ethers.JsonRpcProvider('https://testnet.xana.net/ext/bc/fRuomnMajakodKhGaxiaWz7DqGdqAAAZTnQUUPqA4osnLkw5i/rpc');

const signer = new ethers.Wallet(PRIVATE_KEY, provider);

// Check if your ABI import path is correct
const  abi = require('./contracts/staking.json');
const contract1 = new ethers.Contract(contractADDRESS, abi, signer);


const express = require('express');
const app = express();
app.use(express.json());
app.post('/stakeTokens', async (req, res) => {
    const { amount } = req.body;
    try {
      const transaction = await contract1.stakeTokens(amount);
      await transaction.wait();
  
      res.json({ transactionHash: transaction.hash, status: 'Success' });
    } catch (error) {
      res.status(500).json({ error: error.message, status: 'Failed' });
    }
  });
  app.get('/istokenstake', async (req, res) => {
    const { ownerAddress } = req.body;
  
    try {
      const isTokenStaked = await contract1.istokenstake(ownerAddress);
  
      res.json({ isTokenStaked, status: 'Success' });
    } catch (error) {
      res.status(500).json({ error: error.message, status: 'Failed' });
    }
  });
  app.post('/unstake', async (req, res) => {
    // const {} = req.body;
    try {
      const transaction = await contract1.unstake();
      await transaction.wait();
  
      res.json({ transactionHash: transaction.hash, status: 'Success' });
    } catch (error) {
      res.status(500).json({ error: error.message, status: 'Failed' });
    }
  });
// Start the Express server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});