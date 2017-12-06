import {all} from 'redux-saga/effects';
import sessionSaga from './Session/session.saga'
import profileSaga from './Profile/profile.saga'
import pusherSaga from './Utility/pusher/pusher.saga'
import vacanciesSaga from './Vacancies/vacancies.saga'
import photoSaga from './Utility/photos/photoUpload.saga'
import pushSaga from './Utility/pushNotifications/push.saga'
import createVacancySaga from './CreateVacancy/createVacancy.saga'
import chatSaga from './Chat/chat.saga'
import notificationSaga from './Utility/notifications/notifications.saga'
//
import reviewsSaga from './Profile/reviews.saga'

/* ------------- Connect Types To Sagas ------------- */
export default function * root () {
  yield all([
    createVacancySaga(),
    photoSaga(),
    profileSaga(),
    pushSaga(),
    pusherSaga(),
    sessionSaga(),
    vacanciesSaga(),
    chatSaga(),
    notificationSaga(),
    //
    reviewsSaga()
  ])
}
