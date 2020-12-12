import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { Formik } from 'formik';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  makeStyles,
  CircularProgress
} from '@material-ui/core';
import { loginUser } from '../../redux/actions/api';
import { LOGIN } from '../../redux/actions/types';
import Page from 'src/components/Page';
import { useDispatch } from 'react-redux';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    height: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  }
}));

const LoginView = () => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  const handleChange = event => {
    if (event.target.name == 'username') {
      setUserName(event.target.value);
    } else {
      setPassword(event.target.value);
    }
  };

  const handleSubmit = e => {
    e.preventDefault();
    setLoginError('');
    setLoginLoading(true);
    if (!!password && !!userName) {
      loginUser(userName, password).then(data => {
        if (data.statusCode == 200) {
          dispatch({
            type: LOGIN,
            access_token: data.data.access_token,
            refresh_token: data.data.refresh_token
          });
          navigate("/app/dashboard");
          setLoginLoading(false);
        } else {
          setLoginLoading(false);
          setLoginError('نام کاربری یا رمز عبور نادرست است.');
        }
      });
    } else {
      setLoginLoading(false);
      setLoginError('وارد کردن نام کاربری و رمز عبور الزامی است.');
    }
  };

  return (
    <Page className={classes.root} title="Login">
      <Box
        display="flex"
        flexDirection="column"
        height="100%"
        justifyContent="center"
      >
        <Container maxWidth="sm">
          <Formik
            initialValues={{
              email: '',
              password: ''
            }}
            validationSchema={Yup.object().shape({
              email: Yup.string()
                .email('Must be a valid email')
                .max(255)
                .required(''),
              password: Yup.string()
                .max(255)
                .required('')
            })}
            onSubmit={() => {
              navigate('/app/dashboard', { replace: true });
            }}
          >
            {({ errors, handleBlur, isSubmitting, touched }) => (
              <form onSubmit={handleSubmit}>
                <Box mb={3}>
                  <Typography align="center" color="textPrimary" variant="h2">
                    وارد شوید
                  </Typography>
                </Box>
                <TextField
                  error={Boolean(touched.email && errors.email)}
                  fullWidth
                  helperText={touched.email && errors.email}
                  label="نام کاربری"
                  margin="normal"
                  name="username"
                  onBlur={handleBlur}
                  onChange={event => handleChange(event)}
                  type="text"
                  value={userName}
                  variant="outlined"
                />
                <TextField
                  error={Boolean(touched.password && errors.password)}
                  fullWidth
                  helperText={touched.password && errors.password}
                  label="کلمه عبور"
                  margin="normal"
                  name="password"
                  onBlur={handleBlur}
                  onChange={event => handleChange(event)}
                  type="password"
                  value={password}
                  variant="outlined"
                />
                <Box my={2}>
                  <Button
                    color="primary" disabled={isSubmitting}
                    fullWidth size="large" type="submit" variant="contained"
                    onClick={handleSubmit}>
                    {loginLoading ? <CircularProgress color="whit" /> : <p>ورود</p>}
                  </Button>
                </Box>
                <p align="center" style={{ color: 'red' }}>
                  {loginError}
                </p>
              </form>
            )}
          </Formik>
        </Container>
      </Box>
    </Page>
  );
};

export default LoginView;
