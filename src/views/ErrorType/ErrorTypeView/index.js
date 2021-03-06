import React, { useState, useEffect } from 'react';
import { Box, Container, makeStyles } from '@material-ui/core';
import Page from 'src/components/Page';
import AdminResults from './Results';
import AdminToolbar from './Toolbar';


const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  }
}));

const CustomerListView = () => {
  const classes = useStyles();
  const [openNewErrorModal, setOpenNewErrorModal] = useState(false);
  const [clientViewProductLine, setClientViewProductLine] = useState('');
  const [clientViewStation, setClientViewStation] = useState('');
  const [clientViewDateOfError, setClientViewDateOfError] = useState('');

  return (
    <Page className={classes.root} title="Errors">
      <Container maxWidth={false}>
        <AdminToolbar
          setOpenModal={value => setOpenNewErrorModal(value)}
          selectedProductLine={clientViewProductLine}
          setSelectedProductLine={value => {
            setClientViewProductLine({
              name: value.name,
              id: value.id
            });
          }}
          selectedStation={clientViewStation}
          setSelectedStation={value => setClientViewStation(value)}
          selectedDate={clientViewDateOfError}
          setSelectedDate={value => setClientViewDateOfError(value)}
        />
        <Box mt={3}>
          <AdminResults
            selectedProductLine={clientViewProductLine}
            selectedStation={clientViewStation}
            newErrorModal={openNewErrorModal}
            setNewErrorModal={value => setOpenNewErrorModal(value)}
            selectedDate={clientViewDateOfError}
          />
        </Box>
      </Container>
    </Page>
  );
};

export default CustomerListView;
