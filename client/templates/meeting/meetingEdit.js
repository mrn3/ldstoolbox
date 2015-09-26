Template.meetingEdit.helpers({
  isCall: function (type) {
    if (type == "Call") {
      return true;
    } else {
      return false;
    }
  },
  isSelected: function (value1, value2) {
    if (value1 == value2) {
      return "selected";
    } else {
      return "";
    }
  },
  userCanEditMeeting: function () {
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
  isChecked: function(inFastAndTestimony) {
    if (inFastAndTestimony) {
      return "checked";
    }
  },
  organistSession: function() {
    if (Session.get("selectedOrganist") && Session.get("selectedOrganist").preferredName) {
      return Session.get("selectedOrganist").preferredName;
    } else {
      return "";
    }
  },
  choristerSession: function() {
    if (Session.get("selectedChorister") && Session.get("selectedChorister").preferredName) {
      return Session.get("selectedChorister").preferredName;
    } else {
      return "";
    }
  },
  openingHymnSession: function() {
    if (Session.get("selectedOpeningHymn") && Session.get("selectedOpeningHymn").numberText) {
      return Session.get("selectedOpeningHymn").numberText + " - " + Session.get("selectedOpeningHymn").name;
    } else if (Session.get("selectedOpeningHymn") && Session.get("selectedOpeningHymn").name) {
      return Session.get("selectedOpeningHymn").name;
    } else {
      return "";
    }
  },
  sacramentHymnSession: function() {
    if (Session.get("selectedSacramentHymn") && Session.get("selectedSacramentHymn").numberText) {
      return Session.get("selectedSacramentHymn").numberText + " - " + Session.get("selectedSacramentHymn").name;
    } else if (Session.get("selectedSacramentHymn") && Session.get("selectedSacramentHymn").name) {
      return Session.get("selectedSacramentHymn").name;
    } else {
      return "";
    }
  },
  closingHymnSession: function() {
    if (Session.get("selectedClosingHymn") && Session.get("selectedClosingHymn").numberText) {
      return Session.get("selectedClosingHymn").numberText + " - " + Session.get("selectedClosingHymn").name;
    } else if (Session.get("selectedClosingHymn") && Session.get("selectedClosingHymn").name) {
      return Session.get("selectedClosingHymn").name;
    } else {
      return "";
    }
  },
  invocationSession: function() {
    if (Session.get("selectedInvocation") && Session.get("selectedInvocation").preferredName) {
      return Session.get("selectedInvocation").preferredName;
    } else {
      return "";
    }
  },
  benedictionSession: function() {
    if (Session.get("selectedBenediction") && Session.get("selectedBenediction").preferredName) {
      return Session.get("selectedBenediction").preferredName;
    } else {
      return "";
    }
  },
  presidingSession: function() {
    if (Session.get("selectedPresiding") && Session.get("selectedPresiding").preferredName) {
      return Session.get("selectedPresiding").preferredName;
    } else {
      return "";
    }
  },
  conductingSession: function() {
    if (Session.get("selectedConducting") && Session.get("selectedConducting").preferredName) {
      return Session.get("selectedConducting").preferredName;
    } else {
      return "";
    }
  },
  attendanceSession: function() {
    if (Session.get("selectedAttendance")) {
      return Session.get("selectedAttendance");
    } else {
      return "";
    }
  }
});

Template.meetingEdit.events({
  'click #organistItem': function(e, instance) {
    Session.set("memberSelectType", "organist");
  },
  'click #choristerItem': function(e, instance) {
    Session.set("memberSelectType", "chorister");
  },
  'click #openingHymnItem': function(e, instance) {
    Session.set("hymnSelectType", "openingHymn");
  },
  'click #sacramentHymnItem': function(e, instance) {
    Session.set("hymnSelectType", "sacramentHymn");
  },
  'click #intermediateHymnItem': function(e, instance) {
    Session.set("hymnSelectType", "intermediateHymn");
  },
  'click #closingHymnItem': function(e, instance) {
    Session.set("hymnSelectType", "closingHymn");
  },
  'click #invocationItem': function(e, instance) {
    Session.set("memberSelectType", "invocation");
  },
  'click #benedictionItem': function(e, instance) {
    Session.set("memberSelectType", "benediction");
  },
  'click #presidingItem': function(e, instance) {
    Session.set("memberSelectType", "presiding");
  },
  'click #conductingItem': function(e, instance) {
    Session.set("memberSelectType", "conducting");
  },
  'click #addAnnouncementButton': function(e, instance) {
    announcementCollection.insert({meetingId: this._id, text: "", wardUnitNo: Meteor.user().wardUnitNo, stakeUnitNo: Meteor.user().stakeUnitNo });
  },
  'click .removeAnnouncementButton': function(e, instance) {
    announcementCollection.remove({_id: this._id});
  },
  'change .announcementInput': function(e, instance) {
    var updateObject = {};
    updateObject.$set = {text: e.target.value};
    announcementCollection.update(e.target.id, updateObject);
  },
  'click #addIntermediateHymnButton': function(e, instance) {
    intermediateHymnCollection.insert({meetingId: this._id, afterSpeaker: 1, wardUnitNo: Meteor.user().wardUnitNo, stakeUnitNo: Meteor.user().stakeUnitNo });
  },
  'click .removeIntermediateHymnButton': function(e, instance) {
    intermediateHymnCollection.remove({_id: this._id});
  },
  'click .intermediateHymnItem': function(e, instance) {
    Session.set("hymnSelectType", "intermediateHymn");
    Session.set("intermediateHymnId", this._id);
  },
  'change .intermediateHymnAfterSpeakerSelect': function(e, instance) {
    var updateObject = {};
    updateObject.$set = {afterSpeaker: e.target.value};
    intermediateHymnCollection.update(e.target.id, updateObject);
  },
  'click #addMusicalNumberButton': function(e, instance) {
    musicalNumberCollection.insert({meetingId: this._id, afterSpeaker: 1, wardUnitNo: Meteor.user().wardUnitNo, stakeUnitNo: Meteor.user().stakeUnitNo });
  },
  'click .removeMusicalNumberButton': function(e, instance) {
    musicalNumberCollection.remove({_id: this._id});
  },
  'click .musicalNumberHymnItem': function(e, instance) {
    Session.set("hymnSelectType", "musicalNumberHymn");
    Session.set("musicalNumberId", this._id);
  },
  'click .musicalNumberPerformerItem': function(e, instance) {
    Session.set("memberSelectType", "musicalNumberPerformer");
    Session.set("musicalNumberId", this._id);
  },
  'click .musicalNumberConductorItem': function(e, instance) {
    Session.set("memberSelectType", "musicalNumberConductor");
    Session.set("musicalNumberId", this._id);
  },
  'click .musicalNumberAccompanistItem': function(e, instance) {
    Session.set("memberSelectType", "musicalNumberAccompanist");
    Session.set("musicalNumberId", this._id);
  },
  'change .musicalNumberAfterSpeakerSelect': function(e, instance) {
    var updateObject = {};
    updateObject.$set = {afterSpeaker: e.target.value};
    musicalNumberCollection.update(e.target.id, updateObject);
  },
  'click #addVisitorButton': function(e, instance) {
    visitorCollection.insert({meetingId: this._id, wardUnitNo: Meteor.user().wardUnitNo, stakeUnitNo: Meteor.user().stakeUnitNo});
  },
  'click .removeVisitorButton': function(e, instance) {
    visitorCollection.remove({_id: this._id});
  },
  'click .visitorItem': function(e, instance) {
    Session.set("memberSelectType", "visitor");
    Session.set("visitorId", this._id);
  },
  'click #addSpeakerButton': function(e, instance) {
    speakerCollection.insert({meetingId: this._id, meetingDate: $('#meetingDate').val(), wardUnitNo: Meteor.user().wardUnitNo, stakeUnitNo: Meteor.user().stakeUnitNo});
  },
  'click .removeSpeakerButton': function(e, instance) {
    speakerCollection.remove({_id: this._id});
  },
  'click .speakerItem': function(e, instance) {
    Session.set("memberSelectType", "speaker");
    Session.set("speakerId", this._id);
    Session.set("meetingDate", $('#meetingDate').val());
  },
  'change .speakerOrderSelect': function(e, instance) {
    var updateObject = {};
    updateObject.$set = {order: e.target.value};
    speakerCollection.update(e.target.id, updateObject);
  },
  'change .speakerTopicInput': function(e, instance) {
    var updateObject = {};
    updateObject.$set = {topic: e.target.value};
    speakerCollection.update(e.target.id, updateObject);
  },
  'click #addRecognitionButton': function(e, instance) {
    recognitionCollection.insert({meetingId: this._id, "members": [{_id: Random.id()}], wardUnitNo: Meteor.user().wardUnitNo, stakeUnitNo: Meteor.user().stakeUnitNo});
  },
  'click .removeRecognitionButton': function(e, instance) {
    recognitionCollection.remove({_id: this._id});
  },
  'click .recognitionMemberItem': function(e, instance) {
    Session.set("memberSelectType", "recognition");
    Session.set("recognitionMemberId", this._id);
  },
  'click .recognitionTypeItem': function(e, instance) {
    Session.set("recognitionId", this._id);
  },
  'click .addRecognitionMemberButton': function(e, instance) {
    var updateObject = {
      $addToSet:
        {
          "members":
            {
              _id: Random.id(),
              "preferredName": ""
            }
        }
    }
    recognitionCollection.update(this._id, updateObject);
  },
  'click .recognitionItem': function(e, instance) {
    Session.set("recognitionId", this._id);
  },
  'click .removeRecognitionMemberButton': function(e, instance) {
    var updateObject = {
      $pull:
        {
          "members":
            {
              _id: this._id
            }
        }
    }
    recognitionCollection.update(Session.get("recognitionId"), updateObject);
  },
  'click [data-action=showActionSheet]': function(e, instance){
    var meeting = this;
    IonActionSheet.show({
      titleText: '',
      buttons: [],
      destructiveText: 'Delete Meeting',
      cancelText: 'Cancel',
      cancel: function() {},
      destructiveButtonClicked: function() {
        if(!Meteor.user()){
          console.log('You must be logged in.');
          return false;
        }

        Meteor.call('removeMeeting', meeting, function(error, meeting) {
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
    var meeting = this;
    var updateObject = {};
    var properties = {
      updatedBy:            Meteor.userId(),
      updatedAt:            new Date(),
      wardUnitNo:           Meteor.user().wardUnitNo,
      stakeUnitNo:          Meteor.user().stakeUnitNo,
      meetingDate:          $('#meetingDate').val(),
      fastAndTestimony:     $('#fastAndTestimony').prop("checked"),
      presiding:            Session.get("selectedPresiding"),
      conducting:           Session.get("selectedConducting"),
      attendance:           Session.get("selectedAttendance"),
      organist:             Session.get("selectedOrganist"),
      chorister:            Session.get("selectedChorister"),
      openingHymn:          Session.get("selectedOpeningHymn"),
      sacramentHymn:        Session.get("selectedSacramentHymn"),
      closingHymn:          Session.get("selectedClosingHymn"),
      invocation:           Session.get("selectedInvocation"),
      benediction:          Session.get("selectedBenediction"),
    };
    if (properties) {
      updateObject.$set = properties;
      meetingCollection.update(meeting._id, updateObject, function(error){
        if (error) {
          console.log(error);
        } else {
          history.back();
        }
      });
    }
  }
});

Template.meetingEdit.rendered = function() {
  if (this.data && this.data.meetingData) {
    if (this.data.meetingData.organist) {
      if ((typeof Session.get("selectedOrganist") == "undefined") || (Session.get("selectedOrganist") == "")) {
        Session.set("selectedOrganist", this.data.meetingData.organist);
      }
    }
    if (this.data.meetingData.chorister) {
      if ((typeof Session.get("selectedChorister") == "undefined") || (Session.get("selectedChorister") == "")) {
        Session.set("selectedChorister", this.data.meetingData.chorister);
      }
    }
    if (this.data.meetingData.chorister) {
      if ((typeof Session.get("selectedChorister") == "undefined") || (Session.get("selectedChorister") == "")) {
        Session.set("selectedChorister", this.data.meetingData.chorister);
      }
    }
    if (this.data.meetingData.openingHymn) {
      if ((typeof Session.get("selectedOpeningHymn") == "undefined") || (Session.get("selectedOpeningHymn") == "")) {
        Session.set("selectedOpeningHymn", this.data.meetingData.openingHymn);
      }
    }
    if (this.data.meetingData.sacramentHymn) {
      if ((typeof Session.get("selectedSacramentHymn") == "undefined") || (Session.get("selectedSacramentHymn") == "")) {
        Session.set("selectedSacramentHymn", this.data.meetingData.sacramentHymn);
      }
    }
    if (this.data.meetingData.closingHymn) {
      if ((typeof Session.get("selectedClosingHymn") == "undefined") || (Session.get("selectedClosingHymn") == "")) {
        Session.set("selectedClosingHymn", this.data.meetingData.closingHymn);
      }
    }
    if (this.data.meetingData.invocation) {
      if ((typeof Session.get("selectedInvocation") == "undefined") || (Session.get("selectedInvocation") == "")) {
        Session.set("selectedInvocation", this.data.meetingData.invocation);
      }
    }
    if (this.data.meetingData.benediction) {
      if ((typeof Session.get("selectedBenediction") == "undefined") || (Session.get("selectedBenediction") == "")) {
        Session.set("selectedBenediction", this.data.meetingData.benediction);
      }
    }
    if (this.data.meetingData.presiding) {
      if ((typeof Session.get("selectedPresiding") == "undefined") || (Session.get("selectedPresiding") == "")) {
        Session.set("selectedPresiding", this.data.meetingData.presiding);
      }
    }
    if (this.data.meetingData.conducting) {
      if ((typeof Session.get("selectedConducting") == "undefined") || (Session.get("selectedConducting") == "")) {
        Session.set("selectedConducting", this.data.meetingData.conducting);
      }
    }
    if (this.data.meetingData.attendance) {
      if ((typeof Session.get("selectedAttendance") == "undefined") || (Session.get("selectedAttendance") == "")) {
        Session.set("selectedAttendance", this.data.meetingData.attendance);
      }
    }
  }
};
