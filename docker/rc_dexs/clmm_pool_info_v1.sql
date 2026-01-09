create table clmm_pool_info_v1
(
    id                 bigint auto_increment comment 'Primary Key'
        primary key,
    amm_config         varchar(256)                           not null comment 'AMM Pool Configuration',
    pool_state         varchar(256)                           not null comment 'AMM Pool State Account',
    input_vault        varchar(256)                           not null comment 'Input Token Vault',
    tick_array         varchar(256)                           not null comment 'Tick Array',
    output_vault       varchar(256)                           not null comment 'Output Token Vault',
    observation_state  varchar(256)                           not null comment 'Oracle Observation State',
    token_program      varchar(256)                           not null comment 'SPL Token Program',
    token_program_2022 varchar(256)                           not null comment 'SPL Token Program 2022',
    memo_program       varchar(256)                           not null comment 'Transaction Memo Program (Optional)',
    input_vault_mint   varchar(256)                           not null comment 'Input Vault Mint',
    output_vault_mint  varchar(256)                           not null comment 'Output Vault Mint',
    remaining_accounts text                                   not null comment 'Remaining Accounts (JSON format)',
    trade_fee_rate     int                                    not null comment 'Trade Fee Rate',
    tx_hash            varchar(256) default ''                not null comment 'Tx hash',
    created_at         timestamp    default CURRENT_TIMESTAMP not null comment 'Creation timestamp',
    updated_at         timestamp    default CURRENT_TIMESTAMP not null on update CURRENT_TIMESTAMP comment 'Update timestamp',
    deleted_at         timestamp                              null comment 'Soft delete timestamp',
    constraint idx_pool_state
        unique (pool_state)
)
    comment 'CLMM Pool V1 Information' charset = utf8mb4
                                       row_format = DYNAMIC;

create index idx_input_vault
    on clmm_pool_info_v1 (input_vault);

create index idx_output_vault
    on clmm_pool_info_v1 (output_vault);

