// cognito-config.js
const cognitoConfig = {
  region: "your-region", // Update with your Cognito region
  identityPoolId: "your-identity-pool-id", // Update with your Cognito identity pool ID
  userPoolId: "your-user-pool-id", // Update with your Cognito user pool ID
  clientId: "your-client-id", // Update with your Cognito app client ID
};

//export default cognitoConfig;
module.exports = cognitoConfig;
