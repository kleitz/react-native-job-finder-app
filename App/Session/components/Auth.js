import React, { Component } from 'react'
import PropTypes from 'prop-types'
import I18n from 'react-native-i18n'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Actions, ActionConst } from 'react-native-router-flux'
import { StyleSheet, Image, Animated, View, Keyboard, ActivityIndicator } from 'react-native'
import ScrollableTabView, { DefaultTabBar } from 'react-native-scrollable-tab-view'

import { getSessionError, getSessionErrors } from '../session.selectors'
import { getSessionLoader } from '../../Utility/loaders/loaders.selectors'
import {
  loginRequest,
  registerRequest,
  userRegistered,
  clearAuthError,
  setSessionError
} from '../session.actions'

import assetManager from '../../Images'
import fonts from '../../Common/fonts'
import colors from '../../Common/colors'
import Button from '../../Common/Button'
import SealIcon from '../../Common/SealIcon'

import Login from './Login'
import Register from './Register'

const SLIDE_DIRECTIONS = {
  up: 'up',
  down: 'down'
}

class Auth extends Component {
	state = {
		currentTab: this.props.selectedTab,
		headerHeight: new Animated.Value(120)
	}
	static propTypes = {
		loader: PropTypes.bool,
		error: PropTypes.string,
		loginRequest: PropTypes.func,
		registerRequest: PropTypes.func
	}

	componentDidMount () {
		Keyboard.addListener('keyboardWillShow', this.keyboardWillShow)
		Keyboard.addListener('keyboardWillHide', this.keyboardWillHide)
	}

	componentWillUnmount () {
		Keyboard.removeListener('keyboardWillShow', this.keyboardWillShow)
		Keyboard.removeListener('keyboardWillHide', this.keyboardWillHide)
	}

	keyboardWillShow = () => {
		const { currentTab } = this.state
		if (currentTab) {
			this.slideLogo(SLIDE_DIRECTIONS.up)
		}
	}

	keyboardWillHide = () => {
		this.slideLogo(SLIDE_DIRECTIONS.down)
	}

	slideLogo = direction => {
		Animated.timing(
			this.state.headerHeight,
			{
				toValue: direction === SLIDE_DIRECTIONS.up ? 0 : 100,
				duration: 300
			}
		).start()
	}

	changeTab = () => {
		const { currentTab } = this.state
		this.setState({ currentTab: currentTab ? 0 : 1 })
		this.props.clearAuthError()
		Keyboard.dismiss()
	}

	goBack = () => {
		Keyboard.dismiss()
		Actions.pop()
	}

	render () {
		const {
			selectedTab,
			registerRequest,
			loginRequest,
			loader,
			error,
			errors,
			userRegistered,
			setSessionError
		} = this.props
		const { headerHeight } = this.state
		return (
			<View style={{flex: 1}}>
				<Button
					onPress={this.goBack}
					btnStyle={styles.backBtn}
				>
					<SealIcon name={'back'} size={20} />
				</Button>
				<Animated.View style={[styles.logoContainer, {height: headerHeight}]}>
					<Image
						resizeMode={'contain'}
						style={styles.logoImage}
						source={assetManager.common.logoWithText}
					/>
				</Animated.View>
				<View style={styles.tabContainer}>
					<ScrollableTabView
						initialPage={selectedTab}
						onChangeTab={this.changeTab}
						scrollWithoutAnimation={false}
						tabBarTextStyle={styles.tabBarText}
						tabBarBackgroundColor={colors.dark}
						tabBarActiveTextColor={colors.white}
						tabBarUnderlineStyle={styles.tabBarUnderline}
						tabBarInactiveTextColor={'rgba(255,255,255,0.3)'}
						contentProps={{
							keyboardShouldPersistTaps: 'always'
						}}
						renderTabBar={() => <DefaultTabBar style={styles.tabs} />}
					>
						<Login
							loader={loader}
							error={errors.login}
							loginRequest={loginRequest}
							userRegistered={userRegistered}
							setSessionError={setSessionError}
							tabLabel={I18n.t('auth.loginTab')}
						/>
						<Register
							error={error}
							errors={errors}
							loader={loader}
							userRegistered={userRegistered}
							setSessionError={setSessionError}
							registerRequest={registerRequest}
							tabLabel={I18n.t('auth.registerTab')}
						/>
					</ScrollableTabView>
				</View>
			</View>
		)
	}
}

const styles = StyleSheet.create({
  logoContainer: {
    height: 120,
    backgroundColor: colors.dark,
    justifyContent: 'center',
    alignItems: 'center'
  },
  logoImage: {
    marginTop: 40,
    width: 250
  },
  backBtn: {
    paddingLeft: 20,
    paddingTop: 20,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    width: 50,
    height: 50,
    backgroundColor: 'transparent',
    position: 'absolute',
    top: 10,
    left: 0,
    zIndex: 10000
  },
  tabContainer: {
    flex: 1
  },
  tabs: {
    shadowColor: 'rgba(0,0,0,0.2)',
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    elevation: 5,
    height: 70
  },
  tabBarText: {
    paddingTop: 15,
    fontFamily: fonts.openSansLight,
    fontSize: 16,
    lineHeight: 26,
    letterSpacing: -0.3,
    fontWeight: '400',
    justifyContent: 'center',
    alignSelf: 'center',
    textAlignVertical: 'center'
  },
  tabBarUnderline: {
    backgroundColor: colors.white,
    height: 6,
    transform: [{translateY: 0}]
  }
})

const mapStateToProps = state => ({
  errors: getSessionErrors(state),
  loader: getSessionLoader(state),
  error: getSessionError(state)
})

const mapDispatchToProps = dispatch => bindActionCreators({
  loginRequest,
  registerRequest,
  userRegistered,
  clearAuthError,
  setSessionError
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Auth)
