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

export const getAllErrorTypes = (token, page, take) => {
  return fetch(`${LOCAL_HOST}/Admin/QC/ErrorType?Page=${page}&Take=${take}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `bearer ${token}`
    }
  }).then(response => response.json());
};

export const getAllQCErrors = (token, page, take) => {
  return fetch(`${LOCAL_HOST}/Admin/QC/Errors?Page=${page}&Take=${take}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `bearer ${token}`
    }
  }).then(response => response.json());
};

export const deleteQCError = (token, id) => {
  const msg = JSON.stringify({ errorId: id });
  return fetch(`${LOCAL_HOST}/Admin/QC/Errors/DeleteError`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `bearer ${token}`
    },
    body: msg
  }).then(response => response.json());
};

export const newErrorType = (token, errorType, maxErrorNum) => {
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

export const getProductLinesforDropDown = token => {
  return fetch(`${LOCAL_HOST}/Admin/QC/ProductLine`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `bearer ${token}`
    }
  }).then(response => response.json());
};

export const getStationsOfProductLineIdForDropDown = (token, productLineId) => {
  return fetch(
    `${LOCAL_HOST}/Admin/QC/ProductLine/WorkStations?ProductLineId=${productLineId}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `bearer ${token}`
      }
    }
  ).then(response => response.json());
};

export const getErrortypesOfAProductLine = (token, productLineId) => {
  return fetch(
    `${LOCAL_HOST}/Admin/QC/ProductLine/ErrorTypesForProductLine?ProductLineId=${productLineId}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `bearer ${token}`
      }
    }
  ).then(response => response.json());
};

export const getMiddleProductsOfAProductLine = (token, productLineId) => {
  return fetch(
    `${LOCAL_HOST}/Admin/QC/ProductLine/GetMiddleProducts?ProductLineId=${productLineId}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `bearer ${token}`
      }
    }
  ).then(response => response.json());
};

export const getProductObjects = (token, page, take) => {
  return fetch(
    `${LOCAL_HOST}/Admin/Qc/ProductObject?Page=${page}&Take=${take}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `bearer ${token}`
      }
    }
  ).then(response => response.json());
};

export const newProductObject = (token, erpName, whitePrint) => {
  const msg = JSON.stringify({
    erpName,
    whitePrint
  });
  return fetch(`${LOCAL_HOST}/Admin/Qc/ProductObject/NewProductObject`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `bearer ${token}`
    },
    body: msg
  }).then(response => response.json());
};

export const deleteProductObject = (token, objectId) => {
  const msg = JSON.stringify({
    objectId
  });
  return fetch(`${LOCAL_HOST}/Admin/Qc/ProductObject/DeleteObject`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `bearer ${token}`
    },
    body: msg
  }).then(response => response.json());
};

export const editProductObject = (token, objectId, erpName, whitePrint) => {
  const msg = JSON.stringify({
    objectId,
    erpName,
    whitePrint
  });
  return fetch(`${LOCAL_HOST}/Admin/Qc/ProductObject/EditObject`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `bearer ${token}`
    },
    body: msg
  }).then(response => response.json());
};

export const getAllObjects = (token, page) => {
  return fetch(`${LOCAL_HOST}/Admin/Qc/Errors/Objects?Page=${page}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `bearer ${token}`
    }
  }).then(response => response.json());
};

export const getObjectVersions = (token, objectId) => {
  return fetch(
    `${LOCAL_HOST}/Admin/Qc/Errors/ObjectVersions?objectId=${objectId}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `bearer ${token}`
      }
    }
  ).then(response => response.json());
};

export const newQCError = (
  token,
  productLineId,
  objectId,
  count,
  description,
  registeredDate,
  isMiddleProductOutSourced,
  errorTypeId,
  middleProductId,
  workStationId,
  objectVersionId
) => {
  const msg = JSON.stringify({
    productLineId,
    objectId,
    count: parseInt(count),
    description,
    registeredDate,
    isMiddleProductOutSourced,
    errorTypeId,
    middleProductId,
    workStationId,
    objectVersionId
  });
  return fetch(`${LOCAL_HOST}/Admin/Qc/Errors/NewError`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `bearer ${token}`
    },
    body: msg
  }).then(response => response.json());
};

export const getProductObjectVersions = (token, objectId, take, page) => {
  return fetch(
    `${LOCAL_HOST}/Admin/Qc/ProductObject/ObjectVersions?ObjectId=${objectId}&Take=${take}&Page=${page}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `bearer ${token}`
      }
    }
  ).then(response => response.json());
};

export const deleteObjectVersion = (token, objectId, versionId) =>{
  const msg = JSON.stringify({
    objectId,
    versionId
  });
  return fetch(
    `${LOCAL_HOST}/Admin/Qc/ProductObject/DeleteVersion`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `bearer ${token}`
      },
      body: msg
    }
  ).then(response => response.json());
}

export const addObjectVersion = (token, productObjectId, versionName) => {
  const msg = JSON.stringify({
    productObjectId,
    versionName
  });
  return fetch(
    `${LOCAL_HOST}/Admin/Qc/ProductObject/NewVersion`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `bearer ${token}`
      },
      body: msg
    }
  ).then(response => response.json());
}

export const editObjectVersion = (token, objectId, versionId, versionName) =>{
  const msg = JSON.stringify({
    objectId,
    versionId,
    versionName
  });
  return fetch(
    `${LOCAL_HOST}/Admin/Qc/ProductObject/EditVersion`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `bearer ${token}`
      },
      body: msg
    }
  ).then(response => response.json());
}

export const searchProductObject = (token, name, controller) =>{
  return fetch(
    `${LOCAL_HOST}/Admin/Qc/ProductObject/SearchObject?name=${name}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `bearer ${token}`
      },
      signal: controller.signal,
    }
  ).then(response => response.json());
}

export const getAllProductLines = (token, page, take)=>{
  return fetch(
    `${LOCAL_HOST}/Admin/Qc/ProductLine?Take=${take}&Page=${page}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `bearer ${token}`
      },
    }
  ).then(response => response.json());
}