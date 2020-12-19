import React, { useState } from 'react';
import { Box, Container, makeStyles } from '@material-ui/core';
import Page from 'src/components/Page';
import Results from './Results';
import Toolbar from './Toolbar';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  }
}));

const ListView = () => {
  const classes = useStyles();
  const [modalMode, setModalMode] = useState('');
  const [searchValue, setSearchValue] = useState('');

  return (
    <Page className={classes.root} title="Errors">
      <Container maxWidth={false}>
        <Toolbar
          setModalPurpose={value => setModalMode(value)}
          searchName={searchValue}
          setSearchName={name=>setSearchValue(name)}
        />
        <Box mt={3}>
          <Results
            modalPurpose={modalMode}
            setModalPurpose={value => setModalMode(value)}
            searchName={searchValue}
          />
        </Box>
      </Container>
    </Page>
  );
};

export default ListView;
