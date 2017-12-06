import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Scene, Router } from 'react-native-router-flux'

import FooterDecorator from './components/FooterNavDecorator'
import ProfileContainer from '../Profile/components/ProfileContainer'
import ConfirmationDecorator from '../ConfirmationModal/components/ConfirmationDecorator'

import Vacancies from '../Vacancies/VacanciesList/components/Vacancies'

import Tutorial from '../Onboarding/components/Tutorial'
import Auth from '../Session/components/Auth'
import InfoScreen from '../Onboarding/components/InfoScreen'
import LogoScreen from '../Onboarding/components/LogoScreen'
import Confirmation from '../Session/components/Confirmation'
import InitialScreen from '../Session/components/InitialScreen'
import SplashScreen from '../Common/SplashScreen'
import CreateVacancy from '../CreateVacancy/components/CreateVacancy'

import JobTitle from '../CreateVacancy/components/wizard-screens/JobTitle'
import JobCategory from '../CreateVacancy/components/wizard-screens/JobCategory'
import PersonalityTraits from '../CreateVacancy/components/wizard-screens/PersonalityTraits'
import JobLocationScreen from '../CreateVacancy/components/wizard-screens/Location'
import VacancySchedule from '../CreateVacancy/components/wizard-screens/VacancySchedule'
import VacancyPhoto from '../CreateVacancy/components/wizard-screens/VacancyPhoto'
import OtherCapacities from '../CreateVacancy/components/wizard-screens/OtherCapacities'
import Description from '../CreateVacancy/components/wizard-screens/Description'
import Wage from '../CreateVacancy/components/wizard-screens/Wage'

import Candidates from '../Vacancies/Candidates/components/Candidates'
import CandidateProfile from '../Vacancies/Candidates/components/CandidateProfile'
import Matchings from '../Vacancies/Matchings/components/Matchings'

import { getRehydrateStatus } from '../Session/session.selectors'
import EditName from '../Profile/components/edit-modals/EditName'
import EditEmail from '../Profile/components/edit-modals/EditEmail'
import EditMobile from '../Profile/components/edit-modals/EditMobile'
import EditAddress from '../Profile/components/edit-modals/EditAddress'
import EditPosition from '../Profile/components/edit-modals/EditPosition'
import NetInfoDecorator from '../Utility/netInfo/components/NetInfoDecorator'
import EditCompanyInfo from '../Profile/components/edit-modals/EditCompanyInfo'
import LoaderOverlay from '../Utility/loaders/components/LoaderOverlay'

import ChatRooms from '../Chat/components/ChatRooms'
import ChatRoom from '../Chat/components/ChatRoom'

import ReviewsOfMe from '../Profile/components/reviews/ReviewsOfMe'
import ReviewsToGive from '../Profile/components/reviews/ReviewsToGive'
import GiveReview from '../Profile/components/reviews/GiveReview'

import Support from '../Support/Support'

class NavigationRouter extends Component {
  render () {
    const { isRehydrated } = this.props
    return isRehydrated
        ? <Router>
          <Scene key='root' hideNavBar>
            <Scene key='initialScreen' hideNavBar initial
              component={NetInfoDecorator(LoaderOverlay(InitialScreen))}
              />
            <Scene key='auth' component={NetInfoDecorator(Auth)} hideNavBar />
            <Scene key='tabs' tabs>
              <Scene key='vacanciesTab' hideTabBar hideNavBar>
                <Scene key='myVacancies' component={
                  ConfirmationDecorator(FooterDecorator(NetInfoDecorator(Vacancies)))
                } />
                <Scene key='screenCandidates' panHandlers={null}
                  component={NetInfoDecorator(LoaderOverlay(Candidates))}
                  />
                <Scene key='manageApplicants' component={NetInfoDecorator(LoaderOverlay(Matchings))}
                  panHandlers={null} />
              </Scene>
              <Scene key='chatTab' hideTabBar hideNavBar>
                <Scene key='chat' component={
                  ConfirmationDecorator(FooterDecorator(NetInfoDecorator(ChatRooms)))
                } />
                <Scene key='chatRoom' component={NetInfoDecorator(ChatRoom)} />
              </Scene>
              <Scene key='helpTab' hideTabBar hideNavBar>
                <Scene key='support' component={FooterDecorator(NetInfoDecorator(Support))} />
              </Scene>
              <Scene key='profileTab' hideTabBar hideNavBar>
                <Scene key='profile' component={FooterDecorator(NetInfoDecorator(ProfileContainer))} />
                <Scene key='editName' component={NetInfoDecorator(EditName)} />
                <Scene key='editEmail' component={NetInfoDecorator(EditEmail)} />
                <Scene key='editPosition' component={NetInfoDecorator(EditPosition)} />
                <Scene key='editMobile' component={NetInfoDecorator(EditMobile)} />
                <Scene key='editCompanyInfo' component={NetInfoDecorator(EditCompanyInfo)} />
                <Scene key='editAddress' component={NetInfoDecorator(EditAddress)} />
                <Scene key='reviewsOfMe' component={NetInfoDecorator(ReviewsOfMe)} />
                <Scene key='reviewsToGive' component={NetInfoDecorator(ReviewsToGive)} />
                <Scene key='giveReview' component={NetInfoDecorator(GiveReview)} />
              </Scene>
            </Scene>
            <Scene key='logoScreen' component={NetInfoDecorator(LogoScreen)} />
            <Scene key='infoScreen' component={NetInfoDecorator(InfoScreen)} />
            <Scene key='tutorial' component={NetInfoDecorator(Tutorial)} />
            <Scene key='confirmationScreen' component={NetInfoDecorator(Confirmation)} />
            <Scene key='createVacancy'
              component={NetInfoDecorator(LoaderOverlay(CreateVacancy))}
              panHandlers={null} direction={'vertical'}
              />

            <Scene key='nvJobTitle' component={NetInfoDecorator(JobTitle)} />
            <Scene key='nvJobCategory' component={NetInfoDecorator(JobCategory)} />
            <Scene key='nvPersonalityTraits' component={NetInfoDecorator(PersonalityTraits)} />
            <Scene key='nvJobLocation' component={NetInfoDecorator(JobLocationScreen)} />
            <Scene key='nvSchedule' component={NetInfoDecorator(VacancySchedule)} />
            <Scene key='nvPhoto' component={NetInfoDecorator(VacancyPhoto)} />
            <Scene key='nvOtherCapacities' component={NetInfoDecorator(OtherCapacities)} />
            <Scene key='nvDescription' component={NetInfoDecorator(Description)} />
            <Scene key='nvWage' component={NetInfoDecorator(Wage)} />

            <Scene key='candidateProfile' component={CandidateProfile} />
            <Scene key='employeeReviews' component={NetInfoDecorator(ReviewsOfMe)} />
          </Scene>
        </Router>
        : <SplashScreen />
  }
}

const mapStateToProps = state => ({
  isRehydrated: getRehydrateStatus(state)
})

export default connect(mapStateToProps, null)(NavigationRouter)
