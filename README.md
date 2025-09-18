# RichCode DEX 项目架构与技术总结文档

## 项目概述

RichCode DEX 是一个基于微服务架构的去中心化交易平台，专注于 Solana 链上的代币交易和实时数据展示。项目采用现代化的技术栈，支持实时链上数据解析、代币交易、WebSocket 实时通信等功能。

## 技术栈总览

### 后端技术栈
- **编程语言**: Go 1.24.2
- **微服务框架**: go-zero (gRPC + HTTP REST)
- **数据库**: MySQL (主从配置)
- **缓存**: Redis
- **消息队列**: Kafka
- **区块链交互**: Solana Web3.js SDK, solana-go-sdk
- **实时通信**: WebSocket, gRPC
- **容器化**: Docker & Docker Compose

### 前端技术栈
- **框架**: React 18.2.0
- **构建工具**: Create React App + CRACO
- **样式**: TailwindCSS 3.4.17
- **UI组件**: Radix UI, Lucide React
- **图表**: Lightweight Charts, Recharts
- **钱包集成**: Solana Wallet Adapter
- **动画**: Framer Motion
- **国际化**: 自定义 i18n 实现

## 项目结构分析

### 根目录结构
```
rc_dex/
├── consumer/           # 消费者服务 - 链上数据解析
├── dataflow/          # 数据流服务 - Kafka消息处理
├── gateway/           # 网关服务 - API统一入口
├── market/            # 市场数据服务 - 代币信息与K线
├── trade/             # 交易服务 - 订单处理与执行
├── websocket/         # WebSocket服务 - 实时数据推送
├── model/             # 数据模型定义
├── dexs-ui/    # React前端应用
├── internal/          # 共享内部包
├── pkg/               # 共享工具包
└── scripts/           # 部署脚本
```

## 核心微服务详解

### 1. Consumer 消费者服务 (端口: 8081)

**主要职责**:
- 实时解析 Solana 链上区块数据
- 监听代币创建、交易等事件
- 通过 Kafka 分发数据到其他服务

**核心模块**:
- `internal/logic/sol/block/`: 区块数据解析逻辑
- `internal/logic/sol/slot/`: Slot 数据处理
- `internal/logic/pump/`: Pump.fun 协议处理
- `internal/logic/mq/`: Kafka 消息队列处理

**技术特点**:
- 支持多并发处理 (可配置并发数)
- WebSocket 连接 Solana RPC 节点
- 实时区块数据解析和事件提取
- 支持 Pump.fun、Raydium 等多种 DEX 协议

### 2. Market 市场数据服务 (端口: 8082)

**主要职责**:
- 提供代币市场信息 (价格、市值、交易量等)
- K线数据计算与缓存
- 代币安全性检查
- 交易对信息管理

**核心模块**:
- `internal/cache/`: Redis 缓存管理，支持多种时间间隔的K线缓存
- `internal/logic/`: 各种市场数据查询逻辑
- `internal/ticker/`: 定时任务处理

**数据结构**:
- 支持 1m, 5m, 15m, 1h, 4h, 24h 等多种K线间隔
- 代币信息包含安全检查结果 (蜜罐检测、流动性锁定等)
- 支持 Pump.fun 和 Raydium CLMM/CPMM 池信息

### 3. Trade 交易服务 (端口: 8084)

**主要职责**:
- 处理用户交易订单 (市价单、限价单、移动止损)
- 构造 Solana 交易
- 订单状态管理
- 流动性添加功能

**核心模块**:
- `internal/chain/solana/`: Solana 链交互逻辑
- `internal/proclimitorder/`: 限价单和移动止损处理
- `internal/logic/`: 各种交易逻辑实现

**交易类型支持**:
- 市价单 (Market Order)
- 限价单 (Limit Order)
- 按市值限价单 (Token Cap Limit)
- 移动止损 (Trailing Stop)
- 流动性添加 (Add Liquidity)

**技术特点**:
- 使用 Disruptor 模式处理高并发订单
- 支持 Jito MEV 保护
- 集成多种 Solana 钱包

### 4. Gateway 网关服务 (端口: 8083)

**主要职责**:
- 统一 API 入口
- 请求路由和负载均衡
- CORS 处理
- 认证和授权

**技术特点**:
- 基于 go-zero gateway
- 自动 gRPC 到 HTTP 转换
- 支持 Protocol Buffers 反射
- 统一错误处理和响应格式

### 5. WebSocket 服务 (端口: 8085)

**主要职责**:
- 实时代币数据推送
- K线数据实时更新
- 新代币上线通知

**核心功能**:
- 基于 Redis Pub/Sub 的消息分发
- 支持按交易对订阅
- 心跳保活机制
- 自动重连处理

### 6. DataFlow 数据流服务

**主要职责**:
- Kafka 消息消费
- K线数据计算
- 数据持久化到 MySQL 和 Redis

**核心模块**:
- `internal/mqs/`: Kafka 消费者实现
- `internal/logic/kline/`: K线计算逻辑
- `internal/cache/`: 缓存管理

## 数据模型设计

### 核心数据表

**代币相关**:
- `token_model`: 代币基础信息
- `pair_model`: 交易对信息
- `pump_amm_info_model`: Pump.fun AMM 信息

**交易相关**:
- `trade_model`: 交易记录
- `trade_order_model`: 订单信息
- `trade_order_log_model`: 订单日志

**池子相关**:
- `raydium_pool_model`: Raydium 池信息
- `clmm_pool_info_v1_model`: CLMM V1 池信息
- `clmm_pool_info_v2_model`: CLMM V2 池信息
- `cpmm_pool_info_model`: CPMM 池信息

**用户相关**:
- `user_tokens_model`: 用户代币持仓
- `user_pools_model`: 用户流动性池

## 前端架构分析

### 技术架构
- **状态管理**: React Hooks + Context API
- **路由**: React Router (推测)
- **样式系统**: TailwindCSS + CSS Modules
- **组件库**: 自定义组件 + Radix UI
- **图表**: Lightweight Charts (TradingView 风格)

### 核心功能模块

**交易界面**:
- `TradingViewChart.js`: K线图表组件
- `BuyModal.jsx`: 买入弹窗
- `TokenSecurity.js`: 代币安全检查

**流动性管理**:
- `AddLiquidity.js`: 添加流动性
- `MyPools.js`: 我的流动性池
- `PoolCreation.js`: 创建流动性池

**代币管理**:
- `TokenCreation.js`: 代币创建
- `TokenListNew.js`: 代币列表
- `MyTokens.js`: 我的代币

**实时数据**:
- `TokenListWithWebSocket.jsx`: WebSocket 集成的代币列表
- `useTokenListWebSocket.js`: WebSocket Hook

### UI/UX 特色
- 响应式设计，支持移动端
- 暗色主题支持
- 动画效果 (Framer Motion)
- 国际化支持 (中英文)
- 实时数据更新

## 通信架构

### 服务间通信
```
Frontend (React) 
    ↓ HTTP REST API
Gateway Service
    ↓ gRPC
[Market, Trade, Consumer] Services
    ↓ Kafka/Redis
DataFlow Service
    ↓ MySQL/Redis
Database Layer
```

### 实时数据流
```
Solana Blockchain
    ↓ WebSocket/RPC
Consumer Service
    ↓ Kafka
DataFlow Service
    ↓ Redis Pub/Sub
WebSocket Service
    ↓ WebSocket
Frontend
```

## 部署架构

### 开发环境
- 本地 Go 服务启动
- React 开发服务器
- Docker Compose 中间件 (MySQL, Redis, Kafka)

### 生产环境 (推测)
- Kubernetes 集群部署
- 负载均衡器
- 数据库主从配置
- Redis 集群
- Kafka 集群

## 安全特性

### 代币安全检查
- 蜜罐检测 (Honeypot Detection)
- 流动性锁定检查
- 铸币权限检查
- 冻结权限检查
- 税收机制检查

### 交易安全
- MEV 保护 (Jito 集成)
- 滑点保护
- 交易模拟
- 多重签名支持

## 性能优化

### 后端优化
- Redis 多级缓存
- 数据库读写分离
- Kafka 异步处理
- 连接池管理
- Disruptor 高性能队列

### 前端优化
- 组件懒加载
- WebSocket 连接复用
- 图表数据虚拟化
- 缓存策略

## 监控与日志

### 日志系统
- 结构化日志 (go-zero logx)
- 分级日志记录
- 链路追踪支持

### 监控指标
- 服务健康检查
- 性能指标收集
- 错误率监控

## 扩展性设计

### 水平扩展
- 微服务架构支持独立扩展
- 数据库分片支持
- 缓存集群支持

### 功能扩展
- 插件化 DEX 协议支持
- 多链支持架构
- 新交易类型扩展

## 开发规范

### 代码规范
- Go 标准代码规范
- gRPC 接口定义
- 数据库模型自动生成
- 前端 ESLint 规范

### 项目管理
- Git 版本控制
- 自动化部署脚本
- 环境配置管理

## 环境要求

### 系统要求

**推荐操作系统**: Ubuntu 20.04+ (强烈建议)
- Windows 系统可能存在路径处理等兼容性问题
- macOS 系统基本兼容，但建议使用 Linux

**硬件要求**:
- CPU: 4核心以上
- 内存: 8GB 以上 (推荐 16GB)
- 存储: 50GB 以上可用空间
- 网络: 稳定的互联网连接

### 软件依赖

**必需软件**:
- **Go**: 1.24.2 (精确版本要求)
- **Node.js**: 18.20.8
- **npm**: 最新版本 (或 yarn)
- **Docker**: 20.10+ 
- **Docker Compose**: 2.0+

**可选工具**:
- **Git**: 版本控制
- **Make**: 构建工具
- **protoc**: Protocol Buffers 编译器 (如需修改 .proto 文件)

### 端口要求

确保以下端口未被占用且防火墙已开放:
- **8081**: Consumer 服务
- **8082**: Market 服务  
- **8083**: Gateway 服务 (主要 API 入口)
- **8084**: Trade 服务
- **8085**: WebSocket 服务
- **8086**: DataFlow 服务
- **3001**: 前端应用 (生产环境)
- **3306**: MySQL 数据库
- **6379**: Redis 缓存
- **9092**: Kafka 消息队列

## 项目部署流程

### 方式一: 完整手动部署 (推荐用于开发)

#### 1. 环境准备

**安装 Go 1.24.2**:
```bash
# 下载并安装 Go 1.24.2
wget https://go.dev/dl/go1.24.2.linux-amd64.tar.gz
sudo rm -rf /usr/local/go && sudo tar -C /usr/local -xzf go1.24.2.linux-amd64.tar.gz
echo 'export PATH=$PATH:/usr/local/go/bin' >> ~/.bashrc
source ~/.bashrc
go version  # 验证安装
```

**安装 Node.js 18.20.8**:
```bash
# 使用 nvm 安装指定版本
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc
nvm install 18.20.8
nvm use 18.20.8
node --version  # 验证安装
```

**安装 Docker 和 Docker Compose**:
```bash
# 安装 Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# 安装 Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

#### 2. 项目获取与配置

```bash
# 克隆项目 (假设从 Git 仓库)
git clone <repository-url> fun_dex
cd fun_dex

# 安装 Go 依赖
go mod tidy
```

#### 3. 中间件服务启动

```bash
# 进入 docker 目录
cd docker

# 启动中间件服务 (MySQL, Redis, Kafka)
docker-compose up -d

# 验证服务状态
docker-compose ps

# 等待服务完全启动 (约 30-60 秒)
sleep 60

# 导入数据库结构 (如果有初始化脚本)
# ./import-sql.sh
```

#### 4. 配置文件修改

**重要**: 需要将配置文件中的 IP 地址替换为实际服务器 IP

```bash
# 全局搜索并替换 IP 地址
find . -type f -name "*.yaml" -o -name "*.json" -o -name "*.js" | xargs grep -l "118.194.235.63"
# 手动编辑这些文件，将 118.194.235.63 替换为你的服务器 IP

# 主要配置文件位置:
# - consumer/etc/consumer-local.yaml
# - market/etc/market-local.yaml  
# - trade/etc/trade-local.yaml
# - gateway/etc/gateway-local.yaml
# - websocket/etc/websocket-local.yaml
# - dexs-ui/src/ (前端配置文件)
```

#### 5. 后端服务启动

**按照依赖顺序启动服务**:

```bash
# 终端 1: 启动 Consumer 服务
cd consumer
go run consumer.go -f etc/consumer-local.yaml

# 终端 2: 启动 Market 服务  
cd market
go run market.go -f etc/market-local.yaml

# 终端 3: 启动 Trade 服务
cd trade  
go run trade.go -f etc/trade-local.yaml

# 终端 4: 启动 DataFlow 服务
cd dataflow
go run dataflow.go -f etc/dataflow-local.yaml

# 终端 5: 启动 Gateway 服务
cd gateway
go run gateway.go -f etc/gateway-local.yaml

# 终端 6: 启动 WebSocket 服务
cd websocket
go run token_websocket_server.go -f etc/websocket-local.yaml
```

#### 6. 前端应用部署

```bash
# 进入前端目录
cd dexs-ui

# 安装依赖
npm install

# 构建生产版本
npm run build

# 启动生产服务
npx serve -s build -l 3001

# 或者开发模式启动
# npm start
```

#### 7. 验证部署

```bash
# 检查服务状态
curl http://localhost:8083/health  # Gateway 健康检查
curl http://localhost:8085/health  # WebSocket 健康检查

# 检查前端应用
curl http://localhost:3001

# 检查数据库连接
docker exec -it mysql-db mysql -u root -p -e "SHOW DATABASES;"

# 检查 Redis 连接  
docker exec -it redis-cache redis-cli ping
```

### 方式二: 使用自动化脚本部署

项目提供了自动化部署脚本，可以一键启动所有服务:

```bash
# 使用项目提供的启动脚本
chmod +x start-pump-ui.sh
./start-pump-ui.sh

# 或者使用 Docker 脚本
cd docker
chmod +x start-docker.sh import-sql.sh
./start-docker.sh
./import-sql.sh
```

### 方式三: Docker Compose 完整部署

```bash
# 停止现有服务
docker-compose down

# 启动完整服务栈
docker-compose up -d

# 查看服务状态
docker-compose ps

# 查看日志
docker-compose logs -f
```

## 部署后验证

### 1. 服务健康检查

```bash
# 检查所有服务端口
netstat -tlnp | grep -E "(8081|8082|8083|8084|8085|8086|3001)"

# API 接口测试
curl -X GET "http://localhost:8083/api/v1/health"

# WebSocket 连接测试 (需要 wscat 工具)
# npm install -g wscat
# wscat -c "ws://localhost:8085/ws/kline?pair_address=test&chain_id=100000"
```

### 2. 功能验证

```bash
# 测试代币列表接口
curl "http://localhost:8083/market/GetPumpTokenList" \
  -H "Content-Type: application/json" \
  -d '{"chain_id":100000,"page_no":1,"page_size":10}'

# 测试交易接口
curl -X POST "http://localhost:8083/trade/TestRpc" \
  -H "Content-Type: application/json" \
  -d '{"message":"test","value":123}'
```

### 3. 日志监控

```bash
# 查看 Docker 服务日志
docker-compose logs -f mysql
docker-compose logs -f redis
docker-compose logs -f kafka

# 如果是手动启动的服务，查看对应终端输出
```

## 常见问题排查

### 1. 端口冲突
```bash
# 查找占用端口的进程
lsof -i :8083
# 杀死进程
kill -9 <PID>
```

### 2. 数据库连接失败
```bash
# 检查 MySQL 服务状态
docker exec -it mysql-db mysql -u root -p -e "SELECT 1"
# 检查配置文件中的数据库连接信息
```

### 3. Redis 连接失败
```bash
# 检查 Redis 服务状态  
docker exec -it redis-cache redis-cli ping
```

### 4. 前端构建失败
```bash
# 清理缓存重新安装
cd dexs-ui
rm -rf node_modules package-lock.json
npm install
npm run build
```

### 5. Go 模块依赖问题
```bash
# 清理模块缓存
go clean -modcache
go mod tidy
go mod download
```

## 性能优化建议

### 1. 生产环境配置
- 增加服务器内存到 16GB+
- 使用 SSD 存储
- 配置数据库主从复制
- 启用 Redis 持久化
- 配置 Nginx 反向代理

### 2. 监控告警
- 部署 Prometheus + Grafana
- 配置服务健康检查
- 设置关键指标告警
- 日志聚合分析

### 3. 安全加固
- 配置防火墙规则
- 启用 HTTPS
- 数据库访问控制
- API 限流保护

## 总结

RichCode DEX 是一个技术架构完善的去中心化交易平台，具有以下特点:

1. **微服务架构**: 职责清晰，易于维护和扩展
2. **实时性强**: WebSocket + Kafka 保证数据实时性
3. **性能优化**: 多级缓存 + 异步处理
4. **安全可靠**: 多重安全检查机制
5. **用户体验**: 现代化 UI + 实时数据更新
6. **可扩展性**: 支持多协议、多链扩展

该项目为 Solana 生态的 DeFi 应用提供了一个完整的解决方案，适合作为去中心化交易平台的参考实现。