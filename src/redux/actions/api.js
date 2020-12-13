import { LOCAL_HOST } from './types';

export const loginUser = (username, password) => {
  const msg = JSON.stringify({ userName: username, password });
  return fetch(`${LOCAL_HOST}/account/user/GetToken`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: msg
  }).then(response => response.json());
};

export const checkToken = token => {
  return fetch(`${LOCAL_HOST}/Admin/PanelView`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `bearer ${token}`
    }
  }).then(response => response.json());
};

export const getAllQCErrors = (token, page, take) => {
  return fetch(`${LOCAL_HOST}/Admin/QC/ErrorType?Page=${page}&Take=${take}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `bearer ${token}`
    }
  }).then(response => response.json());
};

export const deleteQCError = (token, id) => {
  const msg = JSON.stringify({ errorTypeId: id });
  return fetch(`${LOCAL_HOST}/Admin/QC/ErrorType/DeleteErrorType`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `bearer ${token}`
    },
    body: msg
  }).then(response => response.json());
};

export const newQCError = (token, errorType, maxErrorNum) => {
  const msg = JSON.stringify({
    errorType: errorType,
    maximumNumberOfErrors: parseInt(maxErrorNum)
  });
  return fetch(`${LOCAL_HOST}/Admin/QC/ErrorType/NewErrorType`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `bearer ${token}`
    },
    body: msg
  }).then(response => response.json());
};

export const SearchError = (token, errorType) => {
  const msg = JSON.stringify({
    errorType
  });
  return fetch(`${LOCAL_HOST}/Admin/QC/Errors/SearchErrorsTypes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `bearer ${token}`
    },
    body: msg
  }).then(response => response.json());
};

export const getProductLinesforDropDown = (token) => {
  return fetch(`${LOCAL_HOST}/Admin/QC/ProductLine`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `bearer ${token}`
    }
  }).then(response => response.json());
};

export const getStationsOfProductLineIdForDropDown = (token, productLineId) => {
  return fetch(`${LOCAL_HOST}/Admin/QC/ProductLine/WorkStations?ProductLineId=${productLineId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `bearer ${token}`
    }
  }).then(response => response.json());
};


export const getErrortypesOfAProductLine = (token, productLineId) => {
  return fetch(`${LOCAL_HOST}/Admin/QC/ProductLine/ErrorTypesForProductLine?ProductLineId=${productLineId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `bearer ${token}`
    }
  }).then(response => response.json());
};


export const getMiddleProductsOfAProductLine = (token, productLineId) => {
  return fetch(`${LOCAL_HOST}/Admin/QC/ProductLine/GetMiddleProducts?ProductLineId=${productLineId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `bearer ${token}`
    }
  }).then(response => response.json());
};

export const getProductObjects = (token, page, take) => {
  return fetch(`${LOCAL_HOST}/Admin/Qc/ProductObject?Page=${page}&Take=${take}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `bearer ${token}`
    }
  }).then((response) => response.json());
};
