Template.meetingView.helpers({
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

Template.meetingView.events({
  'click [data-action=showActionSheet]': function(e, instance){
    var meeting = this;
    IonActionSheet.show({
      titleText: '',
      buttons: [],
      destructiveText: 'Delete Meeting',
      cancelText: 'Cancel',
      cancel: function() {},
      destructiveButtonClicked: function() {
        meetingCollection.remove(meeting._id);
        Router.go("meetingList");
        return true;
      }
    });
  },
  'click [data-action=markApproved]': function(e, instance){
    var meeting = this;
    var updateObject = {};
    var properties = {
      memberName:     meeting.memberName,
      callingName:    meeting.callingName,
      notes:          meeting.notes,
      status:         "Approved",
      dateApproved:   new Date()
    };
    if (properties) {
      updateObject.$set = properties;
      meetingCollection.update(meeting._id, updateObject, function(error){
        if(error) {
          console.log(error);
        }else{
          Router.go("meetingList");
        }
      });
    }
  },
  'click [data-action=markInterviewed]': function(e, instance){
    var meeting = this;
    var updateObject = {};
    var properties = {
      memberName:       meeting.memberName,
      callingName:      meeting.callingName,
      notes:            meeting.notes,
      status:           "Interviewed",
      dateApproved:     meeting.dateApproved,
      dateInterviewed:  new Date()
    };
    if (properties) {
      //calculatedDatePresented = moment($('#dateInterviewed').val()).day(7);
      updateObject.$set = properties;
      meetingCollection.update(meeting._id, updateObject, function(error){
        if(error) {
          console.log(error);
        }else{
          Router.go("meetingList");
        }
      });
    }
  },
  'click [data-action=markPresented]': function(e, instance){
    var meeting = this;
    var updateObject = {};
    var properties = {
      memberName:       meeting.memberName,
      callingName:      meeting.callingName,
      notes:            meeting.notes,
      status:           "Presented",
      dateApproved:     meeting.dateApproved,
      dateInterviewed:  meeting.dateInterviewed,
      datePresented:    new Date()
    };
    if (properties) {
      updateObject.$set = properties;
      meetingCollection.update(meeting._id, updateObject, function(error){
        if(error) {
          console.log(error);
        }else{
          Router.go("meetingList");
        }
      });
    }
  },
  'click [data-action=markRecorded]': function(e, instance){
    var meeting = this;
    var updateObject = {};
    var properties = {
      memberName:       meeting.memberName,
      callingName:      meeting.callingName,
      notes:            meeting.notes,
      status:           "Recorded",
      dateApproved:     meeting.dateApproved,
      dateInterviewed:  meeting.dateInterviewed,
      datePresented:    meeting.datePresented,
      dateRecorded:     new Date()
    };
    if (properties) {
      updateObject.$set = properties;
      meetingCollection.update(meeting._id, updateObject, function(error){
        if(error) {
          console.log(error);
        }else{
          Router.go("meetingList");
        }
      });
    }
  },
  'click [data-action=markSetApart]': function(e, instance){
    var meeting = this;
    var updateObject = {};
    var properties = {
      memberName:       meeting.memberName,
      callingName:      meeting.callingName,
      notes:            meeting.notes,
      status:           "Set Apart",
      dateApproved:     meeting.dateApproved,
      dateInterviewed:  meeting.dateInterviewed,
      datePresented:    meeting.datePresented,
      dateRecorded:     meeting.dateRecorded,
      dateSetApart:     new Date()
    };
    if (properties) {
      updateObject.$set = properties;
      meetingCollection.update(meeting._id, updateObject, function(error){
        if(error) {
          console.log(error);
        }else{
          Router.go("meetingList");
        }
      });
    }
  },
  'click [data-action=markSetApartRecorded]': function(e, instance){
    var meeting = this;
    var updateObject = {};
    var properties = {
      memberName:           meeting.memberName,
      callingName:          meeting.callingName,
      notes:                meeting.notes,
      status:               "Set Apart Recorded",
      dateApproved:         meeting.dateApproved,
      dateInterviewed:      meeting.dateInterviewed,
      datePresented:        meeting.datePresented,
      dateRecorded:         meeting.dateRecorded,
      dateSetApart:         meeting.dateSetApart,
      dateSetApartRecorded: new Date()
    };
    if (properties) {
      updateObject.$set = properties;
      meetingCollection.update(meeting._id, updateObject, function(error){
        if(error) {
          console.log(error);
        }else{
          Router.go("meetingList");
        }
      });
    }
  }
});
