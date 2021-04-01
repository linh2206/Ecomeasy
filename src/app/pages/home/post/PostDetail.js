import React from 'react';
import PropTypes from 'prop-types';
import { globalStyles } from '../../../styles/globalStyles'
import { makeStyles } from '@material-ui/styles';
import { Link } from "react-router-dom";
import { Button, Icon } from '@material-ui/core';
import { Editor } from "react-draft-wysiwyg";

PostDetail.propTypes = {

};

const useStyles = makeStyles({
    root: {
        '& .rdw-storybook-editor': {
            padding: '0 15px'
        }
    },
    ...globalStyles
})

function PostDetail(props) {
    const classes = useStyles()
    function uploadImageCallBack(file) {
        return new Promise(
            (resolve, reject) => {
                const xhr = new XMLHttpRequest(); // eslint-disable-line no-undef
                xhr.open('POST', 'https://api.imgur.com/3/image');
                xhr.setRequestHeader('Authorization', 'Client-ID 8d26ccd12712fca');
                const data = new FormData(); // eslint-disable-line no-undef
                data.append('image', file);
                xhr.send(data);
                xhr.addEventListener('load', () => {
                    const response = JSON.parse(xhr.responseText);
                    resolve(response);
                });
                xhr.addEventListener('error', () => {
                    const error = JSON.parse(xhr.responseText);
                    reject(error);
                });
            },
        );
    }
    return (
        <div className={classes.root}>
            <Link to="/post"><Icon>arrow_back</Icon></Link>
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                margin: '15px 0'
            }}>
                <p className={classes.headerTitle}>Post detail</p>
            </div>

            <div >
                <div className="rdw-storybook-root" style={{
                    color: '#000',
                    border: '1px solid #eee',
                    marginBottom: 30
                }}>
                    <Editor
                        toolbarClassName="rdw-storybook-toolbar"
                        wrapperClassName="rdw-storybook-wrapper"
                        editorClassName="rdw-storybook-editor"
                        toolbar={{
                            image: {
                                uploadCallback: uploadImageCallBack,
                                alt: { present: true, mandatory: false },
                            },
                        }}
                    />
                </div>
            </div>
            <Button className="btn-base btn-base--success" >Save</Button>
        </div>
    );
}

export default PostDetail;