package config

import (
	"dex/pkg/constants"

	"github.com/chengfield/go-queue/kq"
	"github.com/zeromicro/go-zero/core/logx"
	"github.com/zeromicro/go-zero/zrpc"
)

var Cfg Config

var (
	SolRpcUseFrequency int
)

type Config struct {
	zrpc.RpcServerConf
	// database
	MySQLConfig      MySQLConfig        `json:"Mysql"`
	MarketService    zrpc.RpcClientConf `json:"market_service"`
	WebsocketService zrpc.RpcClientConf `json:"websocket_service"`
	TradeService     zrpc.RpcClientConf `json:"trade_service"`

	KqSolTrades kq.KqConf `json:"KqSolTrades,optional"`

	Consumer Consumer `json:"Consumer,optional"`

	Sol Chain `json:"Sol,optional"`
}

type Consumer struct {
	Concurrency int `json:"Concurrency" json:",env=CONSUMER_CONCURRENCY"`
}

type MySQLConfig struct {
	User     string `json:"User"     json:",env=MYSQL_USER"`
	Password string `json:"Password" json:",env=MYSQL_PASSWORD"`
	Host     string `json:"Host"     json:",env=MYSQL_HOST"`
	Port     int    `json:"Port"     json:",env=MYSQL_PORT"`
	DBName   string `json:"DBname"   json:",env=MYSQL_DBNAME"`
}

type Chain struct {
	ChainId    int64    `json:"ChainId"              json:",env=SOL_CHAINID"`
	NodeUrl    []string `json:"NodeUrl"              json:",env=SOL_NODEURL"`
	MEVNodeUrl string   `json:"MevNodeUrl,optional"  json:",env=SOL_MEVNODEURL"`
	WSUrl      string   `json:"WSUrl,optional"       json:",env=SOL_WSURL"`
	StartBlock uint64   `json:"StartBlock,optional"  json:",env=SOL_STARTBLOCK"`
}

func SaveConf(cf Config) {
	Cfg = cf
}

func FindChainRpcByChainId(chainId int) (rpc string) {
	var rpcs []string
	var useFrequency *int

	switch chainId {
	case constants.SolChainIdInt:
		rpcs = Cfg.Sol.NodeUrl
		useFrequency = &SolRpcUseFrequency
	default:
		logx.Error("No Rpc Config")
		return
	}

	if len(rpcs) == 0 {
		logx.Error("No Rpc Config")
		return
	}

	*useFrequency++
	index := *useFrequency % len(rpcs)
	rpc = rpcs[index]
	return
}
