import React, {Component} from 'react';
import Button from '../../../components/UI/Button/Button';
import classes from './ContactInfo.css';
import axios from '../../../axios-orders';
import Spinner from '../../../components/UI/Spinner/Spinner';
import Input from '../../../components/UI/Input/Input';

class ContactInfo extends Component {
	state = {
		orderForm: {
			name: {
				elementType: 'input',
				elementConfig: {
					type: 'text',
					placeholder: 'Your name'
				},
				value: '',
				validation: {
					required: true
				},
				valid: false,
				touched: false
			},
			street: {
				elementType: 'input',
				elementConfig: {
					type: 'text',
					placeholder: 'Your street'
				},
				value: '',
				validation: {
					required: true
				},
				valid: false,
				touched: false
			},
			zip: {
				elementType: 'input',
				elementConfig: {
					type: 'text',
					placeholder: 'Your zip'
				},
				value: '',
				validation: {
					required: true,
					minLength: 5,
					maxLength: 5
				},
				valid: false,
				touched: false
			},
			country: {
				elementType: 'input',
				elementConfig: {
					type: 'text',
					placeholder: 'Your country'
				},
				value: '',
				validation: {
					required: true
				},
				valid: false,
				touched: false
			},
			email: {
				elementType: 'input',
				elementConfig: {
					type: 'text',
					placeholder: 'Your email'
				},
				value: '',
				validation: {
					required: true
				},
				valid: false,
				touched: false
			},
			deliveryMethod: {
				elementType: 'select',
				elementConfig: {
					options: [{value: 'fastest', displayValue: 'Fastest'},
							  {value: 'cheapest', displayValue: 'Cheapest'}]
				},
				value: 'fastest',
				touched: false,
				valid: true,
				validation: {}
			}
		},
		loading: false,
		formValid: false
	}

	checkValid(value, rules) {
		let isValid = true;

		if (rules.required) isValid = value.trim() !== '' && isValid;
		if (rules.minLength) isValid = value.length >= rules.minLength && isValid;
		if (rules.maxLength) isValid = value.length <= rules.maxLength && isValid;

		return isValid;
	}

	orderHandler = (event) => {
		event.preventDefault(); // prevents default behavior of reloading page on form submission

		this.setState({loading: true});


		const formData = {};
		for (let formElementId in this.state.orderForm) {
			formData[formElementId] = this.state.orderForm[formElementId].value;
		}
		
		// data is updated in real-time by state using two-way binding
		const order = {
			ingredients: this.props.ingredients,
			price: this.props.price, // would calculate price on server in real app
			deliveryMethod: 'fastest',
			orderData: formData
		}

		axios.post('/orders.json', order).then(response => {
			console.log(response);
			this.setState({loading: false, purchasing: false});
			this.props.history.push('/');
		}).catch(error => {
			console.log(error);
			this.setState({loading: false, purchasing: false});
		});
	}

	inputChangeHandler = (event, inputId) => {
		const updatedOrderForm = {
			...this.state.orderForm
		}; // nested objects not deep copied

		const updatedFormElement = {
			...updatedOrderForm[inputId]
		}; // spread operator on individual form element

		// now we can immutably updated value property
		updatedFormElement.value = event.target.value;
		updatedFormElement.touched = true;
		updatedFormElement.valid = this.checkValid(updatedFormElement.value, updatedFormElement.validation);
		updatedOrderForm[inputId] = updatedFormElement;

		// check if all form elements are valid
		let formValid = true;
		for (let inputId in updatedOrderForm) {
			formValid = updatedOrderForm[inputId].valid && formValid;
		}

		this.setState({orderForm: updatedOrderForm, formValid: formValid});
	}


	render() {

		const formElements = [];
		for (let key in this.state.orderForm) {
			formElements.push({id: key, config: this.state.orderForm[key]});
		}

		let form = (
				<form onSubmit={this.orderHandler}>
					{formElements.map(formElement => {
						return (
							<Input elementType={formElement.config.elementType}
								   elementConfig={formElement.config.elementConfig}
								   value={formElement.config.value}
								   key={formElement.id}
								   changed={(event) => this.inputChangeHandler(event, formElement.id)}
								   invalid={!formElement.config.valid}
								   shouldValidate={formElement.config.validation}
								   touched={formElement.config.touched} />
						);
					})}
					<Button buttonType="Success" disabled={!this.state.formValid}>Order</Button>
				</form>
		);

		if (this.state.loading) {
			form = <Spinner />;
		}

		return (
			<div className={classes.ContactInfo}>
				<h4>Enter your contact information.</h4>
				{form}
			</div>
		);
	}
}

export default ContactInfo;