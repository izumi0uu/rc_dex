import React from 'react';
import { useParams } from 'react-router-dom';
import TokenListNew from '../components/TokenListNew';
import HeaderNew from '../components/HeaderNew';

const TokenListPage = () => {
  const { type } = useParams();
  
  // 根据类型设置页面标题和过滤条件
  const getPageConfig = (type) => {
    switch (type) {
      case 'trenches':
        return {
          title: '🔥 Trenches - 热门交易',
          description: '发现最热门的代币交易机会',
          filterType: 'trending'
        };
      case 'new-pairs':
        return {
          title: '🆕 新交易对',
          description: '最新上线的交易对',
          filterType: 'new'
        };
      case 'trending':
        return {
          title: '📈 趋势代币',
          description: '当前趋势最强的代币',
          filterType: 'trending'
        };
      default:
        return {
          title: '💰 代币交易',
          description: '开始您的代币交易之旅',
          filterType: 'all'
        };
    }
  };

  const config = getPageConfig(type);

  return (
    <div className="min-h-screen bg-background">
      <HeaderNew 
        activeTab={type || 'trenches'} 
        onTabChange={() => {}} 
        onSettingsClick={() => {}}
      />
      
      <main className="pt-16">
        <div className="container mx-auto px-4 py-6">
          {/* 页面标题 */}
          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl font-bold mb-2">{config.title}</h1>
            <p className="text-muted-foreground">{config.description}</p>
          </div>
          
          {/* 代币列表 */}
          <TokenListNew 
            filterType={config.filterType}
            onTokenSelect={(token) => {
              // 这里可以添加代币选择逻辑，比如跳转到交易页面
              console.log('Selected token:', token);
            }}
          />
        </div>
      </main>
    </div>
  );
};

export default TokenListPage;