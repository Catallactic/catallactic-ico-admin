import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars } from '@fortawesome/free-solid-svg-icons'
import Link from 'next/link'
import { Button, Container, Dropdown } from 'react-bootstrap'
import HeaderFeaturedNav from '../Header/HeaderFeaturedNav'

import { truncateEthAddress } from '../../../config/config'

import { useWeb3Modal } from '@web3modal/wagmi/react'

import { useAccount, useAccountEffect, useConnect, useDisconnect } from 'wagmi'
import { useContext, useEffect } from 'react'
import { ContractsContext } from 'hooks/useContractContextHook'

import { useConnectWallet } from '@web3-onboard/react'

type HeaderProps = {
  toggleSidebar: () => void;
  toggleSidebarMd: () => void;
}

export default function Header(props: HeaderProps) {
  const { toggleSidebar, toggleSidebarMd } = props

	const { open } = useWeb3Modal()
	const { connectors, status, error } = useConnect();
	const { chain, address, isConnected, isDisconnected, isConnecting } = useAccount()
	useAccountEffect({ 
		onConnect(data) {
			console.log('connected', data)

			if (!chain?.id) {
				console.log('No chainId found. Aborting loadYourCryptocommodities.')
				return;
			}
	
			createEnvContracts(chain?.id ? chain.id : 0);
	
			console.log('loadYourCryptocommodities');
			loadYourCryptocommodities();
		},
		onDisconnect() {
			console.log('disconnected')

			window.location.reload();
		},
	})

	const { createEnvContracts, envContracts, loadYourCryptocommodities, CRYPTOCOMMODITIES, selectCrypto, unselectCrypto, selectedCrypto, contracts } = useContext(ContractsContext);

	const onSelectCryptocommodity = async (cryptocommodityName: any)=>{
		console.log('onSelectCryptocommodity', cryptocommodityName);
		await selectCrypto(cryptocommodityName);
	}




	const [{ wallet, connecting }, connect, disconnect] = useConnectWallet()

  return (

    <header className="header sticky-top mb-4 py-2 px-sm-2 border-bottom">
			
      <Container fluid className="header-navbar d-flex align-items-center">
				
        <Button variant="link" className="header-toggler d-md-none px-md-0 me-md-3 rounded-0 shadow-none" type="button" onClick={toggleSidebar}>
          <FontAwesomeIcon icon={faBars} />
        </Button>
        <Button variant="link" className="header-toggler d-none d-md-inline-block px-md-0 me-md-3 rounded-0 shadow-none" type="button" onClick={toggleSidebarMd}>
          <FontAwesomeIcon icon={faBars} />
        </Button>

        <Link href="/" className="header-brand d-md-none">
          <svg width="80" height="46">
            <title>Catallactic Logo</title>
            <use xlinkHref="/assets/brand/catallactic.svg#full" />
          </svg>
        </Link>

        <div className="header-nav d-none d-md-flex">
          <HeaderFeaturedNav />
        </div>

        <div className="header-nav ms-auto">
	
					{/* https://github.com/wevm/wagmi/issues/4256 */}
					{/* https://stackblitz.com/edit/new-wagmi-qem9ah?file=src%2FApp.tsx */}
					{/* https://github.com/Mohammed-Poolwla/structuring-next13/tree/main/src */}


					<>

{/*
					{isDisconnected && connectors.filter(connector => connector.id === 'injected').map((connector) => (
          	<button
							key={connector.uid}
							onClick={() => connect({ connector })}
							type="button"
							className="btn btn-primary m-2" 
						>
							Connect
						</button>
					))}

					{isConnecting ?
						<>
							<button type="button" className="btn btn-primary m-2" onClick={() => disconnect()}>Connecting</button>
						</>
					: '' }
*/}



						<Dropdown className="btn btn-primary mx-2 my-0 dropdown p-0 border-0" onSelect={onSelectCryptocommodity}>
							<Dropdown.Toggle className="w-100" disabled={!CRYPTOCOMMODITIES || CRYPTOCOMMODITIES.length == 0}>
								{ selectedCrypto?.SELECTED_CRYPTOCOMMODITY_NAME || 'Select CryptoCommodity' }
							</Dropdown.Toggle>

							<Dropdown.Menu className="w-100">
								{CRYPTOCOMMODITIES?.map((item: any, index: any) => {
									return (
										<Dropdown.Item as="button" key={index} eventKey={item} active={selectedCrypto?.SELECTED_CRYPTOCOMMODITY_NAME == item}>
											{item}
										</Dropdown.Item>
									);
								})}
							</Dropdown.Menu>
						</Dropdown>
{/*}
						<button type="button" className="btn btn-primary m-2" onClick={() => open({ view: 'Account' })}>{ !address ? 'Connect User' : truncateEthAddress(address) }</button>
						<button type="button" className="btn btn-primary m-2" onClick={() => open({ view: 'Networks' })}>{ !chain ? 'Connect Chain' : chain?.name}</button>
						<button type="button" className="btn btn-primary m-2" >Disconnect</button>
*/}
					</>

					<button type="button" className="btn btn-primary m-2" disabled={connecting} onClick={() => (wallet ? disconnect(wallet) : connect())}>
						{connecting ? 'Connecting' : wallet ? 'Disconnect' : 'Connect'}
					</button>

				</div>

      </Container>

			{/*}
      <div className="header-divider border-top my-2 mx-sm-n2" />

      <Container fluid>
        <Breadcrumb />
      </Container>
			*/}

    </header>
  )
}
