create table sol_token_account_20250623
(
    id                     bigint auto_increment
        primary key,
    owner_address          longtext    null,
    status                 bigint      null,
    chain_id               bigint      null,
    token_account_address  longtext    null,
    token_address          longtext    null,
    token_decimal          bigint      null,
    balance                bigint      null,
    slot                   bigint      null,
    buy_count              bigint      null,
    sell_count             bigint      null,
    buy_amount             double      null,
    sell_amount            double      null,
    buy_base_token_amount  double      null,
    sell_base_token_amount double      null,
    pnl_amount             bigint      null,
    un_pnl_amount          bigint      null,
    created_at             datetime(3) null,
    updated_at             datetime(3) null,
    deleted_at             datetime(3) null
);

create index idx_sol_token_account_20250623_deleted_at
    on sol_token_account_20250623 (deleted_at);

