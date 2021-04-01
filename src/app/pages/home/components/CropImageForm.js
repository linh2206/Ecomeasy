import React, { useState, useEffect } from 'react';
import PropTypes, { element } from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import ReactCrop, { makeAspectCrop } from 'react-image-crop'
import { Button } from '@material-ui/core';
import { getCroppedImg } from "../../../helpers/helper"
import clsx from "clsx";

CropImageForm.propTypes = {

};

const useStyles = makeStyles({
  cropImageContainer: {
    padding: 30,
    width: 600,
    '& .kt-spinner--right:before': {
      right: 15
    },
  },
  cropImageWrapper: {
    width: 450,
    margin: '0 auto'
  },
  formAction: {
    display: 'flex',
    justifyContent: 'space-between',
    '& button': {
      width: 'calc(50% - 7px)'
    }
  },
})

function CropImageForm(props) {
  const classes = useStyles()

  const onCropChange = (e) => {
    setAvatarCrop(e)
  }
  const initialCrop = {
    aspect: 1 / 1,
    unit: 'px',
    x: 0,
    y: 0,
    width: 150,
    height: 150,
  }
  const [avatarCrop, setAvatarCrop] = useState({ ...initialCrop })
  const [imageRef, setImageRef] = useState('')

  const makeClientCrop = (crop) => {
    if (imageRef && crop.width && crop.height) {
      getCroppedImg(
        imageRef,
        crop,
        'newFile.jpeg'
      )
        .then(res => {
          const img = res
          props.onSave(img)
        })
    }
  }

  const saveImage = () => {
    makeClientCrop(avatarCrop)
  }

  return (
    <div className={classes.cropImageContainer}>
      <div className={classes.cropImageWrapper}>
        <div className="crop-img-container">
          <ReactCrop
            src={props.src}
            circularCrop={true}
            crop={avatarCrop}
            onChange={onCropChange}
            onImageLoaded={e => setImageRef(e)}
            ruleOfThirds={true}
          />
        </div>

        <div className={classes.formAction} style={{
          marginTop: 30
        }}>
          <Button
            onClick={() => {
              props.onCancel()
            }}
            className="btn-base btn-base--cancel btn-base--lg">Cancel</Button>
          <Button
            onClick={saveImage}
            disabled={props.loading}
            className={`btn-base btn-base--success btn-base--lg ${clsx(
              {
                "kt-spinner kt-spinner--right kt-spinner--md kt-spinner--light": props.loading
              }
            )}`}>Save</Button>
        </div>
      </div>
    </div>
  );
}

export default CropImageForm;