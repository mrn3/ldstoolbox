Template.callingChangeEdit.helpers({
  isEqual: function (inValue1, inValue2) {
    return (inValue1 == inValue2);
  },
  isNotEqual: function (inValue1, inValue2) {
    return (inValue1 != inValue2);
  },
  isIn: function (inValue, inList) {
    inListArray = inList.split(",");
    for (inListArrayIndex in inListArray) {
      if (inValue == inListArray[inListArrayIndex]) {
        return true;
      }
    }
    return false;
  },
  userCanEditCallingChange: function () {
    if (Meteor.user() && Meteor.user().callings) {

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
    if (Session.get("selectedCallingChangeMember")) {
      return Session.get("selectedCallingChangeMember");
    } else {
      return "";
    }
  },
  callingChangeCallingSession: function() {
    if (Session.get("selectedCallingChangeCalling") && Session.get("selectedCallingChangeCalling").positionName) {
      return Session.get("selectedCallingChangeCalling").positionName;
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
  "click .button": function(event, instance) {
    if (event.target.id && event.target.id != "cancelButton") {
      var callingChange = this;
      var updateObject = {};
      var properties = {};

      if (event.target.id == "markDiscussed") {
        properties = {
          status:                   "Discussed",
          dateDiscussed:            new Date()
        };
      } else if (event.target.id == "unmarkDiscussed") {
        properties = {
          status:                   "New",
          dateDiscussed:            null
        };
      } else if (event.target.id == "markApproved") {
        properties = {
          status:                   "Approved",
          dateApproved:             new Date()
        };
      } else if (event.target.id == "unmarkApproved") {
        properties = {
          status:                   "Discussed",
          dateApproved:             null
        };
      } else if (event.target.id == "markInterviewScheduled") {
        properties = {
          status:                   "Interview Scheduled",
          dateInterviewScheduled:   new Date()
        };
      } else if (event.target.id == "unmarkInterviewScheduled") {
        properties = {
          status:                   "Approved",
          dateInterviewScheduled:   null
        };
      } else if (event.target.id == "markInterviewed") {
        var meetingDate;
        var foundMeeting;
        
        meetingDate = moment().subtract(1, "days").day(7).format("YYYY-MM-DD");
        foundMeeting = meetingCollection.findOne({"meetingDate": meetingDate});
        //if meeting not found, try next week
        if (!foundMeeting) {
          meetingDate = moment().add(6, "days").day(7).format("YYYY-MM-DD");
          foundMeeting = meetingCollection.findOne({"meetingDate": meetingDate});
        }
        //if meeting still not found, try one more week
        if (!foundMeeting) {
          meetingDate = moment().add(13, "days").day(7).format("YYYY-MM-DD");
          foundMeeting = meetingCollection.findOne({"meetingDate": meetingDate});
        }

        properties = {
          status:                   "Interviewed",
          dateInterviewed:          new Date(),
          meeting:                  foundMeeting
        };
      } else if (event.target.id == "unmarkInterviewed") {
        properties = {
          status:                   "Interview Scheduled",
          dateInterviewed:          null
        };
      } else if (event.target.id == "markPresented") {
        properties = {
          status:                   "Presented",
          datePresented:            new Date()
        };
      } else if (event.target.id == "unmarkPresented") {
        properties = {
          status:                   "Interviewed",
          datePresented:            null
        };
      } else if (event.target.id == "markRecorded") {
        properties = {
          status:                   "Recorded",
          dateRecorded:             new Date()
        };
      } else if (event.target.id == "unmarkRecorded") {
        properties = {
          status:                   "Presented",
          dateRecorded:             null
        };
      } else if (event.target.id == "markSetApart") {
        properties = {
          status:                   "Set Apart",
          dateSetApart:             new Date()
        };
      } else if (event.target.id == "unmarkSetApart") {
        properties = {
          status:                   "Recorded",
          dateSetApart:             null
        };
      } else if (event.target.id == "markSetApartRecorded") {
        properties = {
          status:                   "Set Apart Recorded",
          dateSetApartRecorded:     new Date()
        };
      } else if (event.target.id == "unmarkSetApartRecorded") {
        properties = {
          status:                   "Set Apart",
          dateSetApartRecorded:     null
        };
      } else if (event.target.id == "markCanceled") {
        properties = {
          status:                   "Canceled",
          dateCanceled:             new Date()
        };
      } else if (event.target.id == "markOnHold") {
        properties = {
          status:                   "On Hold",
          dateOnHold:               new Date()
        };
      } else if ((event.target.id == "unmarkCanceled") || (event.target.id == "unmarkOnHold")) {
        var restoredStatus;
        if (callingChange.dateSetApartRecorded) {
          restoredStatus =          "Set Apart Recorded"
        } else if (callingChange.dateSetApart) {
          restoredStatus =          "Set Apart"
        } else if (callingChange.dateRecorded) {
          restoredStatus =          "Recorded"
        } else if (callingChange.datePresented) {
          restoredStatus =          "Presented"
        } else if (callingChange.dateInterviewed) {
          restoredStatus =          "Interviewed"
        } else if (callingChange.dateInterviewScheduled) {
          restoredStatus =          "Interview Scheduled"
        } else if (callingChange.dateApproved) {
          restoredStatus =          "Approved"
        } else if (callingChange.dateDiscussed) {
          restoredStatus =          "Discussed"
        } else {
          restoredStatus = "New";
        }

        if (event.target.id == "unmarkCanceled") {
          properties = {
            status:                   restoredStatus,
            dateCanceled:             null
          };
        } else if (event.target.id == "unmarkOnHold") {
          properties = {
            status:                   restoredStatus,
            dateOnHold:               null
          };
        }
      }

      //update other values too in case user input some other information
      properties.updatedBy =          Meteor.userId(),
      properties.updatedAt =          new Date(),
      properties.wardUnitNo =         Meteor.user().wardUnitNo,
      properties.stakeUnitNo =        Meteor.user().stakeUnitNo,
      properties.type =               Session.get("selectedCallingChangeType"),
      properties.member =             Session.get("selectedCallingChangeMember"),
      properties.calling =            Session.get("selectedCallingChangeCalling"),
      properties.interviewDate =      $("#interviewDate").val(),
      properties.interviewTime =      $("#interviewTime").val(),
      properties.notes =              $("#notes").val()

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
