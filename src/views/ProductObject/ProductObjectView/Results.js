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
  TextField
} from '@material-ui/core';
// import Toastify from '../../../../utils/toastify';
import {
  getProductObjects
} from 'src/redux/actions/api';
import { useSelector } from 'react-redux';
import { List } from 'react-feather';

const useStyles = makeStyles(theme => ({
  root: {},
  avatar: {
    marginRight: theme.spacing(2)
  }
}));

const Results = ({ className, newErrorModal, setNewErrorModal, ...rest }) => {
  const selector = useSelector(state => state);
  const classes = useStyles();
  const [productObjectList, setProductObjectList] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPage, setTotalPage] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [listLoading, setListLoading] = useState(true);
  const [selectedError, setSelectedError] = useState({});
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [newErrorLoading, setNewErrorLoading] = useState(false);
  const [newError, setNewError] = useState({
    maxErrorNum: '',
    errorType: ''
  });

  useEffect(() => {
    getObjects();
  }, []);

  const getObjects = () => {
    setListLoading(true);
    getProductObjects(selector.access_token, page, limit).then(data => {
      console.warn('KKKK', data);
      if (data.statusCode == 200) {
        setProductObjectList(data.data.items);
        setTotalPage(data.data.totalPages);
        setTotalItems(data.data.totalItems);
        setListLoading(false);
      } else if (data.statusCode == 401) {
        setProductObjectList([]);
        setListLoading(false);
      }
    });
  };

  const handleLimitChange = event => {
    setLimit(event.target.value);
  };

  const handlePageChange = state => {
    console.warn('state', state);
    if (state == 'pre') {
      if (page > 1) {
        setPage(page - 1);
      }
    } else {
      if (page < totalPage) {
        setPage(page + 1);
      }
    }
  };

//   const handleDeleteError = () => {
//     setDeleteLoading(true);
//     deleteQCError(selector.access_token, selectedError.id).then(data => {
//       if (data.statusCode == 200) {
//         setDeleteLoading(false);
//         setOpenDeleteModal(false);
//         Toastify.success('خطای مورد نظر با موفقیت حذف شد.');
//       } else if (data.statusCode == 401) {
//         setDeleteLoading(false);
//         setOpenDeleteModal(false);
//       } else {
//         setDeleteLoading(false);
//         setOpenDeleteModal(false);
//         Toastify.error('مشکلی پیش آمد. لطفا دوباره تلاش کنید.');
//       }
//       getErrors();
//     });
//   };

//   const handleNewErrorChange = event => {
//     if (event.target.name == 'errorType') {
//       setNewError({ ...newError, errorType: event.target.value });
//     } else {
//       setNewError({ ...newError, maxErrorNum: event.target.value });
//     }
//   };

//   const addNewQcError = () => {
//     setNewErrorLoading(true);
//     newQCError(
//       selector.access_token,
//       newError.errorType,
//       newError.maxErrorNum
//     ).then(data => {
//       setNewErrorModal(false);
//       setNewErrorLoading(false);
//       if (data.statusCode == 200) {
//         Toastify.success('خطای جدید با موفقیت اضافه شد.');
//         setNewError({ errorType: '', maxErrorNum: '' });
//       } else if (data.statusCode == 401) {
//       } else {
//         Toastify.error('مشکلی پیش آمد. لطفا دوباره تلاش کنید.');
//       }
//       getErrors();
//     });
//   };

  return listLoading ? (
    <div
      style={{
        display: 'flex',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <CircularProgress/>
    </div>
  ) : (
    <Card className={clsx(classes.root, className)} {...rest}>
      <PerfectScrollbar>
        <Box minWidth={1050}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>ERP Name</TableCell>
                <TableCell>White Print</TableCell>
                <TableCell>Versions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {productObjectList.slice(0, limit).map(object => (
                <TableRow hover key={object.id}>
                  <TableCell>{object.id}</TableCell>
                  <TableCell>{object.erpName}</TableCell>
                  <TableCell>{object.whitePrint}</TableCell>
                  <TableCell>
                    <Button
                      onClick={() => {
                        setOpenDeleteModal(true);
                        setSelectedError(object);
                      }}
                    >
                      <List size="20"/>
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
        labelDisplayedRows={() => {
        }}
        component="div"
        count={totalItems}
        onChangePage={(event, page) => console.warn('ppppp', page)}
        onChangeRowsPerPage={handleLimitChange}
        page={page}
        rowsPerPage={limit}
        rowsPerPageOptions={[5, 10, 25]}
      />
      {/* <Modal open={openDeleteModal} onClose={() => setOpenDeleteModal(false)}>
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
          <TextField
            fullWidth
            label="نوع خطا"
            margin="normal"
            name="errorType"
            onChange={event => handleNewErrorChange(event)}
            type="text"
            value={newError.errorType}
            variant="outlined"
          />
          <TextField
            fullWidth
            label="حداکثر تعداد خطا"
            margin="normal"
            name="maxErrorNum"
            onChange={event => handleNewErrorChange(event)}
            type="text"
            value={newError.maxErrorNum}
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
              {newErrorLoading ? (
                <CircularProgress color="whit" />
              ) : (
                <p>ثبت</p>
              )}
            </Button>
          </Box>
        </div>
      </Modal> */}
    </Card>
  );
};

Results.propTypes = {
  className: PropTypes.string
};

export default Results;
