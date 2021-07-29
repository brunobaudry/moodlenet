import { t, Trans } from '@lingui/macro'
import CallMadeIcon from '@material-ui/icons/CallMade'
import MailOutlineIcon from '@material-ui/icons/MailOutline'
import Card from '../../../components/atoms/Card/Card'
import PrimaryButton from '../../../components/atoms/PrimaryButton/PrimaryButton'
import TertiaryButton from '../../../components/atoms/TertiaryButton/TertiaryButton'
import { Href, Link } from '../../../elements/link'
import { CP, withCtrl } from '../../../lib/ctrl'
import { SubmitForm, useFormikBag } from '../../../lib/formik'
import { MainPageWrapper } from '../../../templates/page/MainPageWrapper'
import AccessHeader, { AccessHeaderProps } from '../AccessHeader/AccessHeader'
import './styles.scss'

export type SignupFormValues = { email: string }
export type SignupProps = {
  accessHeaderProps: CP<AccessHeaderProps, 'page'>
  onSubmit: SubmitForm<SignupFormValues>
  signupErrorMessage: string | null
  requestSent: boolean
  loginHref: Href
  landingHref: Href
}

export const Signup = withCtrl<SignupProps>(
  ({ accessHeaderProps, onSubmit, requestSent, landingHref, loginHref /* ,signupErrorMessage */ }) => {
    const [form, attrs] = useFormikBag<SignupFormValues>({ initialValues: { email: '' }, onSubmit })
    return (
      <MainPageWrapper>
        <div className={`signup-page ${requestSent ? 'success' : ''}`}>
          <AccessHeader {...accessHeaderProps} page={'signup'} />
          <div className="separator" />
          <div className={`signup-content ${requestSent ? 'success' : ''}`}>
            <Card>
              <Link href={loginHref}>
                Sign in
                <CallMadeIcon />
              </Link>
            </Card>
            <Card>
              <div className="content">
                <div className="title">
                  <Trans>Sign up</Trans>
                </div>
                <form>
                  <input
                    className="email"
                    type="text"
                    placeholder={t`Email`}
                    {...attrs.email}
                    onChange={form.handleChange}
                  />
                </form>
                <div className="bottom">
                  <div className="left">
                    <PrimaryButton onClick={form.submitForm}>
                      <Trans>Next</Trans>
                    </PrimaryButton>
                    <Link href={landingHref}>
                      <TertiaryButton>
                        <Trans>or browse now!</Trans>
                      </TertiaryButton>
                    </Link>
                  </div>
                  <div className="right">
                    <div className="icon">
                      <img
                        alt="apple login"
                        src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg"
                      />
                    </div>
                    <div className="icon">
                      <img
                        alt="google login"
                        src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
          <div className={`success-content ${requestSent ? 'success' : ''}`}>
            <Card>
              <div className="content">
                <div className="title">
                  <Trans>Email sent!</Trans>
                </div>
                <MailOutlineIcon className="icon" />
                <div className="subtitle">
                  <Trans>Check out your inbox and activate your account</Trans>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </MainPageWrapper>
    )
  },
)
Signup.displayName = 'SignUpPage'
