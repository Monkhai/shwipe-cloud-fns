const { queryRef, executeQuery, mutationRef, executeMutation, validateArgs } = require('firebase/data-connect');

const connectorConfig = {
  connector: 'default',
  service: 'test-db',
  location: 'me-west1'
};
exports.connectorConfig = connectorConfig;

function adminCreateUserRef(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  if('_useGeneratedSdk' in dcInstance) {
    dcInstance._useGeneratedSdk();
  } else {
    console.error('Please update to the latest version of the Data Connect SDK by running `npm install firebase@dataconnect-preview`.');
  }
  return mutationRef(dcInstance, 'AdminCreateUser', inputVars);
}
exports.adminCreateUserRef = adminCreateUserRef;
exports.adminCreateUser = function adminCreateUser(dcOrVars, vars) {
  return executeMutation(adminCreateUserRef(dcOrVars, vars));
};

function adminGetUserRef(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  if('_useGeneratedSdk' in dcInstance) {
    dcInstance._useGeneratedSdk();
  } else {
    console.error('Please update to the latest version of the Data Connect SDK by running `npm install firebase@dataconnect-preview`.');
  }
  return queryRef(dcInstance, 'AdminGetUser', inputVars);
}
exports.adminGetUserRef = adminGetUserRef;
exports.adminGetUser = function adminGetUser(dcOrVars, vars) {
  return executeQuery(adminGetUserRef(dcOrVars, vars));
};

