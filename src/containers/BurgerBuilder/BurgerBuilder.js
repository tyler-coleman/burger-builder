import React, {Component} from 'react';
import Aux from '../../hocs/Aux';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import axios from '../../axios-orders';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hocs/withErrorHandler/withErrorHandler';

const INGREDIENT_PRICES = {
	salad: 0.5,
	cheese: 0.4,
	meat: 1.3,
	bacon: 0.7
}

class BurgerBuilder extends Component {

	state = {
		ingredients: null,
		totalPrice: 4.00,
		purchasable: false,
		purchasing: false,
		loading: false,
		error: false
	}

	componentDidMount () {
		axios.get('https://burger-builder-b1bbd.firebaseio.com/ingredients.json').then(response => {
			this.setState({ingredients: response.data});
			this.updatePurchaseState(response.data);
		}).catch(error => {
			console.log(error);
			this.setState({error: true});
		});
	}

	purchaseHandler = () => {
		this.setState({purchasing: true});
	}

	updatePurchaseState (updatedIngredients) {

		const sum = Object.keys(updatedIngredients).map((key) => {
			return updatedIngredients[key];
		}).reduce((sum, el) => {
			return sum + el;
		}, 0);

		// if sum is 0, no ingredients added
		this.setState({purchasable: sum > 0});
	}

	addIngredientHandler = (type) => {
		const oldCount = this.state.ingredients[type];
		const updatedCount = oldCount + 1;

		const updatedIngredients = {...this.state.ingredients};
		updatedIngredients[type] = updatedCount;
		const priceAddition = INGREDIENT_PRICES[type];
		const oldPrice = this.state.totalPrice;
		const newPrice = oldPrice + priceAddition;

		this.setState({totalPrice: newPrice,
					   ingredients: updatedIngredients});

		this.updatePurchaseState(updatedIngredients);
	}

	removeIngredientHandler = (type) => {
		const oldCount = this.state.ingredients[type];
		const updatedCount = oldCount - 1;

		if (oldCount <= 0) return;

		const updatedIngredients = {...this.state.ingredients};
		updatedIngredients[type] = updatedCount;
		const priceReduction = INGREDIENT_PRICES[type];
		const oldPrice = this.state.totalPrice;
		const newPrice = oldPrice - priceReduction;

		this.setState({totalPrice: newPrice,
					   ingredients: updatedIngredients});

		this.updatePurchaseState(updatedIngredients);
	}

	purchaseCancelHandler = () => {
		this.setState({purchasing: false});
	}

	purchaseContinueHandler = () => {

		const queryParams = [];
		for (let ingredient in this.state.ingredients) {
			queryParams.push(encodeURIComponent(ingredient) + '=' + encodeURIComponent(this.state.ingredients[ingredient]));
		}
		queryParams.push('price=' + encodeURIComponent(this.state.totalPrice));

		const queryString = queryParams.join('&');

		this.props.history.push({pathname: '/checkout',
								 search: queryString});
	}

	render () {

		const disabledInfo = {
			...this.state.ingredients
		};

		for (let key in disabledInfo) {
			disabledInfo[key] = (disabledInfo[key] <= 0);
		}
		// {salad: true, meat: false, ...}

		let orderSummary = null;
		if (this.state.ingredients) {
			orderSummary = <OrderSummary ingredients={this.state.ingredients}
									purchaseCancelled={this.purchaseCancelHandler}
									purchaseContinued={this.purchaseContinueHandler}
									price={this.state.totalPrice}/>
		}
		if (this.state.loading) {
			orderSummary = <Spinner />
		}

		let burger = this.state.error ? <p>Ingredients couldn't be loaded...</p> : <div style={{marginTop: '132px'}}><Spinner /></div>;

		if (this.state.ingredients) {
			burger = (
				<Aux>
					<Burger ingredients={this.state.ingredients} />
					<BuildControls 
						ingredientAdded={this.addIngredientHandler}
						ingredientRemoved={this.removeIngredientHandler}
						disabled={disabledInfo}
						price={this.state.totalPrice}
						purchasable={this.state.purchasable}
						ordered={this.purchaseHandler} />
				</Aux>
			);
		}

		return (
			<Aux>
				<Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler}>
					{orderSummary}
				</Modal>
				{burger}
			</Aux>
		);
	}


}

export default withErrorHandler(BurgerBuilder, axios);