create index block_time_index
    on block (block_time);

create table trade
(
    id                   bigint auto_increment
        primary key,
    chain_id             int             default 0                    not null comment 'Chain ID',
    pair_addr            varchar(64)     default ''                   not null comment 'Trading pair contract address',
    tx_hash              varchar(256)    default ''                   not null comment 'Transaction hash',
    hash_id              varchar(256)    default ''                   not null comment 'Transaction ID',
    maker                varchar(64)     default ''                   not null comment 'Transaction initiator',
    trade_type           varchar(64)     default ''                   not null comment 'Trade type',
    base_token_amount    decimal(64, 18) default 0.000000000000000000 not null comment 'Base token amount in this trade',
    token_amount         decimal(64, 18) default 0.000000000000000000 not null comment 'Token amount in this trade',
    base_token_price_usd decimal(64, 18) default 0.000000000000000000 not null comment 'Base token price in USD',
    total_usd            decimal(64, 18) default 0.000000000000000000 not null comment 'Total trade value in USD',
    token_price_usd      decimal(64, 18) default 0.000000000000000000 not null comment 'Token price in USD',
    `to`                 varchar(64)     default ''                   not null comment 'Token recipient',
    block_num            bigint          default 0                    not null comment 'Block height',
    block_time           timestamp       default CURRENT_TIMESTAMP    not null comment 'Block timestamp',
    block_time_stamp     bigint          default 0                    not null comment 'Transaction timestamp',
    swap_name            varchar(64)     default ''                   not null comment 'DEX name',
    created_at           timestamp       default CURRENT_TIMESTAMP    not null,
    updated_at           timestamp       default CURRENT_TIMESTAMP    not null on update CURRENT_TIMESTAMP,
    deleted_at           timestamp                                    null,
    constraint hash_id_index
        unique (hash_id)
)
    comment 'Trade records' charset = utf8mb4;

create index block_time_index
    on trade (block_time);

create index marker_index
    on trade (maker);

