create table pump_amm_info
(
    id                                   bigint auto_increment comment 'Primary Key'
        primary key,
    pool_account                         varchar(256)                           not null comment 'Pool account address',
    global_config_account                varchar(256)                           not null comment 'Global configuration account address',
    base_mint_account                    varchar(256)                           not null comment 'Base mint address',
    quote_mint_account                   varchar(256)                           not null comment 'Quote mint address',
    pool_base_token_account              varchar(256)                           not null comment 'Pool''s base token account',
    pool_quote_token_account             varchar(256)                           not null comment 'Pool''s quote token account',
    protocol_fee_recipient_account       varchar(256)                           not null comment 'Protocol fee recipient account',
    protocol_fee_recipient_token_account varchar(256)                           not null comment 'Protocol fee recipient token account',
    base_token_program                   varchar(256)                           not null comment 'Base token program address',
    quote_token_program                  varchar(256)                           not null comment 'Quote token program address',
    system_program                       varchar(256)                           not null comment 'System program address',
    associated_token_program             varchar(256)                           not null comment 'Associated token program address',
    event_authority_account              varchar(256)                           not null comment 'Event authority account',
    program_account                      varchar(256)                           not null comment 'Program account address',
    created_at                           timestamp    default CURRENT_TIMESTAMP not null comment 'Creation timestamp',
    updated_at                           timestamp    default CURRENT_TIMESTAMP not null on update CURRENT_TIMESTAMP comment 'Update timestamp',
    deleted_at                           timestamp                              null comment 'Soft delete timestamp',
    coin_creator_vault_authority         varchar(255) default ''                null comment 'Coin creator vault authority address',
    coin_creator_vault_ata               varchar(255) default ''                null comment 'Coin creator vault ATA address',
    constraint idx_pool_account
        unique (pool_account)
)
    comment 'Pump AMM Information' charset = utf8mb4;

