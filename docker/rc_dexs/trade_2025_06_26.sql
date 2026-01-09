create table trade_2025_06_26
(
    id                   bigint auto_increment
        primary key,
    chain_id             bigint      null,
    pair_addr            longtext    null,
    tx_hash              longtext    null,
    hash_id              longtext    null,
    maker                longtext    null,
    trade_type           longtext    null,
    base_token_amount    double      null,
    token_amount         double      null,
    base_token_price_usd double      null,
    total_usd            double      null,
    token_price_usd      double      null,
    `to`                 longtext    null,
    block_num            bigint      null,
    block_time           datetime(3) null,
    block_time_stamp     bigint      null,
    swap_name            longtext    null,
    created_at           datetime(3) null,
    updated_at           datetime(3) null,
    deleted_at           datetime(3) null
);

create index idx_trade_2025_06_26_deleted_at
    on trade_2025_06_26 (deleted_at);

