package main

import (
	"flag"
	"fmt"

	"dex/market/internal/cache"
	"dex/market/internal/config"
	"dex/market/internal/server"
	"dex/market/internal/svc"
	"dex/market/internal/ticker"
	"dex/market/market"
	rds "dex/market/pkg/redis"

	"github.com/zeromicro/go-zero/core/conf"
	"github.com/zeromicro/go-zero/core/service"
	"github.com/zeromicro/go-zero/core/stores/redis"
	"github.com/zeromicro/go-zero/zrpc"
	"google.golang.org/grpc"
	"google.golang.org/grpc/reflection"
)

var configFile = flag.String("f", "etc/market-local.yaml", "the config file")

func main() {
	flag.Parse()

	var c config.Config
	conf.MustLoad(*configFile, &c)
	svcCtx := svc.NewServiceContext(c)
	rds.Init(&redis.RedisKeyConf{
		RedisConf: redis.RedisConf{
			Host:        c.Redis.Host,
			Type:        c.Redis.Type,
			Pass:        c.Redis.Pass,
			Tls:         c.Redis.Tls,
			PingTimeout: c.Redis.PingTimeout,
		},
	})
	cache.Init(svcCtx, nil)
	s := zrpc.MustNewServer(c.RpcServerConf, func(grpcServer *grpc.Server) {
		market.RegisterMarketServer(grpcServer, server.NewMarketServer(svcCtx))
		reflection.Register(grpcServer)
	})
	defer s.Stop()

	serviceGroup := service.NewServiceGroup()
	defer serviceGroup.Stop()

	{
		pumpTicker := ticker.NewPumpTicker(svcCtx)
		serviceGroup.Add(pumpTicker)
	}

	go func() {
		serviceGroup.Start()
	}()

	fmt.Printf("Starting rpc server at %s...\n", c.ListenOn)
	s.Start()
}
