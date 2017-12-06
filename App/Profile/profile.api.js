import api from '../Config/Api'

const profileUrl = 'api/recruiters/'

const updateProfile = ({
  companyName, companyVat, companyStreet, companyStreetNumber, companyZip, companyCity,
  companyWebsite, companyLogo, companyBanner, telephone, mobile, position, country, address,
  email, description, pcE, pcL, userId, firstName, lastName
}) =>
  api.put(profileUrl + userId, {
    company_name: companyName,
    company_vat: companyVat,
    company_street: companyStreet,
    company_street_number: companyStreetNumber,
    company_zip: companyZip,
    company_city: companyCity,
    company_website: companyWebsite,
    company_logo: companyLogo,
    company_banner: companyBanner,
    first_name: firstName,
    last_name: lastName,
    telephone,
    mobile,
    country,
    address,
    email,
    description,
    accepted_terms: true,
    pc_e: pcE,
    pc_L: pcL,
    function: position
  })

const getProfile = (userId) =>
  api.get(profileUrl + userId, {})

export default {
  instance: api,
  getProfile,
  updateProfile
}
