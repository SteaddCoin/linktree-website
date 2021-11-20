import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import clsx from 'clsx';
import Typography from '@material-ui/core/Typography';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Grid from '@material-ui/core/Grid';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import { withTranslation } from '~/i18n';
import routeLink from '~/public/text/link';
import { useText } from '~/theme/common';
import Checkbox from './Checkbox';
import SocialAuth from './SocialAuth';
import Title from '../Title/TitleSecondary';
import AuthFrame from './AuthFrame';
import useStyles from './form-style';

function Register(props) {
  const classes = useStyles();
  const text = useText();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const { t } = props;
  const [values, setValues] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  useEffect(() => {
    ValidatorForm.addValidationRule('isPasswordMatch', (value) => {
      if (value !== values.password) {
        return false;
      }
      return true;
    });
    ValidatorForm.addValidationRule('isTruthy', value => value);
  });

  const [check, setCheck] = useState(false);

  const handleChange = name => event => {
    setValues({ ...values, [name]: event.target.value });
  };

  const handleCheck = event => {
    setCheck(event.target.checked);
  };

  const handleSubmit = () => {
    console.log('data submited');
  };

  return (
    <AuthFrame title={t('common:register_title')} subtitle={t('common:register_subtitle')}>
      <div>
        <div className={classes.head}>
          <Title align={isMobile ? 'center' : 'left'}>{t('common:register')}</Title>
          <Button size="small" className={classes.buttonLink} href={routeLink.saas.login}>
            <Icon className={clsx(classes.icon, classes.signArrow)}>arrow_forward</Icon>
            {t('common:register_already')}
          </Button>
        </div>
        <SocialAuth />
        <div className={classes.separator}>
          <Typography>{t('common:register_or')}</Typography>
        </div>
        <ValidatorForm
          onError={errors => console.log(errors)}
          onSubmit={handleSubmit}
        >
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextValidator
                variant="filled"
                className={classes.input}
                label={t('common:register_name')}
                onChange={handleChange('name')}
                name="name"
                value={values.name}
                validators={['required']}
                errorMessages={['This field is required']}
              />
            </Grid>
            <Grid item xs={12}>
              <TextValidator
                variant="filled"
                className={classes.input}
                label={t('common:register_email')}
                onChange={handleChange('email')}
                name="email"
                value={values.email}
                validators={['required', 'isEmail']}
                errorMessages={['This field is required', 'Email is not valid']}
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextValidator
                variant="filled"
                type="password"
                className={classes.input}
                label={t('common:register_password')}
                validators={['required']}
                onChange={handleChange('password')}
                errorMessages={['This field is required']}
                name="password"
                value={values.password}
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextValidator
                variant="filled"
                type="password"
                className={classes.input}
                label={t('common:register_confirm')}
                validators={['isPasswordMatch', 'required']}
                errorMessages={['Password mismatch', 'This field is required']}
                onChange={handleChange('confirmPassword')}
                name="confirm"
                value={values.confirmPassword}
              />
            </Grid>
          </Grid>
          <div className={classes.btnArea}>
            <FormControlLabel
              control={(
                <Checkbox
                  validators={['isTruthy']}
                  errorMessages="This field is required"
                  checked={check}
                  value={check}
                  onChange={(e) => handleCheck(e)}
                  color="primary"
                />
              )}
              label={(
                <span className={text.caption}>
                  {t('common:form_terms')}
                  &nbsp;
                  <a href="#">
                    {t('common:form_privacy')}
                  </a>
                </span>
              )}
            />
            <Button variant="contained" type="submit" color="secondary" size="large">
              {t('common:continue')}
            </Button>
          </div>
        </ValidatorForm>
      </div>
    </AuthFrame>
  );
}


Register.propTypes = {
  t: PropTypes.func.isRequired
};

export default withTranslation(['common'])(Register);
