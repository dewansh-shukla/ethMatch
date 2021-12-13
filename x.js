import { useEffect, useState } from 'react'
import styled from 'styled-components'
import Web3 from 'web3'

//[["ae176371-a75c-4a9c-86f1-1bfad9a37b00","0x23618e81e3f5cdf7f54c3d65f7fbc0abf5b21e8f",20,"0x5b707d05257a67f38e2a1459f752f92c97615fc916d06ceb7ce8ea69119ca3d9768ca23bbb23ba663779b8f01e0a621f8ea733e4596de9439df2c1d319740b4e1c"]]
function run() {
  return {
    statusCode: 200,
    message: 'OK',
    data: [
      {
        players: {
          '0x23618e81e3f5cdf7f54c3d65f7fbc0abf5b21e8f':
            'ae176371-a75c-4a9c-86f1-1bfad9a37b00',
        },
        ranks: {
          '0x23618e81e3f5cdf7f54c3d65f7fbc0abf5b21e8f': 10,
        },
        pool: 20,
        operators_share: 1,
        entry_fee: 20,
        id: '0x35af3b42294cda54cef48e86b26967be3ba5fb29a5fbaf5e723f24ca25e4da00',
        expire_at: 1638707821,
        operator_signature:
          '0x0000000000000000000000000000000000000000000000000000000000000000',
        operator_address: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
      },
    ],
  }
}

const contractABI = require('./contracts/Game.json')
var web3 = null
//0x70997970C51812dc3A010C7d01b50e0d17dc79C8
function App() {
  const [address, setAddress] = useState('')
  const [provider, setProvider] = useState({})
  const [account, setAccount] = useState({})
  const signData = async () => {
    const msgParams = JSON.stringify({
      domain: {
        chainId: 1337,
        name: 'Chess',
        verifyingContract: '0xf5059a5D33d5853360D16C683c16e67980206f36',
        version: '1',
      },
      message: {
        id: run().data[0].id,
        ticket_id: run().data[0].players[address],
        entry_fee: run().data[0].entry_fee,
        operators_share: run().data[0].operators_share,
        operators_address: run().data[0].operator_address,
      },
      primaryType: 'Proposal',
      types: {
        EIP712Domain: [
          { name: 'name', type: 'string' },
          { name: 'version', type: 'string' },
          { name: 'chainId', type: 'uint256' },
          { name: 'verifyingContract', type: 'address' },
        ],
        Proposal: [
          { name: 'id', type: 'string' },
          { name: 'ticket_id', type: 'string' },
          { name: 'entry_fee', type: 'uint256' },
          { name: 'operators_share', type: 'uint256' },
          { name: 'operators_address', type: 'address' },
        ],
      },
    })
    try {
      console.log(msgParams)
      const signedData = await provider.request({
        method: 'eth_signTypedData_v4',
        from: address,
        params: [address, msgParams],
      })
      console.log(signedData)
    } catch (error) {
      console.log(error)
      alert(error)
    }
  }
  const callDeposit = async () => {
    const contract = new web3.eth.Contract(
      contractABI.abi,
      '0x5FbDB2315678afecb367f032d93F642f64180aa3'
    )
    let addr = await contract.methods.createNewAccount().send({
      from: address,
      value: Web3.utils.toWei(Web3.utils.toBN('10'), 'ether'),
    })
    console.log(addr)
  }
  const callDepositWONew = async () => {
    const contract = new web3.eth.Contract(
      contractABI.abi,
      '0x5FbDB2315678afecb367f032d93F642f64180aa3'
    )
    let addr = await contract.methods.depositBalances().send({
      from: address,
      value: Web3.utils.toWei(Web3.utils.toBN('10'), 'ether'),
    })
    console.log(addr)
  }
  const getBalance = async () => {
    const contract = new web3.eth.Contract(
      contractABI.abi,
      '0x5fbdb2315678afecb367f032d93f642f64180aa3'
    )
    let addr = await contract.methods.getBalance().call({
      from: address,
    })
    console.log(addr)
  }
  const walletListener = (_provider) => {
    if (window.ethereum) {
      console.log('added listener')
      _provider.on('accountsChanged', (accounts) => {
        console.log(accounts, 'Changed')
        setAddress(accounts[0])
      })
    }
  }
  const connectWalletPressed = async () => {
    if (window.ethereum) {
      console.log('provider', provider)
      if (provider) {
        const addressArray = await provider.request({
          method: 'eth_requestAccounts',
        })
        console.log(addressArray)

        if (addressArray.length > 0) {
          setAddress(addressArray[0])
          web3 = new Web3(window.web3.currentProvider)
        } else {
          setAddress('')
        }
      }
    } else {
      alert('NO WALLET FOUND')
    }
  }
  useEffect(() => {
    if (window.ethereum) {
      let _provider = null
      try {
        _provider = Web3.givenProvider.providers.find((p) => p.isMetaMask)
        console.log(_provider)
      } catch (err) {
        alert("Cou;dn't find metamask")
      }
      if (_provider) {
        setProvider(_provider)
        walletListener(_provider)
      }
    }
  }, [])
  return (
    <>
      <Main>
        <button id='walletButton' onClick={connectWalletPressed}>
          {address.length > 0 ? (
            'Connected: ' +
            String(address).substring(0, 6) +
            '...' +
            String(address).substring(38)
          ) : (
            <span>Connect Wallet</span>
          )}
        </button>
        <h3>Sign Typed Data V4</h3>
        <button type='button' id='signTypedDataV4Button' onClick={signData}>
          sign typed data v4
        </button>
        <button type='button' id='callDeposit' onClick={callDeposit}>
          call contract
        </button>
        <button type='button' id='callDeposit2' onClick={callDepositWONew}>
          Add Balance
        </button>
        <button type='button' id='getBalance' onClick={getBalance}>
          Get balance
        </button>
        <div id='logo-continer'>
          <p style={{ display: `inline` }}>CONNECT TO METAMASK</p>
          {[1, 3, 4].map((v) => {
            return (
              <div>
                <p>{v}</p>
              </div>
            )
          })}
        </div>
      </Main>
    </>
  )
}

// deallocate nicely

export default App

const Main = styled.div``
