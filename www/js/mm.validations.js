var FIELD_ERR_SEL, loginFormInit, validationsInit;
validationsInit = function() {
  return $.validator.addMethod("password", function(value, element) {
    var result, validator;
    result = this.optional(element) || value.length >= 6;
    if (!result) {
      element.value = "";
      validator = this;
      setTimeout(function() {
        validator.blockFocusCleanup = true;
        element.focus();
        return validator.blockFocusCleanup = false;
      }, 1);
    }
    return result;
  }, "Password must be at least 6 characters long");
};
FIELD_ERR_SEL = "div.field_error";
loginFormInit = function() {
  log("roginforminit");
  return $("#loginForm, #registerForm").validate({
    errorClass: "field_error",
    errorPlacement: function(error, element) {
      return error.insertAfter(element);
    },
    onkeyup: false,
    submitHandler: function(form) {
      var email, pw;
      log("zynking");
      email = $(form).find("#email").attr("value");
      pw = $(form).find("#password").attr("value");
      submitSyncReq({
        email: email,
        password: pw
      });
      return false;
    },
    rules: {
      "user[email]": {
        required: true,
        email: true
      },
      "user[password]": {
        required: true,
        minlength: 6
      },
      "user[password_confirmation]": {
        required: true,
        equalTo: "#user_password"
      }
    },
    messages: {
      "user[password]": {
        required: "Password must be at least 6 characters"
      },
      "user[password_confirmation]": {
        required: " ",
        equalTo: "Passwords don't match"
      },
      "user[email]": {
        required: "Please enter a valid email address",
        email: "Please enter a valid email address"
      }
    },
    debug: true
  });
};