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
  TableRow,
  makeStyles,
  CircularProgress,
  Modal,
  TextField,
  Checkbox
} from '@material-ui/core';
import Toastify from '../../../utils/toastify';
import Autocomplete from '@material-ui/lab/Autocomplete';
import {
  getAllQCErrors,
  deleteQCError,
  newQCError,
  getErrortypesOfAProductLine,
  getMiddleProductsOfAProductLine,
  getAllObjects,
  getObjectVersions
} from '../../../redux/actions/api';
import { useSelector } from 'react-redux';
import { Trash, Check, X } from 'react-feather';
import TablePagination from "src/utils/TablePagination";

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
  const [limit, setLimit] = useState(1);
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
  const [selectedObject, setSelectedObject] = useState('');
  const [selectedObjectVersion, setSelectedObjectVersion] = useState('');
  const [errorCount, setErrorCount] = useState('');
  const [description, setDescription] = useState('');
  const [errorTypeList, setErrorTypeList] = useState([]);
  const [middleProductList, setMiddleProductList] = useState([]);
  const [objectsList, setObjectsList] = useState([]);
  const [objectVersionList, setObjectVersionList] = useState([]);
  const [objectsPage, setObjectsPage] = useState(1);
  const [isMiddleProductOutSourced, setIsMiddleProductOutSourced] = useState(
    false
  );


  useEffect(() => {
    getErrors();
  }, [page, limit]);

  useEffect(() => {
    getObjects();
  }, []);

  useEffect(() => {
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

  const handleSelectObject = value => {
    setSelectedObject(value);
    getObjectVersions(selector.access_token, value.id).then(data => {
      if (data.statusCode == 200) {
        setObjectVersionList(data.data);
      } else {
        //do something if request failed...
      }
    });
  };

  const getObjects = () => {
    let list = objectsList;
    getAllObjects(selector.access_token, objectsPage).then(data => {
      if (data.statusCode == 200) {
        data.data.map(item => {
          list.push(item);
        });
      } else {
        //do something if request failed...
      }
    });
    setObjectsList(list);
  };

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

  const addNewQcError = () => {
    setNewErrorLoading(true);
    if (middleProductList.length == 0) {
      setNewErrorLoading(false);
      setNewErrorModal(false);
      Toastify.error(
        'امکان ثبت خطا برای این خط تولید به دلیل عدم وجود محصول میانی وجود ندارد.'
      );
    } else if (errorTypeList.length==0){
      setNewErrorLoading(false);
      setNewErrorModal(false);
      Toastify.error(
        'امکان ثبت خطا برای این خط تولید به دلیل عدم وجود نوع خطا وجود ندارد.'
      );
    } else if (!selectedProductLine) {
      setNewErrorLoading(false);
      setNewErrorModal(false);
      Toastify.error('لطفا خط تولید را تعیین کنید.');
    } else if (selectedDate.length == 0) {
      setNewErrorLoading(false);
      setNewErrorModal(false);
      Toastify.error('لطفا تاریخ ثبت خطا را تعیین کنید.');
    } else if (!selectedStation) {
      setNewErrorLoading(false);
      setNewErrorModal(false);
      Toastify.error('لطفا ایستگاه ثبت خطا را تعیین کنید.');
    } else if (!selectedErrorTypeOfProductLine) {
      setNewErrorLoading(false);
      setNewErrorModal(false);
      Toastify.error('لطفا نوع خطا را تعیین کنید.');
    } else if (errorCount.length == 0) {
      setNewErrorLoading(false);
      setNewErrorModal(false);
      Toastify.error('لطفا تعداد خطا را تعیین کنید.');
    } else if (!selectedMiddleProductOfProductLine) {
      setNewErrorLoading(false);
      setNewErrorModal(false);
      Toastify.error('لطفا محصول میانی خطا را تعیین کنید.');
    } else if (description.length == 0) {
      setNewErrorLoading(false);
      setNewErrorModal(false);
      Toastify.error('لطفا توضیحات ثبت خطا را تعیین کنید.');
    } else if (!selectedObject) {
      setNewErrorLoading(false);
      setNewErrorModal(false);
      Toastify.error('لطفا object خطا را تعیین کنید.');
    } else if (!selectedObject) {
      setNewErrorLoading(false);
      setNewErrorModal(false);
      Toastify.error('لطفا ورژن object خطا را تعیین کنید.');
    } else {
      newQCError(
        selector.access_token,
        selectedProductLine.id,
        !!selectedObject ? selectedObject.id : '',
        errorCount,
        description,
        selectedDate,
        isMiddleProductOutSourced,
        !!selectedErrorTypeOfProductLine
          ? selectedErrorTypeOfProductLine.errorId
          : 0,
        !!selectedMiddleProductOfProductLine
          ? selectedMiddleProductOfProductLine.id
          : 0,
        selectedStation.id,
        !!selectedObjectVersion ? selectedObjectVersion.versionId : 0
      ).then(data => {
        setNewErrorModal(false);
        setNewErrorLoading(false);
        if (data.statusCode === 200) {
          Toastify.success('خطای جدید با موفقیت اضافه شد.');

        } else if (data.statusCode === 401) {
        } else {
          Toastify.error('مشکلی پیش آمد. لطفا دوباره تلاش کنید.');
        }
        getErrors();
      });
    }
  };

  const handleChangeErrorTypeOfProductLine = value => {
    setSelectedErrorTypeOFPRoductLine(value);
  };

  const handleChangeMiddleProduct = value => {
    setSelectedMiddleProductOfProductLine(value);
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
                <TableCell style={{textAlign:"center"}}>ID</TableCell>
                <TableCell style={{textAlign:"center"}}>نوع خطا</TableCell>
                <TableCell style={{textAlign:"center"}}>تعداد خطا</TableCell>
                <TableCell style={{textAlign:"center"}}>تاریخ</TableCell>
                <TableCell style={{textAlign:"center"}}>محصول میانی برون سپاری شده</TableCell>
                <TableCell style={{textAlign:"center"}}>نام محصول میانی</TableCell>
                <TableCell style={{textAlign:"center"}}>نام ایستگاه</TableCell>
                <TableCell style={{textAlign:"center"}}>نام شئ</TableCell>
                <TableCell style={{textAlign:"center"}}>نام نسخه شئ</TableCell>
                <TableCell style={{textAlign:"center"}}>نام کاربر</TableCell>
                <TableCell style={{textAlign:"center"}}>حذف خطا</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {errorList.slice(0, limit).map(error => (
                <TableRow hover key={error.id}>
                  <TableCell>{error.id}</TableCell>
                  <TableCell>{error.errorTypeName}</TableCell>
                  <TableCell>{error.errorCount}</TableCell>
                  <TableCell>{error.date}</TableCell>
                  <TableCell align="center">
                    {error.isMiddleProductOutSourced ? (
                      <Check size="20" style={{ alignSelf: 'center' }} />
                    ) : (
                      <X size="20" />
                    )}
                  </TableCell>
                  <TableCell>{error.middleProductName}</TableCell>
                  <TableCell>{error.workStationName}</TableCell>
                  <TableCell>{error.objectName}</TableCell>
                  <TableCell>{error.objectVersionName}</TableCell>
                  <TableCell>{error.userName}</TableCell>
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
        currentPage={page}
        totalPages={totalPage}
        take={limit}
        changePage={handlePageChange}
        changeTake={handleLimitChange}
        totalItems={totalItems}
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
              <Autocomplete
                options={errorTypeList}
                style={{ minWidth: 200 }}
                id="errorType"
                getOptionLabel={option => option.errorType}
                renderInput={params => (
                  <TextField {...params} label="نوع خطا" variant="outlined" />
                )}
                onChange={(event, newValue) =>
                  handleChangeErrorTypeOfProductLine(newValue)
                }
              />
            </Box>
            <Box
              display="flex"
              flexDirection="row"
              style={{ marginLeft: 15, marginRight: 30, alignItems: 'center' }}
            >
              {/* <p textAlign="right" style={{ width: 100 }}>
                تعداد خطا:
              </p> */}
              <TextField
                id="standard-basic"
                label="تعداد خطا"
                style={{ width: 200 }}
                onChange={event => setErrorCount(event.target.value)}
              />
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
              <Autocomplete
                options={middleProductList}
                style={{ minWidth: 200 }}
                id="middleProduct"
                getOptionLabel={option => option.name}
                renderInput={params => (
                  <TextField
                    {...params}
                    label="محصول میانی"
                    variant="outlined"
                  />
                )}
                onChange={(event, newValue) =>
                  handleChangeMiddleProduct(newValue)
                }
              />
            </Box>

            <Checkbox
              value="checkedA"
              inputProps={{ 'aria-label': 'Checkbox A' }}
              onChange={(event, newValue) =>
                setIsMiddleProductOutSourced(newValue)
              }
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
              <Autocomplete
                options={objectsList}
                style={{ minWidth: 200 }}
                id="objects"
                getOptionLabel={option => option.erpName}
                renderInput={params => (
                  <TextField {...params} label="Object" variant="outlined" />
                )}
                onChange={(event, newValue) => handleSelectObject(newValue)}
              />
            </Box>
            <Box
              display="flex"
              flexDirection="row"
              style={{ marginLeft: 15, marginRight: 30, alignItems: 'center' }}
            >
              <Autocomplete
                options={objectVersionList}
                style={{ minWidth: 200 }}
                id="objectVersion"
                getOptionLabel={option => option.versionName}
                renderInput={params => (
                  <TextField {...params} label="Object Version" variant="outlined" />
                )}
                onChange={(event, newValue) => {
                  setSelectedObjectVersion(newValue);
                }}
              />
            </Box>
          </Box>
          <br />
          <TextField
            multiline
            fullWidth
            label="توضیحات"
            margin="normal"
            name="description"
            onChange={event => {
              setDescription(event.target.value);
            }}
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
