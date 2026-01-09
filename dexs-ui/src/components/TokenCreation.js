import React, { useState } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { 
  PublicKey, 
  Transaction, 
  SystemProgram,
  Keypair,
  LAMPORTS_PER_SOL
} from '@solana/web3.js';
import {
  createInitializeMintInstruction,
  createAssociatedTokenAccountInstruction,
  createMintToInstruction,
  getAssociatedTokenAddress,
  TOKEN_PROGRAM_ID,
  TOKEN_2022_PROGRAM_ID
} from '@solana/spl-token';
import './TokenCreation.css';

// Standard sizes for SPL Token accounts
const MINT_SIZE = 82; // Size of a mint account in bytes

const TokenCreation = () => {
  const { publicKey, connected, signTransaction, sendTransaction } = useWallet();
  const { connection } = useConnection();
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    symbol: '',
    decimals: 9,
    supply: 1000000,
    description: '',
    image: '',
    useToken2022: true,
    freezeAuthority: true,
    updateAuthority: true
  });
  
  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [txSignature, setTxSignature] = useState('');
  const [tokenMint, setTokenMint] = useState('');

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) return 'Token name is required';
    if (!formData.symbol.trim()) return 'Token symbol is required';
    if (formData.symbol.length > 10) return 'Symbol must be 10 characters or less';
    if (formData.decimals < 0 || formData.decimals > 9) return 'Decimals must be between 0-9';
    if (formData.supply <= 0) return 'Supply must be greater than 0';
    
    // Check if the final token amount would exceed JavaScript's safe integer limit
    const finalAmount = formData.supply * Math.pow(10, formData.decimals);
    if (finalAmount > Number.MAX_SAFE_INTEGER) {
      return 'Token supply is too large. Please reduce supply or decimals.';
    }
    
    return null;
  };

  const createToken = async () => {
    if (isLoading) return; // 防止并发
    setIsLoading(true);
    setError('');
    setSuccess('');
    setTxSignature('');
    setTokenMint('');
    console.log('createToken called at', new Date().toISOString());
    try {
      console.log('🚀 Starting token creation...');
      console.log('Form data:', formData);
      console.log('Connected wallet:', publicKey.toString());
      // Generate new mint keypair
      const mintKeypair = Keypair.generate();
      console.log('✅ Generated mint keypair:', mintKeypair.publicKey.toString());

      // For now, use Token Program (Token-2022 will be added later when packages support it)
      const tokenProgram = TOKEN_PROGRAM_ID;
      console.log('✅ Using token program:', tokenProgram.toString());
      
      // Calculate space needed for mint account  
      const mintSpace = MINT_SIZE;
      console.log('✅ Mint space calculated:', mintSpace);

      // Calculate rent
      const rentExemptBalance = await connection.getMinimumBalanceForRentExemption(mintSpace);
      console.log('✅ Rent exempt balance:', rentExemptBalance);

      // Get associated token account
      const associatedTokenAccount = await getAssociatedTokenAddress(
        mintKeypair.publicKey,
        publicKey,
        false,
        tokenProgram
      );
      console.log('✅ Associated token account:', associatedTokenAccount.toString());

      const transaction = new Transaction();
      console.log('✅ Transaction created');

      // Create mint account
      try {
        const createAccountIx = SystemProgram.createAccount({
          fromPubkey: publicKey,
          newAccountPubkey: mintKeypair.publicKey,
          space: mintSpace,
          lamports: rentExemptBalance,
          programId: tokenProgram,
        });
        transaction.add(createAccountIx);
        console.log('✅ Added create account instruction');
      } catch (err) {
        console.error('❌ Error creating account instruction:', err);
        throw new Error(`Failed to create account instruction: ${err.message}`);
      }

      // Initialize mint
      try {
        const freezeAuthority = formData.freezeAuthority ? publicKey : null;
        const initMintIx = createInitializeMintInstruction(
          mintKeypair.publicKey,    // mint
          formData.decimals,        // decimals
          publicKey,               // mintAuthority
          freezeAuthority          // freezeAuthority (can be null)
          // programId is optional (TOKEN_PROGRAM_ID by default)
        );
        transaction.add(initMintIx);
        console.log('✅ Added initialize mint instruction with decimals:', formData.decimals);
      } catch (err) {
        console.error('❌ Error creating initialize mint instruction:', err);
        throw new Error(`Failed to create initialize mint instruction: ${err.message}`);
      }

      // Create associated token account
      try {
        const createATAIx = createAssociatedTokenAccountInstruction(
          publicKey,           // payer
          associatedTokenAccount, // associatedToken
          publicKey,           // owner
          mintKeypair.publicKey   // mint
          // Note: TOKEN_PROGRAM_ID is default, ASSOCIATED_TOKEN_PROGRAM_ID is default
        );
        transaction.add(createATAIx);
        console.log('✅ Added create ATA instruction');
      } catch (err) {
        console.error('❌ Error creating ATA instruction:', err);
        throw new Error(`Failed to create ATA instruction: ${err.message}`);
      }

      // Mint initial supply
      try {
        const mintAmount = formData.supply * Math.pow(10, formData.decimals);
        console.log('💰 Mint amount calculated:', mintAmount);
        
        const mintToIx = createMintToInstruction(
          mintKeypair.publicKey,    // mint
          associatedTokenAccount,   // destination
          publicKey,               // authority (mint authority)
          mintAmount              // amount
          // multiSigners is optional (empty array by default)
          // programId is optional (TOKEN_PROGRAM_ID by default)
        );
        transaction.add(mintToIx);
        console.log('✅ Added mint to instruction');
      } catch (err) {
        console.error('❌ Error creating mint to instruction:', err);
        throw new Error(`Failed to create mint to instruction: ${err.message}`);
      }

      // Get latest blockhash
      try {
        const { blockhash } = await connection.getLatestBlockhash();
        transaction.recentBlockhash = blockhash;
        transaction.feePayer = publicKey;
        console.log('✅ Set blockhash and fee payer');
      } catch (err) {
        console.error('❌ Error getting blockhash:', err);
        throw new Error(`Failed to get latest blockhash: ${err.message}`);
      }

      // Sign and send transaction
      try {
        console.log('🖊️ Requesting wallet signature...');
        
        // Sign with mint keypair first
        transaction.partialSign(mintKeypair);
        console.log('✅ Partially signed with mint keypair');
        
        // Get wallet signature
        const signedTransaction = await signTransaction(transaction);
        console.log('✅ Transaction signed by wallet');
        console.log('Transaction signatures:', signedTransaction.signatures.map(s => s.publicKey.toString()));
        console.log('Transaction blockhash:', transaction.recentBlockhash);
        
        // Send with sendRawTransaction
        console.log('📡 Sending transaction...');
        const txid = await connection.sendRawTransaction(signedTransaction.serialize());
        await connection.confirmTransaction(txid, 'confirmed');
        console.log('✅ Transaction confirmed!');

        setSuccess('Token created successfully!');
        setTxSignature(txid);
        setTokenMint(mintKeypair.publicKey.toString());
      } catch (err) {
        console.error('❌ Error signing/sending transaction:', err);
        throw new Error(`Failed to sign or send transaction: ${err.message}`);
      }

    } catch (err) {
      console.error('Token creation error:', err);
      setError(`Failed to create token: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  if (!connected) {
    return (
      <div className="token-creation-container">
        <div className="wallet-not-connected">
          <h2>🔗 Connect Wallet</h2>
          <p>Please connect your wallet to create tokens</p>
        </div>
      </div>
    );
  }

  return (
    <div className="token-creation-container">
      <div className="token-creation-card">
        <div className="card-header">
          <h2>🪙 Create New Token</h2>
          <p>Deploy your own SPL token with advanced features</p>
        </div>

        <div className="form-section">
          <div className="program-selector">
            <label className="toggle-label">
              <input
                type="checkbox"
                name="useToken2022"
                checked={formData.useToken2022}
                onChange={handleInputChange}
              />
              <span className="toggle-slider"></span>
              <span className="toggle-text">
                {formData.useToken2022 ? '🆕 Token-2022' : '📜 Token Program'}
              </span>
            </label>
            <div className="program-info">
              {formData.useToken2022 ? (
                <span className="info-text">🚧 Token-2022 coming soon! Currently using Token Program.</span>
              ) : (
                <span className="info-text">🔒 Classic token program (widely supported)</span>
              )}
            </div>
          </div>

          <div className="input-grid">
            <div className="input-group">
              <label>Token Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="My Awesome Token"
                maxLength="32"
                disabled={isLoading}
              />
            </div>

            <div className="input-group">
              <label>Symbol *</label>
              <input
                type="text"
                name="symbol"
                value={formData.symbol}
                onChange={handleInputChange}
                placeholder="MAT"
                maxLength="10"
                disabled={isLoading}
              />
            </div>

            <div className="input-group">
              <label>Decimals</label>
              <input
                type="number"
                name="decimals"
                value={formData.decimals}
                onChange={handleInputChange}
                min="0"
                max="9"
                disabled={isLoading}
              />
            </div>

            <div className="input-group">
              <label>Initial Supply</label>
              <input
                type="number"
                name="supply"
                value={formData.supply}
                onChange={handleInputChange}
                min="1"
                disabled={isLoading}
              />
            </div>
          </div>

          {false && formData.useToken2022 && (
            <div className="input-group">
              <label>Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe your token..."
                rows="3"
                disabled={isLoading}
              />
            </div>
          )}

          {false && formData.useToken2022 && (
            <div className="input-group">
              <label>Image URL</label>
              <input
                type="url"
                name="image"
                value={formData.image}
                onChange={handleInputChange}
                placeholder="https://example.com/image.png"
                disabled={isLoading}
              />
            </div>
          )}

          <div className="authorities-section">
            <h3>🔐 Token Authorities</h3>
            <div className="authorities-grid">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="freezeAuthority"
                  checked={formData.freezeAuthority}
                  onChange={handleInputChange}
                  disabled={isLoading}
                />
                <span>🧊 Freeze Authority</span>
                <small>Ability to freeze token accounts</small>
              </label>

              {false && formData.useToken2022 && (
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="updateAuthority"
                    checked={formData.updateAuthority}
                    onChange={handleInputChange}
                    disabled={isLoading}
                  />
                  <span>✏️ Update Authority</span>
                  <small>Ability to update metadata</small>
                </label>
              )}
            </div>
          </div>

          {error && (
            <div className="error-message">
              ❌ {error}
            </div>
          )}

          {success && (
            <div className="success-message">
              ✅ {success}
              {txSignature && (
                <div className="tx-details">
                  <div><strong>Transaction:</strong> 
                    <a 
                      href={`https://explorer.solana.com/tx/${txSignature}?cluster=devnet`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {txSignature.slice(0, 8)}...{txSignature.slice(-8)}
                    </a>
                  </div>
                  {tokenMint && (
                    <div><strong>Token Mint:</strong> 
                      <a 
                        href={`https://explorer.solana.com/address/${tokenMint}?cluster=devnet`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {tokenMint.slice(0, 8)}...{tokenMint.slice(-8)}
                      </a>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          <div className="form-actions">
            <button
              className="create-token-btn"
              onClick={createToken}
              disabled={isLoading || !connected}
            >
              {isLoading ? (
                <>
                  <span className="spinner"></span>
                  Creating Token...
                </>
              ) : (
                <>
                  🚀 Create Token
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TokenCreation; 