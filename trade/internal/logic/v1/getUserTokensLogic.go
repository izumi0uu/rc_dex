package v1

import (
	"context"
	"dex/pkg/xcode"
	"dex/trade/internal/svc"
	"dex/trade/internal/types"
	"math"

	"solana/model"

	"github.com/zeromicro/go-zero/core/logx"
)

type GetUserTokensLogic struct {
	logx.Logger
	ctx    context.Context
	svcCtx *svc.ServiceContext
}

func NewGetUserTokensLogic(ctx context.Context, svcCtx *svc.ServiceContext) *GetUserTokensLogic {
	return &GetUserTokensLogic{
		Logger: logx.WithContext(ctx),
		ctx:    ctx,
		svcCtx: svcCtx,
	}
}

func (l *GetUserTokensLogic) GetUserTokens(req *types.GetUserTokensReq) (resp *types.GetUserTokensResp, err error) {
	l.Infof("GetUserTokens req: %+v", req)

	if req.WalletAddress == "" {
		return nil, xcode.New(xcode.ParamsError, "wallet_address is required")
	}

	// Create response object
	resp = &types.GetUserTokensResp{
		Code: 0,
		Msg:  "success",
		Data: struct {
			List      []types.UserTokenItem `json:"list"`
			TotalNum  int64                 `json:"total_num"`
			PageNo    int64                 `json:"page_no"`
			PageSize  int64                 `json:"page_size"`
			TotalPage int64                 `json:"total_page"`
		}{
			PageNo:   req.PageNo,
			PageSize: req.PageSize,
		},
	}

	// Calculate pagination
	offset := (req.PageNo - 1) * req.PageSize

	// Build query conditions
	db := l.svcCtx.UserTokensModel.WithSession(l.svcCtx.DB)
	q := db.conn.Model(&model.UserTokens{}).
		Where("user_wallet_address = ?", req.WalletAddress)

	if req.ChainId > 0 {
		q = q.Where("chain_id = ?", req.ChainId)
	}

	// Count total records
	var totalCount int64
	if err := q.Count(&totalCount).Error; err != nil {
		l.Errorf("Failed to get token count: %v", err)
		return nil, xcode.New(xcode.InternalError, "database error")
	}

	// Calculate total pages
	totalPages := int64(math.Ceil(float64(totalCount) / float64(req.PageSize)))
	resp.Data.TotalNum = totalCount
	resp.Data.TotalPage = totalPages

	// If no records, return early
	if totalCount == 0 {
		return resp, nil
	}

	// Query tokens with pagination
	var tokens []*model.UserTokens
	if err := q.Limit(int(req.PageSize)).Offset(int(offset)).
		Order("id DESC").Find(&tokens).Error; err != nil {
		l.Errorf("Failed to get tokens: %v", err)
		return nil, xcode.New(xcode.InternalError, "database error")
	}

	// Convert to response items
	items := make([]types.UserTokenItem, len(tokens))
	for i, token := range tokens {
		createdAt := int64(0)
		if !token.CreatedAt.IsZero() {
			createdAt = token.CreatedAt.Unix()
		}

		items[i] = types.UserTokenItem{
			Id:            token.Id,
			TokenAddress:  token.TokenAddress,
			TokenProgram:  token.TokenProgram,
			TokenName:     token.Name,
			TokenSymbol:   token.Symbol,
			TokenIcon:     token.Icon,
			TokenDecimals: token.Decimals,
			TokenSupply:   int64(token.TotalSupply),
			Description:   token.Description,
			TxHash:        token.TxHash,
			CreatedAt:     createdAt,
		}
	}

	resp.Data.List = items
	return resp, nil
}
