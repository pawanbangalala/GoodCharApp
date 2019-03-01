import React, { Component } from 'react';
import { View, Alert, Text, TouchableWithoutFeedback, StyleSheet, Platform, ScrollView } from 'react-native';
import { Dropdown } from 'react-native-material-dropdown';
import Styles from './Styles';
import { UserInput } from '../../Components/UserInput';
import { Button } from '../../Components/Button';
import { Icon } from 'react-native-elements';
import LinearGradient from 'react-native-linear-gradient';
import QRCodeScanner from 'react-native-qrcode-scanner';
var Sound = require('react-native-sound');
import { getProjects } from '../../Network';
import FingerprintScanner from 'react-native-fingerprint-scanner';

const right = { name: 'qrcode', type: 'font-awesome', size: 24, color: '#fff' };
let audioFile = require('../../../assets/goodchar_donation.mp3');
const data = [{ value: 'First' }, { value: 'Second' }, { value: 'Third' }];
const campName = { First: 'First Project', Second: 'Second Project', Third: 'Third Project' };

export default class DonationCamp extends Component {
	constructor(props) {
		super(props);
		let user = props.navigation.getParam('user', '');
		this.state = {
			volunteer: user,
			project: '',
			donee: '',
			campName: '',
			recording: false,
			qr_code_result: '',
			playing: false,
			authorized_donee: true,
			camps: [],
			projects: [],
		};
		this.handleVolunteerName = this.handleVolunteerName.bind(this);
		this.handleProjectName = this.handleProjectName.bind(this);
		this.handleDoneeName = this.handleDoneeName.bind(this);
		this.whoosh = new Sound(audioFile, error => {
			if (error) {
				console.log('failed to load the sound', error);
				return;
			}
		});
		Sound.setCategory('Playback');
		this.whoosh.setVolume(0.8);
	}

	async componentWillMount() {
		let projects = await getProjects();

		let projectsList = projects.filter(
			item => item.donationcamp_name !== undefined && item.donationcamp_name !== null
		);
		console.log('projects :', projectsList);
		let camps = projectsList.map(item => {
			if (item.donationcamp_name !== undefined && item.donationcamp_name !== null) {
				let key = 'value';
				let obj = {};
				obj[key] = item.donationcamp_name;
				return obj;
			}
		});
		let result = projectsList.map(item => {
			let key = item.donationcamp_name;
			let obj = {};
			obj[key] = item.project_name;
			return obj;
		});
		this.setState({ camps: camps, projects: result });
	}

	componentWillUnmount() {
		this.whoosh.release();
	}

	handleVolunteerName = value => {
		console.log(' handleVolunteerName', value);
		this.setState({
			volunteer: value,
		});
	};

	handleProjectName = value => {
		if (value.length > 0) {
			console.log('handleProjectName camps ', this.state.camps);
			console.log('handleProjectName camp ', value);
			console.log('handleProjectName projects ', this.state.projects);

			let project = this.state.projects.filter(item => value in item);
			let projectname = project[0][value];
			console.log('handleProjectName project ', project[0][value]);

			this.setState({ campName: value, project: projectname });
		}
	};

	handleDoneeName = value => {
		this.setState({ donee: value });
	};

	handleDonationAsset = () => {
		if (!this.state.recording) {
			this.setState({ recording: true });
		} else {
			this.setState({ recording: false });
		}
	};

	resetAllFields = () => {
		this.whoosh.stop();

		this.setState({
			camp: ' ',
			project: ' ',
			donee: ' ',
			recording: false,
			qr_code_result: '',
			playing: false,
			authorized_donee: true,
		});

		//this.refs.camp.value = '';
	};
	handleCompleteDonation = () => {
		if (!this.state.volunteer || this.state.volunteer.length <= 0) {
			Alert.alert('Invalid Volunteer details');
			return;
		}

		if (!this.state.project || this.state.project.length <= 0) {
			Alert.alert('Invalid Project details');
			return;
		}

		if (!this.state.donee || this.state.donee.length <= 0) {
			Alert.alert('Invalid Donee details');
			return;
		}

		if (!this.state.qr_code_result || this.state.qr_code_result.length <= 0) {
			Alert.alert('Invalid Asset details');
			return;
		}

		if (!this.state.qr_code_result || this.state.qr_code_result.length <= 0) {
			Alert.alert('Invalid Asset details');
			return;
		}

		if (!this.state.authorized_donee) {
			Alert.alert('Unauthorized donee, Scan your finger');
			return;
		}

		Alert.alert('Congratulations', `Donation succesful, Block created`, [
			{
				text: 'Go To Dashboard',
				onPress: () => this.gotoLandingScreen(),
			},
			{
				text: 'Next Donation',
				onPress: async () => {
					this.resetAllFields();
				},
			},
			{ cancelable: true },
		]);
	};

	gotoLandingScreen = () => {
		this.props.navigation.navigate('LandingScreen');
	};

	render() {
		console.log('render user name ', this.state.volunteer);
		return (
			<View style={{ flex: 1, justifyContent: 'flex-start' }}>
				<View style={{ flex: 1, justifyContent: 'flex-start' }}>
					<ScrollView
						ref="scrollView"
						onContentSizeChange={(width, height) =>
							this.refs.scrollView.scrollTo(this.state.recording ? 250 : 0)
						}
					>
						<View style={{ justifyContent: 'flex-start' }}>
							<UserInput
								placeHolder="Enter Volunteer Name"
								autoCapitalize="words"
								onChangeText={this.handleVolunteerName}
								item={this.state.volunteer.name}
								editable={false}
							/>
							<View style={{ paddingHorizontal: 16 }}>
								<Dropdown
									ref="camp"
									label="Select Camp Name"
									data={this.state.camps}
									onChangeText={value => this.handleProjectName(value)}
								/>
							</View>
							<UserInput
								placeHolder="Project Name"
								autoCapitalize="words"
								editable={false}
								item={this.state.project}
							/>
							<UserInput
								placeHolder="Enter Donee Name"
								autoCapitalize="words"
								onChangeText={this.handleDoneeName}
								item={this.state.donee}
							/>
							<View
								style={{
									paddingHorizontal: 16,
									justifyContent: 'space-around',
									alignItems: 'center',
								}}
							>
								{this.state.recording && (
									<View style={{ flex: 1 }}>
										<QRCodeScanner
											onRead={e => this.setState({ qr_code_result: e.data, recording: false })}
										/>
										<View
											style={{
												backgroundColor: 'transparent',
												height: 30,
												position: 'absolute',
												right: 4,
												top: 4,
											}}
										>
											<TouchableWithoutFeedback
												onPress={() => this.setState({ recording: false })}
											>
												<Icon name="window-close" type="font-awesome" size={32} color="#aaa" />
											</TouchableWithoutFeedback>
										</View>
									</View>
								)}
								<Button label="Donation Asset" onPress={this.handleDonationAsset} right={right} />
								{this.state.qr_code_result.length > 0 && (
									<View>
										<Text
											style={{
												paddingHorizontal: 16,
												fontSize: 16,
												fontWeight: '600',
												color: '#333333',
											}}
											numberOfLines={2}
											ellipsizeMode="tail"
										>
											{this.state.qr_code_result}
										</Text>
									</View>
								)}
							</View>
							<TouchableWithoutFeedback
								onPress={() => {
									this.setState({ playing: !this.state.playing }, () => {
										if (this.state.playing) {
											this.whoosh.play(success => this.setState({ playing: false }));
										} else {
											this.whoosh.stop();
										}
									});
								}}
							>
								<View
									style={{
										backgroundColor: '#7D4976',
										flexDirection: 'row',
										justifyContent: 'center',
										alignItems: 'center',
										height: 50,
										marginTop: 16,
										paddingHorizontal: 16,
										borderBottomWidth: StyleSheet.hairlineWidth,
										borderBottomColor: '#333333',
									}}
								>
									<Icon
										name={this.state.playing ? 'pause-circle' : 'play-circle'}
										type="font-awesome"
										size={32}
										color="#fff"
									/>
									<Text
										style={{
											color: '#fff',
											fontSize: Platform.OS === 'ios' ? 20 : 18,
											fontWeight: '500',
											flex: 1,
											marginLeft: 24,
										}}
									>
										Announcement from GoodChar
									</Text>
								</View>
							</TouchableWithoutFeedback>
						</View>
						<View
							style={{
								flex: 1,
								justifyContent: 'space-evenly',
								alignItems: 'center',
								backgroundColor: '#fff',
								paddingTop: 16,
							}}
						>
							<TouchableWithoutFeedback
								onPress={() => {
									// FingerprintScanner.isSensorAvailable()
									// 	.then(biometryType => {
									// 		console.log('sensor available  press');
									// 		FingerprintScanner.authenticate({
									// 			description: 'Scan your fingerprint on the device scanner to continue',
									// 		})
									// 			.then(() => {
									// 				Alert.alert('Authenticated successfully');
									// 				this.setState({ authorized_donee: true });
									// 			})
									// 			.catch(error => {
									// 				Alert.alert('Authenticated failed');
									// 				this.setState({ authorized_donee: true });
									// 			});
									// 	})
									// 	.catch(error => console.log('sensor error'));
									// console.log('onlong press');
									Alert.alert('Authenticated successfully');
								}}
							>
								<Icon name="fingerprint" type="material-community" color="#333333" size={80} />
							</TouchableWithoutFeedback>
							<Button label="Complete Donation" onPress={this.handleCompleteDonation} />
						</View>
					</ScrollView>
				</View>
			</View>
		);
	}
}
