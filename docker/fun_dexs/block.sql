create table block
(
    id           bigint auto_increment
        primary key,
    slot         bigint          default 0                    not null comment 'slot',
    block_height bigint          default 0                    not null comment 'block_height',
    block_time   timestamp       default CURRENT_TIMESTAMP    not null on update CURRENT_TIMESTAMP comment 'block_time',
    status       tinyint         default 0                    not null comment '1 processed, 2 failed',
    sol_price    decimal(64, 18) default 0.000000000000000000 not null comment 'sol price',
    created_at   timestamp       default CURRENT_TIMESTAMP    not null,
    updated_at   timestamp       default CURRENT_TIMESTAMP    not null on update CURRENT_TIMESTAMP,
    deleted_at   timestamp                                    null,
    err_message  varchar(1000)   default ''                   not null comment 'error message',
    constraint slot_index
        unique (slot)
)
    comment 'block' charset = utf8mb4
                    row_format = DYNAMIC;

