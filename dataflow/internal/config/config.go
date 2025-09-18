package config

import (
	datakline "dex/dataflow/dataflow"

	"github.com/SpectatorNan/gorm-zero/gormc/config/mysql"
	"github.com/chengfield/go-queue/kq"
	"github.com/zeromicro/go-zero/zrpc"
)

type Config struct {
	zrpc.RpcServerConf
	KqSolConf kq.KqConf `json:"KqSol"`
	Mysql     MysqlConf
}

type MysqlConf struct {
	Master mysql.Mysql   `json:"Master"`
	Slave  []mysql.Mysql `json:"Slave,optional"`
}

var KlineProcessedCh = make(chan *datakline.Kline, 10000)
