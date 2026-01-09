package main

import (
	"flag"
	"fmt"
	"time"

	"dex/consumer/consumer"
	"dex/consumer/internal/config"
	"dex/consumer/internal/logic/mq"
	"dex/consumer/internal/logic/sol/block"
	"dex/consumer/internal/logic/sol/slot"
	"dex/consumer/internal/server"
	"dex/consumer/internal/svc"
	"dex/consumer/internal/ticker"

	"github.com/zeromicro/go-zero/core/conf"
	"github.com/zeromicro/go-zero/core/logx"
	"github.com/zeromicro/go-zero/core/proc"
	"github.com/zeromicro/go-zero/core/service"
	"github.com/zeromicro/go-zero/core/stat"
	"github.com/zeromicro/go-zero/zrpc"
	"google.golang.org/grpc"
	"google.golang.org/grpc/reflection"
)

var configFile = flag.String("f", "etc/consumer-local.yaml", "the config file")

func main() {
	flag.Parse()
	var c config.Config
	conf.MustLoad(*configFile, &c)
	config.SaveConf(c)

	proc.SetTimeToForceQuit(30 * time.Second)

	// logx.Infof("config consumer:%#v, redismodel: %#v,mysql:%#v, sol:%#v", c.Consumer, c.Redis, c.MySQLConfig, c.Sol)

	stat.DisableLog()

	sg := service.NewServiceGroup()
	defer sg.Stop()

	mq.NewKafka(mq.KqConf{
		Brokers:  c.KqSolTrades.Brokers,
		Group:    c.KqSolTrades.Group,
		CaFile:   c.KqSolTrades.CaFile,
		Username: c.KqSolTrades.Username,
		Password: c.KqSolTrades.Password,
	})

	{
		consumerCtx := svc.NewServiceContext(c)

		s := zrpc.MustNewServer(c.RpcServerConf, func(grpcServer *grpc.Server) {
			consumer.RegisterConsumerServer(grpcServer, server.NewConsumerServer(consumerCtx))

			if c.Mode == service.DevMode || c.Mode == service.TestMode {
				reflection.Register(grpcServer)
			}
		})
		sg.Add(s)
	}

	{
		ctx := svc.NewSolServiceContext(c)
		var realChan = make(chan uint64, 50)
		var historyChan = make(chan uint64, 50)
		// var errChan = make(chan uint64, 1)
		// var resumeChan = make(chan uint64, 50)

		// 消费者
		for i := 0; i < c.Consumer.Concurrency; i++ {
			fmt.Println("GetBlockFromHttp now ****************")

			sg.Add(block.NewBlockService(ctx, "block-real", realChan, i))
		}

		// // 存量
		// for i := 0; i < c.Consumer.Concurrency; i++ {
		// 	sg.Add(block.NewBlockService(ctx, "block-history", historyChan, i))
		// }

		// // 失败
		// for i := 0; i < 10; i++ {
		// 	sg.Add(block.NewBlockService(ctx, "block-error", errChan, i))
		// }

		// // 历史恢复
		// for i := 0; i < 50; i++ {
		// 	sg.Add(block.NewResumeBlockService(ctx, "block-resume", resumeChan, i))
		// }

		// 生产者
		sg.Add(slot.NewSlotServiceGroup(ctx, realChan, historyChan))

		solTicker := ticker.NewSolTicker(ctx)
		sg.Add(solTicker)
	}

	logx.Info("Starting consumer at ", c.ListenOn)
	sg.Start()
}
