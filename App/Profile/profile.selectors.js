import { createSelector } from 'reselect'

const phoneRegex = /^\+?([0-9]){10,10}$/
const getProfile = state => state.get('profile')

const getCompanyInfo = createSelector(
  getProfile,
  profile => ({
    id: profile.get('id'),
    companyName: profile.get('companyName'),
    companyVat: profile.get('companyVat'),
    companyStreet: profile.get('companyStreet'),
    companyStreetNumber: profile.get('companyStreetNumber'),
    companyZip: profile.get('companyZip'),
    companyCity: profile.get('companyCity'),
    companyWebsite: profile.get('companyWebsite'),
    companyLogo: profile.get('companyLogo'),
    companyBanner: profile.get('companyBanner'),
    description: profile.get('description'),
    telephone: profile.get('telephone'),
    address: profile.get('address')
  })
)

const getAccountInfo = createSelector(
  getProfile,
  profile => ({
    id: profile.get('id'),
    firstName: profile.get('firstName'),
    lastName: profile.get('lastName'),
    mobile: profile.get('mobile'),
    position: profile.get('position'),
    country: profile.get('country'),
    address: profile.get('address'),
    email: profile.get('email')
  })
)

const getOnboardingInfo = createSelector(
  getProfile,
  profile => ({
    id: profile.get('id'),
    telephone: profile.get('telephone'),
    address: profile.get('address'),
    companyLogo: profile.get('companyLogo'),
    companyWebsite: profile.get('companyWebsite')
  })
)

const getValidPhone = createSelector(
  getProfile,
  profile => phoneRegex.test(profile.get('telephone'))
)

export {
  getValidPhone,
  getCompanyInfo,
  getAccountInfo,
  getOnboardingInfo
}
