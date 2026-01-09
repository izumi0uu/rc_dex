create table sol_account
(
    id               bigint auto_increment
        primary key,
    address          varchar(50) default ''                not null comment 'Wallet address',
    balance          bigint      default 0                 not null comment 'SOL balance',
    slot             bigint      default 0                 not null comment 'Last updated slot',
    created_at       timestamp   default CURRENT_TIMESTAMP not null,
    updated_at       timestamp   default CURRENT_TIMESTAMP not null on update CURRENT_TIMESTAMP,
    deleted_at       timestamp                             null,
    block_time_stamp bigint      default 0                 not null,
    constraint address_index
        unique (address)
)
    comment 'SOL account table' charset = utf8mb4;

