import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import moment from "moment"
import { Button, ButtonGroup, TextField, FormControl, Select, MenuItem } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import DayPicker, { DateUtils } from 'react-day-picker';
import CalendarTodayIcon from '@material-ui/icons/CalendarToday';

RangeDatePicker.propTypes = {

};

export const FILTER_OPTION = {
    TODAY: 'today',
    YESTERDAY: 'yesterday',
    WEEK: 'week',
    MONTH: 'month',
    YEAR: 'year',
    MANUAL: 'manual',
    ALL: 'all'
}

const DATE_OPTIONS = ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
    'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12']

const useStyles = makeStyles({
    root: {
        '& .MuiSelect-selectMenu': {
            padding: '8px !important'
        }
    },
    datepickerContainer: {
        border: '1px solid rgba(0, 0, 0, 0.23)',
        borderRadius: 6,
        overflow: 'hidden',
        position: 'relative',
        '& input': {
            padding: '8px 15px'
        },
        '&:focus': {
            '& .Range': {
                background: 'red'
            }
        }
    },
    dateFilterBtnGroup: {
        '& button': {
            color: '#333',
            fontWeight: 400
        },
        '& .active': {
            background: '#ebebeb',
            fontWeight: 800
        }
    }
})

function RangeDatePicker(props) {
    const { from, to, setFrom, setTo, setMode, mode, isShowDateSelection, isShowAll } = props
    const classes = useStyles()
    const datepickerWrapper = useRef(null)
    const [enteredTo, setEnteredTo] = useState(new Date())
    const [isShowDatePicker, setIsShowDatePicker] = useState(false)
    const [monthSelection, setMonthSelection] = useState('')
    const [tempFrom, setTempFrom] = useState(from && moment(from).format('YYYY-MM-DD'))
    const [tempTo, setTempTo] = useState(to && moment(to).format('YYYY-MM-DD'))

    const handleDayClick = (day) => {
        if (moment() < moment(day)) {
            return;
        }
        if (from && to && day >= from && day <= to) {
            setFrom(null)
            setTo(null)
            setEnteredTo(null)
            return;
        }
        if (isSelectingFirstDay(from, to, day)) {
            setFrom(day)
            setTo(null)
            setEnteredTo(null)
        } else {
            setTo(day)
            setEnteredTo(day)
            setIsShowDatePicker(false)
        }
    }

    const isSelectingFirstDay = (from, to, day) => {
        const isBeforeFirstDay = from && DateUtils.isDayBefore(day, from);
        const isRangeSelected = from && to;
        return !from || isBeforeFirstDay || isRangeSelected;
    }

    const handleDayMouseEnter = (day) => {
        if (!isSelectingFirstDay(from, to, day)) {
            setEnteredTo(day)
        }
    }

    const handleClickOutside = event => {
        if (datepickerWrapper.current && !datepickerWrapper.current.contains(event.target)) {
            setIsShowDatePicker(false);
            if (!to || !from) {
                setFrom(new Date())
                setTo(new Date())
            }
        }
    };

    const changeDateRange = (option) => {
        setMonthSelection('')
        let sDate = ''
        let eDate = ''
        switch (option) {
            case FILTER_OPTION.TODAY:
                sDate = moment()
                break;
            case FILTER_OPTION.YESTERDAY:
                sDate = moment().subtract(1, 'days')
                break;
            case FILTER_OPTION.WEEK:
                sDate = moment().subtract(6, 'days')
                break;
            case FILTER_OPTION.MONTH:
                sDate = moment().startOf('month')
                break;
            case FILTER_OPTION.YEAR:
                sDate = moment().startOf('year')
                break;
            case FILTER_OPTION.ALL:
                return;
                break;
        }
        eDate = option === FILTER_OPTION.YESTERDAY ? moment().subtract(1, 'days') : moment()
        setFrom(sDate._d)
        setTo(eDate._d)
        setTempFrom(sDate._d)
        setTempTo(eDate._d)
        setEnteredTo(eDate._d)
    }

    const handleChangeMonthSelection = val => {
        setMonthSelection(val)
        setMode('')
        let currentYear = new Date().getFullYear()
        let sDate = moment(`${val + 1}/01/${currentYear}`)
        let eDate = moment(sDate).endOf('month')
        setFrom(sDate._d)
        setTo(eDate._d)
        setTempFrom(sDate._d)
        setTempTo(eDate._d)
        setEnteredTo(eDate._d)
    }

    useEffect(() => {
        document.addEventListener("click", handleClickOutside, false);
        return () => {
            document.removeEventListener("click", handleClickOutside, false);
        };
    }, [from, to]);

    const onUpdate = () => {
        if (tempFrom) {
            setFrom(new Date(tempFrom))
        }
        else {
            setTempFrom(from && moment(from).format('YYYY-MM-DD'))
        }
        if (tempTo) {
            setTo(new Date(tempTo))
        }
        else {
            setTempTo(to && moment(to).format('YYYY-MM-DD'))
        }
    }

    return (
        <div>
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end'
            }}>
                <div style={{ marginRight: '15px' }}>
                    <form noValidate>
                        <div className={classes.datepickerContainer} onBlur={onUpdate}>
                            <input
                                onChange={e => setTempFrom(e.target.value)}
                                value={tempFrom ? moment(tempFrom).format('YYYY-MM-DD') : ''}
                                type="date" />
                            -
                            <input
                                onChange={e => setTempTo(e.target.value)}
                                value={tempTo ? moment(tempTo).format('YYYY-MM-DD') : ''}
                                type="date"
                            />
                        </div>
                    </form>
                </div>
                {/* <div style={{ marginRight: '15px' }}>
                    <form noValidate>
                        <div className={classes.datepickerContainer} ref={datepickerWrapper}>
                            <TextField
                                variant="outlined"
                                onFocus={() => setIsShowDatePicker(true)}
                                value={`${from ? moment(from).format('MM-DD-YYYY') : ''} - ${to ? moment(to).format('MM-DD-YYYY') : ''}`}
                                InputProps={{
                                    endAdornment: <CalendarTodayIcon />
                                }}>
                            </TextField>
                            <DayPicker
                                className={`Range ${isShowDatePicker ? 'open' : ''}`}
                                numberOfMonths={2}
                                selectedDays={[from, { from, to: enteredTo }]}
                                disabledDays={{
                                    after: new Date()
                                }}
                                modifiers={{ start: from, end: enteredTo }}
                                onDayClick={handleDayClick}
                                onDayMouseEnter={handleDayMouseEnter}
                            />
                        </div>
                    </form>
                </div> */}
                <div >
                    <ButtonGroup aria-label="outlined button group" className={classes.dateFilterBtnGroup}>
                        <Button className={mode === FILTER_OPTION.YESTERDAY ? 'active' : ''}
                            onClick={() => {
                                setMode(FILTER_OPTION.YESTERDAY)
                                changeDateRange(FILTER_OPTION.YESTERDAY)
                            }}>Hôm qua</Button>
                        <Button className={mode === FILTER_OPTION.TODAY ? 'active' : ''}
                            onClick={() => {
                                setMode(FILTER_OPTION.TODAY)
                                changeDateRange(FILTER_OPTION.TODAY)
                            }}>Hôm nay</Button>
                        <Button className={mode === FILTER_OPTION.WEEK ? 'active' : ''}
                            onClick={() => {
                                setMode(FILTER_OPTION.WEEK)
                                changeDateRange(FILTER_OPTION.WEEK)
                            }}>Tuần</Button>
                        {
                            isShowDateSelection || <Button className={mode === FILTER_OPTION.MONTH ? 'active' : ''}
                                onClick={() => {
                                    setMode(FILTER_OPTION.MONTH)
                                    changeDateRange(FILTER_OPTION.MONTH)
                                }}>Tháng</Button>
                        }
                        <Button className={mode === FILTER_OPTION.YEAR ? 'active' : ''}
                            onClick={() => {
                                setMode(FILTER_OPTION.YEAR)
                                changeDateRange(FILTER_OPTION.YEAR)
                            }}>Năm</Button>
                        {isShowAll && <Button className={mode === FILTER_OPTION.ALL ? 'active' : ''}
                            onClick={() => {
                                setMode(FILTER_OPTION.ALL)
                                changeDateRange(FILTER_OPTION.ALL)
                            }}>All</Button>}
                    </ButtonGroup>
                </div>
                {
                    isShowDateSelection &&

                    <FormControl style={{
                        marginLeft: 15,
                        background: 'unset',
                        height: 33,
                    }} variant="outlined" >
                        <Select
                            value={monthSelection}
                            onChange={e => handleChangeMonthSelection(e.target.value)}
                            style={{
                                width: 110,
                                maxHeight: '100%'
                            }}
                            MenuProps={{
                                anchorOrigin: {
                                    vertical: "bottom",
                                    horizontal: "left"
                                },
                                transformOrigin: {
                                    vertical: "top",
                                    horizontal: "left"
                                },
                                getContentAnchorEl: null
                            }}
                            labelId="brand"
                            id="brand"
                            label="Brand"
                        >
                            {DATE_OPTIONS.map((item, index) => (
                                <MenuItem key={item} value={index}>{item}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                }
            </div>
        </div>
    );
}

export default RangeDatePicker;