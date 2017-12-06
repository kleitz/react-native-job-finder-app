export default {
  startCarousel: {
    ios: {
      slide1: require(`./startCarousel/ios/USP1-iphone.jpg`),
      slide2: require(`./startCarousel/ios/USP2-iphone.jpg`),
      slide3: require(`./startCarousel/ios/USP3-iphone.jpg`),
      slide4: require(`./startCarousel/ios/USP4-iphone.jpg`)
    },
    android: {
      slide1: require(`./startCarousel/android/USP1-android.jpg`),
      slide2: require(`./startCarousel/android/USP2-android.jpg`),
      slide3: require(`./startCarousel/android/USP3-android.jpg`),
      slide4: require(`./startCarousel/android/USP4-android.jpg`)
    }
  },
  common: {
    logoScreenPlaceholder: require(`./common/logo-screen-placeholder.png`),
    logoWithText: require(`./common/logo_with_text.png`),
    coverPhotoDefault: require(`./common/empty-cover-photo.jpg`),
    companyAvatarPlaceholder: require(`./common/company-placeholder.png`),
    registeredGif: require(`./common/registered.gif`),
    registeredStatic: require(`./common/registered-static.jpg`),
    matchedPlaceholder: require(`./common/matched_empty_state.png`),
    sealedPlaceholder: require(`./common/sealed_empty_state.png`),
    candidatesPlaceholder: require(`./common/screening_empty_state.png`),
    vacanciesPlaceholder: require(`./common/vacancies_empty_state.png`),
    vacanciesPlaceholderHint: require(`./common/hint-dashed-arrow.png`),
    chatRoomPlaceholder: require(`./common/chat-room-empty.png`),
    noConnectionsPlaceholder: require(`./common/no-connections.png`)
  },
  tutorial: {
    ios: {
      slide1: require('./tutorial/ios/slide-1.gif'),
      slide2: require('./tutorial/ios/slide-2.gif'),
      slide3: require('./tutorial/ios/slide-3.gif'),
      slide4: require('./tutorial/ios/slide-4.gif')
    },
    android: {
      slide1: require('./tutorial/android/slide-1.gif'),
      slide2: require('./tutorial/android/slide-2.gif'),
      slide3: require('./tutorial/android/slide-3.gif'),
      slide4: require('./tutorial/android/slide-4.gif')
    }
  },
  confirmationModal: {
    resumeVacancy: require('./confirmationModals/play.png'),
    reuseVacancy: require('./confirmationModals/reuse.png'),
    pauseVacancy: require('./confirmationModals/pause.png'),
    editedVacancy: require('./confirmationModals/pencil.png'),
    publishedVacancy: require('./confirmationModals/suitcase.png')
  },
  support: {
    faq: require('./support/faq.png'),
    howItWorks: require('./support/how-it-works.png'),
    pricing: require('./support/pricing.png'),
    termsConditions: require('./support/terms-conditions.png')
  }
}
