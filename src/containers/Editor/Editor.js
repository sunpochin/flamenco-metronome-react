import React, { Component } from 'react';
import {serverapi, postCompas, getCompas} from './serverapi.js';
import MetronomeEditor from './MetronomeEditor.js';

// import Aux from '../../hoc/Aux/Aux';
// import Modal from '../../components/UI/Modal/Modal';
// import Spinner from '../../components/UI/Spinner/Spinner';
//import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
//import axios from '../../axios-orders';

const INGREDIENT_PRICES = {
    salad: 0.5,
    cheese: 0.4,
    meat: 1.3,
    bacon: 0.7
};

class Editor extends Component {
    // constructor(props) {
    //     super(props);
    //     this.state = {...}
    // }
    state = {
        ingredients: null,
        totalPrice: 4,
        purchasable: false,
        purchasing: false,
        loading: false,
        error: false
    }

    componentDidMount () {
        serverapi.get( 'compas.json' )
            .then( response => {
                console.log('response: ', response);
                this.setState( { ingredients: response.data } );
            } )
            .catch( error => {
                this.setState( { error: true } );
            } );
    }

    // updatePurchaseState ( ingredients ) {
    //     const sum = Object.keys( ingredients )
    //         .map( igKey => {
    //             return ingredients[igKey];
    //         } )
    //         .reduce( ( sum, el ) => {
    //             return sum + el;
    //         }, 0 );
    //     this.setState( { purchasable: sum > 0 } );
    // }

    // addIngredientHandler = ( type ) => {
    //     const oldCount = this.state.ingredients[type];
    //     const updatedCount = oldCount + 1;
    //     const updatedIngredients = {
    //         ...this.state.ingredients
    //     };
    //     updatedIngredients[type] = updatedCount;
    //     const priceAddition = INGREDIENT_PRICES[type];
    //     const oldPrice = this.state.totalPrice;
    //     const newPrice = oldPrice + priceAddition;
    //     this.setState( { totalPrice: newPrice, ingredients: updatedIngredients } );
    //     this.updatePurchaseState( updatedIngredients );
    // }

    // removeIngredientHandler = ( type ) => {
    //     const oldCount = this.state.ingredients[type];
    //     if ( oldCount <= 0 ) {
    //         return;
    //     }
    //     const updatedCount = oldCount - 1;
    //     const updatedIngredients = {
    //         ...this.state.ingredients
    //     };
    //     updatedIngredients[type] = updatedCount;
    //     const priceDeduction = INGREDIENT_PRICES[type];
    //     const oldPrice = this.state.totalPrice;
    //     const newPrice = oldPrice - priceDeduction;
    //     this.setState( { totalPrice: newPrice, ingredients: updatedIngredients } );
    //     this.updatePurchaseState( updatedIngredients );
    // }

    // purchaseHandler = () => {
    //     this.setState( { purchasing: true } );
    // }

    // purchaseCancelHandler = () => {
    //     this.setState( { purchasing: false } );
    // }

    // purchaseContinueHandler = () => {
    //     // alert('You continue!');
        
    //     const queryParams = [];
    //     for (let i in this.state.ingredients) {
    //         queryParams.push(encodeURIComponent(i) + '=' + encodeURIComponent(this.state.ingredients[i]));
    //     }
    //     queryParams.push('price=' + this.state.totalPrice);
    //     const queryString = queryParams.join('&');
    //     this.props.history.push({
    //         pathname: '/checkout',
    //         search: '?' + queryString
    //     });
    // }

    render () {
        const theEditor = new MetronomeEditor('res/audio/',
        [ 'Low_Bongo.wav', 'Clap_bright.wav',],
            null);

        // self.metroWorker = new MetronomeCore(soundsPath, sounds, metroSoundListener);

        // const disabledInfo = {
        //     ...this.state.ingredients
        // };
        // for ( let key in disabledInfo ) {
        //     disabledInfo[key] = disabledInfo[key] <= 0
        // }
        // let orderSummary = null;
        // let burger = this.state.error ? <p>Ingredients can't be loaded!</p> : <Spinner />;

        // if ( this.state.ingredients ) {
        //     burger = (
        //         <Aux>
        //             <Burger ingredients={this.state.ingredients} />
        //             <BuildControls
        //                 ingredientAdded={this.addIngredientHandler}
        //                 ingredientRemoved={this.removeIngredientHandler}
        //                 disabled={disabledInfo}
        //                 purchasable={this.state.purchasable}
        //                 ordered={this.purchaseHandler}
        //                 price={this.state.totalPrice} />
        //         </Aux>
        //     );
        //     orderSummary = <OrderSummary
        //         ingredients={this.state.ingredients}
        //         price={this.state.totalPrice}
        //         purchaseCancelled={this.purchaseCancelHandler}
        //         purchaseContinued={this.purchaseContinueHandler} />;
        // }
        // if ( this.state.loading ) {
        //     orderSummary = <Spinner />;
        // }
        // {salad: true, meat: false, ...}
        return (
            <div>
                <button id="play">Play</button>
                <h1>We hope it tastes well!</h1>
                <p>editor</p>
            </div>
            // <Aux>
            //     <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler}>
            //         {orderSummary}
            //     </Modal>
            //     {burger}
            // </Aux>
        );
    }
}

export default Editor;
//export default withErrorHandler(Editor, axios );
