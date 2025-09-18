import React, { useState } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { Transaction, VersionedTransaction } from '@solana/web3.js';
import { Buffer } from 'buffer';
import { useTranslation } from '../i18n/LanguageContext';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './UI/dialog';
import { Button } from './UI/Button';
import { Card, CardContent, CardHeader, CardTitle } from './UI/enhanced-card';
import { Badge } from './UI/badge';
import { LoadingSpinner } from './UI/loading-spinner';
import { 
  AlertCircle, 
  CheckCircle, 
  ExternalLink, 
  Wallet, 
  Zap,
  Copy,
  TrendingUp
} from 'lucide-react';
import { cn } from '../lib/utils';

// API URL configuration
const API_URL = process.env.NODE_ENV === 'development' 
  ? '' // Use proxy in development
  : '/api'; // Use Nginx proxy in production

const BuyModal = ({ isOpen, onClose, token }) => {
  const { t } = useTranslation();
  const { publicKey, connected, signTransaction, sendTransaction } = useWallet();
  const { connection } = useConnection();
  const [amountIn, setAmountIn] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [txSignature, setTxSignature] = useState('');

  // Helper function to convert VersionedTransaction to legacy Transaction
  const convertToLegacyTransaction = (versionedTx) => {
    try {
      console.log('🔄 Converting VersionedTransaction to legacy Transaction...');
      
      const message = versionedTx.message;
      console.log('Message type:', message.constructor.name);
      
      const hasV0Properties = message.header && 
                             message.staticAccountKeys && 
                             message.recentBlockhash && 
                             message.instructions &&
                             Array.isArray(message.staticAccountKeys) &&
                             Array.isArray(message.instructions);
      
      if (hasV0Properties) {
        console.log('Detected MessageV0-like structure, proceeding with conversion...');
        
        const {
          header,
          staticAccountKeys,
          recentBlockhash,
          instructions,
          addressTableLookups
        } = message;
        
        console.log('Message data:', {
          staticAccountKeys: staticAccountKeys?.length || 0,
          instructions: instructions?.length || 0,
          addressTableLookups: addressTableLookups?.length || 0,
          recentBlockhash: recentBlockhash?.toString().slice(0, 10) + '...',
          header: header ? Object.keys(header) : 'none'
        });
        
        if (addressTableLookups && addressTableLookups.length > 0) {
          throw new Error('Cannot convert transaction with address table lookups to legacy format');
        }
        
        const legacyTransaction = new Transaction();
        legacyTransaction.recentBlockhash = recentBlockhash;
        legacyTransaction.feePayer = staticAccountKeys[0];
        
        for (let index = 0; index < instructions.length; index++) {
          const instruction = instructions[index];
          
          try {
            console.log(`Converting instruction ${index}:`);
            console.log(`  programIdIndex: ${instruction.programIdIndex}`);
            console.log(`  accountsLength: ${instruction.accounts?.length || 0}`);
            console.log(`  dataLength: ${instruction.data?.length || 0}`);
            
            let instructionData = instruction.data;
            
            if (!instructionData) {
              console.log(`Instruction ${index} has no data, creating empty buffer`);
              instructionData = Buffer.alloc(0);
            } else if (!Buffer.isBuffer(instructionData)) {
              if (Array.isArray(instructionData)) {
                instructionData = Buffer.from(instructionData);
              } else if (typeof instructionData === 'string') {
                instructionData = Buffer.from(instructionData, 'base64');
              } else if (instructionData instanceof Uint8Array) {
                instructionData = Buffer.from(instructionData);
              } else if (instructionData.constructor && (instructionData.constructor.name === 'Uint8Array' || instructionData.constructor.name === 'Er' || instructionData.constructor.name.includes('Array'))) {
                instructionData = Buffer.from(instructionData);
              } else if (typeof instructionData === 'object' && instructionData !== null) {
                if (instructionData.type === 'Buffer' && Array.isArray(instructionData.data)) {
                  instructionData = Buffer.from(instructionData.data);
                } else if (instructionData.length !== undefined && typeof instructionData.length === 'number') {
                  instructionData = Buffer.from(Object.values(instructionData));
                } else {
                  console.warn(`Unknown data type for instruction ${index}, attempting conversion:`, instructionData);
                  instructionData = Buffer.from(Object.values(instructionData));
                }
              } else {
                console.warn(`Unknown data type for instruction ${index}, attempting conversion:`, instructionData);
                instructionData = Buffer.from(Object.values(instructionData));
              }
            }
            
            const convertedInstruction = {
              programId: staticAccountKeys[instruction.programIdIndex],
              keys: instruction.accounts.map((accountIndex, keyIndex) => {
                const accountIndexValue = typeof accountIndex === 'object' ? accountIndex.accountIndex : accountIndex;
                const pubkey = staticAccountKeys[accountIndexValue];
                
                if (!pubkey) {
                  throw new Error(`Invalid account index ${accountIndexValue} for instruction ${index}, key ${keyIndex}`);
                }
                
                return {
                  pubkey: pubkey,
                  isSigner: accountIndexValue < header.numRequiredSignatures,
                  isWritable: accountIndexValue < header.numRequiredSignatures - header.numReadonlySignedAccounts || 
                             (accountIndexValue >= header.numRequiredSignatures && 
                              accountIndexValue < staticAccountKeys.length - header.numReadonlyUnsignedAccounts)
                };
              }),
              data: Buffer.isBuffer(instructionData) ? instructionData : Buffer.alloc(0)
            };
            
            legacyTransaction.add(convertedInstruction);
            
          } catch (instError) {
            console.error(`Failed to convert instruction ${index}:`, instError);
            throw new Error(`Instruction conversion failed: ${instError.message}`);
          }
        }
        
        console.log('✅ Successfully converted to legacy Transaction');
        return legacyTransaction;
        
      } else {
        console.error('Message structure:', Object.keys(message));
        throw new Error(`Unsupported message structure. Expected MessageV0-like properties but got: ${Object.keys(message).join(', ')}`);
      }
      
    } catch (conversionError) {
      console.error('❌ Failed to convert to legacy transaction:', conversionError);
      throw conversionError;
    }
  };

  const handleBuy = async () => {
    if (!connected || !publicKey) {
      setError('Please connect your wallet first');
      return;
    }

    if (!amountIn || isNaN(parseFloat(amountIn)) || parseFloat(amountIn) <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    if (!signTransaction || !sendTransaction) {
      setError('Wallet does not support transaction signing');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccess('');
    setTxSignature('');

    const wallet = window.solana || window.phantom;
    const walletSupportsVersioned = wallet?.isVersionedTransactionSupported || false;
    console.log('Wallet supports versioned transactions:', walletSupportsVersioned);

    try {
      setSuccess('Creating transaction...');
      
      const apiPayload = {
        chain_id: 100000, // Solana
        token_ca: token.tokenAddress,
        swap_type: 1, // Buy
        amount_in: amountIn,
        user_wallet_address: publicKey.toString(),
      };

      console.log('API request payload:', apiPayload);

      const response = await fetch(`${API_URL}/v1/trade/create_market_order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apiPayload),
      });

      const data = await response.json();
      console.log('📨 Full API response:', data);

      if (!response.ok) {
        console.error('API response not OK:', data);
        setError(data.message || `API Error ${response.status}: ${response.statusText}`);
        return;
      }
      
      const txHash = data.data?.txHash || data.txHash || data.tx_hash;
      
      if (!txHash) {
        console.error('Transaction data not found in response:', data);
        if (data.code && data.message) {
          console.error('Backend returned:', data.code, data.message);
          setError(`Backend Error ${data.code}: ${data.message}`);
        } else {
          setError('No transaction data received from server');
        }
        return;
      }

      console.log('Unsigned transaction (base64):', txHash);

      setSuccess('Preparing transaction for signing...');
      let transaction;
      let transactionType;
      
      try {
        const transactionBuffer = Buffer.from(txHash, 'base64');
        console.log('Successfully decoded base64 to buffer, length:', transactionBuffer.length);
        
        let isVersionedTransaction = false;
        let originalVersionedTransaction = null;
        
        try {
          transaction = Transaction.from(transactionBuffer);
          transactionType = 'Transaction (legacy)';
          isVersionedTransaction = false;
          console.log('✅ Successfully created legacy Transaction object:', transaction);
          
        } catch (legacyError) {
          console.log('Failed to deserialize as legacy transaction, trying versioned format:', legacyError);
          
          try {
            originalVersionedTransaction = VersionedTransaction.deserialize(transactionBuffer);
            isVersionedTransaction = true;
            console.log('Successfully created VersionedTransaction object:', originalVersionedTransaction);
            
            if (!walletSupportsVersioned) {
              console.warn('⚠️ Wallet does not support versioned transactions, attempting conversion...');
              
              try {
                transaction = convertToLegacyTransaction(originalVersionedTransaction);
                transactionType = 'Transaction (converted from VersionedTransaction)';
                console.log('✅ Successfully converted to legacy Transaction format');
              } catch (conversionError) {
                console.error('❌ Failed to convert to legacy format:', conversionError);
                setError(`Cannot convert transaction for your wallet: ${conversionError.message}. Please try a different wallet like Phantom or Solflare.`);
                return;
              }
            } else {
              transaction = originalVersionedTransaction;
              transactionType = 'VersionedTransaction';
            }
            
          } catch (versionedError) {
            console.error('Failed to deserialize as both legacy and versioned transaction:', { legacyError, versionedError });
            setError(`Cannot deserialize transaction: ${legacyError.message}`);
            return;
          }
        }
        
        console.log('Final transaction type:', transactionType);
        
      } catch (decodeError) {
        console.error('Failed to decode transaction:', decodeError);
        setError(`Failed to decode transaction: ${decodeError.message}`);
        return;
      }

      setSuccess('Please approve the transaction in your wallet...');
      
      try {
        console.log('Sending transaction to wallet for signing...');
        
        const phantomProvider = window.solana || window.phantom?.solana;
        let signature;
        
        if (phantomProvider && phantomProvider.signAndSendTransaction) {
          console.log('🔄 Using Phantom\'s native signAndSendTransaction method...');
          try {
            const result = await phantomProvider.signAndSendTransaction(transaction);
            signature = result.signature || result;
            console.log('✅ Transaction submitted with Phantom native method, signature:', signature);
          } catch (phantomError) {
            console.error('❌ Phantom native method failed:', phantomError);
            console.log('🔄 Falling back to wallet adapter sendTransaction...');
            signature = await sendTransaction(transaction, connection);
            console.log('✅ Transaction submitted with wallet adapter, signature:', signature);
          }
        } else {
          console.log('🔄 Using wallet adapter sendTransaction method...');
          signature = await sendTransaction(transaction, connection);
          console.log('✅ Transaction submitted with wallet adapter, signature:', signature);
        }
        
        setTxSignature(signature);
        setSuccess(`Transaction submitted successfully! Signature: ${signature}`);
        
        setSuccess('Confirming transaction...');
        const confirmation = await connection.confirmTransaction(signature, 'confirmed');
        
        if (confirmation.value.err) {
          setError(`Transaction failed: ${confirmation.value.err.toString()}`);
        } else {
          setSuccess(`✅ Transaction confirmed! View on Solscan: https://solscan.io/tx/${signature}?cluster=devnet`);
        }
        
      } catch (walletError) {
        console.error('Wallet error:', walletError);
        
        if (walletError.message?.includes('User rejected')) {
          setError('Transaction was rejected by user');
        } else if (walletError.message?.includes('blockhash')) {
          setError('Transaction expired. Please try again.');
        } else if (walletError.message?.includes('insufficient')) {
          setError('Insufficient funds for transaction');
        } else if (walletError.message?.includes('network')) {
          setError('Network error. Please check your connection.');
        } else if (walletError.message === 'Unexpected error') {
          setError('Transaction format issue. This converted transaction may not be compatible with your wallet. Please try using Phantom or Solflare wallet instead.');
        } else {
          setError('Failed to sign/send transaction: ' + (walletError.message || 'Unknown error'));
        }
      }

    } catch (err) {
      console.error('General error:', err);
      setError('Network error: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setAmountIn('');
    setError('');
    setSuccess('');
    setTxSignature('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  // Quick amount buttons
  const quickAmounts = ['0.0001', '0.001', '0.01', '0.1', '1'];

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg w-full max-w-[90vw]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-green-500" />
            {t('buyModal.title')} {token?.tokenName || 'Token'}
          </DialogTitle>
          <DialogDescription>
            {t('buyModal.description')}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Token Info Card */}
          <Card variant="elevated" padding="none">
            <CardContent className="p-4">
              <div className="flex items-center gap-4 w-full">
                <div className="relative flex-shrink-0">
                  {token?.tokenIcon ? (
                    <img 
                      src={token.tokenIcon} 
                      alt={token.tokenName} 
                      className="w-16 h-16 rounded-lg border-2 border-border object-cover"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white font-bold text-xl border-2 border-border">
                      {(token?.tokenName || '?').charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="absolute -top-4 -right-2">
                    <Badge variant="outline" className="text-xs px-1.5 py-0.5 bg-green-50 text-green-600 border-green-200">
                      <TrendingUp className="w-3 h-3 mr-1" />
{t('buyModal.new')}
                    </Badge>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-xl text-foreground mb-2">
                    {token?.tokenName || 'Unknown Token'}
                  </h3>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span className="text-xs text-muted-foreground/70">{t('buyModal.address')}:</span>
                      <span className="font-mono text-sm">
                        {token?.tokenAddress ? 
                          `${token.tokenAddress.slice(0, 12)}...${token.tokenAddress.slice(-8)}` : 
                          'N/A'
                        }
                      </span>
                      {token?.tokenAddress && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(token.tokenAddress)}
                          className="h-6 w-6 p-0 hover:bg-muted"
                          title={t('buyModal.copyAddress')}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                    {token?.mktCap && (
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-xs text-muted-foreground/70">{t('buyModal.marketCap')}:</span>
                        <span className="font-semibold text-blue-600">
                          ${token.mktCap >= 1000000 ? `${(token.mktCap / 1000000).toFixed(2)}M` : 
                            token.mktCap >= 1000 ? `${(token.mktCap / 1000).toFixed(1)}K` : 
                            token.mktCap.toFixed(2)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Amount Input */}
          <div className="space-y-2">
            <label htmlFor="amount" className="text-sm font-medium text-foreground">
              {t('buyModal.amount')}
            </label>
            <div className="relative">
              <input
                id="amount"
                type="number"
                placeholder={t('buyModal.placeholder.amount')}
                step="0.0001"
                min="0"
                value={amountIn}
                onChange={(e) => setAmountIn(e.target.value)}
                disabled={isLoading}
                className={cn(
                  "w-full px-3 py-2 text-sm rounded-md border border-input bg-background",
                  "placeholder:text-muted-foreground",
                  "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                  "disabled:cursor-not-allowed disabled:opacity-50",
                  error && "border-red-500 focus:ring-red-500"
                )}
              />
            </div>
            
            {/* Quick Amount Buttons */}
            <div className="grid grid-cols-5 gap-2">
              {quickAmounts.map((amount) => (
                <Button
                  key={amount}
                  variant="outline"
                  size="sm"
                  onClick={() => setAmountIn(amount)}
                  disabled={isLoading}
                  className="text-xs px-2 py-1 h-8 flex-1"
                >
                  {amount} SOL
                </Button>
              ))}
            </div>
          </div>

          {/* Status Messages */}
          {error && (
            <Card variant="outline" className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20">
              <CardContent className="p-3">
                <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-sm">{error}</span>
                </div>
              </CardContent>
            </Card>
          )}

          {success && (
            <Card variant="outline" className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20">
              <CardContent className="p-3">
                <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                  <CheckCircle className="h-4 w-4" />
                  <span className="text-sm">{success}</span>
                </div>
              </CardContent>
            </Card>
          )}

          {txSignature && (
            <Card variant="elevated" padding="sm">
              <CardContent className="p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{t('buyModal.transactionSignature')}:</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(txSignature)}
                    className="h-6 w-6 p-0"
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
                <div className="font-mono text-xs text-muted-foreground break-all">
                  {txSignature}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => window.open(`https://solscan.io/tx/${txSignature}?cluster=devnet`, '_blank')}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  {t('buyModal.viewOnSolscan')}
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Wallet Status */}
          <Card variant="outline" className={cn(
            "border transition-colors duration-200",
            connected 
              ? "bg-green-50/50 border-green-200 dark:bg-green-900/10 dark:border-green-800" 
              : "bg-amber-50/50 border-amber-200 dark:bg-amber-900/10 dark:border-amber-800"
          )}>
            <CardContent className="p-3">
              <div className="flex items-center gap-2">
                <Wallet className={cn(
                  "h-4 w-4",
                  connected ? "text-green-600" : "text-amber-600"
                )} />
                {connected ? (
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-green-700 dark:text-green-400">
                      {t('buyModal.walletConnected')}: {publicKey?.toString().slice(0, 8)}...
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-amber-500" />
                    <span className="text-sm text-amber-700 dark:text-amber-400">
                      {t('buyModal.connectWallet')}
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <DialogFooter className="flex flex-row gap-3 pt-4">
          <Button 
            variant="outline" 
            onClick={handleClose}
            disabled={isLoading}
            className="flex-1 h-10"
          >
            {t('buyModal.cancel')}
          </Button>
          <Button 
            variant="success"
            onClick={handleBuy}
            disabled={!connected || isLoading || !amountIn}
            className="flex-1 h-10"
          >
            {isLoading ? (
              <>
                <LoadingSpinner className="mr-2 h-4 w-4" />
                {t('buyModal.creating')}
              </>
            ) : (
              <>
                <Zap className="mr-2 h-4 w-4" />
                {t('buyModal.buyToken')}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BuyModal;
