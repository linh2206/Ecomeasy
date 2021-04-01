import React from 'react';
import PropTypes from 'prop-types';
import { Dialog, DialogContent, Icon, Button, Link } from '@material-ui/core';
import { orange } from '@material-ui/core/colors';
import clsx from "clsx"

ConfirmationPopup.propTypes = {

};

function ConfirmationPopup(props) {
    return (
        <div>
            <Dialog
                open={props.open}
                onClose={props.onClose}
                keepMounted
                maxWidth="sm"
                aria-labelledby="alert-dialog-slide-title"
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogContent>
                    <div style={{
                        textAlign: 'center',
                        padding: '30px',
                        maxWidth: 500
                    }}>
                        <Icon
                            style={{
                                color: '#FF8C00',
                                fontSize: 72
                            }}>error_outline</Icon>
                        <p style={{
                            fontSize: 26,
                            margin: '15 0'
                        }}>{props.message}</p>
                        <div style={{
                            margin: '30px auto 0 auto',
                            display: 'flex',
                            justifyContent: 'flex-end',
                            alignItems: 'center'
                        }}>
                            <Link
                                style={{
                                    color: '#6B6C6F',
                                    marginRight: 50
                                }} onClick={props.onClose}>Cancel</Link>
                            <Button
                                onClick={props.onOK}
                                className={`btn-base btn-base--success btn-base--lg ${clsx(
                                    {
                                        "kt-spinner kt-spinner--right kt-spinner--md kt-spinner--light": props.loading
                                    }
                                )}`}> Ok</Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default ConfirmationPopup;