Template.callingChangeView.helpers({
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

Template.callingChangeView.events({
  'click [data-action=showActionSheet]': function(e, instance){
    var callingChange = this;
    IonActionSheet.show({
      titleText: '',
      buttons: [],
      destructiveText: 'Delete',
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
      memberName:     callingChange.memberName,
      callingName:    callingChange.callingName,
      notes:          callingChange.notes,
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
  'click [data-action=markApproved]': function(e, instance){
    var callingChange = this;
    var updateObject = {};
    var properties = {
      memberName:       callingChange.memberName,
      callingName:      callingChange.callingName,
      notes:            callingChange.notes,
      status:           "Approved",
      dateApproved:     new Date()
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
    var properties = {
      memberName:       callingChange.memberName,
      callingName:      callingChange.callingName,
      notes:            callingChange.notes,
      status:           "Interviewed",
      dateApproved:     callingChange.dateApproved,
      dateInterviewed:  new Date()
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
      memberName:       callingChange.memberName,
      callingName:      callingChange.callingName,
      notes:            callingChange.notes,
      status:           "Presented",
      dateApproved:     callingChange.dateApproved,
      dateInterviewed:  callingChange.dateInterviewed,
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
    var properties = {
      memberName:       callingChange.memberName,
      callingName:      callingChange.callingName,
      notes:            callingChange.notes,
      status:           "Recorded",
      dateApproved:     callingChange.dateApproved,
      dateInterviewed:  callingChange.dateInterviewed,
      datePresented:    callingChange.datePresented,
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
      memberName:       callingChange.memberName,
      callingName:      callingChange.callingName,
      notes:            callingChange.notes,
      status:           "Set Apart",
      dateApproved:     callingChange.dateApproved,
      dateInterviewed:  callingChange.dateInterviewed,
      datePresented:    callingChange.datePresented,
      dateRecorded:     callingChange.dateRecorded,
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
      memberName:           callingChange.memberName,
      callingName:          callingChange.callingName,
      notes:                callingChange.notes,
      status:               "Set Apart Recorded",
      dateApproved:         callingChange.dateApproved,
      dateInterviewed:      callingChange.dateInterviewed,
      datePresented:        callingChange.datePresented,
      dateRecorded:         callingChange.dateRecorded,
      dateSetApart:         callingChange.dateSetApart,
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
