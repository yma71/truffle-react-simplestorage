import React, { Component } from 'react'
import SimpleStorageContract from '../build/contracts/SimpleStorage.json'
import getWeb3 from './utils/getWeb3'
import contract from 'truffle-contract'

import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './App.css'

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      storageValue: 0,
      web3: null,
      isStoring: false,
    }
  }

  componentWillMount() {
    // Get network provider and web3 instance.
    // See utils/getWeb3 for more info.

    getWeb3
      .then(results => {
        this.web3 = results.web3
        this.setState({
          web3: results.web3,
        })

        const simpleStorage = contract(SimpleStorageContract)
        simpleStorage.setProvider(this.web3.currentProvider)
        this.simpleStorageInstance = simpleStorage.at('0x8e08dd08cb249be7a6e9972912a74338f3b9a29f')

        // Get accounts.
        this.web3.eth.getAccounts((error, accounts) => {
          this.account = accounts[0]
        })

        const event = this.simpleStorageInstance.ValueStored((error, result) => {
          console.log(result)
        })

        // event.watch((error, result) => {
        //   if (!error) alert('wait for a while, check for block Synchronization or block creation')
        //   console.log(result)
        // })

        // var subscription = this.web3.eth.subscribe(
        //   'logs',
        //   {
        //     address: '0x8e08dd08cb249be7a6e9972912a74338f3b9a29f',
        //     topics: ['0x8e08dd08cb249be7a6e9972912a74338f3b9a29f'],
        //   },
        //   (error, result) => {
        //     if (!error) console.log(result)
        //   }
        // )
      })
      .catch(() => {
        console.log('Error finding web3.')
      })
  }

  storeValue(val) {
    this.setState({ isStoring: true })

    // Declaring this for later so we can chain functions on SimpleStorage.

    // Get accounts.
    this.simpleStorageInstance
      .set(val, { from: this.account })
      .then(result => {
        return this.simpleStorageInstance.get.call(this.account)
      })
      .then(result => {
        // Update state with the result.
        this.setState({ isStoring: false })

        return this.setState({ storageValue: result.c[0] })
      })
      .catch(e => {
        this.setState({ isStoring: false })
      })
  }

  render() {
    return (
      <div className="App">
        <nav className="navbar pure-menu pure-menu-horizontal">
          <a href="#" className="pure-menu-heading pure-menu-link">
            Truffle Box
          </a>
        </nav>

        <main className="container">
          <div className="pure-g">
            <div className="pure-u-1-1">
              <h1>Good to Go!</h1>
              <p>Your Truffle Box is installed and ready.</p>
              <h2>Smart Contract Example</h2>
              <p>
                If your contracts compiled and migrated successfully, below will show a stored value of 5 (by default).
              </p>
              <p>
                Try changing the value stored on <strong>line 59</strong> of App.js.
              </p>
              <p>The stored value is: {this.state.storageValue}</p>
              <input ref={input => (this.input = input)} />
              <button disabled={this.state.isStoring} onClick={() => this.storeValue(this.input.value)}>
                {this.state.isStoring ? 'Storing...' : 'Store value'}
              </button>
            </div>
          </div>
        </main>
      </div>
    )
  }
}

export default App
