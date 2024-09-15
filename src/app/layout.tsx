"use client";

import { ErrorBoundary } from 'react-error-boundary'

import { createWeb3Modal } from '@web3modal/wagmi/react'
import { defaultWagmiConfig } from '@web3modal/wagmi/react/config'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { hardhat, polygonMumbai, sepolia } from 'viem/chains'
import { coinbaseWallet, injected, walletConnect, metaMask } from 'wagmi/connectors';

import { AdminLayout } from 'layout'
import { SimpleLayout } from 'layout/SimpleLayout';

import { merlinTestnet } from 'config/networks/merlin_testnet';
import { citreaDevnet } from 'config/networks/citrea_devnet';

import { ContractsContext, useContractContextHook } from 'hooks/useContractContextHook'

import '@fortawesome/fontawesome-svg-core/styles.css'
import '../styles/globals.scss'
import '../styles/_app.css';
import { WagmiProvider } from 'wagmi';

import injectedModule from '@web3-onboard/injected-wallets'
import { useConnectWallet, init, Web3OnboardProvider } from '@web3-onboard/react'

/*declare let window:any
window.ethereum.on('accountsChanged', (accounts: any) => {
	window.location.reload();
});
window.ethereum.on('disconnect', (accounts: any) => {
	window.location.reload();
});
const setListener = provider => {
	provider.on("chainChanged", _ => window.location.reload());
};
window.ethereum.on('chainChanged', (chainId: any) => {
	window.location.reload();
});*/

// 1. Get projectId
const projectId = '75b26af85c05f056c40e2788823e66ae'

// 2. Create wagmiConfig
const queryClient = new QueryClient()
const metadata = {
  name: 'Web3Modal',
  description: 'Web3Modal Example',
  url: 'https://web3modal.com',
  icons: ['https://avatars.githubusercontent.com/u/37784886']
}
const chains = [citreaDevnet, merlinTestnet, polygonMumbai, sepolia, hardhat] as const
const wagmiConfig = defaultWagmiConfig({ chains, projectId, metadata })

// 3. Create modal
createWeb3Modal({ wagmiConfig, projectId })




const wallets = injectedModule()
const web3Onboard = init({
	// This javascript object is unordered meaning props do not require a certain order
	wallets: [wallets],
	chains: [
		{
			id: 42161,
			token: 'ARB-ETH',
			label: 'Arbitrum One',
			rpcUrl: 'https://rpc.ankr.com/arbitrum'
		},
		{
			id: '0xa4ba',
			token: 'ARB',
			label: 'Arbitrum Nova',
			rpcUrl: 'https://nova.arbitrum.io/rpc'
		},
		{
			id: '0x2105',
			token: 'ETH',
			label: 'Base',
			rpcUrl: 'https://mainnet.base.org'
		},
	],
	appMetadata: {
		name: 'Token Swap',
		description: 'Swap tokens for other tokens',
		recommendedInjectedWallets: [
			{ name: 'MetaMask', url: 'https://metamask.io' },
			{ name: 'Coinbase', url: 'https://wallet.coinbase.com/' }
		]
	},
	accountCenter: {
		desktop: {
			position: 'topRight',
			enabled: true,
			minimal: false
		},
		mobile: {
			position: 'topRight',
			enabled: true,
			minimal: true
		}
	},
  /*{containerElements: {
    accountCenter: '#onboard-container'
  }}*/
})





function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

	const contractsContextDefaultValue = useContractContextHook();

  return (
		<Web3OnboardProvider web3Onboard={web3Onboard}>
			<ErrorBoundary fallback={<div>Something went wrong</div>}>
				<WagmiProvider config={wagmiConfig}>
					<QueryClientProvider client={queryClient}>
						<ContractsContext.Provider value={contractsContextDefaultValue} >

								<html lang="en">
									<body>
										<AdminLayout>
											{children}
										</AdminLayout>
									</body>
								</html>

						</ContractsContext.Provider>
					</QueryClientProvider>
				</WagmiProvider>
			</ErrorBoundary>
		</Web3OnboardProvider>
  )
}

export default RootLayout
