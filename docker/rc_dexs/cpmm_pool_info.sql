create table cpmm_pool_info
(
    id                   bigint auto_increment comment 'Primary Key'
        primary key,
    amm_config           varchar(256)                           not null comment 'AMM Config Account',
    pool_state           varchar(256)                           not null comment 'Pool State Account',
    input_vault          varchar(256)                           not null comment 'Input Vault',
    output_vault         varchar(256)                           not null comment 'Output Vault',
    input_token_program  varchar(256)                           not null comment 'Input Token Program',
    output_token_program varchar(256)                           not null comment 'Output Token Program',
    input_token_mint     varchar(256)                           not null comment 'Input Token Mint',
    output_token_mint    varchar(256)                           not null comment 'Output Token Mint',
    trade_fee_rate       int                                    not null comment 'Trade Fee Rate',
    observation_state    varchar(256)                           not null comment 'Observation State',
    tx_hash              varchar(256) default ''                not null comment 'Tx hash',
    created_at           timestamp    default CURRENT_TIMESTAMP not null comment 'Creation timestamp',
    updated_at           timestamp    default CURRENT_TIMESTAMP not null on update CURRENT_TIMESTAMP comment 'Update timestamp',
    constraint idx_pool_state
        unique (pool_state)
)
    comment 'cpmm pool info' charset = utf8mb4;

