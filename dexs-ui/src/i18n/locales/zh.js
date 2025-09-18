// 中文语言包
export const zh = {
  // 头部导航
  header: {
    navigation: {
      trenches: '战壕',
      newPair: '新交易对',
      trending: '趋势',
      copyTrade: '跟单交易',
      monitor: '监控',
      track: '添加流动性',
      holding: '持仓',
      createToken: '创建代币',
      createPool: '创建流动池',
      addLiquidity: '添加流动性',
      faucet: '水龙头',
      tokenSecurity: '代币安全'
    },
    faucet: {
      title: 'Solana 测试网水龙头'
    },
    search: {
      placeholder: '搜索代币/合约/钱包地址'
    },
    wallet: {
      connect: '连接钱包',
      disconnect: '断开连接',
      connecting: '连接中...'
    },
    buttons: {
      deposit: '存款',
      settings: '设置'
    },
    network: {
      solana: 'SOL'
    }
  },

  // 代币列表
  tokenList: {
    title: 'Token Trenches',
    tabs: {
      pumpfun: 'PumpFun 代币',
      clmm: 'CLMM 代币'
    },
    columns: {
      newCreations: '新创建',
      completing: '完成中',
      completed: '已完成'
    },
    status: {
      lastUpdated: '最后更新',
      live: '实时',
      offline: '离线',
      connecting: '连接中...'
    },
    buttons: {
      manualRefresh: '手动刷新',
      mockMode: '模拟模式',
      realMode: '真实模式',
      tryAgain: '重试',
      refresh: '刷新',
      enableMock: '开启模拟',
      disableMock: '关闭模拟'
    },
    loading: {
      loadingTokens: '加载代币中...',
      loadingPools: '加载流动池中...',
      loadingNewTokens: '加载新代币中...',
      loadingCompletingTokens: '加载即将完成的代币中...',
      loadingCompletedTokens: '加载已完成的代币中...',
      loadingV1Pools: '加载 V1 池子中...',
      loadingV2Pools: '加载 V2 池子中...'
    },
    empty: {
      noTokensFound: '未找到代币',
      noTokensDescription: '当前在devnet上没有可用的代币。',
      noClmmTokens: '未找到CLMM代币',
      noClmmDescription: '当前在devnet上没有可用的集中流动性代币。'
    },
    notifications: {
      newToken: '新代币'
    },
    sections: {
      newTokens: '新代币',
      almostBonded: '即将完成',
      migrated: '已迁移',
      clmmV1Pools: 'CLMM V1 池子',
      clmmV2Pools: 'CLMM V2 池子'
    },
    labels: {
      progress: '进度',
      tvl: 'TVL',
      apr: 'APR',
      volume24h: '24小时交易量',
      fees: '手续费',
      mockModeEnabled: 'Mock模式已启用'
    },
    selectOptions: {
      pumpfun: 'Pump.fun',
      clmm: 'CLMM'
    }
  },

  // 代币卡片
  tokenCard: {
    buttons: {
      buy: '购买',
      chart: '图表'
    },
    metrics: {
      marketCap: '市值',
      holders: '持有者',
      price: '价格',
      volume: '交易量'
    },
    status: {
      new: '新建',
      completing: '完成中',
      completed: '已完成'
    }
  },

  // 图表页面
  chart: {
    title: '图表',
    noTokenSelected: '没有选择代币',
    description: '请从代币列表中选择一个代币来查看图表',
    backToTokens: '返回代币列表'
  },

  // 功能占位页面
  features: {
    copyTrade: {
      title: '跟单交易',
      description: '跟单交易功能即将上线...'
    },
    monitor: {
      title: '监控',
      description: '监控功能即将上线...'
    },
    track: {
      title: '追踪',
      description: '追踪功能即将上线...'
    },
    holding: {
      title: '持仓',
      description: '持仓功能即将上线...'
    }
  },

  // 创建代币
  tokenCreation: {
    title: '创建代币',
    description: '在Solana网络上创建您的代币',
    subtitle: '🪙 代币创建工具'
  },

  // 创建流动池
  poolCreation: {
    title: '创建流动池',
    description: '为您的代币创建流动性池',
    subtitle: '🏊 流动池创建工具'
  },

  // 添加流动性
  addLiquidity: {
    title: '添加流动性',
    description: '向现有流动池添加流动性',
    subtitle: '💧 流动性管理工具'
  },

  // 水龙头
  faucet: {
    title: '水龙头',
    description: '获取测试代币',
    subtitle: '🚰 测试代币获取工具'
  },

  // 代币安全
  tokenSecurity: {
    title: '代币安全',
    description: '检查代币安全性',
    subtitle: '🛡️ 代币安全检查工具'
  },

  // 仪表板
  dashboard: {
    totalTokens: '总代币数',
    activeTraders: '活跃交易者',
    todayCompleted: '今日完成',
    totalVolume: '总交易量',
    fromLastMonth: '较上月',
    welcome: '欢迎来到 RichCode DEX',
    subtitle: '发现、交易和创建下一个热门代币',
    quickActions: '快速操作',
    startTrading: '开始交易',
    startTradingDesc: '浏览热门代币并开始交易',
    createToken: '创建代币',
    createTokenDesc: '创建您自己的代币项目',
    createPool: '创建池子',
    createPoolDesc: '为您的代币对创建流动性池',
    getStarted: '开始使用',
    trendingTokens: '热门代币',
    viewAll: '查看全部',
    trending: '热门',
    marketCap: '市值',
    liquidity: '流动性',
    recentTrades: '最新交易',
    topPools: '热门资金池',
    priceChart: '价格图表',
    recentTradesActivity: '实时交易活动',
    live: '实时',
    topPoolsTVL: '最高 TVL 资金池'
  },

  // 代币创建
  tokenCreation: {
    title: '创建代币',
    description: '在Solana网络上创建您的代币',
    subtitle: '🪙 代币创建工具',
    connectWallet: '请连接您的钱包以创建代币',
    deployToken: '部署您自己的SPL代币，具有高级功能',
    tokenName: '代币名称',
    symbol: '符号',
    decimals: '小数位数',
    initialSupply: '初始供应量',
    description: '描述',
    imageUrl: '图片URL',
    freezeAuthority: '冻结权限',
    freezeAuthorityDesc: '冻结代币账户的能力',
    updateAuthority: '更新权限',
    updateAuthorityDesc: '更新元数据的能力',
    transaction: '交易',
    tokenMint: '代币铸币',
    creatingToken: '创建代币中...',
    createTokenBtn: '🚀 创建代币',
    tokenCreated: '代币创建成功！',
    programSelector: '程序选择器',
    tokenProgram: '代币程序',
    token2022: 'Token-2022',
    token2022ComingSoon: '🚧 Token-2022 即将推出！目前使用代币程序。',
    classicTokenProgram: '🔒 经典代币程序（广泛支持）',
    tokenAuthorities: '🔐 代币权限',
    basicInfo: '基本信息',
    advancedSettings: '高级设置',
    formValidation: {
      nameRequired: '代币名称为必填项',
      symbolRequired: '代币符号为必填项',
      symbolTooLong: '符号长度不能超过10个字符',
      decimalsRange: '小数位数必须在0-9之间',
      supplyRequired: '供应量必须大于0',
      supplyTooLarge: '代币供应量过大。请减少供应量或小数位数。'
    },
    placeholders: {
      tokenName: '我的超棒代币',
      symbol: 'MAT',
      description: '描述您的代币...',
      imageUrl: 'https://example.com/image.png'
    },
    preview: {
      title: '代币预览',
      name: '名称',
      symbol: '符号',
      decimals: '小数位数',
      supply: '初始供应量',
      program: '程序',
      notSet: '未设置'
    },
    steps: {
      nextStep: '下一步：确认创建',
      confirmTitle: '确认代币创建',
      confirmDesc: '请仔细检查以下信息，创建后无法修改',
      tokenName: '代币名称',
      tokenSymbol: '代币符号',
      decimals: '小数位数',
      supply: '初始供应量',
      authorities: '权限设置',
      freezeAuth: '冻结权限',
      enabled: '启用',
      disabled: '禁用',
      warning: '重要提醒',
      warningText: '代币创建后无法修改基本信息。请确保所有信息正确无误。',
      backToEdit: '返回修改',
      successTitle: '您的代币已成功创建并部署到 Solana 网络',
      txHash: '交易哈希',
      tokenAddress: '代币地址',
      createAnother: '创建另一个代币',
      backToHome: '返回首页'
    },
    hints: {
      decimals: '小数位数决定代币的最小单位',
      supply: '初始铸造的代币数量'
    }
  },

  // 流动池创建
  poolCreation: {
    title: '创建流动池',
    description: '为您的代币创建流动性池',
    subtitle: '🏊 流动池创建工具',
    connectWallet: '请连接您的钱包以创建流动池',
    createPool: '为您的代币对创建集中流动性池',
    token0Address: 'Token 0 地址',
    token0Desc: '基础代币（通常是项目代币）',
    token1Address: 'Token 1 地址',
    token1Desc: '报价代币（通常是 SOL 或 USDC）',
    price: '价格（Token1 每 Token0）',
    priceDesc: '池子的初始汇率',
    openTime: '开放时间',
    currentTimeNotice: '使用当前时间开放池子',
    poolOpenDesc: '池子将立即开放交易',
    poolInfo: '池子信息',
    type: '类型',
    program: '程序',
    network: '网络',
    transactionId: '交易ID',
    debugInfo: '交易调试信息',
    creatingPool: '创建池子中...',
    createPoolBtn: '创建池子',
    placeholders: {
      token0: '例如：So11111111111111111111111111111111111111112',
      token1: '例如：EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
      price: '0.001'
    },
    newTitle: '创建 CLMM 池',
    newDescription: '为您的代币对创建集中流动性做市商池，享受更高效的资本利用率',
    backToDashboard: '返回仪表板',
    tokenPair: '代币对',
    selectTokens: '选择要创建流动性池的两个代币',
    token0Required: 'Token 0 地址 *',
    token1Required: 'Token 1 地址 *',
    initialPrice: '初始价格',
    setPriceDesc: '设置池子的初始汇率',
    priceRequired: '价格 (Token1 per Token0) *',
    feeTier: '手续费等级',
    selectFeeTier: '选择适合您代币对的手续费等级',
    selectFeeTierPlaceholder: '选择手续费等级',
    feeTiers: {
      tier1: '0.01% - 稳定币',
      tier1Desc: '最适合稳定币对',
      tier5: '0.05% - 低波动',
      tier5Desc: '适合相关资产',
      tier30: '0.3% - 标准',
      tier30Desc: '大多数交易对',
      tier100: '1% - 高波动',
      tier100Desc: '高风险资产'
    },
    tickSpacing: 'Tick 间距',
    launchSettings: '启动设置',
    poolOpenSettings: '池子的开放时间设置',
    useCurrentTime: '使用当前时间开放池子',
    immediateOpen: '池子将立即开放进行交易',
    poolInfoTitle: '池子信息',
    wallet: '钱包',
    transactionSuccess: '交易成功',
    copied: '已复制',
    txIdCopied: '交易ID已复制到剪贴板',
    viewOnExplorer: '在 Solana Explorer 中查看',
    debugInfoTitle: '调试信息',
    errors: {
      walletNotConnected: '钱包未连接',
      connectWalletFirst: '请先连接您的钱包',
      formValidationFailed: '表单验证失败',
      token0Required: 'Token 0 地址是必需的',
      token1Required: 'Token 1 地址是必需的',
      tokensMustBeDifferent: '代币地址必须不同',
      priceRequired: '初始价格必须大于 0',
      createPoolFailed: '创建池子失败',
      transactionSent: '交易已发送',
      waitingConfirmation: '正在等待确认...',
      poolCreated: '池子创建成功！',
      transactionConfirmed: '交易已确认',
      transactionFailed: '交易失败',
      missingTxHash: 'API 响应中缺少交易哈希'
    }
  },

  // 代币安全
  tokenSecurity: {
    title: '代币安全',
    description: '检查代币安全性',
    subtitle: '🛡️ 代币安全检查工具',
    enterAddress: '输入 Solana SPL 代币铸币地址以检查其安全状态。',
    mintAddress: '铸币地址',
    decimals: '小数位数',
    initialized: '已初始化',
    mintAuthority: '铸币权限',
    freezeAuthority: '冻结权限',
    mintAuthoritySafe: '铸币权限安全',
    freezeAuthoritySafe: '冻结权限安全',
    securitySummary: '安全摘要',
    yes: '是',
    no: '否',
    none: '无',
    safe: '安全',
    risk: '风险',
    placeholder: '输入代币铸币地址...'
  },

  // 购买弹窗
  buyModal: {
    new: '新建',
    copyAddress: '复制地址',
    placeholder: {
      amount: '0.0001'
    },
    title: '购买',
    description: '输入您想要购买的 SOL 数量来交换此代币',
    address: '地址',
    marketCap: '市值',
    amount: '购买数量 (SOL)',
    transactionSignature: '交易签名',
    viewOnSolscan: '在 Solscan 上查看',
    walletConnected: '钱包已连接',
    connectWallet: '请先连接您的钱包',
    cancel: '取消',
    creating: '创建交易中...',
    buyToken: '购买代币'
  },

  // 添加流动性
  addLiquidity: {
    title: '添加流动性',
    description: '向现有流动池添加流动性',
    subtitle: '💧 流动性管理工具',
    enterPoolAddress: '输入池子地址（例如：Bevpu2aknCe7ZotQDRy2LgbG1gtU8S1BFwcpLPziy8af）',
    tokenAMint: '输入代币A铸币地址',
    tokenASymbol: '例如：SOL',
    tokenBMint: '输入代币B铸币地址',
    tokenBSymbol: '例如：USDC',
    priceRange: '例如：1.5',
    modalTitle: '添加流动性',
    modalDescription: '向CLMM池子添加流动性并赚取手续费',
    transactionSuccess: '交易成功！',
    transactionSignature: '交易签名',
    selectPool: '选择池子',
    selectFromList: '从列表选择',
    manualInput: '手动输入地址',
    selectPoolPlaceholder: '请选择池子',
    noPoolsAvailable: '暂无可用池子，请使用手动输入',
    poolAddress: '池子地址',
    poolAddressPlaceholder: '输入池子地址',
    autoFetching: '获取中...',
    autoFetchToken: '自动获取Token信息',
    poolDetails: '池子详情',
    showDetails: '显示详情',
    hideDetails: '隐藏详情',
    errors: {
      fetchPoolsFailed: '获取池子列表失败',
      fetchPoolDetailsFailed: '获取池子详情失败',
      poolNotFound: '未找到该池子账户或数据为空',
      autoFetchSuccess: '自动获取Token信息成功',
      fetchTokenInfoFailed: '获取池子Token信息失败',
      fillAllFields: '请填写所有必需的池子详情',
      invalidPrice: '请输入有效的价格',
      createPoolInfoFailed: '创建池子信息失败，请检查输入',
      connectWalletFirst: '请先连接钱包',
      walletNotSupported: '钱包不支持交易签名',
      fillAllRequired: '请填写所有必需字段',
      creatingTransaction: '正在创建交易...',
      apiError: 'API 错误',
      backendError: '错误 515: 后端服务出错。请检查钱包是否有足够的代币并已批准交易。',
      unknownError: '未知错误',
      noTransactionData: '服务器未返回交易数据',
      cannotDeserialize: '无法反序列化交易',
      decodeTransactionFailed: '解码交易失败',
      signTransactionFailed: '签名交易失败',
      sendingTransaction: '正在发送交易...',
      sendTransactionFailed: '发送交易失败',
      liquidityAddedSuccess: '流动性添加成功！',
      transactionProcessed: '流动性添加成功！交易已处理。',
      addLiquidityFailed: '添加流动性失败'
    }
  },

  // 页脚
  footer: {
    pumpTokens: 'RichCode DEX',
    telegramGroup: 'Telegram 群组',
    discordCommunity: 'Discord 社区',
    description: '发现、交易和创建下一个热门代币。基于 Solana 区块链的去中心化代币交易平台，为用户提供安全、快速、低成本的交易体验。',
    features: '功能',
    tradingHall: '交易大厅',
    copyTrade: '跟单交易',
    monitorPanel: '监控面板',
    trackingAnalysis: '追踪分析',
    positionManagement: '持仓管理',
    contactUs: '联系我们',
    technicalSupport: '技术支持',
    businessCooperation: '商务合作',
    ecosystem: '生态系统',
    solanaOfficial: 'Solana 官网',
    copyright: '© 2024 RichCode DEX. 保留所有权利。',
    privacyPolicy: '隐私政策',
    termsOfService: '服务条款',
    disclaimer: '免责声明',
    emailContact: '邮箱联系'
  },

  // 钱包调试器
  walletDebugger: {
    connectionStatus: '连接状态',
    connected: '✅ 已连接',
    disconnected: '❌ 未连接',
    wallet: '钱包',
    publicKey: '公钥',
    balance: '余额',
    rpcEndpoint: 'RPC 端点',
    readyState: '就绪状态',
    legacyTransactions: '传统交易：✅ 支持',
    warning: '⚠️ 警告：您的钱包可能不支持某些交易。建议使用 Phantom 或 Solflare。',
    walletObjectInfo: '钱包对象信息',
    capabilities: '功能',
    supportedTxVersions: '支持的交易版本',
    solanaVersion: 'Solana 版本',
    availableWallets: '可用钱包',
    consoleDetails: '按 F12 打开控制台查看更多详情'
  },

  // 图表
  tradingChart: {
    retryBtn: '重试',
    loadingData: '加载价格数据中...',
    noTokenSelected: '请从代币列表中选择一个代币来查看其价格图表'
  },

  // WebSocket 代币列表
  tokenListWebSocket: {
    disconnect: '断开连接',
    tokensListed: '已列出代币',
    messagesReceived: '已接收消息',
    newTokens: '新代币',
    updates: '更新',
    marketCap: '市值',
    holders: '持有者',
    launched: '启动',
    viewOnPumpfun: '在 Pump.fun 上查看'
  },

  // 设置
  settings: {
    title: '设置',
    language: {
      title: '语言',
      chinese: '中文',
      english: 'English',
      autoSave: '语言设置会自动保存'
    }
  },

  // 通用
  common: {
    loading: '加载中...',
    error: '错误',
    success: '成功',
    warning: '警告',
    info: '信息',
    close: '关闭',
    cancel: '取消',
    confirm: '确认',
    retry: '重试',
    all: '全部',
    filter: '筛选',
    export: '导出',
    help: '帮助',
    never: '从未',
    previous: '上一页',
    next: '下一页',
    page: '第',
    pageUnit: '页'
  }
};
