const { ethers } = require('ethers');
require('dotenv').config();

const API_URL = process.env.API_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const contractADDRESS = process.env.CONTRACT_ADDRESS;

const provider = new ethers.JsonRpcProvider('https://testnet.xana.net/ext/bc/fRuomnMajakodKhGaxiaWz7DqGdqAAAZTnQUUPqA4osnLkw5i/rpc');

const signer = new ethers.Wallet(PRIVATE_KEY, provider);

// Check if your ABI import path is correct
const  abi = require('./contracts/1155contract.json');
const contract = new ethers.Contract(contractADDRESS, abi, signer);


const express = require('express');
const app = express();
app.use(express.json());
app.post('/mint', async (req, res) => {
    try {
      const { id, value, data } = req.body;
  
      // Call the mint function of the smart contract
      const tx = await contract.mint(id, value, data);
      await tx.wait();
  
      res.json({ success: true, transactionHash: tx.hash });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  app.post('/balanceof', async (req, res) => {
    let { owner, id } = req.body;
    let response = await getBalanceOf(owner, id);
    res.json({ balance: response });
});

async function getBalanceOf(owner, id) {
    const ownerAddress = owner;
    const id1 = id;

    try {
        const balance = await contract.balanceOf(ownerAddress, id1);
        console.log(`Balance of ${ownerAddress} for ID ${id1}: ${balance}`);
        return balance.toString(); // Convert BigInt to string
    } catch (error) {
        console.error('Error:', error);
        return 'Error fetching balance';
    }
}
app.post('/burn', async (req, res) => {
    let { id, value } = req.body;
    let response = await burn(id, value);
    res.json({ success: true, response });
});
async function burn(id, value) {
        const id1 = id;  
       const value1 = value; 
      
        try {
          const tx = await contract.burn(id, value);
          await tx.wait();
          console.log('Transaction mined:', tx.hash);
        } catch (error) {
          console.error('Error:', error);
        }
      }
      app.post('/setApprovalForAll', async (req, res) => {
        let { operator, approved } = req.body;
        let response = await setApprovalForAll(operator, approved);
        res.json({ success: true, response });
    });
    async function setApprovalForAll(operator,approved) {
           const operatorAddress1 = operator;
           const approved1 = approved; 
          try {
            const tx = await contract.setApprovalForAll(operator, approved);
            await tx.wait();
            console.log(`Approval for all set for ${operatorAddress1}: ${approved1}`);
          } catch (error) {
            console.error('Error:', error);
          }
        }
        app.post('/isApprovedForAll', async (req, res) => {
            let { owner, operator } = req.body;
            let response = await checkIsApprovedForAll(owner, operator);
            res.json({ success: true, response });
        });
        
        async function checkIsApprovedForAll(owner, operator) {
            const ownerAddress = owner;
            const operatorAddress = operator;
        
            try {
                const isApproved = await contract.isApprovedForAll(ownerAddress, operatorAddress);
                console.log(`Is approved for all: ${isApproved}`);
                return isApproved;
            } catch (error) {
                console.error('Error checking approval for all:', error);
                return false;
            }
        }
        app.post('/safeTransferFrom', async (req, res) => {
            const { from, to, id, value, data } = req.body;
        
            try {
                await safeTransferFrom(from, to, id, value, data);
                res.json({ success: true, message: 'Tokens transferred successfully.' });
            } catch (error) {
                console.error('Error transferring tokens:', error);
                res.status(500).json({ error: 'Internal Server Error' });
            }
        });
        
        async function safeTransferFrom(from, to, id, value, data) {
            const fromAddress = from;
            const toAddress = to;
        
            try {
                const tx = await contract.safeTransferFrom(fromAddress, toAddress, id, value, data);
                await tx.wait();
                console.log('Tokens transferred:', tx.transactionHash);
            } catch (error) {
                console.error('Error transferring tokens:', error);
                throw error;
            }
        }
        
    
  // Start the Express server
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });

  
 