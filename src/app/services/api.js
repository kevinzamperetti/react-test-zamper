import * as axios from 'axios'

const api = axios.create( {
	baseURL : "https://indicame-api.herokuapp.com/api"
} )

export default api;