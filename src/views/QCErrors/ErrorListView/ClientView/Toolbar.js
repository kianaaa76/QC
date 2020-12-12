import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {
  Box,
  Button,
  Card,
  CardContent,
  makeStyles,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@material-ui/core';
import {
  getProductLinesforDropDown,
  getStationsOfProductLineIdForDropDown,
} from 'src/redux/actions/api';
import { SET_SELECTED_PRODUCT_LINE } from 'src/redux/actions/types';
import { useSelector, useDispatch } from 'react-redux';
import 'react-modern-calendar-datepicker/lib/DatePicker.css';
import { Calendar } from 'react-modern-calendar-datepicker';
import moment from 'moment-jalaali';

moment.loadPersian({
  dialect: 'persian-modern',
  usePersianDigits: true
});

const notFocusedLabelClass =
  'MuiFormLabel-root MuiInputLabel-root MuiInputLabel-formControl MuiInputLabel-animated';
const focusedLabelClass =
  'MuiFormLabel-root MuiInputLabel-root MuiInputLabel-formControl MuiInputLabel-animated MuiInputLabel-shrink Mui-focused';

const useStyles = makeStyles(theme => ({
  root: {},
  importButton: {
    marginRight: theme.spacing(1)
  },
  exportButton: {
    marginRight: theme.spacing(1)
  }
}));

const Toolbar = ({
  className,
  setOpenModal,
  selectedProductLine,
  setSelectedProductLine,
  selectedStation,
  setSelectedStation,
  selectedDate,
  setSelectedDate,
  ...rest
}) => {
  const classes = useStyles();
  const selector = useSelector(state => state);
  const dispatch = useDispatch();
  const [productLineList, setProductLineList] = useState([]);
  const [stationList, setStationList] = useState([]);
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    if (productLineList.length == 0) {
      getProductLinesforDropDown(selector.access_token).then(data => {
        if (data.statusCode == 200) {
          setProductLineList(data.data.items);
          setSelectedProductLine(data.data.items[0].id);
        }
      });
    }
  });

  const handleChangeProductLine = event => {
    dispatch({
      type: SET_SELECTED_PRODUCT_LINE,
      selectedProductLineOfErrorTab: event.target.value
    });
    setStationList([]);
    productLineList.map(item => {
      if (item.id == event.target.value) {
        setSelectedProductLine({
          name: item.name,
          id: item.id
        });
        getStationsOfProductLineIdForDropDown(
          selector.access_token,
          item.id
        ).then(data => {
          if (data.statusCode == 200) {
            setStationList(data.data.items);
          } else {
            setStationList([]);
            //do something in case of not getting success!
          }
        });
      }
    });
  };

  const handleChangeStation = event => {
    stationList.map(item => {
      if (item.id == event.target.value) {
        setSelectedStation(item);
      }
    });
  };

  return (
    <div className={clsx(classes.root, className)} {...rest}>
      <Box display="flex" justifyContent="flex-end">
        <Button
          color="primary"
          variant="contained"
          onClick={() => setOpenModal(true)}
        >
          خطای جدید
        </Button>
      </Box>

      <Box mt={3}>
        <Card>
          <CardContent>
            <FormControl
              className={classes.formControl}
              style={{ marginLeft: '5%', marginRight: '5%' }}
            >
              <InputLabel id="demo-simple-select-label">خط تولید</InputLabel>
              <Select
                style={{ minWidth: 120 }}
                labelId="label"
                id="select"
                value={!!selectedProductLine.id ? selectedProductLine.id : ''}
                onChange={handleChangeProductLine}
              >
                {productLineList.map(item => (
                  <MenuItem value={item.id}>{item.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl
              className={classes.formControl}
              style={{ marginLeft: '5%', marginRight: '5%' }}
            >
              <InputLabel id="demo-simple-select-label">ایستکاه</InputLabel>
              <Select
                style={{ minWidth: 120 }}
                labelId="label"
                id="select"
                value={!!selectedStation.id ? selectedStation.id : ''}
                onChange={handleChangeStation}
              >
                {stationList.map(item => (
                  <MenuItem value={item.id}>{item.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl
              className={classes.formControl}
              style={{ marginLeft: '5%', marginRight: '5%' }}
            >
              <div className="MuiFormControl-root">
                <label
                  class={
                    !!selectedDate || showDatePicker
                      ? focusedLabelClass
                      : notFocusedLabelClass
                  }
                  data-shrink="false"
                  id="demo-simple-select-label"
                >
                  تاریخ
                </label>
                <div
                  class="MuiInputBase-root MuiInput-root MuiInput-underline MuiInputBase-formControl MuiInput-formControl"
                  style={{ width: 120 }}
                >
                  <div
                    class="MuiSelect-root MuiSelect-select MuiSelect-selectMenu MuiInputBase-input MuiInput-input"
                    role="button"
                    aria-haspopup="listbox"
                    aria-labelledby="label select"
                    id="select"
                    onClick={() => {
                      console.warn('showDatePicker', showDatePicker);
                      setShowDatePicker(!showDatePicker);
                    }}
                  >
                    <span>​{selectedDate}</span>
                  </div>
                  <input
                    aria-hidden="true"
                    class="MuiSelect-nativeInput"
                    value=""
                  />
                  <svg
                    class="MuiSvgIcon-root MuiSelect-icon"
                    focusable="false"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M7 10l5 5 5-5z"></path>
                  </svg>
                </div>
              </div>
              {showDatePicker && (
                <Calendar
                  // value={selectedDate}
                  onChange={date => {
                    setSelectedDate(`${date.year}/${date.month}/${date.day}`);
                    setShowDatePicker(false);
                  }}
                  locale="fa"
                  shouldHighlightWeekends
                />
              )}
            </FormControl>
          </CardContent>
        </Card>
      </Box>
    </div>
  );
};

Toolbar.propTypes = {
  className: PropTypes.string
};

export default Toolbar;
