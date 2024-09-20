"use client";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { ContractsContext } from 'hooks/useContractContextHook'
import { useCrowdsaleHook } from 'hooks/useCrowdsaleHook'
import { NextPage } from 'next'
import Link from 'next/link'
import { useContext, useEffect, useState } from 'react'
import { Card, CardBody, Col, Container, Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Form, Row } from 'react-bootstrap'
import {
  faArrowDown,
  faArrowUp,
  faDownload,
  faEllipsisVertical,
  faMars,
  faSearch,
  faUsers,
  faVenus,
} from '@fortawesome/free-solid-svg-icons'
import { useSetChain, useWallets } from '@web3-onboard/react';

const Login: NextPage = () => {

	// *************************************************************************************************************************
	// ******************************************************** Read Data ******************************************************
	// *************************************************************************************************************************
	const connectedWallets = useWallets()
	const [{ connectedChain }] = useSetChain()
	const { createEnvContracts, envContracts, loadYourCryptocommodities, CRYPTOCOMMODITIES, selectCrypto, unselectCrypto, selectedCrypto, contracts } = useContext(ContractsContext);

	const { 
		loadICOFeatures, ICO_HARD_CAP, ICO_SOFT_CAP, ICO_PRICE, ICO_MIN_TRANSFER, ICO_MAX_TRANSFER, ICO_MAX_INVESTMENT, ICO_WHITELIST_THRESHOLD, ICO_CURRENT_STAGE, ICO_CURRENT_STAGE_TEXT, STAGE,
		loadICOPaymentMethod, ICO_PAYMENT_SYMBOLS, ICO_PAYMENT_METHODS, 
		loadAntiWhale, ICO_WHITELIST_USER_LIST, ICO_WHITELIST_USER_COUNT, ICO_IS_USE_BLACKLIST, ICO_BLACKLIST_USER_LIST, ICO_BLACKLIST_USER_COUNT,
		getBalancesRawICOMeWallet,  BALANCES_RAW_ICO_ME_WALLET, 
		getBalancesRawICOSearchAddressWallet, BALANCES_RAW_ICO_SEARCH_ADDRESS_WALLET, 
		getBalancesUSDICOMeWallet, BALANCES_USD_ICO_ME_WALLET, 
		getBalancesUSDICOSearchAddressWallet, BALANCES_USD_ICO_SEARCH_ADDRESS_WALLET, 
		getBalancesPaymentTokensMeWallet, BALANCES_PAYMENT_TOKENS_ME_WALLET,
		getBalancesPaymentMethodsSearchAddress, BALANCES_PAYMENT_TOKENS_SEARCH_ADDRESS,
		getBalancesPaymentMethodsICOWallet, BALANCES_PAYMENT_TOKENS_ICO_WALLET,
		getBalancesTargetWallet, BALANCES_PAYMENT_TOKENS_LIQUIDITY_WALLET,
		isWhitelisted, 
		isBlacklisted,
	} = useCrowdsaleHook();

	// *************************************************************************************************************************
	// ******************************************************* Load Data *******************************************************
	// *************************************************************************************************************************
	useEffect(() => {

		if (!connectedChain) {
			console.log('No chainId found. Aborting..')
			return;
		}

		const chainId = Number(connectedWallets.at(0)?.chains[0].id);
		if (chainId) {
			console.log('No chainId found. Aborting loadYourCryptocommodities.')
			return;
		}

		createEnvContracts(chainId);

		console.log(' ');
		loadYourCryptocommodities();
	}, [connectedWallets])


	// *************************************************************************************************************************
	// ******************************************************** Update Data ****************************************************
	// *************************************************************************************************************************
	const onSelectCryptocommodity = async (cryptocommodityName: any)=>{
		console.log('onSelectCryptocommodity', cryptocommodityName);
		await selectCrypto(cryptocommodityName);
	}


	// *************************************************************************************************************************
	// ************************************************************ UI *********************************************************
	// *************************************************************************************************************************
  const [CAN_CREATE, setCanCreate] = useState<boolean>(false);
  const [CAN_MODIFY, setCanModify] = useState<boolean>(false);
  const [CAN_TYPE, setCanType] = useState<boolean>(false);
	useEffect(() => {
		console.log(`isDisconnected: ` + !connectedChain);
		console.log(`selectedCrypto: ` + selectedCrypto);
		console.log(`ICO_CURRENT_STAGE: ` + ICO_CURRENT_STAGE);
		setCanCreate(connectedChain != undefined && selectedCrypto != undefined && (ICO_CURRENT_STAGE == undefined || ICO_CURRENT_STAGE == STAGE.NOT_CREATED));
		setCanModify(connectedChain != undefined && selectedCrypto != undefined && (ICO_CURRENT_STAGE != undefined && ICO_CURRENT_STAGE != STAGE.NOT_CREATED));
		setCanType(connectedChain != undefined && selectedCrypto != undefined);
	}, [connectedChain, selectedCrypto, ICO_CURRENT_STAGE])

  return (
    <div className="bg-group rounded-5 d-flex flex-row align-items-center dark:bg-transparent">
      <Container>

				<Row className="m-4"></Row>

				{ CAN_CREATE || CAN_MODIFY ? '' :
				<Row>
					<Col className='text-center'><Form.Text className="color-frame w-100">These features are disabled because you have not created a cryptocommodity. Visit <Link href="/admin/cryptocommodities">this page</Link> to create one.</Form.Text></Col>
				</Row>
				}

				<Row className="mt-4 mb-2">
					<Col xs={4}><div><Form.Text className="color-frame catatext">Symbol</Form.Text></div></Col>
					<Col xs={4}><div><Form.Text className="color-frame catatext" dir="rtl">Address</Form.Text></div></Col>
					<Col xs={4}><div><Form.Text className="color-frame catatext">Decimals</Form.Text></div></Col>						
				</Row>

				<Row className="mb-5">
					<Col xs={4}><input className="form-control form-control-lg border-0 text-center background-disabled color-dashboard fw-bolder border-0" disabled={ true } value={ 'NO SELECTED' } ></input></Col>
					<Col xs={4}><input className="form-control form-control-lg border-0 text-center background-disabled color-dashboard fw-bolder border-0" disabled={ true } value={ 'NO SELECTED' } dir="rtl" ></input></Col>
					<Col xs={4}><input className="form-control form-control-lg border-0 text-center background-disabled color-dashboard fw-bolder border-0" disabled={ true } value={ 'NO SELECTED' } dir="rtl" ></input></Col>
				</Row>

				<Row className="mt-4 mb-2">
					<Col><div><Form.Text className="color-frame catatext">Supply Allocations</Form.Text></div></Col>
				</Row>
				<div className="row">
					<div className="col-sm-6 col-lg-3">
						<Card className="mb-4 background-disabled border-0 color-dashboard">
							<CardBody className="pb-0 d-flex justify-content-between align-items-start">
								<div>
									<div className="fs-4 fw-semibold">
										26K
										<span className="fs-6 ms-2 fw-normal">
											(-12.4%
											<FontAwesomeIcon icon={faArrowDown} fixedWidth />
											)
										</span>
									</div>
									<div>Project</div>
								</div>
								<Dropdown align="end">
									<DropdownToggle as="button" bsPrefix="btn" className="btn-link rounded-0 color-dashboard shadow-none p-0 border-0" id="dropdown-chart1">
										<FontAwesomeIcon fixedWidth icon={faEllipsisVertical} />
									</DropdownToggle>

									<DropdownMenu>
										<DropdownItem href="#/action-1">Action</DropdownItem>
										<DropdownItem href="#/action-2">Another action</DropdownItem>
										<DropdownItem href="#/action-3">Something else</DropdownItem>
									</DropdownMenu>
								</Dropdown>
							</CardBody>
							<div className="mt-3 mx-3 text-center fw-bolder fs-3" style={{ height: '70px' }}>
								NO TGE
							</div>
						</Card>
					</div>

					<div className="col-sm-6 col-lg-3">
						<Card className="mb-4 background-disabled border-0 color-dashboard">
							<CardBody className="pb-0 d-flex justify-content-between align-items-start">
								<div>
									<div className="fs-4 fw-semibold">
										$6.200
										<span className="fs-6 ms-2 fw-normal">
											(40.9%
											<FontAwesomeIcon icon={faArrowUp} fixedWidth />
											)
										</span>
									</div>
									<div>Holders</div>
								</div>
								<Dropdown align="end">
									<DropdownToggle as="button" bsPrefix="btn" className="btn-link rounded-0 color-dashboard shadow-none p-0 border-0" id="dropdown-chart2">
										<FontAwesomeIcon fixedWidth icon={faEllipsisVertical} />
									</DropdownToggle>

									<DropdownMenu>
										<DropdownItem href="#/action-1">Action</DropdownItem>
										<DropdownItem href="#/action-2">Another action</DropdownItem>
										<DropdownItem href="#/action-3">Something else</DropdownItem>
									</DropdownMenu>
								</Dropdown>
							</CardBody>
							<div className="mt-3 mx-3 text-center fw-bolder fs-3" style={{ height: '70px' }}>
								NO TGE
							</div>
						</Card>
					</div>

					<div className="col-sm-6 col-lg-3">
						<Card className="mb-4 background-disabled border-0 color-dashboard">
							<CardBody className="pb-0 d-flex justify-content-between align-items-start">
								<div>
									<div className="fs-4 fw-semibold">
										2.49%
										<span className="fs-6 ms-2 fw-normal">
											(84.7%
											<FontAwesomeIcon icon={faArrowUp} fixedWidth />
											)
										</span>
									</div>
									<div>Exchanges</div>
								</div>
								<Dropdown align="end">
									<DropdownToggle as="button" bsPrefix="btn" className="btn-link rounded-0 color-dashboard shadow-none p-0 border-0" id="dropdown-chart3">
										<FontAwesomeIcon fixedWidth icon={faEllipsisVertical} />
									</DropdownToggle>

									<DropdownMenu>
										<DropdownItem href="#/action-1">Action</DropdownItem>
										<DropdownItem href="#/action-2">Another action</DropdownItem>
										<DropdownItem href="#/action-3">Something else</DropdownItem>
									</DropdownMenu>
								</Dropdown>
							</CardBody>
							<div className="mt-3 mx-3 text-center fw-bolder fs-3" style={{ height: '70px' }}>
								NO TGE
							</div>
						</Card>
					</div>

					<div className="col-sm-6 col-lg-3">
						<Card className="mb-4 background-disabled color-dashboard">
							<CardBody className="pb-0 d-flex justify-content-between align-items-start">
								<div>
									<div className="fs-4 fw-semibold">
										44K
										<span className="fs-6 ms-2 fw-normal">
											(-23.6%
											<FontAwesomeIcon icon={faArrowDown} fixedWidth />
											)
										</span>
									</div>
									<div>DeFi Services</div>
								</div>
								<Dropdown align="end">
									<DropdownToggle as="button" bsPrefix="btn" className="btn-link rounded-0 color-dashboard shadow-none p-0 border-0" id="dropdown-chart4">
										<FontAwesomeIcon fixedWidth icon={faEllipsisVertical} />
									</DropdownToggle>

									<DropdownMenu>
										<DropdownItem href="#/action-1">Action</DropdownItem>
										<DropdownItem href="#/action-2">Another action</DropdownItem>
										<DropdownItem href="#/action-3">Something else</DropdownItem>
									</DropdownMenu>
								</Dropdown>
							</CardBody>
							<div className="mt-3 mx-3 text-center fw-bolder fs-3" style={{ height: '70px' }}>
								NO TGE
							</div>
						</Card>
					</div>
				</div>

				<Row className="mt-4 mb-2">
					<Col><div><Form.Text className="color-frame catatext">Pending Vesting Schedules</Form.Text></div></Col>
				</Row>
				<div className="row">
					<div className="col-12">
						<Card className="mb-4 background-disabled border-0 color-dashboard">
							<CardBody className="pb-0 d-flex justify-content-between align-items-start">
								<div>
									<div className="fs-4 fw-semibold">
										26K
										<span className="fs-6 ms-2 fw-normal">
											(-12.4%
											<FontAwesomeIcon icon={faArrowDown} fixedWidth />
											)
										</span>
									</div>
									<div>Project</div>
								</div>
								<Dropdown align="end">
									<DropdownToggle as="button" bsPrefix="btn" className="btn-link rounded-0 color-dashboard shadow-none p-0 border-0" id="dropdown-chart1">
										<FontAwesomeIcon fixedWidth icon={faEllipsisVertical} />
									</DropdownToggle>

									<DropdownMenu>
										<DropdownItem href="#/action-1">Action</DropdownItem>
										<DropdownItem href="#/action-2">Another action</DropdownItem>
										<DropdownItem href="#/action-3">Something else</DropdownItem>
									</DropdownMenu>
								</Dropdown>
							</CardBody>
							<div className="mt-3 mx-3 text-center fw-bolder fs-3" style={{ height: '70px' }}>
								NO CURRENT VESTING SCHEDULES
							</div>
						</Card>
					</div>
				</div>

				<Row className="mt-4 mb-2">
					<Col><div><Form.Text className="color-frame catatext">Ongoing Fundraising</Form.Text></div></Col>
				</Row>
				<div className="row">
					<div className="col-12">
						<Card className="mb-4 background-disabled border-0 color-dashboard">
							<CardBody className="pb-0 d-flex justify-content-between align-items-start">
								<div>
									<div className="fs-4 fw-semibold">
										26K
										<span className="fs-6 ms-2 fw-normal">
											(-12.4%
											<FontAwesomeIcon icon={faArrowDown} fixedWidth />
											)
										</span>
									</div>
									<div>Project</div>
								</div>
								<Dropdown align="end">
									<DropdownToggle as="button" bsPrefix="btn" className="btn-link rounded-0 color-dashboard shadow-none p-0 border-0" id="dropdown-chart1">
										<FontAwesomeIcon fixedWidth icon={faEllipsisVertical} />
									</DropdownToggle>

									<DropdownMenu>
										<DropdownItem href="#/action-1">Action</DropdownItem>
										<DropdownItem href="#/action-2">Another action</DropdownItem>
										<DropdownItem href="#/action-3">Something else</DropdownItem>
									</DropdownMenu>
								</Dropdown>
							</CardBody>
							<div className="mt-3 mx-3 text-center fw-bolder fs-3" style={{ height: '70px' }}>
								NO FUNDRAISING ONGOING
							</div>
						</Card>
					</div>
				</div>

				<Row className="mt-4 mb-2">
					<Col><div><Form.Text className="color-frame catatext">Deployed Networks</Form.Text></div></Col>
				</Row>
				<div className="row">
					<div className="col-12">
						<Card className="mb-4 background-disabled border-0 color-dashboard">
							<CardBody className="pb-0 d-flex justify-content-between align-items-start">
								<div>
									<div className="fs-4 fw-semibold">
										26K
										<span className="fs-6 ms-2 fw-normal">
											(-12.4%
											<FontAwesomeIcon icon={faArrowDown} fixedWidth />
											)
										</span>
									</div>
									<div>Project</div>
								</div>
								<Dropdown align="end">
									<DropdownToggle as="button" bsPrefix="btn" className="btn-link rounded-0 color-dashboard shadow-none p-0 border-0" id="dropdown-chart1">
										<FontAwesomeIcon fixedWidth icon={faEllipsisVertical} />
									</DropdownToggle>

									<DropdownMenu>
										<DropdownItem href="#/action-1">Action</DropdownItem>
										<DropdownItem href="#/action-2">Another action</DropdownItem>
										<DropdownItem href="#/action-3">Something else</DropdownItem>
									</DropdownMenu>
								</Dropdown>
							</CardBody>
							<div className="mt-3 mx-3 text-center fw-bolder fs-3" style={{ height: '70px' }}>
									NO TOKEN GENERATION EVENT HAS BEEN EXECUTED
							</div>
						</Card>
					</div>
				</div>

				<Row className="m-4"></Row>

      </Container>
    </div>
  )
}

export default Login
