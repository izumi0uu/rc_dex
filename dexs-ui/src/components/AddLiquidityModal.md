# AddLiquidity 模态框组件

## 概述

`AddLiquidityModal` 是一个使用 shadcn UI 组件库构建的现代化流动性添加模态框，用于向 CLMM（Concentrated Liquidity Market Maker）池子添加流动性。

## 功能特性

### 🎨 UI/UX 特性
- ✅ 使用 shadcn UI 组件，保持设计一致性
- ✅ 响应式设计，支持移动端和桌面端
- ✅ 流畅的动画和过渡效果
- ✅ 直观的价格范围可视化
- ✅ 清晰的错误和成功状态提示

### 🔧 功能特性
- ✅ 支持从池子列表选择或手动输入池子地址
- ✅ 自动获取池子的 Token 信息
- ✅ 智能价格范围设置
- ✅ Token 数量自动计算
- ✅ 完整的 Solana 交易处理流程
- ✅ 钱包集成和交易签名

### 🛡️ 安全特性
- ✅ 输入验证和错误处理
- ✅ 交易状态跟踪
- ✅ 失败重试机制
- ✅ 安全的交易序列化和反序列化

## 使用方法

### 基本用法

```jsx
import AddLiquidityModal from './components/AddLiquidityModal';

function MyComponent() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div>
      <button onClick={() => setIsModalOpen(true)}>
        添加流动性
      </button>
      
      <AddLiquidityModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
```

### 集成到 Header

该组件已集成到 `HeaderNew.js` 中：

```jsx
// 在 HeaderNew.js 中
const [isAddLiquidityModalOpen, setIsAddLiquidityModalOpen] = useState(false);

// Track 菜单项配置
{ 
  id: 'track', 
  label: t('header.navigation.track'), 
  icon: BarChart3,
  onClick: () => setIsAddLiquidityModalOpen(true)
}

// 模态框组件
<AddLiquidityModal 
  isOpen={isAddLiquidityModalOpen}
  onClose={() => setIsAddLiquidityModalOpen(false)}
/>
```

## 组件结构

### Props

| 属性 | 类型 | 必需 | 描述 |
|------|------|------|------|
| `isOpen` | boolean | ✅ | 控制模态框显示/隐藏 |
| `onClose` | function | ✅ | 关闭模态框的回调函数 |

### 状态管理

组件内部管理以下状态：

- **池子相关**: `pools`, `selectedPool`, `poolInfo`
- **输入方式**: `useManualInput`, `manualPoolAddress`
- **Token 信息**: `tokenAAmount`, `tokenBAmount`, `priceRange`
- **UI 状态**: `isLoading`, `error`, `success`, `txSignature`

## 工作流程

### 1. 池子选择
- 用户可以从预加载的池子列表中选择
- 或者手动输入池子地址
- 支持自动获取池子的 Token 信息

### 2. 价格范围设置
- 显示当前池子价格
- 用户设置最低和最高价格
- 实时预览价格范围宽度

### 3. Token 数量输入
- 支持以任一 Token 为基准输入
- 自动计算另一 Token 的数量
- 一键切换输入 Token

### 4. 交易处理
- 创建交易请求
- 钱包签名确认
- 发送交易到网络
- 显示交易结果

## API 集成

### 后端接口

```javascript
// 获取池子列表
GET /api/v1/market/index_clmm?chain_id=100000&pool_version=1&page_no=1&page_size=50

// 添加流动性
POST /api/trade/add_liquidity_v1
{
  "chain_id": 100000,
  "pool_id": "pool_address",
  "tick_lower": 800000,
  "tick_upper": 1200000,
  "base_token": 0,
  "base_amount": "1.0",
  "other_amount_max": "100.0",
  "user_wallet_address": "wallet_address",
  "token_a_address": "token_a_mint",
  "token_b_address": "token_b_mint"
}
```

### Solana 集成

- 使用 `@solana/wallet-adapter-react` 进行钱包集成
- 支持 VersionedTransaction 和 Legacy Transaction
- 自动处理交易序列化和反序列化

## 样式定制

### CSS 类

- `.message-card`: 消息卡片动画
- `.token-switch-button`: Token 切换按钮动画
- `.price-range-slider`: 价格范围滑块样式
- `.loading-pulse`: 加载状态脉冲动画

### 主题支持

组件完全支持 shadcn 的主题系统：

- 自动适应深色/浅色主题
- 使用 CSS 变量进行颜色管理
- 响应式断点支持

## 错误处理

### 常见错误场景

1. **钱包未连接**: 提示用户连接钱包
2. **池子不存在**: 显示错误信息，建议手动输入
3. **Token 数量无效**: 实时验证输入
4. **价格范围无效**: 检查范围合理性
5. **交易失败**: 显示详细错误信息

### 错误恢复

- 自动重试机制
- 清晰的错误提示
- 用户友好的解决方案建议

## 性能优化

- 使用 `useEffect` 优化 API 调用
- 防抖输入处理
- 组件懒加载
- 内存泄漏防护

## 测试

运行测试组件：

```jsx
import AddLiquidityModalTest from './AddLiquidityModal.test';
```

## 未来改进

- [ ] 添加价格图表可视化
- [ ] 支持多种手续费层级
- [ ] 添加流动性预估收益计算
- [ ] 支持批量操作
- [ ] 添加更多动画效果

## 依赖

- React 18+
- @solana/wallet-adapter-react
- @solana/web3.js
- @radix-ui/react-dialog
- lucide-react
- class-variance-authority

## 许可证

MIT License
