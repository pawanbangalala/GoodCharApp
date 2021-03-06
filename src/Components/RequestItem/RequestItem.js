import React from 'react';
import { View, TouchableOpacity, Text, Image } from 'react-native';
import { Styles } from '../RequestItem';
import { Icon } from 'react-native-elements';

const icon = require('../../../assets/icon_gc.png');

const RequestItem = ({ label }) => {
	return (
		<TouchableOpacity style={Styles.topContainer}>
			<View style={Styles.container}>
				<Image source={icon} style={{ height: 24, width: 24, marginRight: 8 }} />
				<Text style={Styles.label1}>{label}</Text>
				<Icon name="ios-arrow-forward" type="ionicon" />
			</View>
		</TouchableOpacity>
	);
};

export default RequestItem;
