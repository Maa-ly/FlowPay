import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ethers } from "ethers";

@Injectable()
export class BlockchainService {
  private provider: ethers.JsonRpcProvider;
  private executionWallet: ethers.Wallet;
  private intentContract: ethers.Contract;
  private factoryContract: ethers.Contract;

  constructor(private configService: ConfigService) {
    this.initialize();
  }

  private initialize() {
    // Setup provider
    const rpcUrl = this.configService.get("CRONOS_RPC_URL");
    this.provider = new ethers.JsonRpcProvider(rpcUrl);

    // Setup execution wallet
    const privateKey = this.configService.get("EXECUTION_WALLET_PRIVATE_KEY");
    if (privateKey) {
      this.executionWallet = new ethers.Wallet(privateKey, this.provider);
    }

    // Setup contract instances
    this.setupContracts();
  }

  private setupContracts() {
    const intentAddress = this.configService.get("INTENT_CONTRACT_ADDRESS");
    const factoryAddress = this.configService.get("FACTORY_CONTRACT_ADDRESS");

    // Intent Contract ABI (add your actual ABI)
    const intentAbi = [
      "function createIntent(address recipient, uint256 amount, uint256 frequency, uint256 safetyBuffer) external returns (uint256)",
      "function executeIntent(uint256 intentId) external",
      "function pauseIntent(uint256 intentId) external",
      "function resumeIntent(uint256 intentId) external",
      "function deleteIntent(uint256 intentId) external",
      "function getIntent(uint256 intentId) external view returns (tuple(address owner, address recipient, uint256 amount, uint256 frequency, uint256 safetyBuffer, uint256 lastExecution, uint256 nextExecution, bool isActive))",
      "function getUserIntents(address user) external view returns (uint256[])",
      "event IntentCreated(uint256 indexed intentId, address indexed owner, address recipient, uint256 amount)",
      "event IntentExecuted(uint256 indexed intentId, uint256 amount, uint256 timestamp)",
      "event IntentPaused(uint256 indexed intentId)",
      "event IntentResumed(uint256 indexed intentId)",
      "event IntentDeleted(uint256 indexed intentId)",
    ];

    this.intentContract = new ethers.Contract(
      intentAddress,
      intentAbi,
      this.executionWallet || this.provider,
    );

    // Factory Contract ABI
    const factoryAbi = [
      "function createIntent(address recipient, uint256 amount) external returns (uint256)",
      "event IntentCreated(uint256 indexed intentId, address indexed owner)",
    ];

    this.factoryContract = new ethers.Contract(
      factoryAddress,
      factoryAbi,
      this.executionWallet || this.provider,
    );
  }

  // Get wallet balance
  async getBalance(address: string): Promise<bigint> {
    return await this.provider.getBalance(address);
  }

  // Get ERC20 token balance
  async getTokenBalance(
    tokenAddress: string,
    walletAddress: string,
  ): Promise<bigint> {
    const erc20Abi = [
      "function balanceOf(address owner) view returns (uint256)",
      "function decimals() view returns (uint8)",
    ];

    const tokenContract = new ethers.Contract(
      tokenAddress,
      erc20Abi,
      this.provider,
    );
    return await tokenContract.balanceOf(walletAddress);
  }

  // Get current gas price
  async getGasPrice(): Promise<bigint> {
    const feeData = await this.provider.getFeeData();
    return feeData.gasPrice;
  }

  // Get intent details from blockchain
  async getIntent(intentId: bigint): Promise<any> {
    return await this.intentContract.getIntent(intentId);
  }

  // Execute intent on-chain
  async executeIntent(intentId: bigint): Promise<ethers.TransactionReceipt> {
    const tx = await this.intentContract.executeIntent(intentId);
    return await tx.wait();
  }

  // Create intent on-chain
  async createIntent(
    recipient: string,
    amount: bigint,
    frequency: bigint,
    safetyBuffer: bigint,
  ): Promise<ethers.TransactionReceipt> {
    const tx = await this.intentContract.createIntent(
      recipient,
      amount,
      frequency,
      safetyBuffer,
    );
    return await tx.wait();
  }

  // Pause intent
  async pauseIntent(intentId: bigint): Promise<ethers.TransactionReceipt> {
    const tx = await this.intentContract.pauseIntent(intentId);
    return await tx.wait();
  }

  // Resume intent
  async resumeIntent(intentId: bigint): Promise<ethers.TransactionReceipt> {
    const tx = await this.intentContract.resumeIntent(intentId);
    return await tx.wait();
  }

  // Delete intent
  async deleteIntent(intentId: bigint): Promise<ethers.TransactionReceipt> {
    const tx = await this.intentContract.deleteIntent(intentId);
    return await tx.wait();
  }

  // Get user intents
  async getUserIntents(userAddress: string): Promise<bigint[]> {
    return await this.intentContract.getUserIntents(userAddress);
  }

  // Listen to contract events
  listenToEvents(callback: (event: any) => void) {
    this.intentContract.on("IntentCreated", (...args) => {
      callback({ type: "IntentCreated", args });
    });

    this.intentContract.on("IntentExecuted", (...args) => {
      callback({ type: "IntentExecuted", args });
    });

    this.intentContract.on("IntentPaused", (...args) => {
      callback({ type: "IntentPaused", args });
    });

    this.intentContract.on("IntentResumed", (...args) => {
      callback({ type: "IntentResumed", args });
    });

    this.intentContract.on("IntentDeleted", (...args) => {
      callback({ type: "IntentDeleted", args });
    });
  }

  // Verify signature (for wallet auth)
  verifySignature(message: string, signature: string): string {
    return ethers.verifyMessage(message, signature);
  }

  // Get transaction receipt
  async getTransactionReceipt(
    txHash: string,
  ): Promise<ethers.TransactionReceipt> {
    return await this.provider.getTransactionReceipt(txHash);
  }

  // Estimate gas
  async estimateGas(tx: ethers.TransactionRequest): Promise<bigint> {
    return await this.provider.estimateGas(tx);
  }
}
