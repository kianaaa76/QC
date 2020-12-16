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
import Toastify from '../../../utils/toastify';
import {
  getProductObjects,
  deleteProductObject,
  newProductObject,
  editProductObject
} from 'src/redux/actions/api';
import { useSelector } from 'react-redux';
import { List, Trash, Edit } from 'react-feather';

const useStyles = makeStyles(theme => ({
  root: {},
  avatar: {
    marginRight: theme.spacing(2)
  }
}));

const Results = ({ className, modalPurpose, setModalPurpose, ...rest }) => {
  const selector = useSelector(state => state);
  const classes = useStyles();
  const [productObjectList, setProductObjectList] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPage, setTotalPage] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [listLoading, setListLoading] = useState(true);
  const [selectedObject, setSelectedObject] = useState({});
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [newObjectLoading, setNewObjectLoading] = useState(false);
  const [newObject, setNewObject] = useState({
    erpName: '',
    whitePrint: ''
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
      } else {
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

  const handleDeleteObject = () => {
    setDeleteLoading(true);
    deleteProductObject(selector.access_token, selectedObject.id).then(data => {
      if (data.statusCode == 200) {
        setDeleteLoading(false);
        setOpenDeleteModal(false);
        Toastify.success('object مورد نظر با موفقیت حذف شد.');
      } else if (data.statusCode == 401) {
        setDeleteLoading(false);
        setOpenDeleteModal(false);
      } else {
        setDeleteLoading(false);
        setOpenDeleteModal(false);
        Toastify.error('مشکلی پیش آمد. لطفا دوباره تلاش کنید.');
      }
      getObjects();
    });
    setSelectedObject({});
  };

  const handleNewObjectFields = event => {
    if (event.target.name == 'erpName') {
      setNewObject({ ...newObject, erpName: event.target.value });
    } else {
      setNewObject({ ...newObject, whitePrint: event.target.value });
    }
  };

  const addNewObject = () => {
    setNewObjectLoading(true);
    newProductObject(
      selector.access_token,
      newObject.erpName,
      newObject.whitePrint
    ).then(data => {
      setModalPurpose('');
      setNewObjectLoading(false);
      if (data.statusCode == 200) {
        Toastify.success('object جدید با موفقیت اضافه شد.');
        setNewObject({ erpName: '', whitePrint: '' });
        getObjects();
      } else if (data.statusCode == 401) {
      } else {
        Toastify.error('مشکلی پیش آمد. لطفا دوباره تلاش کنید.');
      }
    });
  };

  const handeEditObjectFields = event => {
    if (event.target.name == 'erpName') {
      setSelectedObject({ ...selectedObject, erpName: event.target.value });
    } else {
      setSelectedObject({ ...selectedObject, whitePrint: event.target.value });
    }
  };

  const handleEditObject = () => {
    setNewObjectLoading(true);
    editProductObject(
      selector.access_token,
      selectedObject.id,
      selectedObject.erpName,
      selectedObject.whitePrint
    ).then(data => {
      if (data.statusCode == 200) {
        Toastify.success('object با موفقیت به روزرسانی شد.');
        setNewObjectLoading(false);
        setModalPurpose('');
        setSelectedObject({});
        getObjects();
      } else if (data.statusCode == 401) {
      } else {
        Toastify.error('مشکلی پیش آمد. لطفا دوباره تلاش کنید.');
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
                <TableCell align="center">ID</TableCell>
                <TableCell align="center">ERP Name</TableCell>
                <TableCell align="center">White Print</TableCell>
                <TableCell align="center">Versions</TableCell>
                <TableCell align="center">به روزرسانی object</TableCell>
                <TableCell align="center">حذف object</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {productObjectList.slice(0, limit).map(object => (
                <TableRow hover key={object.id}>
                  <TableCell align="center">{object.id}</TableCell>
                  <TableCell align="center">{object.erpName}</TableCell>
                  <TableCell align="center">{object.whitePrint}</TableCell>
                  <TableCell align="center">
                    <Button
                      onClick={() => {
                        setOpenDeleteModal(true);
                        setSelectedObject(object);
                      }}
                    >
                      <List size="20" />
                    </Button>
                  </TableCell>
                  <TableCell align="center">
                    <Button
                      onClick={() => {
                        setSelectedObject(object);
                        setModalPurpose('edit');
                      }}
                    >
                      <Edit size="20" />
                    </Button>
                  </TableCell>
                  <TableCell align="center">
                    <Button
                      onClick={() => {
                        setSelectedObject(object);
                        setOpenDeleteModal(true);
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
            آیا از پاک کردن object اطمینان دارید؟
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
                  onClick={handleDeleteObject}
                >
                  بله
                </Button>
                <Button
                  color="primary"
                  variant="contained"
                  style={{ marginRight: 10 }}
                  onClick={() => {
                    setSelectedObject({});
                    setOpenDeleteModal(false);
                  }}
                >
                  خیر
                </Button>
              </row>
            )}
          </div>
        </div>
      </Modal>
      <Modal
        open={modalPurpose.length > 0 ? true : false}
        onClose={() => setModalPurpose('')}
      >
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
          {modalPurpose == 'new' ? (
            <h4>ثبت object</h4>
          ) : (
            <h4>به روزرسانی object</h4>
          )}
          <br />
          <hr />
          <br />
          <TextField
            fullWidth
            label="ERP Name"
            margin="normal"
            name="erpName"
            onChange={event =>
              modalPurpose == 'new'
                ? handleNewObjectFields(event)
                : handeEditObjectFields(event)
            }
            type="text"
            value={
              modalPurpose == 'new' ? newObject.erpName : selectedObject.erpName
            }
            variant="outlined"
          />
          <TextField
            fullWidth
            label="White Print"
            margin="normal"
            name="whitePrint"
            onChange={event =>
              modalPurpose == 'new'
                ? handleNewObjectFields(event)
                : handeEditObjectFields(event)
            }
            type="text"
            value={
              modalPurpose == 'new'
                ? newObject.whitePrint
                : selectedObject.whitePrint
            }
            variant="outlined"
          />
          <Box my={2}>
            <Button
              color="primary"
              disabled={newObjectLoading}
              fullWidth
              size="large"
              type="submit"
              variant="contained"
              onClick={modalPurpose=="new" ? addNewObject : handleEditObject}
            >
              {newObjectLoading ? (
                <CircularProgress color="whit" />
              ) : (
                <p>ثبت</p>
              )}
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
