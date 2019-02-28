import React, { Component } from 'react';
import { View, Text, FlatList } from 'react-native';
import Styles from './Styles';
import { RequestItem } from '../../Components/RequestItem';
import { getCauses } from '../../Network';

export default class Requests extends Component {
	constructor() {
		super();
		this.state = {
			causes: [],
		};
	}

	async componentWillMount() {
		let causes = await getCauses();
		console.log('causes requests ', causes);
		if (causes) {
			this.setState({ causes: causes });
		} else {
			this.setState({ causes: [] });
		}
	}

	render() {
		return (
			<View style={Styles.container}>
				{this.state.causes.length > 0 && (
					<FlatList
						keyExtractor={item => item._id}
						data={this.state.causes}
						renderItem={({ item }) => <RequestItem label={item.cause_name} />}
					/>
				)}
			</View>
		);
	}
}
