create table trade_kline_12h_06
(
    id           bigint auto_increment
        primary key,
    chain_id     bigint      null,
    pair_address longtext    null,
    candle_time  bigint      null,
    open_at      bigint      null,
    close_at     bigint      null,
    o            double      null,
    c            double      null,
    h            double      null,
    l            double      null,
    v            double      null,
    t            double      null,
    a            double      null,
    count        bigint      null,
    buy_count    bigint      null,
    sell_count   bigint      null,
    updated_at   datetime(3) null
);

