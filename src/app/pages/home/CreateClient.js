import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Paper, TextField, Divider } from '@material-ui/core';
import Modal from '@material-ui/core/Modal';
import { Form, Row, Col } from 'react-bootstrap';
import { injectIntl } from 'react-intl';
import { Formik } from 'formik';
import { connect } from 'react-redux';

import * as client from '../../store/ducks/client.duck';
import { createClient } from '../../crud/client.crud';


// function rand() {
//   return Math.round(Math.random() * 20) - 10;
// }

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}


const useStyles = makeStyles({
  root: {
    width: '100%',
  },
  padding: {
    padding: '25px',
  },
  title: {
    padding: '0 0 15px',
    fontSize: '20px',
    fontWeight: 'bold',
  },
  paper: {
    position: 'absolute',
    width: 900,
  },
});


function CreateClient(props) {
  const classes = useStyles();
  const { intl } = props;
  console.log('props', props);

  // getModalStyle is not a pure function, we roll the style only on the first render
  const [modalStyle] = React.useState(getModalStyle);

  return (
    <div>
      <Modal
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        open={props.open}
        onClose={props.onClose}
      >
        <div style={modalStyle} className={classes.paper}>
          <div className={ classes.root }>
            <Paper className={ classes.padding }>

              <div className={ classes.title }>
                Create Client
              </div>

              <Formik
                initialValues={ {
                  name: '',
                  company: '',
                  packageA: '',
                  email: '',
                  phone: '',
                  username: '',
                  password: '',
                  whitelistIp: '',
                } }
                validate={ values => {
                  const errors = {};

                  if (!values.name) {
                    errors.name = intl.formatMessage({
                      id: 'AUTH.VALIDATION.REQUIRED_FIELD',
                    });
                  }
                  if (!values.company) {
                    errors.company = intl.formatMessage({
                      id: 'AUTH.VALIDATION.REQUIRED_FIELD',
                    });
                  }
                  if (!values.packageA) {
                    errors.packageA = intl.formatMessage({
                      id: 'AUTH.VALIDATION.REQUIRED_FIELD',
                    });
                  }
                  if (!values.email) {
                    errors.email = intl.formatMessage({
                      id: 'AUTH.VALIDATION.REQUIRED_FIELD',
                    });
                  } else if (
                    !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
                  ) {
                    errors.email = intl.formatMessage({
                      id: 'AUTH.VALIDATION.INVALID_FIELD',
                    });
                  }

                  if (!values.phone) {
                    errors.phone = intl.formatMessage({
                      id: 'AUTH.VALIDATION.REQUIRED_FIELD',
                    });
                  }

                  if (!values.username) {
                    errors.username = intl.formatMessage({
                      id: 'AUTH.VALIDATION.REQUIRED_FIELD',
                    });
                  }

                  if (!values.password) {
                    errors.password = intl.formatMessage({
                      id: 'AUTH.VALIDATION.REQUIRED_FIELD',
                    });
                  }

                  if (!values.whitelistIp) {
                    errors.whitelistIp = intl.formatMessage({
                      id: 'AUTH.VALIDATION.REQUIRED_FIELD',
                    });
                  }

                  return errors;
                } }
                onSubmit={ (values, { setStatus, setSubmitting }) => {
                  createClient(
                    props.auth.authToken,
                    values.name,
                    values.company,
                    values.packageA,
                    values.email,
                    values.phone,
                    values.username,
                    values.password,
                  )
                    .then(({data : {result}}) => {
                      props.setClientList([...props.clientList, result])
                      props.onClose()
                    })
                    .catch((error) => {
                      setStatus(error.response.data.validationErrors);
                      setSubmitting(false);
                    });
                } }
              >
                { ({
                     values,
                     status,
                     errors,
                     touched,
                     handleChange,
                     handleBlur,
                     handleSubmit,
                     isSubmitting,
                   }) => (
                  <form onSubmit={ handleSubmit } noValidate autoComplete="off">
                    {status && Object.values(status).map((value,index) => {
                      return (
                        <div role="alert" className="alert alert-danger" key={index}>
                          <div className="alert-text">{value}</div>
                        </div>
                      )
                    })
                    }
                    <Form.Group as={ Row } controlId="formPlaintextPassword">
                      <Form.Label column sm="1">
                        Name
                      </Form.Label>
                      <Col sm="11">
                        <TextField
                          name="name"
                          className={ classes.root }
                          onBlur={ handleBlur }
                          onChange={ handleChange }
                          value={ values.name }
                          helperText={ touched.name && errors.name }
                          error={ Boolean(touched.name && errors.name) }
                        />
                      </Col>
                    </Form.Group>

                    <Form.Group as={ Row } controlId="formPlaintextPassword">
                      <Form.Label column sm="1">
                        Company
                      </Form.Label>
                      <Col sm="11">
                        <TextField
                          name="company"
                          className={ classes.root }
                          onBlur={ handleBlur }
                          onChange={ handleChange }
                          value={ values.company }
                          helperText={ touched.company && errors.company }
                          error={ Boolean(touched.company && errors.company) }
                        />
                      </Col>
                    </Form.Group>

                    <Form.Group as={ Row } controlId="formPlaintextPassword">
                      <Form.Label column sm="1">
                        Package
                      </Form.Label>
                      <Col sm="11">
                        <TextField
                          name="packageA"
                          className={ classes.root }
                          onBlur={ handleBlur }
                          onChange={ handleChange }
                          value={ values.packageA }
                          helperText={ touched.packageA && errors.packageA }
                          error={ Boolean(touched.packageA && errors.packageA) }
                        />
                      </Col>
                    </Form.Group>

                    <Form.Group as={ Row } controlId="formPlaintextPassword">
                      <Form.Label column sm="1">
                        Email
                      </Form.Label>
                      <Col sm="11">
                        <TextField
                          name="email"
                          className={ classes.root }
                          onBlur={ handleBlur }
                          onChange={ handleChange }
                          value={ values.email }
                          helperText={ touched.email && errors.email }
                          error={ Boolean(touched.email && errors.email) }
                        />
                      </Col>
                    </Form.Group>

                    <Form.Group as={ Row } controlId="formPlaintextPassword">
                      <Form.Label column sm="1">
                        Phone
                      </Form.Label>
                      <Col sm="11">
                        <TextField
                          name="phone"
                          type="tel"
                          className={ classes.root }
                          onBlur={ handleBlur }
                          onChange={ handleChange }
                          value={ values.phone }
                          helperText={ touched.phone && errors.phone }
                          error={ Boolean(touched.phone && errors.phone) }
                        />
                      </Col>
                    </Form.Group>

                    <Form.Group as={ Row } controlId="formPlaintextPassword">
                      <Form.Label column sm="1">
                        Username
                      </Form.Label>
                      <Col sm="11">
                        <TextField
                          name="username"
                          className={ classes.root }
                          onBlur={ handleBlur }
                          onChange={ handleChange }
                          value={ values.username }
                          helperText={ touched.username && errors.username }
                          error={ Boolean(touched.username && errors.username) }
                        />
                      </Col>
                    </Form.Group>

                    <Form.Group as={ Row } controlId="formPlaintextPassword">
                      <Form.Label column sm="1">
                        Password
                      </Form.Label>
                      <Col sm="11">
                        <TextField
                          type="password"
                          name="password"
                          className={ classes.root }
                          onBlur={ handleBlur }
                          onChange={ handleChange }
                          value={ values.password }
                          helperText={ touched.password && errors.password }
                          error={ Boolean(touched.password && errors.password) }
                        />
                      </Col>
                    </Form.Group>

                    <Form.Group as={ Row } controlId="formPlaintextPassword">
                      <Form.Label column sm="1">
                        IP
                      </Form.Label>
                      <Col sm="11">
                        <TextField
                          name="whitelistIp"
                          className={ classes.root }
                          onBlur={ handleBlur }
                          onChange={ handleChange }
                          value={ values.whitelistIp }
                          helperText={ touched.whitelistIp && errors.whitelistIp }
                          error={ Boolean(touched.whitelistIp && errors.whitelistIp) }
                        />
                      </Col>
                    </Form.Group>

                    <div className="kt-login__actions">
                      <button
                        disabled={ isSubmitting }
                        className="btn btn-primary btn-elevate kt-login__btn-primary"
                      >
                        Create Client
                      </button>
                    </div>
                  </form>
                ) }
              </Formik>
            </Paper>
          </div>
        </div>
      </Modal>
    </div>
  );

}

const mapStateToProps = ({ auth }) => ({
  auth,
});

export default injectIntl(
  connect(
    mapStateToProps,
    client.actions,
  )(CreateClient),
);