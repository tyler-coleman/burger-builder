import axios from 'axios';

const instance = axios.create({
	baseURL: 'https://burger-builder-b1bbd.firebaseio.com/'
});

export default instance;