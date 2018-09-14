import React from 'react';
import Burger from '../../Burger/Burger';
import Button from '../../UI/Button/Button';
import classes from './CheckoutSummary.css';


const checkoutSummary = (props) => {


	return (
		<div className={classes.CheckoutSummary}>
			<h1>Happy eating!</h1>
			<div style={{width: '300px', margin: 'auto'}}>
				<Burger ingredients={props.ingredients} />
			</div>
			<Button buttonType="Danger" clicked={props.checkoutCancelled}>Cancel</Button>
			<Button buttonType="Success" clicked={props.checkoutContinued}>Continue</Button>
		</div>
	);
}

export default checkoutSummary;