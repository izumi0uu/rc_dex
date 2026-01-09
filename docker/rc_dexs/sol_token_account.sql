create table sol_token_account
(
    id                     bigint auto_increment
        primary key,
    owner_address          varchar(50)     default ''                   not null comment 'Owner wallet address',
    status                 tinyint         default 0                    not null comment '0: Open, 1: Closed',
    chain_id               int             default 0                    not null comment 'Chain id',
    token_account_address  varchar(50)     default ''                   not null comment 'Token account address',
    token_address          varchar(50)     default ''                   not null comment 'Token contract address',
    token_decimal          tinyint         default 0                    not null comment 'Token decimals',
    balance                bigint          default 0                    not null comment 'Token balance',
    slot                   bigint          default 0                    not null,
    buy_count              bigint          default 0                    not null comment 'Number of buy transactions',
    sell_count             bigint          default 0                    not null comment 'Number of sell transactions',
    buy_amount             decimal(64, 18) default 0.000000000000000000 not null comment 'Total buy amount',
    sell_amount            decimal(64, 18) default 0.000000000000000000 not null comment 'Total sell amount',
    buy_base_token_amount  decimal(64, 18) default 0.000000000000000000 not null comment 'Total base token spent on buys',
    sell_base_token_amount decimal(64, 18) default 0.000000000000000000 not null comment 'Total base token received from sells',
    pnl_amount             bigint          default 0                    not null comment 'Realized profit/loss',
    un_pnl_amount          bigint          default 0                    not null comment 'Unrealized profit/loss',
    created_at             timestamp       default CURRENT_TIMESTAMP    not null,
    updated_at             timestamp       default CURRENT_TIMESTAMP    not null on update CURRENT_TIMESTAMP,
    deleted_at             timestamp                                    null,
    constraint sol_token_account_owner_address_token_account_address_uindex
        unique (owner_address, token_account_address)
)
    comment 'SOL token account table' charset = utf8mb4
                                      row_format = DYNAMIC;

create index chainid_tokenaddress_balance_index
    on sol_token_account (chain_id, token_address, balance);

