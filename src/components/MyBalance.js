import React, { Component } from 'react';
import './MyBalance.scss';
import { connect } from 'react-redux';
import AmountSpan from "./AmountSpan";
import trimZero from "../utils/trimZero";
import * as actions from "actions/index";
const config = require( 'config.json' );

class MyBalance extends Component {

  componentDidMount() {
    console.log("My Balance Mount");

    const { keypair } = this.props;

    if( !keypair) {
      return;
    }
    
    fetch(`${config.api_url}/accounts/${keypair.publicKey()}`, {
      method: 'GET',
      timeout: 3000,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
    .then(res => {
      return res.json()
    })
    .then(account => {
      account.balance = Number(account.balance / 10000000).toFixed(7).replace(/[0]+$/, '').replace(/[.]+$/, '');
      this.props.streamAccount(account);
    })
  }
  
	render() {
		let balance = 0;
		if ( this.props.account ) {
			balance = this.props.account.balance;
    }
    
    console.log(this.props.account);

		return (
			<div className="balance-container">
				<p id="balance">
					<AmountSpan value={ balance }/>
					{ ' ' }
					<span className={ 'unit' }>BOS</span>
				</p>
			</div>
		)
	}
}

const mapStoreToProps = ( store ) => ( {
  keypair: store.keypair.keypair,
	account: store.stream.account,
	language: store.language.language,
} );

// Redux
const mapDispatchToStore = ( dispatch ) => ( {
	streamAccount: ( $account ) => {
		dispatch( actions.streamAccount( $account ) );
	},
	streamEffects: ( $effects ) => {
		dispatch( actions.streamEffects( $effects ) );
	},
	streamOffers: ( $offers ) => {
		dispatch( actions.streamOffers( $offers ) );
	},
	streamPayment: ( $payment ) => {
		dispatch( actions.streamPayment( $payment ) );
	},
	updateKeypair: ( $keypair ) => {
		dispatch( actions.updateKeypair( $keypair ) );
  },
	resetHistory: () => {
		dispatch( actions.resetHistory() );
	},
	showTimer: ( isShow ) => {
		dispatch( actions.showTimer( isShow ) );
	}
} );

MyBalance = connect( mapStoreToProps, mapDispatchToStore )( MyBalance );

export default MyBalance