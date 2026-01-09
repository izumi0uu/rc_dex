create table trade_order
(
    id               int auto_increment
        primary key,
    uid              int                                          not null,
    trade_type       tinyint                                      not null comment '1:market 2：limit  3:one_click 4:token_cap_limit 5:trailing_stop',
    chain_id         int                                          not null,
    token_ca         varchar(100)                                 not null,
    swap_type        tinyint                                      not null comment '1:buy 2:sell',
    wallet_index     tinyint                                      not null,
    wallet_address   varchar(100)                                 not null,
    is_auto_slippage tinyint(1)      default 0                    not null comment '是否自动滑点',
    slippage         int                                          not null,
    is_anti_mev      tinyint(1)                                   not null,
    gas_type         tinyint                                      not null comment '手续费类型 1 normal 2：fast 3：superspeed',
    status           tinyint                                      not null comment '1：wait 2:proc 3:onchain 4:fail 5:suc 6:cancel 7:timeout fail ',
    fail_reason      varchar(255)    default ''                   not null,
    double_out       tinyint(1)      default 0                    not null comment '是否翻倍出本 1:是 0:否',
    order_cap        decimal(32, 18) default 0.000000000000000000 not null comment '挂单市值 token的流动性市值',
    order_amount     decimal(32, 18)                              not null comment '挂单数量（付出的币种 买:base 卖:token）',
    order_price_base decimal(32, 18)                              not null comment '挂单价格 token对base的价格',
    order_value_base decimal(32, 18)                              not null comment '挂单总价 （base）买： 挂单数量   卖：挂单数量*挂单总价',
    order_base_price decimal(32, 18)                              not null comment 'base to usd',
    final_cap        decimal(32, 18) default 0.000000000000000000 not null comment '最终市值 token的流动性市值',
    final_amount     decimal(32, 18) default 0.000000000000000000 not null comment '最终数量（得到的币种 买:token 卖:base）',
    final_price_base decimal(32, 18) default 0.000000000000000000 not null comment '最终价格 token对base的价格',
    final_value_base decimal(32, 18) default 0.000000000000000000 not null comment '最终总价值（base）买：最终数量 * 最终价格   卖：最终数量',
    final_base_price decimal(32, 18)                              not null comment 'base to usd',
    gas_fee          decimal(32, 18)                              not null comment 'sol',
    priority_fee     decimal(32, 18) default 0.000000000000000000 not null comment 'sol',
    dex_fee          decimal(32, 18) default 0.000000000000000000 not null comment '花费币种',
    server_fee       decimal(32, 18) default 0.000000000000000000 not null comment 'sol',
    jito_fee         decimal(32, 18) default 0.000000000000000000 not null comment 'sol',
    tx_hash          varchar(100)    default ''                   not null,
    dex_name         varchar(20)                                  not null comment '交易时选取的交易所',
    pair_ca          varchar(100)                                 not null comment '交易时选取的交易池',
    created_at       timestamp       default CURRENT_TIMESTAMP    not null,
    updated_at       timestamp       default CURRENT_TIMESTAMP    not null on update CURRENT_TIMESTAMP,
    drawdown_price   decimal(32, 18) default 0.000000000000000000 not null comment '回撤触发价格',
    trailing_percent int             default 0                    not null comment '回撤百分比'
)
    charset = utf8mb4;

create index status_chain_id
    on trade_order (status, chain_id);

create index trade_order_created_at_uid_status_index
    on trade_order (created_at, uid, status);

create index user
    on trade_order (uid, status, trade_type);

