Template.callingChangeEdit.helpers({
  isDiscussed: function (status) {
    if (status == "Discussed") {
      return true;
    } else {
      return false;
    }
  },
  isApproved: function (status) {
    if (status == "Approved") {
      return true;
    } else {
      return false;
    }
  },
  isInterviewed: function (status) {
    if (status == "Interviewed") {
      return true;
    } else {
      return false;
    }
  },
  isPresented: function (status) {
    if (status == "Presented") {
      return true;
    } else {
      return false;
    }
  },
  isRecorded: function (status) {
    if (status == "Recorded") {
      return true;
    } else {
      return false;
    }
  },
  isSetApart: function (status) {
    if (status == "Set Apart") {
      return true;
    } else {
      return false;
    }
  },
  isSetApartRecorded: function (status) {
    if (status == "Set Apart Recorded") {
      return true;
    } else {
      return false;
    }
  },
  isCanceled: function (status) {
    if (status == "Canceled") {
      return true;
    } else {
      return false;
    }
  }
});

Template.callingChangeEdit.events({
  'click #cancelButton': function(e, instance) {
    history.back();
  },
  'click #meetingItem': function(e, instance) {
    Session.set("meetingId", this._id);
  },
  'click #doneButton': function(e, instance) {
    e.preventDefault();

    var callingChange = this;
    var updateObject = {};

    if(!Meteor.user()){
      console.log('You must be logged in.');
      return false;
    }

    var properties = {
      updatedBy:            Meteor.userId(),
      wardUnitNo:           Meteor.user().wardUnitNo,
      updatedAt:            new Date(),
      type:                 Session.get("selectedCallingChangeType"),
      member:               Session.get("selectedCallingChangeMember"),
      calling:              Session.get("selectedCallingChangeCalling"),
      notes:                $('#notes').val()
    };

    if (properties) {
      updateObject.$set = properties;
      callingChangeCollection.update(callingChange._id, updateObject, function(error){
        if (error) {
          console.log(error);
        } else {
          history.back();
        }
      });
    }
  },
  'click [data-action=showActionSheet]': function(e, instance){
    var callingChange = this;
    IonActionSheet.show({
      titleText: '',
      buttons: [],
      destructiveText: 'Delete Calling Change',
      cancelText: 'Cancel',
      cancel: function() {},
      destructiveButtonClicked: function() {
        callingChangeCollection.remove(callingChange._id);
        Router.go("callingChangeList");
        return true;
      }
    });
  },
  'click [data-action=markApproved]': function(e, instance){
    var callingChange = this;
    var updateObject = {};
    var properties = {
      status:         "Approved",
      dateApproved:   new Date()
    };
    if (properties) {
      updateObject.$set = properties;
      callingChangeCollection.update(callingChange._id, updateObject, function(error){
        if(error) {
          console.log(error);
        }else{
          Router.go("callingChangeList");
        }
      });
    }
  },
  'click [data-action=markInterviewed]': function(e, instance){
    var callingChange = this;
    var updateObject = {};
    var meetingDate = moment().subtract(1, "days").day(7).format("YYYY-MM-DD");
    var foundMeeting = meetingCollection.findOne({"meetingDate": "2015-03-15"});

    var properties = {
      status:           "Interviewed",
      dateInterviewed:  new Date(),
      meeting:          foundMeeting
    };
    if (properties) {
      updateObject.$set = properties;
      callingChangeCollection.update(callingChange._id, updateObject, function(error){
        if(error) {
          console.log(error);
        }else{
          Router.go("callingChangeList");
        }
      });
    }
  },
  'click [data-action=markPresented]': function(e, instance){
    var callingChange = this;
    var updateObject = {};
    var properties = {
      status:           "Presented",
      datePresented:    new Date()
    };
    if (properties) {
      updateObject.$set = properties;
      callingChangeCollection.update(callingChange._id, updateObject, function(error){
        if(error) {
          console.log(error);
        }else{
          Router.go("callingChangeList");
        }
      });
    }
  },
  'click [data-action=markRecorded]': function(e, instance){
    var callingChange = this;
    var updateObject = {};
    var calculatedStatus;
    if (callingChange.type == "Release") {
      calculatedStatus = "Complete";
    } else {
      calculatedStatus = "Recorded"
    }
    var properties = {
      status:           calculatedStatus,
      dateRecorded:     new Date()
    };
    if (properties) {
      updateObject.$set = properties;
      callingChangeCollection.update(callingChange._id, updateObject, function(error){
        if(error) {
          console.log(error);
        }else{
          Router.go("callingChangeList");
        }
      });
    }
  },
  'click [data-action=markSetApart]': function(e, instance){
    var callingChange = this;
    var updateObject = {};
    var properties = {
      status:           "Set Apart",
      dateSetApart:     new Date()
    };
    if (properties) {
      updateObject.$set = properties;
      callingChangeCollection.update(callingChange._id, updateObject, function(error){
        if(error) {
          console.log(error);
        }else{
          Router.go("callingChangeList");
        }
      });
    }
  },
  'click [data-action=markSetApartRecorded]': function(e, instance){
    var callingChange = this;
    var updateObject = {};
    var properties = {
      status:               "Complete",
      dateSetApartRecorded: new Date()
    };
    if (properties) {
      updateObject.$set = properties;
      callingChangeCollection.update(callingChange._id, updateObject, function(error){
        if(error) {
          console.log(error);
        }else{
          Router.go("callingChangeList");
        }
      });
    }
  }
});
