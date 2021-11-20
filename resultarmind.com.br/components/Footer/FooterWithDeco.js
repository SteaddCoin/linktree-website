import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { withTranslation } from '~/i18n';
import { useText } from '~/theme/common';
import Footer from './Footer';
import useStyles from './footer-style';
import api from '../../services/api';

function FooterWithDeco(props) {
  const classes = useStyles();
  const text = useText();
  const { t, toggleDir } = props;
  const [access, setAccess] = useState({});

  useEffect(() => {
		api.get('read-access-link').then(r => {
			setAccess(r.data.link);
		}).catch(e => {
		if (e.response?.status === 404) {
				}
			});
	}, []);

  return (
    <div className={classes.footerDeco}>
      <div className={classes.decoration}>
        <svg className={classes.leftDeco}>
          <use xlinkHref="/images/saas/deco-bg-left.svg#main" />
        </svg>
        <svg className={classes.rightDeco}>
          <use xlinkHref="/images/saas/deco-bg-right.svg#main" />
        </svg>
      </div>
      <div className={classes.action}>
        <Typography variant="h4" className={text.title2}>
          {t('common:saas-landing.footer_waiting')}
        </Typography>
        <a href={access.url} style={{ textDecoration: 'none' }}>
          <Button variant="contained" color="secondary" size="large">
            {access.name}
          </Button>
        </a>
      </div>
      <Footer toggleDir={toggleDir} />
    </div>
  );
}

FooterWithDeco.propTypes = {
  t: PropTypes.func.isRequired,
  toggleDir: PropTypes.func.isRequired
};

export default withTranslation(['saas-landing'])(FooterWithDeco);
