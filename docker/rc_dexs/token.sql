create table token
(
    id                   bigint auto_increment
        primary key,
    chain_id             int            default 1                 not null comment 'Chain ID',
    address              varchar(50)    default ''                not null comment 'Token contract address',
    program              varchar(50)    default ''                not null comment 'program',
    name                 text                                     not null comment 'Token name',
    symbol               varchar(50)    default ''                not null comment 'Token symbol',
    decimals             tinyint(1)     default 18                not null comment 'Token decimals',
    total_supply         double         default 0                 not null comment 'Total token supply',
    icon                 text                                     not null comment 'Token icon URL',
    description          text                                     not null comment 'Token description',
    hold_count           int            default 0                 not null comment 'Number of holders',
    is_ca_drop_owner     tinyint(1)     default 0                 not null comment 'Owner rights renounced',
    is_ca_verify         tinyint(1)     default 0                 not null comment 'Contract verified',
    is_honey_scam        tinyint(1)     default 0                 not null comment 'Honeypot check (Cannot sell)',
    is_liquid_lock       tinyint(1)     default 0                 not null comment 'Liquidity locked',
    is_can_pause_trade   tinyint(1)     default 0                 not null comment 'Can pause trading',
    is_can_change_tax    tinyint(1)     default 0                 not null comment 'Can modify tax rate',
    is_have_black_list   tinyint(1)     default 0                 not null comment 'Has blacklist mechanism',
    is_can_all_sell      tinyint(1)     default 0                 not null comment 'Can sell entire balance',
    is_have_proxy        tinyint(1)     default 0                 not null comment 'Has proxy contract',
    is_can_external_call tinyint(1)     default 0                 not null comment 'Contract can make external calls',
    is_can_add_token     tinyint(1)     default 0                 not null comment 'Contract has minting capability',
    is_can_change_token  tinyint(1)     default 0                 not null comment 'Owner can modify user balances',
    sell_tax             decimal(10, 4) default 0.0000            not null comment 'Sell tax rate',
    buy_tax              decimal(10, 4) default 0.0000            not null comment 'Buy tax rate',
    twitter_username     text                                     not null comment 'Twitter username',
    website              text                                     not null comment 'Official website',
    telegram             text                                     not null comment 'Telegram link',
    created_at           timestamp      default CURRENT_TIMESTAMP not null,
    updated_at           timestamp      default CURRENT_TIMESTAMP not null on update CURRENT_TIMESTAMP,
    deleted_at           timestamp                                null,
    is_check_ca          tinyint(1)     default 0                 not null comment 'Contract analysis completed',
    check_ca_at          bigint         default 0                 not null comment 'Contract analysis timestamp',
    is_burn_pool         tinyint(1)     default 0                 not null comment 'Indicates if the token is part of a burn pool',
    is_top_ten           tinyint(1)     default 0                 not null comment 'Indicates if the token is in the top ten by market capitalization',
    audit_source         varchar(255)   default ''                not null comment 'Audit source',
    slot                 bigint         default 0                 not null,
    constraint chain_id_address_index
        unique (chain_id, address),
    constraint chain_id_address_symbol_index
        unique (chain_id, address, symbol)
)
    comment 'Token Table' charset = utf8mb4
                          row_format = DYNAMIC;

create index address_index
    on token (address);

create index icon_index
    on token (icon(255));

create index idx_created_audit
    on token (created_at);

