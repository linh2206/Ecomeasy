import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Paper, TextField, Divider } from '@material-ui/core';
import Modal from '@material-ui/core/Modal';
import { Form, Row, Col } from 'react-bootstrap';
import { injectIntl } from 'react-intl';
import { Formik } from 'formik';
import { connect } from 'react-redux';

import * as client from '../../store/ducks/client.duck';
import { editClient } from '../../crud/client.crud';

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


function EditClient(props) {
  const classes = useStyles();
  const { intl, dataClient, setClientList } = props;
  // getModalStyle is not a pure function, we roll the style only on the first render
  const [modalStyle] = React.useState(getModalStyle);

  return (
    <div>
      <Modal
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        open={props.openEdit}
        onClose={props.onEditClose}
      >
        <div style={modalStyle} className={classes.paper}>
          <div className={ classes.root }>
            <Paper className={ classes.padding }>

              <div className={ classes.title }>
                Edit Client
              </div>

              <Formik
                initialValues={ {
                  name: `${dataClient.user.name}`,
                  company: `${dataClient.company}`,
                  package: `${dataClient.package}`,
                  phone: `${dataClient.phone}`,
                  email: `${dataClient.user.email}`,
                  username: `${dataClient.user.username}`,
                  whitelistIp: `${dataClient.whitelistIp}`,
                } }
                validate={ values => {
                  const errors = {};
                  if (!values.company) {
                    errors.company = intl.formatMessage({
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
                  editClient(
                    props.auth.authToken,
                    props.dataClient.id,
                    {
                      'company': values.company,
                      'whitelistIp': values.whitelistIp,
                    },
                  )
                    .then(({data : {result}}) => {
                      setClientList(props.clientList.map(item => item.id === props.dataClient.id ? { ...item, company:  result.company, whitelistIp: result.whitelistIp}: item));
                      props.onEditClose()
                    })
                    .catch((error) => {
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
                    <Form.Group as={ Row } controlId="formPlaintextPassword">
                      <Form.Label column sm="1">
                        Name
                      </Form.Label>
                      <Col sm="11">
                        <TextField
                          disabled
                          name="name"
                          className={ classes.root }
                          value={ values.name }
                          InputProps={{
                            readOnly: true,
                          }}
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
                          disabled
                          name="package"
                          className={ classes.root }
                          value={ values.package }
                          InputProps={{
                            readOnly: true,
                          }}
                        />
                      </Col>
                    </Form.Group>

                    <Form.Group as={ Row } controlId="formPlaintextPassword">
                      <Form.Label column sm="1">
                        Phone
                      </Form.Label>
                      <Col sm="11">
                        <TextField
                          disabled
                          name="phone"
                          type="tel"
                          className={ classes.root }
                          value={ values.phone }
                          InputProps={{
                            readOnly: true,
                          }}
                        />
                      </Col>
                    </Form.Group>

                    <Form.Group as={ Row } controlId="formPlaintextPassword">
                      <Form.Label column sm="1">
                        Email
                      </Form.Label>
                      <Col sm="11">
                        <TextField
                          disabled
                          name="email"
                          className={ classes.root }
                          value={ values.email }
                          InputProps={{
                            readOnly: true,
                          }}
                        />
                      </Col>
                    </Form.Group>

                    <Form.Group as={ Row } controlId="formPlaintextPassword">
                      <Form.Label column sm="1">
                        Username
                      </Form.Label>
                      <Col sm="11">
                        <TextField
                          disabled
                          name="username"
                          className={ classes.root }
                          value={ values.username }
                          InputProps={{
                            readOnly: true,
                          }}
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
                        Save
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
  )(EditClient),
);