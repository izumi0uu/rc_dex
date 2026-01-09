import React, { useState } from 'react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets';
import { clusterApiUrl } from '@solana/web3.js';
import { useMemo } from 'react';

import HeaderNew from './components/HeaderNew';
import DashboardNew from './components/DashboardNew';
import TokenListNew from './components/TokenListNew';
import TokenCreationNew from './components/TokenCreationNew';
import PoolCreationNew from './components/PoolCreationNew';
import Footer from './components/Footer';
import LanguageSelector from './components/LanguageSelector';
import { LanguageProvider } from './i18n/LanguageContext';
import { ThemeProvider } from './components/UI/theme-provider';
import DynamicBackground from './components/UI/DynamicBackground';
import Watermark from './components/UI/Watermark';

import '@solana/wallet-adapter-react-ui/styles.css';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [tokenFilter, setTokenFilter] = useState('trending');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isLanguageSelectorOpen, setIsLanguageSelectorOpen] = useState(false);

  // Solana network configuration
  const network = WalletAdapterNetwork.Devnet;
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);
  
  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
    ],
    []
  );

  const navigateToTokens = (filterType) => {
    setTokenFilter(filterType);
    setCurrentPage('tokens');
  };

  const navigateToHome = () => {
    setCurrentPage('home');
  };

  const navigateToTokenCreation = () => {
    setCurrentPage('create-token');
  };

  const navigateToPoolCreation = () => {
    setCurrentPage('create-pool');
  };

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    // 根据不同的tab处理导航逻辑
    switch (tabId) {
      case 'dashboard':
        setCurrentPage('home');
        break;
      case 'tokens':
        setCurrentPage('tokens');
        break;
      case 'trenches':
        navigateToTokens('tokens');
        break;
      case 'track':
      case 'create-token':
        setCurrentPage('create-token');
        break;
      case 'create-pool':
        setCurrentPage('create-pool');
        break;
      case 'add-liquidity':
      case 'token-security':
        // 这些功能可以根据需要实现页面切换
        console.log(`Navigating to ${tabId}`);
        setCurrentPage('home');
        break;
      default:
        setCurrentPage('home');
        break;
    }
  };

  const handleSettingsClick = () => {
    setIsLanguageSelectorOpen(true);
  };

  const handleLanguageSelectorClose = () => {
    setIsLanguageSelectorOpen(false);
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'tokens':
        return <TokenListNew filterType={tokenFilter} onNavigateHome={navigateToHome} />;
      case 'create-token':
        return <TokenCreationNew onNavigateBack={navigateToHome} />;
      case 'create-pool':
        return <PoolCreationNew onNavigateBack={navigateToHome} />;
      case 'home':
      default:
        return <DashboardNew 
          onNavigateToTokens={navigateToTokens} 
          onNavigateToTokenCreation={navigateToTokenCreation}
          onNavigateToPoolCreation={navigateToPoolCreation}
        />;
    }
  };

  return (
    <LanguageProvider>
      <ThemeProvider>
        <ConnectionProvider endpoint={endpoint}>
          <WalletProvider wallets={wallets} autoConnect>
            <WalletModalProvider>
              <DynamicBackground 
                particleCount={30}
                enableParticles={true}
                enableOrbs={true}
              >
                <div className="App min-h-screen text-foreground relative z-10 flex flex-col">
                  <HeaderNew 
                    activeTab={activeTab}
                    onTabChange={handleTabChange}
                    onSettingsClick={handleSettingsClick}
                  />
                  <main className="flex-1 bg-background/70 dark:bg-background/90">
                    {renderCurrentPage()}
                  </main>
                  <Footer />
                  <LanguageSelector
                    isOpen={isLanguageSelectorOpen}
                    onClose={handleLanguageSelectorClose}
                  />
                  <Watermark text="仅供学习使用" opacity={0.05} />
                </div>
              </DynamicBackground>
            </WalletModalProvider>
          </WalletProvider>
        </ConnectionProvider>
      </ThemeProvider>
    </LanguageProvider>
  );
}

export default App;