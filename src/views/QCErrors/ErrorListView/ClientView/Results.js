import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import PerfectScrollbar from 'react-perfect-scrollbar';
import {
  Box,
  Card,
  Table,
  Button,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  makeStyles,
  CircularProgress,
  Modal,
  TextField,
  Select,
  MenuItem,
  Checkbox
} from '@material-ui/core';
import Toastify from '../../../../utils/toastify';
import {
  getAllQCErrors,
  deleteQCError,
  newQCError,
  getErrortypesOfAProductLine,
  getMiddleProductsOfAProductLine
} from '../../../../redux/actions/api';
import { useSelector } from 'react-redux';
import { Trash } from 'react-feather';

const useStyles = makeStyles(theme => ({
  root: {},
  avatar: {
    marginRight: theme.spacing(2)
  }
}));

const Results = ({
  className,
  newErrorModal,
  setNewErrorModal,
  selectedProductLine,
  selectedStation,
  selectedDate,
  ...rest
}) => {
  const selector = useSelector(state => state);
  const classes = useStyles();
  const [errorList, setErrorList] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPage, setTotalPage] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [listLoading, setListLoading] = useState(true);
  const [selectedError, setSelectedError] = useState({});
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [newErrorLoading, setNewErrorLoading] = useState(false);
  const [
    selectedErrorTypeOfProductLine,
    setSelectedErrorTypeOFPRoductLine
  ] = useState('');
  const [
    selectedMiddleProductOfProductLine,
    setSelectedMiddleProductOfProductLine
  ] = useState('');
  const [errorTypeList, setErrorTypeList] = useState([]);
  const [middleProductList, setMiddleProductList] = useState([]);
  const [newError, setNewError] = useState({
    maxErrorNum: '',
    errorType: ''
  });

  useEffect(() => {
    getErrors();
  }, [page, limit]);

  useEffect(() => {
    console.warn("sSSSS", selector.selectedProductLineOfErrorTab);
    getErrortypesOfAProductLine(
      selector.access_token,
      selector.selectedProductLineOfErrorTab
    ).then(data => {
      if (data.statusCode === 200) {
        setErrorTypeList(data.data);
      } else {
        setErrorTypeList([]);
        //do something in case of not getting success!
      }
    });

    getMiddleProductsOfAProductLine(
      selector.access_token,
      selector.selectedProductLineOfErrorTab
    ).then(data => {
      if (data.statusCode === 200) {
        setMiddleProductList(data.data);
      } else {
        setMiddleProductList([]);
        //do something in case of not getting success!
      }
    });
  }, [selector]);

  const getErrors = () => {
    setListLoading(true);
    getAllQCErrors(selector.access_token, page, limit).then(data => {
      if (data.statusCode === 200) {
        setErrorList(data.data.items);
        setTotalPage(data.data.totalPages);
        setTotalItems(data.data.totalItems);
        setListLoading(false);
      } else if (data.statusCode === 401) {
        setErrorList([]);
        setListLoading(false);
      }
    });
  };

  useEffect(() => {}, []);

  const handleLimitChange = event => {
    setLimit(event.target.value);
  };

  const handlePageChange = state => {
    if (state === 'pre') {
      if (page > 1) {
        setPage(page - 1);
      }
    } else {
      if (page < totalPage) {
        setPage(page + 1);
      }
    }
  };

  const handleDeleteError = () => {
    setDeleteLoading(true);
    deleteQCError(selector.access_token, selectedError.id).then(data => {
      if (data.statusCode === 200) {
        setDeleteLoading(false);
        setOpenDeleteModal(false);
        Toastify.success('خطای مورد نظر با موفقیت حذف شد.');
      } else if (data.statusCode === 401) {
        setDeleteLoading(false);
        setOpenDeleteModal(false);
      } else {
        setDeleteLoading(false);
        setOpenDeleteModal(false);
        Toastify.error('مشکلی پیش آمد. لطفا دوباره تلاش کنید.');
      }
      getErrors();
    });
  };

  const handleNewErrorChange = event => {
    if (event.target.name === 'errorType') {
      setNewError({ ...newError, errorType: event.target.value });
    } else {
      setNewError({ ...newError, maxErrorNum: event.target.value });
    }
  };

  const addNewQcError = () => {
    setNewErrorLoading(true);
    newQCError(
      selector.access_token,
      newError.errorType,
      newError.maxErrorNum
    ).then(data => {
      setNewErrorModal(false);
      setNewErrorLoading(false);
      if (data.statusCode === 200) {
        Toastify.success('خطای جدید با موفقیت اضافه شد.');
        setNewError({ errorType: '', maxErrorNum: '' });
      } else if (data.statusCode === 401) {
      } else {
        Toastify.error('مشکلی پیش آمد. لطفا دوباره تلاش کنید.');
      }
      getErrors();
    });
  };

  const handleChangeErrorTypeOfProductLine = event => {
    errorTypeList.map(item => {
      if (item.errorId === event.target.value) {
        setSelectedErrorTypeOFPRoductLine(item);
      }
    });
  };

  const handleChangeMiddleProduct = event => {
    middleProductList.map(item => {
      if (item.id === event.target.value) {
        setSelectedMiddleProductOfProductLine(item);
      }
    });
  };

  return listLoading ? (
    <div
      style={{
        display: 'flex',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <CircularProgress />
    </div>
  ) : (
    <Card className={clsx(classes.root, className)} {...rest}>
      <PerfectScrollbar>
        <Box minWidth={1050}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>نوع خطا</TableCell>
                <TableCell>تعداد خطا</TableCell>
                <TableCell>حذف خطا</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {errorList.slice(0, limit).map(error => (
                <TableRow hover key={error.id}>
                  <TableCell>{error.id}</TableCell>
                  <TableCell>{error.errorType}</TableCell>
                  <TableCell>{error.stationCount}</TableCell>
                  <TableCell>
                    <Button
                      onClick={() => {
                        setOpenDeleteModal(true);
                        setSelectedError(error);
                      }}
                    >
                      <Trash size="20" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </PerfectScrollbar>
      <TablePagination
        backIconButtonProps={{
          onClick: () => handlePageChange('next')
        }}
        nextIconButtonProps={{ disabled: false }}
        backIconButtonProps={{ disabled: false }}
        backIconButtonText="بعدی"
        nextIconButtonText="قبلی"
        nextIconButtonProps={{
          onClick: () => handlePageChange('pre')
        }}
        labelDisplayedRows={() => {}}
        component="div"
        count={totalItems}
        onChangePage={(event, page) => console.warn('ppppp', page)}
        onChangeRowsPerPage={handleLimitChange}
        page={page}
        rowsPerPage={limit}
        rowsPerPageOptions={[5, 10, 25]}
      />
      <Modal open={openDeleteModal} onClose={() => setOpenDeleteModal(false)}>
        <div
          style={{
            position: 'absolute',
            height: '17vh',
            backgroundColor: '#fff',
            padding: 20,
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)'
            // right: "25%"
          }}
        >
          <p style={{ textAlign: 'center' }}>
            آیا از پاک کردن خطا اطمینان دارید؟
          </p>
          <div
            style={{
              display: 'flex',
              width: '100%',
              height: '70%',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {deleteLoading ? (
              <CircularProgress />
            ) : (
              <row>
                <Button
                  color="primary"
                  variant="contained"
                  style={{ marginLeft: 10 }}
                  onClick={handleDeleteError}
                >
                  بله
                </Button>
                <Button
                  color="primary"
                  variant="contained"
                  style={{ marginRight: 10 }}
                  onClick={() => setOpenDeleteModal(false)}
                >
                  خیر
                </Button>
              </row>
            )}
          </div>
        </div>
      </Modal>
      <Modal open={newErrorModal} onClose={() => setNewErrorModal(false)}>
        <div
          style={{
            backgroundColor: '#fff',
            padding: 20,
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)'
          }}
        >
          <h4>ثبت خطا</h4>
          <br />
          <hr />
          <br />
          <Box display="flex" flexDirection="row">
            <Box
              display="flex"
              flexDirection="row"
              style={{ marginLeft: 15, marginRight: 15 }}
            >
              <p textAlign="right" style={{ width: 65 }}>
                خط تولید:{' '}
              </p>
              <p>
                {!!selectedProductLine && !!selectedProductLine.name
                  ? selectedProductLine.name
                  : '-'}
              </p>
            </Box>
            <Box
              display="flex"
              flexDirection="row"
              style={{ marginLeft: 15, marginRight: 15 }}
            >
              <p textAlign="right" style={{ width: 65 }}>
                ایستگاه:{' '}
              </p>
              <p>{!!selectedStation ? selectedStation.name : '-'}</p>
            </Box>
            <Box
              display="flex"
              flexDirection="row"
              style={{ marginLeft: 15, marginRight: 15 }}
            >
              <p textAlign="right" style={{ width: 65 }}>
                تاریخ:{' '}
              </p>
              <p>{!!selectedDate ? selectedDate : '-'}</p>
            </Box>
          </Box>
          <br />
          <br />
          <Box display="flex" flexDirection="row">
            <Box
              display="flex"
              flexDirection="row"
              style={{ marginLeft: 30, marginRight: 15, alignItems: 'center' }}
            >
              <p textAlign="right" style={{ width: 100 }}>
                نوع خطا:
              </p>
              <Select
                labelId="label"
                id="select"
                value={
                  !!selectedErrorTypeOfProductLine
                    ? selectedErrorTypeOfProductLine.errorId
                    : ''
                }
                style={{ minWidth: 100 }}
                onChange={handleChangeErrorTypeOfProductLine}
              >
                {!!errorTypeList && errorTypeList.length > 0 ? (
                  errorTypeList.map(item => (
                    <MenuItem value={item.errorId}>{item.errorType}</MenuItem>
                  ))
                ) : (
                  <MenuItem value="" disabled>
                    خطایی موجود نیست.
                  </MenuItem>
                )}
              </Select>
            </Box>
            <Box
              display="flex"
              flexDirection="row"
              style={{ marginLeft: 15, marginRight: 30, alignItems: 'center' }}
            >
              <p textAlign="right" style={{ width: 100 }}>
                تعداد خطا:
              </p>
              <Select
                labelId="label"
                id="select"
                value="20"
                style={{ minWidth: 100 }}
              >
                <MenuItem value="10">Ten</MenuItem>
                <MenuItem value="20">Twenty</MenuItem>
              </Select>
            </Box>
          </Box>
          <br />
          <br />
          <Box
            display="flex"
            flexDirection="row"
            style={{ alignItems: 'center' }}
          >
            <Box
              display="flex"
              flexDirection="row"
              style={{ marginLeft: 30, marginRight: 15, alignItems: 'center' }}
            >
              <p textAlign="right" style={{ width: 100 }}>
                محصول میانی:{' '}
              </p>
              <Select
                labelId="label"
                id="select"
                value={
                  !!selectedMiddleProductOfProductLine
                    ? selectedMiddleProductOfProductLine.id
                    : ''
                }
                style={{ minWidth: 100 }}
                onChange={handleChangeMiddleProduct}
              >
                {!!middleProductList && middleProductList.length>0 ?
                  middleProductList.map(item => (
                    <MenuItem value={item.id}>{item.name}</MenuItem>
                  )):(
                    <MenuItem value="" disabled>محصول میانی موجود نیست.</MenuItem>
                  )}
              </Select>
            </Box>

            <Checkbox
              value="checkedA"
              inputProps={{ 'aria-label': 'Checkbox A' }}
            />
            <p>محصول میانی برون سپاری شده</p>
          </Box>
          <br />
          <br />
          <Box display="flex" flexDirection="row">
            <Box
              display="flex"
              flexDirection="row"
              style={{ marginLeft: 30, marginRight: 15, alignItems: 'center' }}
            >
              <p textAlign="right" style={{ width: 100 }}>
                Object:
              </p>
              <Select
                labelId="label"
                id="select"
                value="20"
                style={{ minWidth: 100 }}
              >
                <MenuItem value="10">Ten</MenuItem>
                <MenuItem value="20">Twenty</MenuItem>
                <MenuItem value="30">Ten</MenuItem>
                <MenuItem value="40">Twenty</MenuItem>
              </Select>
            </Box>
            <Box
              display="flex"
              flexDirection="row"
              style={{ marginLeft: 15, marginRight: 30, alignItems: 'center' }}
            >
              <p textAlign="right" style={{ width: 100 }}>
                Version:
              </p>
              <Select
                labelId="label"
                id="select"
                value="20"
                style={{ minWidth: 100 }}
              >
                <MenuItem value="10">Ten</MenuItem>
                <MenuItem value="20">Twenty</MenuItem>
              </Select>
            </Box>
          </Box>
          <br />
          <TextField
            multiline
            fullWidth
            label="توضیحات"
            margin="normal"
            name="description"
            onChange={event => {}}
            type="text"
            variant="outlined"
          />
          <Box my={2}>
            <Button
              color="primary"
              disabled={newErrorLoading}
              fullWidth
              size="large"
              type="submit"
              variant="contained"
              onClick={addNewQcError}
            >
              {newErrorLoading ? <CircularProgress color="whit" /> : <p>ثبت</p>}
            </Button>
          </Box>
        </div>
      </Modal>
    </Card>
  );
};

Results.propTypes = {
  className: PropTypes.string
};

export default Results;
