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
  isNotCanceled: function (status) {
    if (status == "Canceled") {
      return false;
    } else {
      return true;
    }
  },
  userCanEditCallingChange: function () {
    if (Meteor.user().callings) {

      //bishop, counselors, executive secretary, ward clerk, membership clerk
      var allowedCallingList = [4, 54, 55, 56, 57, 787];
      var userCallingList = Meteor.user().callings.reduce(
        function(total, calling){
          return total.concat(calling.positionId);
        },
      []);

      var callingIntersection =
        userCallingList.filter(function(n) {
          return allowedCallingList.indexOf(n) != -1
        });

      return (callingIntersection.length > 0);
    }
  },
  callingChangeTypeSession: function() {
    if (Session.get("selectedCallingChangeType")) {
      return Session.get("selectedCallingChangeType")
    } else {
      return "";
    }
  },
  callingChangeMemberSession: function() {
    if (Session.get("selectedCallingChangeMember") && Session.get("selectedCallingChangeMember").switchedPreferredName) {
      return Session.get("selectedCallingChangeMember").switchedPreferredName;
    } else {
      return "";
    }
  },
  callingChangeCallingSession: function() {
    if (Session.get("selectedCallingChangeCalling") && Session.get("selectedCallingChangeCalling").callingName) {
      return Session.get("selectedCallingChangeCalling").callingName;
    } else {
      return "";
    }
  }
});

Template.callingChangeEdit.events({
  'click #callingChangeMemberItem': function(e, instance) {
    Session.set("memberSelectType", "callingChangeMember");
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
      updatedAt:            new Date(),
      wardUnitNo:           Meteor.user().wardUnitNo,
      stakeUnitNo:          Meteor.user().stakeUnitNo,
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
  'click [data-action=showCancelActionSheet]': function(e, instance){
    var callingChange = this;
    IonActionSheet.show({
      titleText: '',
      buttons: [],
      destructiveText: 'Mark Canceled',
      cancelText: 'Cancel',
      cancel: function() {},
      destructiveButtonClicked: function() {
        var updateObject = {};
        var properties = {
          status:         "Canceled",
          dateCanceled:   new Date()
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
        return true;
      }
    });
  },
  'click [data-action=showDeleteActionSheet]': function(e, instance){
    var callingChange = this;
    IonActionSheet.show({
      titleText: '',
      buttons: [],
      destructiveText: 'Delete Calling Change',
      cancelText: 'Cancel',
      cancel: function() {},
      destructiveButtonClicked: function() {
        callingChangeCollection.remove(callingChange._id);
        history.back();
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
        if (error) {
          console.log(error);
        } else {
          history.back();
        }
      });
    }
  },
  'click [data-action=markInterviewed]': function(e, instance){
    var callingChange = this;
    var updateObject = {};
    var meetingDate = moment().subtract(1, "days").day(7).format("YYYY-MM-DD");
    var foundMeeting = meetingCollection.findOne({"meetingDate": meetingDate});

    var properties = {
      status:           "Interviewed",
      dateInterviewed:  new Date(),
      meeting:          foundMeeting
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
        if (error) {
          console.log(error);
        } else {
          history.back();
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
        if (error) {
          console.log(error);
        } else {
          history.back();
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
        if (error) {
          console.log(error);
        } else {
          history.back();
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
        if (error) {
          console.log(error);
        } else {
          history.back();
        }
      });
    }
  }
});

Template.callingChangeEdit.rendered = function() {
  if (this.data && this.data.callingChangeData) {
    if (this.data.callingChangeData.member) {
      if ((typeof Session.get("selectedCallingChangeMember") == "undefined") || (Session.get("selectedCallingChangeMember") == "")) {
        Session.set("selectedCallingChangeMember", this.data.callingChangeData.member);
      }
    }
    if (this.data.callingChangeData.calling) {
      if ((typeof Session.get("selectedCallingChangeCalling") == "undefined") || (Session.get("selectedCallingChangeCalling") == "")) {
        Session.set("selectedCallingChangeCalling", this.data.callingChangeData.calling);
      }
    }
    if (this.data.callingChangeData.type) {
      if ((typeof Session.get("selectedCallingChangeType") == "undefined") || (Session.get("selectedCallingChangeType") == "")) {
        Session.set("selectedCallingChangeType", this.data.callingChangeData.type);
      }
    }
  }
};
