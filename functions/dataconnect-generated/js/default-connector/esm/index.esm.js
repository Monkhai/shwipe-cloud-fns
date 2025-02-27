import { queryRef, executeQuery, mutationRef, executeMutation, validateArgs } from 'firebase/data-connect';


export const connectorConfig = {
  connector: 'default',
  service: 'test-db',
  location: 'me-west1'
};

export function adminCreateUserRef(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'AdminCreateUser', inputVars);
}

export function adminCreateUser(dcOrVars, vars) {
  return executeMutation(adminCreateUserRef(dcOrVars, vars));
}

export function adminGetUserRef(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'AdminGetUser', inputVars);
}

export function adminGetUser(dcOrVars, vars) {
  return executeQuery(adminGetUserRef(dcOrVars, vars));
}
