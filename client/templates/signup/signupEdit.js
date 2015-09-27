Template.signupEdit.helpers({
  userCanDeleteSignup: function () {
    if (Meteor.user() && Meteor.user().callings) {
      //bishop, counselors, executive secretary, ward clerk, membership clerk, librarian
      var allowedCallingList = [4, 54, 55, 56, 57, 787, 229];
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
    var emailString = "mailto:" + volunteerEmailArray.join(",");
    window.location = emailString;
  },
  'click #textVolunteersButton': function(e, instance) {
    var volunteerArray = volunteerCollection.find({signupId: this._id}).fetch();
    var volunteerPhoneArray = volunteerArray.map(function(obj) { if (obj["volunteer"] && obj["volunteer"].phone) { return obj["volunteer"].phone } });
    var emailString = "sms:" + volunteerPhoneArray.join(",");
    window.location = emailString;
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
