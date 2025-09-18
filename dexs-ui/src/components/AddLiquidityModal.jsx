import React, { useState, useEffect } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { Transaction, VersionedTransaction, PublicKey } from '@solana/web3.js';
import { Buffer } from 'buffer';
import { Droplets, ArrowUpDown, Info, AlertCircle, CheckCircle2, ExternalLink, Settings, RefreshCw, Zap } from 'lucide-react';
import './AddLiquidityModal.css';

// Shadcn UI 组件
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from './UI/dialog';
import { Button } from './UI/Button';
import { Card, CardContent, CardHeader, CardTitle } from './UI/card';
import { EnhancedInput, FormField, NumberInput } from './UI/enhanced-input';
import { LoadingSpinner, LoadingWithText } from './UI/loading-spinner';
import { useTranslation } from '../i18n/LanguageContext';

// API URL configuration
const API_URL = '/api';

// 辅助函数：将金额转换为最小单位
function toSmallestUnit(amount) {
  const decimals = 6;
  if (typeof amount === 'string') amount = amount.trim();
  if (amount === '' || isNaN(amount)) return '0';
  return String(Math.floor(Number(amount) * Math.pow(10, decimals)));
}

const AddLiquidityModal = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const { publicKey, connected, signTransaction } = useWallet();
  const { connection } = useConnection();
  
  // 主要状态
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [txSignature, setTxSignature] = useState('');
  
  // 池子相关状态
  const [pools, setPools] = useState([]);
  const [selectedPool, setSelectedPool] = useState(null);
  const [poolInfo, setPoolInfo] = useState(null);
  
  // 输入方式状态
  const [useManualInput, setUseManualInput] = useState(false);
  const [manualPoolAddress, setManualPoolAddress] = useState('');
  const [showManualPoolDetails, setShowManualPoolDetails] = useState(false);
  
  // 手动池子详情
  const [manualTokenAAddress, setManualTokenAAddress] = useState('');
  const [manualTokenBAddress, setManualTokenBAddress] = useState('');
  const [manualTokenASymbol, setManualTokenASymbol] = useState('Token A');
  const [manualTokenBSymbol, setManualTokenBSymbol] = useState('Token B');
  const [manualCurrentPrice, setManualCurrentPrice] = useState('1');
  
  // 自动获取Token信息
  const [autoTokenA, setAutoTokenA] = useState('');
  const [autoTokenB, setAutoTokenB] = useState('');
  const [autoFetchLoading, setAutoFetchLoading] = useState(false);
  
  // 价格范围和金额
  const [priceRange, setPriceRange] = useState([0, 0]);
  const [inputToken, setInputToken] = useState('A');
  const [tokenAAmount, setTokenAAmount] = useState('');
  const [tokenBAmount, setTokenBAmount] = useState('');

  // 获取池子列表
  const fetchPools = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_URL}/v1/market/index_clmm?chain_id=100000&pool_version=1&page_no=1&page_size=50`);
      const data = await response.json();
      
      if (data && data.data && data.data.list) {
        setPools(data.data.list);
        if (data.data.list.length === 0) {
          setUseManualInput(true);
        }
      }
    } catch (error) {
      console.error('Error fetching pools:', error);
      setError('获取池子列表失败');
      setUseManualInput(true);
    } finally {
      setIsLoading(false);
    }
  };

  // 获取池子详情
  const fetchPoolDetails = async (poolId) => {
    try {
      setIsLoading(true);
      const pool = pools.find(p => p.pool_state === poolId);
      
      if (pool) {
        setPoolInfo({
          id: pool.pool_state,
          tokenA: {
            symbol: pool.token0_symbol || 'Token A',
            address: pool.token0_mint
          },
          tokenB: {
            symbol: pool.token1_symbol || 'Token B',
            address: pool.token1_mint
          },
          price: pool.price || 1,
          minPrice: pool.price * 0.5,
          maxPrice: pool.price * 2,
        });
        
        setPriceRange([pool.price * 0.8, pool.price * 1.2]);
      }
    } catch (error) {
      console.error('Error fetching pool details:', error);
      setError('获取池子详情失败');
    } finally {
      setIsLoading(false);
    }
  };

  // 自动获取Token信息
  const handleAutoFetchTokenInfo = async () => {
    if (!manualPoolAddress) return;
    
    setAutoFetchLoading(true);
    setError('');
    
    try {
      const poolPubkey = new PublicKey(manualPoolAddress.trim());
      const accountInfo = await connection.getAccountInfo(poolPubkey);
      
      if (!accountInfo || !accountInfo.data) {
        setError('未找到该池子账户或数据为空');
        return;
      }
      
      const data = accountInfo.data;
      const tokenMint0Bytes = data.slice(73, 105);
      const tokenMint1Bytes = data.slice(105, 137);
      const tokenMint0Pubkey = new PublicKey(tokenMint0Bytes).toBase58();
      const tokenMint1Pubkey = new PublicKey(tokenMint1Bytes).toBase58();
      
      setAutoTokenA(tokenMint0Pubkey);
      setAutoTokenB(tokenMint1Pubkey);
      setManualTokenAAddress(tokenMint0Pubkey);
      setManualTokenBAddress(tokenMint1Pubkey);
      setSuccess('自动获取Token信息成功');
    } catch (e) {
      setError(`获取池子Token信息失败: ${e.message}`);
    } finally {
      setAutoFetchLoading(false);
    }
  };

  // 计算另一个Token的数量
  const calculateOtherAmount = (amount, isTokenA) => {
    if (!poolInfo || !amount) return '';
    
    const price = poolInfo.price || 1;
    
    if (isTokenA) {
      return (parseFloat(amount) * price).toFixed(6);
    } else {
      return (parseFloat(amount) / price).toFixed(6);
    }
  };

  // 处理Token A数量变化
  const handleTokenAChange = (e) => {
    const value = e.target.value;
    setTokenAAmount(value);
    if (inputToken === 'A') {
      setTokenBAmount(calculateOtherAmount(value, true));
    }
  };

  // 处理Token B数量变化
  const handleTokenBChange = (e) => {
    const value = e.target.value;
    setTokenBAmount(value);
    if (inputToken === 'B') {
      setTokenAAmount(calculateOtherAmount(value, false));
    }
  };

  // 切换输入Token
  const switchInputToken = () => {
    setInputToken(inputToken === 'A' ? 'B' : 'A');
    if (inputToken === 'A' && tokenAAmount) {
      setTokenBAmount(calculateOtherAmount(tokenAAmount, true));
    } else if (inputToken === 'B' && tokenBAmount) {
      setTokenAAmount(calculateOtherAmount(tokenBAmount, false));
    }
  };

  // 创建手动池子信息
  const createManualPoolInfo = () => {
    if (!manualPoolAddress || !manualTokenAAddress || !manualTokenBAddress) {
      setError('请填写所有必需的池子详情');
      return;
    }
    
    try {
      const price = parseFloat(manualCurrentPrice);
      if (isNaN(price) || price <= 0) {
        setError('请输入有效的价格');
        return;
      }
      
      const poolInfo = {
        id: manualPoolAddress,
        tokenA: {
          symbol: manualTokenASymbol || 'Token A',
          address: manualTokenAAddress
        },
        tokenB: {
          symbol: manualTokenBSymbol || 'Token B',
          address: manualTokenBAddress
        },
        price: price,
        minPrice: price * 0.5,
        maxPrice: price * 2,
      };
      
      setPoolInfo(poolInfo);
      setPriceRange([price * 0.8, price * 1.2]);
      setError('');
      setShowManualPoolDetails(false);
    } catch (error) {
      console.error('Error creating pool info:', error);
      setError('创建池子信息失败，请检查输入');
    }
  };

  // 处理添加流动性
  const handleAddLiquidity = async () => {
    if (!connected || !publicKey) {
      setError('请先连接钱包');
      return;
    }

    if (!signTransaction) {
      setError('钱包不支持交易签名');
      return;
    }

    const currentPoolId = useManualInput ? manualPoolAddress : selectedPool;
    
    if (!currentPoolId || !tokenAAmount || !tokenBAmount) {
      setError('请填写所有必需字段');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccess('');
    setTxSignature('');

    try {
      // 创建交易
      setSuccess('正在创建交易...');
      
      const baseTokenIsA = inputToken === 'A';
      const baseAmount = baseTokenIsA ? tokenAAmount : tokenBAmount;
      const otherAmountMax = baseTokenIsA ? tokenBAmount : tokenAAmount;
      
      const tickLowerInt = Math.floor(Number(priceRange[0]) * 1e6);
      const tickUpperInt = Math.floor(Number(priceRange[1]) * 1e6);
      
      const apiPayload = {
        chain_id: 100000,
        pool_id: String(currentPoolId),
        tick_lower: tickLowerInt,
        tick_upper: tickUpperInt,
        base_token: baseTokenIsA ? 0 : 1,
        base_amount: baseAmount,
        other_amount_max: otherAmountMax,
        user_wallet_address: publicKey.toString(),
        token_a_address: poolInfo?.tokenA?.address || manualTokenAAddress,
        token_b_address: poolInfo?.tokenB?.address || manualTokenBAddress
      };

      const response = await fetch(`${API_URL}/trade/add_liquidity_v1`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apiPayload),
      });

      const data = await response.json();
      
      if (!response.ok) {
        setError(data.message || `API 错误 ${response.status}: ${response.statusText}`);
        return;
      }
      
      if (data.code && data.code !== 0 && data.code !== 10000) {
        if (data.code === 515) {
          setError(`错误 515: 后端服务出错。请检查钱包是否有足够的代币并已批准交易。`);
        } else {
          setError(`错误 ${data.code}: ${data.msg || '未知错误'}`);
        }
        return;
      }
      
      const txHash = data.data?.txHash || data.data?.tx_hash || data.txHash || data.tx_hash;
      
      if (!txHash) {
        setError('服务器未返回交易数据');
        return;
      }
      
      // 准备签名交易
      setSuccess('准备签名交易...');
      let transaction;
      let transactionBuffer;
      
      try {
        transactionBuffer = Buffer.from(txHash, 'base64');
        try {
          transaction = VersionedTransaction.deserialize(transactionBuffer);
        } catch (versionedError) {
          try {
            transaction = Transaction.from(transactionBuffer);
          } catch (legacyError) {
            setError('无法反序列化交易');
            return;
          }
        }
      } catch (decodeError) {
        setError(`解码交易失败: ${decodeError.message}`);
        return;
      }

      // 签名交易
      setSuccess('正在签名交易...');
      let signedTransaction;
      try {
        signedTransaction = await signTransaction(transaction);
      } catch (signError) {
        setError(`签名交易失败: ${signError.message}`);
        return;
      }

      // 发送交易
      setSuccess('正在发送交易...');
      try {
        const serializedTransaction = signedTransaction.serialize();
        let signature;
        
        try {
          signature = await connection.sendRawTransaction(serializedTransaction);
        } catch (sendError) {
          if (sendError.message && sendError.message.includes('already been processed')) {
            // 交易已处理，表示成功
            const timestamp = Date.now();
            const randomId = Math.random().toString(36).substring(2, 15);
            signature = `processed_${timestamp}_${randomId}`;
            
            setTxSignature(signature);
            setSuccess(`流动性添加成功！交易已处理。`);
            return;
          }
          
          setError(`发送交易失败: ${sendError.message}`);
          return;
        }
        
        setTxSignature(signature);
        setSuccess(`流动性添加成功！`);
      } catch (sendError) {
        setError(`发送交易失败: ${sendError.message}`);
        return;
      }
    } catch (error) {
      console.error('Error adding liquidity:', error);
      setError(`添加流动性失败: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // 重置表单
  const resetForm = () => {
    setSelectedPool(null);
    setManualPoolAddress('');
    setPoolInfo(null);
    setTokenAAmount('');
    setTokenBAmount('');
    setPriceRange([0, 0]);
    setError('');
    setSuccess('');
    setTxSignature('');
    setShowManualPoolDetails(false);
    setAutoTokenA('');
    setAutoTokenB('');
    setManualTokenAAddress('');
    setManualTokenBAddress('');
    setManualTokenASymbol('Token A');
    setManualTokenBSymbol('Token B');
    setManualCurrentPrice('1');
  };

  // 当模态框打开时获取池子列表
  useEffect(() => {
    if (isOpen) {
      fetchPools();
    } else {
      resetForm();
    }
  }, [isOpen]);

  // 当选择池子时获取详情
  useEffect(() => {
    if (selectedPool) {
      fetchPoolDetails(selectedPool);
    }
  }, [selectedPool]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Droplets className="h-5 w-5 text-primary" />
            {t('addLiquidity.modalTitle')}
          </DialogTitle>
          <DialogDescription>
            {t('addLiquidity.modalDescription')}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* 错误和成功消息 */}
          {error && (
            <Card className="border-destructive bg-destructive/10 message-card">
              <CardContent className="p-4">
                <div className="flex items-start gap-2 text-destructive">
                  <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span className="text-sm font-medium leading-relaxed">{error}</span>
                </div>
              </CardContent>
            </Card>
          )}

          {success && (
            <Card className="border-success bg-success/10 message-card">
              <CardContent className="p-4">
                <div className="flex items-start gap-2 text-success">
                  <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span className="text-sm font-medium leading-relaxed">{success}</span>
                </div>
              </CardContent>
            </Card>
          )}

          {txSignature && (
            <Card className="border-success bg-success/10">
              <CardContent className="p-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-success">
                    <CheckCircle2 className="h-4 w-4" />
                    <span className="text-sm font-medium">交易成功！</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span>交易签名:</span>
                    <a 
                      href={`https://solscan.io/tx/${txSignature}?cluster=devnet`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline flex items-center gap-1"
                    >
                      {txSignature.slice(0, 8)}...{txSignature.slice(-8)}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* 池子选择 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">选择池子</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* 输入方式切换 */}
              <div className="flex gap-2">
                <Button
                  variant={!useManualInput ? 'default' : 'outline'}
                  onClick={() => setUseManualInput(false)}
                  disabled={pools.length === 0}
                  className="flex-1"
                >
                  从列表选择
                </Button>
                <Button
                  variant={useManualInput ? 'default' : 'outline'}
                  onClick={() => setUseManualInput(true)}
                  className="flex-1"
                >
                  手动输入地址
                </Button>
              </div>

              {!useManualInput ? (
                <FormField label="选择池子">
                  <select 
                    className="w-full h-10 px-3 py-2 border border-input bg-background rounded-md text-sm"
                    onChange={(e) => setSelectedPool(e.target.value)}
                    value={selectedPool || ''}
                    disabled={pools.length === 0}
                  >
                    <option value="">请选择池子</option>
                    {pools.map(pool => (
                      <option key={pool.pool_state} value={pool.pool_state}>
                        {pool.token0_symbol}/{pool.token1_symbol}
                      </option>
                    ))}
                  </select>
                  {pools.length === 0 && (
                    <p className="text-sm text-muted-foreground mt-2">
                      暂无可用池子，请使用手动输入
                    </p>
                  )}
                </FormField>
              ) : (
                <div className="space-y-4">
                  <FormField label="池子地址">
                    <EnhancedInput
                      value={manualPoolAddress}
                      onChange={(e) => setManualPoolAddress(e.target.value)}
                      placeholder="输入池子地址"
                    />
                  </FormField>

                  <Button
                    onClick={handleAutoFetchTokenInfo}
                    disabled={!manualPoolAddress || autoFetchLoading}
                    variant="outline"
                    className="w-full"
                  >
                    {autoFetchLoading ? (
                      <LoadingWithText 
                        text="获取中..." 
                        direction="horizontal" 
                        size="sm"
                      />
                    ) : (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2" />
                        自动获取Token信息
                      </>
                    )}
                  </Button>

                  {(autoTokenA || autoTokenB) && (
                    <div className="text-xs space-y-1 p-3 bg-muted rounded-md">
                      {autoTokenA && <div>Token A: {autoTokenA}</div>}
                      {autoTokenB && <div>Token B: {autoTokenB}</div>}
                    </div>
                  )}

                  {showManualPoolDetails && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">手动输入池子详情</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <FormField label="Token A 地址">
                            <EnhancedInput
                              value={manualTokenAAddress}
                              onChange={(e) => setManualTokenAAddress(e.target.value)}
                              placeholder="Token A mint 地址"
                            />
                          </FormField>
                          <FormField label="Token A 符号">
                            <EnhancedInput
                              value={manualTokenASymbol}
                              onChange={(e) => setManualTokenASymbol(e.target.value)}
                              placeholder="如: SOL"
                            />
                          </FormField>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <FormField label="Token B 地址">
                            <EnhancedInput
                              value={manualTokenBAddress}
                              onChange={(e) => setManualTokenBAddress(e.target.value)}
                              placeholder="Token B mint 地址"
                            />
                          </FormField>
                          <FormField label="Token B 符号">
                            <EnhancedInput
                              value={manualTokenBSymbol}
                              onChange={(e) => setManualTokenBSymbol(e.target.value)}
                              placeholder="如: USDC"
                            />
                          </FormField>
                        </div>

                        <FormField label="当前价格 (Token B / Token A)">
                          <NumberInput
                            value={manualCurrentPrice}
                            onChange={(e) => setManualCurrentPrice(e.target.value)}
                            placeholder="如: 1.5"
                            step="0.000001"
                            min="0.000001"
                          />
                        </FormField>

                        <Button onClick={createManualPoolInfo} className="w-full">
                          确认池子详情
                        </Button>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* 池子信息和操作 */}
          {poolInfo && (
            <>
              {/* 价格范围设置 */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">设置价格范围</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField label="最低价格">
                      <NumberInput
                        value={priceRange[0]}
                        onChange={(e) => setPriceRange([parseFloat(e.target.value) || 0, priceRange[1]])}
                      />
                    </FormField>
                    <FormField label="最高价格">
                      <NumberInput
                        value={priceRange[1]}
                        onChange={(e) => setPriceRange([priceRange[0], parseFloat(e.target.value) || 0])}
                      />
                    </FormField>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Info className="h-4 w-4" />
                      <span>
                        当前价格: {poolInfo.price} {poolInfo.tokenB.symbol}/{poolInfo.tokenA.symbol}
                      </span>
                    </div>
                    
                    {/* 价格范围预览 */}
                    <div className="p-3 bg-muted/50 rounded-md">
                      <div className="text-xs text-muted-foreground mb-1">价格范围预览</div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium text-blue-600">
                          {priceRange[0].toFixed(6)}
                        </span>
                        <div className="flex-1 mx-3 h-1 bg-gradient-to-r from-blue-500 via-green-500 to-blue-500 rounded-full"></div>
                        <span className="font-medium text-blue-600">
                          {priceRange[1].toFixed(6)}
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1 text-center">
                        范围宽度: {((priceRange[1] - priceRange[0]) / poolInfo.price * 100).toFixed(2)}%
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Token数量输入 */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">输入Token数量</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <FormField label={poolInfo.tokenA.symbol}>
                      <NumberInput
                        value={tokenAAmount}
                        onChange={handleTokenAChange}
                        disabled={inputToken !== 'A'}
                        placeholder={`输入 ${poolInfo.tokenA.symbol} 数量`}
                      />
                    </FormField>
                    
                    <div className="flex justify-center">
                      <Button
                        onClick={switchInputToken}
                        variant="outline"
                        size="icon"
                        className="rounded-full token-switch-button hover:bg-primary/10 transition-all duration-300"
                        title="切换输入Token"
                      >
                        <ArrowUpDown className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <FormField label={poolInfo.tokenB.symbol}>
                      <NumberInput
                        value={tokenBAmount}
                        onChange={handleTokenBChange}
                        disabled={inputToken !== 'B'}
                        placeholder={`输入 ${poolInfo.tokenB.symbol} 数量`}
                      />
                    </FormField>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>

        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            取消
          </Button>
          <Button
            onClick={handleAddLiquidity}
            disabled={
              !poolInfo || 
              !tokenAAmount || 
              !tokenBAmount || 
              priceRange[0] >= priceRange[1] || 
              isLoading ||
              !connected
            }
            className="flex items-center gap-2 min-w-[140px]"
            title={
              !connected ? '请先连接钱包' :
              !poolInfo ? '请先选择池子' :
              !tokenAAmount || !tokenBAmount ? '请输入Token数量' :
              priceRange[0] >= priceRange[1] ? '价格范围无效' :
              '点击添加流动性'
            }
          >
            {isLoading ? (
              <>
                <LoadingSpinner size="sm" />
                处理中...
              </>
            ) : (
              <>
                {connected ? (
                  <Droplets className="h-4 w-4" />
                ) : (
                  <Zap className="h-4 w-4" />
                )}
                {connected ? '添加流动性' : '连接钱包'}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddLiquidityModal;
