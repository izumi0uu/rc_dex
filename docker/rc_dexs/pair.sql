create table pair
(
    id                               bigint auto_increment
        primary key,
    chain_id                         int             default 1                    not null comment 'Chain ID',
    address                          varchar(50)     default ''                   not null comment 'Trading pair address',
    name                             varchar(255)                                 not null comment 'DEX factory version swap name',
    factory_address                  varchar(50)     default ''                   not null comment 'Factory contract address',
    base_token_address               varchar(50)     default ''                   not null comment 'Base token address',
    token_address                    varchar(50)     default ''                   not null comment 'Token address',
    base_token_symbol                varchar(50)     default ''                   not null comment 'Base token symbol',
    token_symbol                     varchar(50)     default ''                   not null comment 'Token symbol',
    base_token_decimal               tinyint(1)      default 0                    not null comment 'Base token decimals',
    token_decimal                    tinyint(1)      default 0                    not null comment 'Token decimals',
    base_token_is_native_token       tinyint(1)      default 0                    not null comment 'Is base token native currency',
    base_token_is_token0             tinyint(1)      default 0                    not null comment 'Is base token token0',
    init_base_token_amount           decimal(64, 18) default 0.000000000000000000 not null comment 'Initial base token liquidity',
    init_token_amount                decimal(64, 18) default 0.000000000000000000 not null comment 'Initial token liquidity',
    current_base_token_amount        decimal(64, 18) default 0.000000000000000000 not null comment 'Current base token liquidity',
    current_token_amount             decimal(64, 18) default 0.000000000000000000 not null comment 'Current token liquidity',
    fdv                              double          default 0                    not null comment 'Fully diluted valuation',
    mkt_cap                          decimal(64, 18) default 0.000000000000000000 not null comment 'Market capitalization',
    token_price                      decimal(64, 18) default 0.000000000000000000 not null comment 'Token price',
    base_token_price                 decimal(64, 18) default 0.000000000000000000 not null comment 'Base token price',
    block_num                        int             default 0                    not null comment 'Creation block height',
    block_time                       timestamp       default CURRENT_TIMESTAMP    not null on update CURRENT_TIMESTAMP comment 'Creation block timestamp',
    created_at                       timestamp       default CURRENT_TIMESTAMP    not null,
    updated_at                       timestamp       default CURRENT_TIMESTAMP    not null on update CURRENT_TIMESTAMP,
    deleted_at                       timestamp                                    null,
    highest_token_price              decimal(64, 18) default 0.000000000000000000 not null comment 'Highest token price',
    latest_trade_time                timestamp       default CURRENT_TIMESTAMP    not null comment 'Latest on-chain trade timestamp',
    pump_point                       decimal(64, 18) default 0.000000000000000000 not null comment 'Pump score',
    launch_pad_point                 double          default 0                    null comment 'LaunchPad progress',
    pump_launched                    tinyint(1)      default 0                    not null comment 'Pump launched (0: false, 1: true)',
    pump_market_cap                  decimal(64, 18) default 0.000000000000000000 not null comment 'Pump market cap',
    pump_owner                       varchar(50)     default ''                   not null comment 'Pump owner address',
    pump_swap_pair_addr              varchar(50)     default ''                   not null comment 'Pump swap pair address',
    pump_virtual_base_token_reserves decimal(64, 18) default 0.000000000000000000 not null comment 'Pump virtual base token reserves',
    pump_virtual_token_reserves      decimal(64, 18) default 0.000000000000000000 not null comment 'Pump virtual token reserves',
    pump_status                      tinyint         default 0                    not null comment 'Pump status',
    pump_pair_addr                   varchar(50)     default ''                   not null comment 'Pump pair address',
    slot                             bigint          default 0                    not null,
    liquidity                        decimal(64, 18) default 0.000000000000000000 not null comment 'Liquidity',
    launch_pad_status                int             default 0                    not null comment 'LaunchPad status: 0-not launchpad, 1-new creation, 2-completing, 3-completed',
    constraint chain_id_address_index
        unique (chain_id, address)
)
    comment 'Pair Table' charset = utf8mb4
                         row_format = DYNAMIC;

create index block_num_index
    on pair (block_num);

create index block_time_index
    on pair (block_time);

create index name_index
    on pair (name);

create index pump_point_index
    on pair (pump_point);

create index pump_status_index
    on pair (pump_status);

create index token_address_index
    on pair (token_address);

create index token_symbol_index
    on pair (token_symbol);

