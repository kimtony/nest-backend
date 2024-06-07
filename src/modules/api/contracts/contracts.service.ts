
import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { ethers,JsonRpcProvider, FetchRequest } from "ethers";
// import { abi as bep20_abi } from '@modules/abi/bep20.json';

@Injectable()
export class ContractsService {
  constructor(
  ) { }

  async getContracts(): Promise<string> {

    // 主网
    // const providerUrl = 'https://rpc.ankr.com/bsc';   
    // 测试网
    // const providerUrl = 'https://bsc-testnet.public.blastapi.io'
    // const providerUrl = 'https://data-seed-prebsc-1-s1.binance.org:8545'
    // const providerUrl = 'https://bsc-testnet-rpc.publicnode.com'

    const providerUrl = 'http://127.0.0.1:8545/'
    const provider = new JsonRpcProvider(providerUrl);

    // 获取用户余额
    // const balance = await provider.getBalance("0x899F79DfCa3fabC2Ae99099C2C3f142067e641ba");
    // const userBalance = ethers.formatEther(balance);
    // console.log(userBalance);

    // 获取交易数据
    // const transaction = await provider.getTransactionReceipt("0x0895e82cba2eaaa7be2155b76be09dece6543187f94de0428b7ebee10379c5e9");
    // console.log(transaction);

    // 读取合约
    const contractAddr = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
    const toAddress = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";
    const contract = new ethers.Contract( contractAddr,'bep20_abi',provider);
    const name = await contract.name()
    const symbol = await contract.symbol()
    const totalSupply = await contract.totalSupply()
    const getInviter = await contract.getInviter(toAddress)
    console.log("\n1. 读取合约信息")
    console.log(`合约地址: ${contractAddr}`)
    console.log(`名称: ${name}`)
    console.log(`代号: ${symbol}`)
    console.log(`总供给: ${ethers.formatEther(totalSupply)}`)
    console.log(`上级地址: ${getInviter}`);

    // 得到当前block
    const block = await provider.getBlockNumber()
    console.log(`当前区块高度: ${block}`);
    // this.mqPublishService.pubMQMsgTest('web3 block send push RabbitMQ');

    console.log('---------Transfer-------------')
    // const transferEvents = await contract.queryFilter('Transfer', block - 5000, block)
    const transferEvents = await contract.queryFilter('Transfer')
    if(transferEvents.length > 0 ){
      transferEvents.map(event =>{
        console.log('transactionHash:',event.transactionHash);
        console.log('blockNumber:',event.blockNumber);
        const res = contract.interface.parseLog(event)
        console.log('from:',res.args[0]);
        console.log('to:',res.args[1]);
        console.log('value:',ethers.formatEther(res.args[2]));
      })
    }
    console.log('---------TakeTransfer-------------')
    // const swapEvents = await contract.queryFilter('TakeTransfer', block - 5000, block)
    const takeTransferEvents = await contract.queryFilter('TakeTransfer')
    if(takeTransferEvents.length > 0 ){
      takeTransferEvents.map(event =>{
        console.log('transactionHash:',event.transactionHash);
        console.log('blockNumber:',event.blockNumber);
        const res = contract.interface.parseLog(event)
        console.log('from:',res.args[0]);
        console.log('to:',res.args[1]);
        console.log('amount:',ethers.formatEther(res.args[2]));
      })
    }
    console.log('---------swap-------------')
    // const swapEvents = await contract.queryFilter('Swap', block - 5000, block)
    const swapEvents = await contract.queryFilter('Swap')
    if(swapEvents.length > 0 ){
      swapEvents.map(event =>{
        console.log('transactionHash:',event.transactionHash);
        console.log('blockNumber:',event.blockNumber);
        const res = contract.interface.parseLog(event)
        console.log('from:',res.args[0]);
        console.log('amount0In:',ethers.formatEther(res.args[1]));
        console.log('amount1In:',ethers.formatEther(res.args[2]));
        console.log('amount0Out:',ethers.formatEther(res.args[3]));
        console.log('amount1Out :',ethers.formatEther(res.args[4]));
      })
    }
    
 
    // // 转账主网代币 
    // const privateKey = "";
    // const wallet = new ethers.Wallet(privateKey, provider)

    // const tx = {
    //   to: toAddress,
    //   value: ethers.parseEther("0.001")
    // }
    // const receipt = await wallet.sendTransaction(tx)
    // await receipt.wait() // 等待链上确认交易
    // console.log(receipt) // 打印交易详情


    /**
     * id
     * tx_hash
     * blo
     * method
     * from
     * to
     * value
     */

    return '';
  
  }
}
