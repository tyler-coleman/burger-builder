import React, { Component } from 'react';
import Layout from '../components/Layout/Layout';
import BurgerBuilder from './BurgerBuilder/BurgerBuilder.js';
import Checkout from './Checkout/Checkout';
import Orders from './Orders/Orders';
import {Route} from 'react-router-dom';

class App extends Component {
  render () {
    return (
      <div>
      	  <Layout>
      	  	<Route path="/" exact component={BurgerBuilder} />
            <Route path="/orders" component={Orders} />
      	  	<Route path="/checkout" component={Checkout} />
      	  </Layout>
      </div>
    );
  }
}

export default App;
