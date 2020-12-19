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
  TextField
} from '@material-ui/core';
import Toastify from '../../../utils/toastify';
import {
  getProductObjects,
  deleteProductObject,
  newProductObject,
  editProductObject,
  getProductObjectVersions,
  deleteObjectVersion,
  addObjectVersion,
  editObjectVersion,
  searchProductObject
} from 'src/redux/actions/api';
import { useSelector } from 'react-redux';
import { List, Trash, Edit, Check, X, Plus } from 'react-feather';
import TablePagination from '../../../utils/TablePagination';

const useStyles = makeStyles(theme => ({
  root: {},
  avatar: {
    marginRight: theme.spacing(2)
  }
}));

const Results = ({
  className,
  modalPurpose,
  setModalPurpose,
  searchName,
  ...rest
}) => {
  const selector = useSelector(state => state);
  const classes = useStyles();
  const [productObjectList, setProductObjectList] = useState([]);
  const [objectPage, setObjectPage] = useState(1);
  const [objectLimit, setObjectLimit] = useState(10);
  const [objectTotalPage, setObjectTotalPage] = useState(0);
  const [objectTotalItems, setObjectTotalItems] = useState(0);
  const [versionPage, setVersionPage] = useState(1);
  const [versionLimit, setVersionLimit] = useState(10);
  const [versionTotalItems, setVersionTotalItems] = useState(0);
  const [versionTotalPages, setVersionTotalPages] = useState(0);
  const [listLoading, setListLoading] = useState(true);
  const [selectedObject, setSelectedObject] = useState({});
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [newObjectLoading, setNewObjectLoading] = useState(false);
  const [openVersionsModal, setOpenVersionsModal] = useState(false);
  const [versionTableLoading, setVersionTableLoading] = useState(true);
  const [versionList, setVersionList] = useState([]);
  const [newObject, setNewObject] = useState({
    erpName: '',
    whitePrint: ''
  });
  const [deletingVersion, setDeletingVersion] = useState(null);
  const [deleteVersionLoading, setDeleteVersionLoading] = useState(false);
  const [openNewVersionModal, setOpenNewVersionModal] = useState(false);
  const [newVersionName, setNewVersionName] = useState('');
  const [newVersionLoading, setNewVersionLoading] = useState(false);
  const [edittingVersion, setEdittingVersion] = useState(null);
  const [editVersionLoading, setEditVersionLoading] = useState(false);
  const [edittingVersionName, setEdittingVersionName] = useState('');

  useEffect(() => {
    getObjects();
  }, [objectLimit, objectPage]);

  useEffect(() => {
    const abortController = new AbortController();
    if (searchName.length >= 3) {
      setListLoading(true);
      searchProductObject(
        selector.access_token,
        searchName,
        abortController
      ).then(data => {
        if (data.statusCode == 200) {
          setProductObjectList(data.data);
          setListLoading(false);
        } else {
          setListLoading(false);
          Toastify.error(data.data);
        }
      });
    } else if (searchName == "") {
      getObjects();
    }else {
      setListLoading(false);
    }
    return function cancel() {
      abortController.abort();
    };
  }, [searchName]);

  const getObjects = () => {
    setListLoading(true);
    getProductObjects(selector.access_token, objectPage, objectLimit).then(
      data => {
        if (data.statusCode == 200) {
          setProductObjectList(data.data.items);
          setObjectTotalPage(data.data.totalPages);
          setObjectTotalItems(data.data.totalItems);
          setListLoading(false);
        } else if (data.statusCode == 401) {
          setProductObjectList([]);
          setListLoading(false);
        } else {
          setListLoading(false);
        }
      }
    );
  };

  const handleLimitChange = (event, table) => {
    if (table == 'object') {
      setObjectLimit(event.target.value);
    } else {
      setVersionLimit(event.target.value);
      getVersions(selectedObject.id);
    }
  };

  const handlePageChange = (state, table) => {
    if (table == 'object') {
      if (state == 'pre') {
        if (objectPage > 1) {
          setObjectPage(objectPage - 1);
        }
      } else {
        if (objectPage < objectTotalPage) {
          setObjectPage(objectPage + 1);
        }
      }
    } else {
      if (state == 'pre') {
        if (versionPage > 1) {
          setVersionLimit(versionPage - 1);
        }
      } else {
        if (versionPage < versionTotalPages) {
          setVersionPage(versionPage + 1);
        }
      }
      getVersions(selectedObject.id);
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

  const getVersions = objectId => {
    setVersionTableLoading(true);
    getProductObjectVersions(
      selector.access_token,
      objectId,
      versionLimit,
      versionPage
    ).then(data => {
      if (data.statusCode == 200) {
        setVersionTotalItems(data.data.totalItems);
        setVersionTotalPages(data.data.totalPages);
        setVersionList(data.data.items);
        setVersionTableLoading(false);
      } else {
        setVersionTableLoading(false);
        //do something!
      }
    });
  };

  const handleOnVersionsPress = object => {
    setSelectedObject(object);
    setOpenVersionsModal(true);
    getVersions(object.id);
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

  const handleDeleteVersion = () => {
    setDeleteVersionLoading(true);
    deleteObjectVersion(
      selector.access_token,
      selectedObject.id,
      deletingVersion.versionId
    ).then(data => {
      if (data.statusCode == 200) {
        setDeleteVersionLoading(false);
        setDeletingVersion(null);
        setOpenVersionsModal(false);
        Toastify.success('نسخه object یا موفقیت حذف شد.');
      } else {
        setDeleteVersionLoading(false);
        Toastify.error(data.data);
      }
    });
  };

  const handleAddNewVersion = () => {
    setNewVersionLoading(true);
    addObjectVersion(
      selector.access_token,
      selectedObject.id,
      newVersionName
    ).then(data => {
      if (data.statusCode == 200) {
        setNewVersionLoading(false);
        setOpenNewVersionModal(false);
        Toastify.success('Version جدید با موفقیت اضافه شد.');
      } else {
        setNewVersionLoading(false);
        Toastify.error(data.data);
      }
    });
  };

  const handleEditVersion = () => {
    setEditVersionLoading(true);
    setEdittingVersionName(edittingVersion.versionName);
    editObjectVersion(
      selector.access_token,
      selectedObject.id,
      edittingVersion.versionId,
      edittingVersionName
    ).then(data => {
      if (data.statusCode == 200) {
        setEditVersionLoading(false);
        setEdittingVersion(null);
        setEdittingVersionName('');
        Toastify.success('Version با موفقیت به روزرسانی شد.');
        getVersions(selectedObject.id);
      } else {
        setEditVersionLoading(false);
        Toastify.error(data.data);
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
                <TableCell align="center">افزودن Version</TableCell>
                <TableCell align="center">به روزرسانی object</TableCell>
                <TableCell align="center">حذف object</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {productObjectList.slice(0, objectLimit).map(object => (
                <TableRow hover key={object.id}>
                  <TableCell align="center">{object.id}</TableCell>
                  <TableCell align="center">{object.erpName}</TableCell>
                  <TableCell align="center">{object.whitePrint}</TableCell>
                  <TableCell align="center">
                    <Button
                      onClick={() => {
                        handleOnVersionsPress(object);
                      }}
                    >
                      <List size="20" />
                    </Button>
                  </TableCell>
                  <TableCell align="center">
                    <Button
                      onClick={() => {
                        setSelectedObject(object);
                        setOpenNewVersionModal(true);
                      }}
                    >
                      <Plus />
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
        currentPage={objectPage}
        totalPages={objectTotalPage}
        take={objectLimit}
        changePage={state => handlePageChange(state, 'object')}
        changeTake={event => handleLimitChange(event, 'object')}
        totalItems={objectTotalItems}
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
              onClick={modalPurpose == 'new' ? addNewObject : handleEditObject}
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
      <Modal
        open={openVersionsModal}
        onClose={() => setOpenVersionsModal(false)}
      >
        <div
          style={{
            width: '80%',
            height: '60%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#fff',
            padding: 20,
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)'
          }}
        >
          {versionTableLoading ? (
            <CircularProgress />
          ) : (
            <Box width={'100%'} height={'100%'}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell align="center">ID</TableCell>
                    <TableCell align="center">نام نسخه</TableCell>
                    <TableCell align="center">به روزرسانی نسخه</TableCell>
                    <TableCell align="center">حذف نسخه</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {versionList.slice(0, versionLimit).map(version => (
                    <TableRow hover key={version.versionId}>
                      <TableCell align="center">{version.versionId}</TableCell>
                      <TableCell align="center">
                        {!!edittingVersion &&
                        edittingVersion.versionId == version.versionId ? (
                          <TextField
                            defaultValue={version.versionName}
                            onChange={event =>
                              setEdittingVersionName(event.target.value)
                            }
                          />
                        ) : (
                          version.versionName
                        )}
                      </TableCell>
                      <TableCell align="center">
                        {editVersionLoading &&
                        edittingVersion.versionId == version.versionId ? (
                          <CircularProgress />
                        ) : !!edittingVersion &&
                          edittingVersion.versionId == version.versionId ? (
                          <row>
                            <Button onClick={handleEditVersion}>
                              <Check />
                            </Button>
                            <Button
                              onClick={() => {
                                setEdittingVersion(null);
                              }}
                            >
                              <X />
                            </Button>
                          </row>
                        ) : (
                          <Button
                            onClick={() => {
                              setEdittingVersion(version);
                            }}
                          >
                            <Edit size="20" />
                          </Button>
                        )}
                      </TableCell>
                      <TableCell align="center">
                        {deleteVersionLoading &&
                        deletingVersion.versionId == version.versionId ? (
                          <CircularProgress />
                        ) : !!deletingVersion &&
                          deletingVersion.versionId == version.versionId ? (
                          <row>
                            <Button onClick={handleDeleteVersion}>
                              <Check />
                            </Button>
                            <Button
                              onClick={() => {
                                setDeletingVersion(null);
                              }}
                            >
                              <X />
                            </Button>
                          </row>
                        ) : (
                          <Button
                            onClick={() => {
                              setDeletingVersion(version);
                            }}
                          >
                            <Trash size="20" />
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <TablePagination
                currentPage={versionPage}
                totalPages={versionTotalPages}
                take={versionLimit}
                changePage={state => handlePageChange(state, 'version')}
                changeTake={event => handleLimitChange(event, 'version')}
                totalItems={versionTotalItems}
              />
            </Box>
          )}
        </div>
      </Modal>
      <Modal
        open={openNewVersionModal}
        onClose={() => setOpenNewVersionModal(false)}
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
          <h4>ثبت Version</h4>
          <br />
          <hr />
          <TextField
            fullWidth
            label="Version Name"
            margin="normal"
            name="versionName"
            onChange={event => setNewVersionName(event.target.value)}
            type="text"
            value={newVersionName}
            variant="outlined"
          />
          <Button
            color="primary"
            disabled={newVersionLoading}
            fullWidth
            size="large"
            type="submit"
            variant="contained"
            onClick={handleAddNewVersion}
          >
            {newVersionLoading ? <CircularProgress color="whit" /> : <p>ثبت</p>}
          </Button>
        </div>
      </Modal>
    </Card>
  );
};

Results.propTypes = {
  className: PropTypes.string
};

export default Results;
