var ScareCrow = window.ScareCrow || {};

(function scopeWrapper($) {
  var signinUrl = "/login.html"; // Change the signin URL to your login page

  var poolData = {
    UserPoolId: "your-user-pool-id", // Replace with your Cognito User Pool ID
    ClientId: "your-client-id", // Replace with your Cognito Client ID
  };

  var userPool;

  if (!(poolData.UserPoolId && poolData.ClientId)) {
    $("#noCognitoMessage").show();
    return;
  }

  userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

  if (typeof AWSCognito !== "undefined") {
    AWSCognito.config.region = "your-region"; // Replace with your Cognito region
  }

  ScareCrow.signOut = function signOut() {
    userPool.getCurrentUser().signOut();
  };

  ScareCrow.authToken = new Promise(function fetchCurrentAuthToken(
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

  function register(email, password, onSuccess, onFailure) {
    var dataEmail = {
      Name: "email",
      Value: email,
    };
    var attributeEmail = new AmazonCognitoIdentity.CognitoUserAttribute(
      dataEmail
    );

    userPool.signUp(
      toUsername(email),
      password,
      [attributeEmail],
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

  function signin(email, password, onSuccess, onFailure) {
    var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(
      {
        Username: email,
        Password: password,
      }
    );

    var cognitoUser = createCognitoUser(email);
    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: onSuccess,
      onFailure: onFailure,
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
      Username: email,
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
    $("#signinForm").submit(handleSignin);
    $("#registrationForm").submit(handleRegister);
    $("#verifyForm").submit(handleVerify);
  });

  function handleSignin(event) {
    var email = $("#emailInputSignin").val();
    var password = $("#passwordInputSignin").val();
    event.preventDefault();
    signin(
      email,
      password,
      function signinSuccess() {
        console.log("Successfully Logged In");
        window.location.href = "dashboard.html"; // Redirect to your dashboard page after login
      },
      function signinError(err) {
        alert(err.message);
      }
    );
  }

  function handleRegister(event) {
    var email = $("#emailInputRegister").val();
    var password = $("#passwordInputRegister").val();
    var password2 = $("#password2InputRegister").val();

    var onSuccess = function registerSuccess(result) {
      var cognitoUser = result.user;
      console.log("user name is " + cognitoUser.getUsername());
      alert(
        "Registration successful. Please check your email inbox or spam folder for your verification code."
      );
      window.location.href = "verify.html"; // Redirect to your verification page
    };
    var onFailure = function registerFailure(err) {
      alert(err.message);
    };
    event.preventDefault();

    if (password === password2) {
      register(email, password, onSuccess, onFailure);
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
        window.location.href = signinUrl;
      },
      function verifyError(err) {
        alert(err.message);
      }
    );
  }
})(jQuery);
