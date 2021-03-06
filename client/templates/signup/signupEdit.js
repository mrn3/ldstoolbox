Template.signupEdit.helpers({
  userIsSignupAdmin: function () {
    //if this user is the responsible party, then they can administer it
    if (Meteor.user() && Session.get("selectedResponsible") && Meteor.user().individualId == Session.get("selectedResponsible").individualId) {
      return true;
    }
    //also if someone in bishopric, they can admin it
    if (Meteor.user() && Meteor.user().callings) {
      //bishop, counselors, executive secretary, ward clerk, membership clerk
      var allowedCallingList = [4, 54, 55, 56, 57, 787];
      var userCallingList = Meteor.user().callings.reduce(
        function(total, calling){
          return total.concat(calling.positionTypeId);
        },
      []);
      var callingIntersection =
        userCallingList.filter(function(n) {
          return allowedCallingList.indexOf(n) != -1
        });
      return (callingIntersection.length > 0);
    }
  },
  isSelected: function (value1, value2) {
    if (value1 == value2) {
      return "selected";
    } else {
      return "";
    }
  },
  responsibleSession: function() {
    if (Session.get("selectedResponsible") && Session.get("selectedResponsible").preferredName) {
      return Session.get("selectedResponsible").preferredName;
    } else {
      return "";
    }
  },
  reminderTextLink: function (inPhone, inDescription) {
    var signup = signupCollection.findOne({_id: this.signupId})
    var formattedSignupDate = moment($('#signupDate').val()).format("dddd, MMMM D, YYYY");
    return "sms:" + inPhone + "&body=This is a reminder that you signed up for " + signup.signupName + " on " + formattedSignupDate + " and with details of " + inDescription + ". Thanks!";
  },
  formattedSignupDate: function () {
    return moment($('#signupDate').val()).format("dddd, MMMM D, YYYY");
  }
});

Template.signupEdit.events({
  'click #responsibleItem': function(e, instance) {
    Session.set("memberSelectType", "responsible");
  },
  'click #addVolunteerButton': function(e, instance) {
    volunteerCollection.insert({signupId: this._id, signupDate: $('#signupDate').val(), wardUnitNo: Meteor.user().wardUnitNo, stakeUnitNo: Meteor.user().stakeUnitNo});
  },
  'click .removeVolunteerButton': function(e, instance) {
    volunteerCollection.remove({_id: this._id});
  },
  'click .volunteerItem': function(e, instance) {
    Session.set("memberSelectType", "volunteer");
    Session.set("volunteerId", this._id);
    Session.set("signupDate", $('#signupDate').val());
  },
  'change .volunteerOrderSelect': function(e, instance) {
    var updateObject = {};
    updateObject.$set = {order: e.target.value};
    volunteerCollection.update(e.target.id, updateObject);
  },
  'change .volunteerDescriptionInput': function(e, instance) {
    var updateObject = {};
    updateObject.$set = {description: e.target.value};
    volunteerCollection.update(e.target.id, updateObject);
  },
  'click #emailVolunteersButton': function(e, instance) {
    var volunteerArray = volunteerCollection.find({signupId: this._id}).fetch();
    var volunteerEmailArray = volunteerArray.map(function(obj) { if (obj["volunteer"] && obj["volunteer"].email) { return obj["volunteer"].email } });
    var emailString = "mailto:" + volunteerEmailArray.join(",")
    var formattedSignupDate = moment($('#signupDate').val()).format("dddd, MMMM D, YYYY");
    emailString += "?subject=" + $('#signupName').val() + " - " + formattedSignupDate;
    emailString += "&body=This is a reminder that you signed up for " + $('#signupName').val() + " on " + formattedSignupDate + "."
    var volunteerDescriptionArray = volunteerArray.map(function(obj) {
      if (obj.description && obj["volunteer"] && obj["volunteer"].preferredName) {
        return obj.description + " - " + obj["volunteer"].preferredName
      }
    })
    emailString += "%0D%0A" //add hard return
    emailString += "%0D%0A"
    emailString += "The details are:"
    emailString += "%0D%0A"
    for (var i=0; i<volunteerDescriptionArray.length; i++) {
      if (volunteerDescriptionArray[i]) {
        emailString += "%0D%0A" + volunteerDescriptionArray[i]
      }
    }
    emailString += "%0D%0A"
    emailString += "%0D%0A"
    emailString += "Please let me know if you won't be able to do this.  Thanks!"
    window.location = emailString;
  },
  'click .textVolunteersButton': function(e, instance) {
    var volunteerArray = volunteerCollection.find({signupId: this._id}).fetch()
    var volunteerPhoneArray = volunteerArray.map(function(obj) { if (obj["volunteer"] && obj["volunteer"].phone) { return obj["volunteer"].phone } });
    var textString = "sms:" + volunteerPhoneArray.join(",");
    var formattedSignupDate = moment($('#signupDate').val()).format("dddd, MMMM D, YYYY");
    if (e.target.id == 'android') {
      textString += "?body=This is a reminder that you signed up for " + $('#signupName').val() + " on " + formattedSignupDate + ". Thanks!";
    }
    var volunteerDescriptionArray = volunteerArray.map(function(obj) { if (obj.description && obj["volunteer"] && obj["volunteer"].preferredName) { return obj.description + " - " + obj["volunteer"].preferredName } })
    textString += "\r\n" //add hard return
    textString += "\r\n"
    textString += "The details are:"
    textString += "\r\n"
    for (var i=0; i<volunteerDescriptionArray.length; i++) {
      textString += "\r\n" + volunteerDescriptionArray[i]
    }
    textString += "\r\n"
    textString += "\r\n"
    textString += "Please let me know if you won't be able to do this.  Thanks!"
    window.location = textString;
  },
  'click [data-action=showActionSheet]': function(e, instance){
    var signup = this;
    IonActionSheet.show({
      titleText: '',
      buttons: [],
      destructiveText: 'Delete Signup',
      cancelText: 'Cancel',
      cancel: function() {},
      destructiveButtonClicked: function() {
        if(!Meteor.user()){
          console.log('You must be logged in.');
          return false;
        }

        Meteor.call('removeSignup', signup, function(error, signup) {
          if(error) {
            console.log(error.reason);
          } else {
            history.back();
          }
        });
        return true;
      }
    });
  },
  'click #doneButton': function(e, instance){
    var signup = this;
    var updateObject = {};
    var properties = {
      updatedBy:            Meteor.userId(),
      updatedAt:            new Date(),
      wardUnitNo:           Meteor.user().wardUnitNo,
      stakeUnitNo:          Meteor.user().stakeUnitNo,
      signupName:           $('#signupName').val(),
      signupDate:           $('#signupDate').val(),
      responsible:          Session.get("selectedResponsible")
    };
    if (properties) {
      updateObject.$set = properties;
      signupCollection.update(signup._id, updateObject, function(error){
        if (error) {
          console.log(error);
        } else {
          history.back();
        }
      });
    }
  }
});

Template.signupEdit.rendered = function() {
  if (this.data && this.data.signupData) {
    if (this.data.signupData.responsible) {
      if ((typeof Session.get("selectedResponsible") == "undefined") || (Session.get("selectedResponsible") == "")) {
        Session.set("selectedResponsible", this.data.signupData.responsible);
      }
    }
  }
};
