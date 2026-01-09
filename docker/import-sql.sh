#!/bin/bash

# 检查 MySQL 是否可以连接
echo "检查 MySQL 连接..."
docker exec mysql-db mysql -u root -p'richcode.cc' -e "SHOW DATABASES;" > /dev/null 2>&1
if [ $? -ne 0 ]; then
    echo "MySQL 连接失败，请确保 MySQL 容器已启动"
    exit 1
fi

echo "开始导入 SQL 脚本..."

# 导入所有 SQL 脚本
for sql_file in ./rc_dexs/*.sql; do
    if [ -f "$sql_file" ]; then
        echo "导入 $sql_file..."
        docker exec -i mysql-db mysql -u root -p'richcode.cc' rc_dexs < "$sql_file"
        if [ $? -eq 0 ]; then
            echo "✅ $sql_file 导入成功"
        else
            echo "❌ $sql_file 导入失败"
        fi
    fi
done

echo "SQL 脚本导入完成"

# 验证表是否创建成功
echo "验证数据库表..."
docker exec mysql-db mysql -u root -p'richcode.cc' -e "USE rc_dexs; SHOW TABLES;" 