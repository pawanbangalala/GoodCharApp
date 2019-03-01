import axios from 'axios';
const axiosInstance = axios.create({
	baseURL: 'http://13.126.176.252:8080',
	timeout: 3000,
});

export const getCauses = () => {
	return axiosInstance
		.get('/api/causes')
		.then(response => {
			console.log('causes ', response.data);
			return response.data;
		})
		.catch(error => {
			console.log(error.message);
			return null;
		});
};

export const getProjects = () => {
	return axiosInstance
		.get('/api/projects/')
		.then(response => {
			console.log('projects : ', response.data);
			return response.data;
		})
		.catch(error => {
			return null;
		});
};
