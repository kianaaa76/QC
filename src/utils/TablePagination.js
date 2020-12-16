import React from 'react';
import { Button, Select, MenuItem } from '@material-ui/core';
import { ChevronLeft, ChevronRight } from 'react-feather';

const TablePagination = ({
  currentPage,
  totalPages,
  take,
  changePage,
  changeTake,
  totalItems
}) => {
  return (
    <div
      style={{
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        padding: 10
      }}
    >
      <row
        style={{
          float: 'right',
          marginRight: 20,
          height: '100%',
          alignSelft: 'center',
          alignItems: 'center',
          display: "flex",
        }}
      >
        Total Items: {totalItems}
      </row>
      <row
        style={{
          float: 'left',
          height: '100%',
          alignItems: 'center',
          display: "flex",
        }}
      >
        <span style={{ marginLeft: 20, marginRight: 20 }}>Rows per page</span>
        <Select
          onChange={value => changeTake(value)}
          value={take}
          style={{ minWidth: 60 }}
        >
          <MenuItem value="1">1</MenuItem>
          <MenuItem value="5">5</MenuItem>
          <MenuItem value="10">10</MenuItem>
          <MenuItem value="20">20</MenuItem>
        </Select>
        <Button
          disabled={currentPage == totalPages}
          onClick={() => changePage('next')}
        >
          <ChevronRight />
        </Button>
        <Button disabled={currentPage == '1'} onClick={() => changePage('pre')}>
          <ChevronLeft />
        </Button>
      </row>
    </div>
  );
};

export default TablePagination;
