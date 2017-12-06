import api from '../Config/Api'

const register = ({company, email, password, confirmPassword}) =>
  api.post(
    `/recruiters`,
    {
      recruiter: {
        company_name: company,
        email,
        password,
        password_confirmation: confirmPassword,
        accepted_terms: 'true'
      },
      get_token: true
    }
  )

const login = ({email, password}) =>
  api.post(
    `/recruiters/sign_in`,
    {
      recruiter: {
        email,
        password
      },
      get_token: 'true'
    }
  )

const logout = () => api.delete(`/recruiters/sign_out`)

export default {
  api,
  register,
  login,
  logout
}
