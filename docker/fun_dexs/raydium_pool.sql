create table raydium_pool
(
    id                       bigint auto_increment
        primary key,
    chain_id                 bigint       default 0                 not null comment 'Chain ID',
    amm_id                   varchar(255) default ''                not null comment 'AMM ID (pair address)',
    amm_authority            varchar(255) default ''                not null comment 'AMM Authority',
    amm_open_orders          varchar(255) default ''                not null comment 'AMM Open Orders',
    amm_target_orders        varchar(255) default ''                not null comment 'AMM Target Orders',
    pool_coin_token_account  varchar(255) default ''                not null comment 'Pool Coin Token Account',
    pool_pc_token_account    varchar(255) default ''                not null comment 'Pool PC Token Account',
    serum_program_id         varchar(255) default ''                not null comment 'Serum Program ID',
    serum_market             varchar(255) default ''                not null comment 'Serum Market',
    serum_bids               varchar(255) default ''                not null comment 'Serum Bids',
    serum_asks               varchar(255) default ''                not null comment 'Serum Asks',
    serum_event_queue        varchar(255) default ''                not null comment 'Serum Event Queue',
    serum_coin_vault_account varchar(255) default ''                not null comment 'Serum Coin Vault Account',
    serum_pc_vault_account   varchar(255) default ''                not null comment 'Serum PC Vault Account',
    serum_vault_signer       varchar(255) default ''                not null comment 'Serum Vault Signer',
    created_at               timestamp    default CURRENT_TIMESTAMP not null comment 'Creation timestamp',
    updated_at               timestamp    default CURRENT_TIMESTAMP not null on update CURRENT_TIMESTAMP comment 'Update timestamp',
    deleted_at               timestamp                              null,
    tx_hash                  varchar(256) default ''                not null,
    base_mint                varchar(255)                           not null,
    quote_mint               varchar(255)                           not null,
    constraint chain_id_amm_id_index
        unique (chain_id, amm_id)
)
    comment 'Raydium Pool' charset = utf8mb4
                           row_format = DYNAMIC;

