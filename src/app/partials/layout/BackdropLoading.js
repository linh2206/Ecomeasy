import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';

BackdropLoading.propTypes = {

};

const useStyles = makeStyles({
    root: {

    }
})

function BackdropLoading(props) {
    return (
        <div style={{
            background: 'rgba(0, 0, 0, 0.4)',
            width: '100vw',
            height: '100vh',
            position: 'fixed',
            left: 0,
            top: 0,
            zIndex: 99999
        }}>
            <div className="lds-spinner">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
            </div>
        </div>
    );
}

export default BackdropLoading;