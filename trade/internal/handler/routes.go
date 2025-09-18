package handler

import (
	"net/http"

	v1 "dex/trade/internal/handler/v1"
	"dex/trade/internal/middleware"
	"dex/trade/internal/svc"

	"github.com/zeromicro/go-zero/rest"
)

func RegisterHandlers(server *rest.Server, serverCtx *svc.ServiceContext) {
	// Register user tokens and pools routes
	server.AddRoutes(
		[]rest.Route{
			{
				Method:  http.MethodGet,
				Path:    "/v1/market/user_tokens",
				Handler: middleware.Cors(v1.GetUserTokensHandler(serverCtx)),
			},
			{
				Method:  http.MethodPost,
				Path:    "/v1/market/store_user_token",
				Handler: middleware.Cors(v1.StoreUserTokenHandler(serverCtx)),
			},
			{
				Method:  http.MethodGet,
				Path:    "/v1/market/user_pools",
				Handler: middleware.Cors(v1.GetUserPoolsHandler(serverCtx)),
			},
			{
				Method:  http.MethodPost,
				Path:    "/v1/market/store_user_pool",
				Handler: middleware.Cors(v1.StoreUserPoolHandler(serverCtx)),
			},
		},
	)
}
