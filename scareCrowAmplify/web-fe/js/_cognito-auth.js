/*global WildRydes _config AmazonCognitoIdentity AWSCognito*/

var WildRydes = window.WildRydes || {};

(function scopeWrapper($) {
  var poolData = {
    UserPoolId: _config.cognito.userPoolId,
    ClientId: _config.cognito.userPoolClientId,
  };

  var userPool;

  if (
    !(
      _config.cognito.userPoolId &&
      _config.cognito.userPoolClientId &&
      _config.cognito.region
    )
  ) {
    $("#noCognitoMessage").show();
    return;
  }

  userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

  if (typeof AWSCognito !== "undefined") {
    AWSCognito.config.region = _config.cognito.region;
  }

  WildRydes.signOut = function signOut() {
    userPool.getCurrentUser().signOut();
  };

  WildRydes.authToken = new Promise(function fetchCurrentAuthToken(
    resolve,
    reject
  ) {
    var cognitoUser = userPool.getCurrentUser();

    if (cognitoUser) {
      cognitoUser.getSession(function sessionCallback(err, session) {
        if (err) {
          reject(err);
        } else if (!session.isValid()) {
          resolve(null);
        } else {
          resolve(session.getIdToken().getJwtToken());
        }
      });
    } else {
      resolve(null);
    }
  });

  /*
   * Cognito User Pool functions
   */

  function register(
    email,
    password,
    country,
    farm_name,
    phone,
    address,
    onSuccess,
    onFailure
  ) {
    var dataEmail = {
      Name: "email",
      Value: email,
    };

    let attributeList = [];
    attributeList.push(
      new AmazonCognitoIdentity.CognitoUserAttribute({
        Name: "custom:farm_country",
        Value: country,
      })
    );
    attributeList.push(
      new AmazonCognitoIdentity.CognitoUserAttribute({
        Name: "custom:farm_phone",
        Value: phone,
      })
    );
    attributeList.push(
      new AmazonCognitoIdentity.CognitoUserAttribute({
        Name: "custom:farm_address",
        Value: address,
      })
    );
    attributeList.push(
      new AmazonCognitoIdentity.CognitoUserAttribute({
        Name: "custom:farm_name",
        Value: farm_name,
      })
    );
    attributeList.push(
      new AmazonCognitoIdentity.CognitoUserAttribute(dataEmail)
    );

    userPool.signUp(
      toUsername(email),
      password,
      attributeList,
      null,
      function signUpCallback(err, result) {
        if (!err) {
          onSuccess(result);
        } else {
          onFailure(err);
        }
      }
    );
  }

  function signin(email, password, onSuccess, onFailure, newPasswordRequired) {
    var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(
      {
        Username: toUsername(email),
        Password: password,
      }
    );

    var cognitoUser = createCognitoUser(email);
    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: onSuccess,
      onFailure: onFailure,
      newPasswordRequired: newPasswordRequired,
    });
  }

  function verify(email, code, onSuccess, onFailure) {
    createCognitoUser(email).confirmRegistration(
      code,
      true,
      function confirmCallback(err, result) {
        if (!err) {
          onSuccess(result);
        } else {
          onFailure(err);
        }
      }
    );
  }

  function createCognitoUser(email) {
    return new AmazonCognitoIdentity.CognitoUser({
      Username: toUsername(email),
      Pool: userPool,
    });
  }

  function toUsername(email) {
    return email.replace("@", "-at-");
  }

  /*
   *  Event Handlers
   */

  $(function onDocReady() {
    $("#loginForm").submit(handleSignin);
    $("#registrationForm").submit(handleRegister);
    $("#verifyForm").submit(handleVerify);
    $("#signout").click(signout);
  });

  function signout(event) {
    event.preventDefault();
    userPool.getCurrentUser().signOut();
    window.location.replace("https://webapp.dsh9r6h478957.amplifyapp.com");
  }

  function handleSignin(event) {
    var email = $("#emailInputLogin").val();
    var password = $("#passwordInputLogin").val();
    event.preventDefault();
    signin(
      email,
      password,
      function signinSuccess() {
        console.log("Successfully Logged In");
        window.location.replace(
          "https://webapp.dsh9r6h478957.amplifyapp.com/web-fe/"
        );
      },
      function signinError(err) {
        alert("Info: " + err.message);
      },
      function resetPass(userAttributes, requiredAttributes) {
        // User was signed up by an admin and must provide new
        // password and required attributes, if any, to complete
        // authentication.

        // the api doesn't accept this field back
        delete userAttributes.email_verified;

        // store userAttributes on global variable
        userAttributes = userAttributes;
      }
    );
  }

  function handleRegister(event) {
    var email = $("#emailInputRegister").val();
    var password = $("#passwordInputRegister").val();
    var password2 = $("#password2InputRegister").val();

    var phone_number = $("#phone").val();
    // var country = $('#country').find(":selected").val();
    var country = $("#country").val();
    var address = $("#address").val();
    var farm_name = $("#farm_name").val();

    alert(country);

    var onSuccess = function registerSuccess(result) {
      var cognitoUser = result.user;
      console.log("User name is " + cognitoUser.getUsername());
      var confirmation =
        "Registration successful. Please check your email inbox or spam folder for your verification code.";
      alert(confirmation);
      window.location.replace(
        "https://webapp.dsh9r6h478957.amplifyapp.com/web-fe/auth/verify2.html"
      );
    };
    var onFailure = function registerFailure(err) {
      alert("Info: " + err.message);
      alert(err);
    };
    event.preventDefault();

    if (password === password2) {
      register(
        email,
        password,
        country,
        farm_name,
        phone_number,
        address,
        onSuccess,
        onFailure
      );
    } else {
      alert("Passwords do not match");
    }
  }

  function handleVerify(event) {
    var email = $("#emailInputVerify").val();
    var code = $("#codeInputVerify").val();
    event.preventDefault();
    verify(
      email,
      code,
      function verifySuccess(result) {
        console.log("call result: " + result);
        console.log("Successfully verified");
        alert(
          "Verification successful. You will now be redirected to the login page."
        );
        window.location.replace(
          "https://webapp.dsh9r6h478957.amplifyapp.com/web-fe/auth/login2.html"
        );
      },
      function verifyError(err) {
        alert(err);
      }
    );
  }
})(jQuery);
