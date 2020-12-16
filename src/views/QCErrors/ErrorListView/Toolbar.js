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
  InputLabel,
  TextField
} from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import {
  getProductLinesforDropDown,
  getStationsOfProductLineIdForDropDown
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
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    function handleResize() {
      setWindowWidth(window.innerWidth);
    }
    window.addEventListener('resize', handleResize);
  });

  useEffect(() => {
    if (productLineList.length == 0) {
      getProductLinesforDropDown(selector.access_token).then(data => {
        if (data.statusCode == 200) {
          setProductLineList(data.data.items);
        }
      });
    }
  });

  const handleChangeProductLine = value => {
    if (!!value) {
      dispatch({
        type: SET_SELECTED_PRODUCT_LINE,
        selectedProductLineOfErrorTab: value.id
      });
    }
    setStationList([]);
    setSelectedProductLine(value);
    if (!!value) {
      getStationsOfProductLineIdForDropDown(
        selector.access_token,
        value.id
      ).then(data => {
        if (data.statusCode == 200) {
          setStationList(data.data.items);
        } else {
          setStationList([]);
          //do something in case of not getting success!
        }
      });
    }
  };

  const handleChangeStation = value => {
    setSelectedStation(value);
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
              style={{ marginLeft: '1%', marginRight: '1%' }}
            >
              <Autocomplete
                options={productLineList}
                style={{ minWidth: 200 }}
                id="ProductLine"
                getOptionLabel={option => option.name}
                renderInput={params => (
                  <TextField {...params} label="خط تولید" variant="outlined" />
                )}
                onChange={(event, newValue) =>
                  handleChangeProductLine(newValue)
                }
              />
            </FormControl>
            <FormControl
              className={classes.formControl}
              style={{ marginLeft: '1%', marginRight: '1%' }}
            >
              <Autocomplete
                options={stationList}
                style={{ minWidth: 200 }}
                id="Station"
                getOptionLabel={option => option.name}
                renderInput={params => (
                  <TextField {...params} label="ایستکاه" variant="outlined" />
                )}
                onChange={(event, newValue) => handleChangeStation(newValue)}
              />
            </FormControl>
            <FormControl
              className={classes.formControl}
              style={{ marginLeft: '1%', marginRight: '1%' }}
            >
              <TextField
                style={{
                  marginTop: windowWidth > 500 ? 0 : 15,
                  marginBottom: 0,
                  width: 200
                }}
                fullWidth
                label="تاریخ"
                margin="normal"
                name="date"
                type="text"
                value={selectedDate}
                variant="outlined"
                onClick={() => setShowDatePicker(true)}
              />
              {showDatePicker && (
                <Calendar
                  onChange={date => {
                    setSelectedDate(
                      `${date.year}/${date.month.toString().length == 2 ? '' : '0'}${
                        date.month
                      }/${date.day.toString().length == 2 ? '' : '0'}${date.day}`
                    );
                    setShowDatePicker(false);
                  }}
                  locale="fa"
                  shouldHighlightWeekends
                  inputPlaceholder="select"
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
