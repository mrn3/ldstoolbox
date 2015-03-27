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
  }
});

Template.meetingEdit.events({
  'click #addAnnouncementButton': function(e, instance) {
    announcementCollection.insert({meetingId: this._id, text: "", wardUnitNo: Meteor.user().wardUnitNo });
  },
  'click .removeAnnouncementButton': function(e, instance) {
    announcementCollection.remove({_id: this._id});
  },
  'change .announcementInput': function(e, instance) {
    announcementValue = document.getElementById(this._id).value;
    var updateObject = {};
    updateObject.$set = {text: announcementValue, wardUnitNo: Meteor.user().wardUnitNo};
    announcementCollection.update(this._id, updateObject);
  },
  'click #addIntermediateHymnButton': function(e, instance) {
    intermediateHymnCollection.insert({meetingId: this._id, afterSpeaker: 1, wardUnitNo: Meteor.user().wardUnitNo });
  },
  'click .removeIntermediateHymnButton': function(e, instance) {
    intermediateHymnCollection.remove({_id: this._id});
  },
  'click .intermediateHymnItem': function(e, instance) {
    Session.set("hymnSelectType", "intermediateHymn");
    Session.set("intermediateHymnId", this._id);
  },
  'change .intermediateHymnAfterSpeakerSelect': function(e, instance) {
    afterSpeakerValue = document.getElementById(this._id).value;
    var updateObject = {};
    updateObject.$set = {afterSpeaker: afterSpeakerValue, wardUnitNo: Meteor.user().wardUnitNo};
    intermediateHymnCollection.update(this._id, updateObject);
  },
  'click #addMusicalNumberButton': function(e, instance) {
    musicalNumberCollection.insert({meetingId: this._id, afterSpeaker: 1, wardUnitNo: Meteor.user().wardUnitNo });
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
  'click .musicalNumberAccompanistItem': function(e, instance) {
    Session.set("memberSelectType", "musicalNumberAccompanist");
    Session.set("musicalNumberId", this._id);
  },
  'change .musicalNumberAfterSpeakerSelect': function(e, instance) {
    afterSpeakerValue = document.getElementById(this._id).value;
    var updateObject = {};
    updateObject.$set = {afterSpeaker: afterSpeakerValue, wardUnitNo: Meteor.user().wardUnitNo};
    musicalNumberCollection.update(this._id, updateObject);
  },
  'click #addVisitorButton': function(e, instance) {
    visitorCollection.insert({meetingId: this._id, wardUnitNo: Meteor.user().wardUnitNo});
  },
  'click .removeVisitorButton': function(e, instance) {
    visitorCollection.remove({_id: this._id});
  },
  'click .visitorItem': function(e, instance) {
    Session.set("memberSelectType", "visitor");
    Session.set("visitorId", this._id);
  },
  'click #addSpeakerButton': function(e, instance) {
    speakerCollection.insert({meetingId: this._id, wardUnitNo: Meteor.user().wardUnitNo});
  },
  'click .removeSpeakerButton': function(e, instance) {
    speakerCollection.remove({_id: this._id});
  },
  'click .speakerItem': function(e, instance) {
    Session.set("memberSelectType", "speaker");
    Session.set("speakerId", this._id);
  },
  'click #addRecognitionButton': function(e, instance) {
    recognitionCollection.insert({meetingId: this._id, "members": [{_id: Random.id()}], wardUnitNo: Meteor.user().wardUnitNo});
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
              "switchedPreferredName": ""
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
  'click #cancelButton': function(e, instance) {
    history.back();
  },
  'click #doneButton': function(e, instance){
    var meeting = this;
    var updateObject = {};
    var properties = {
      createdBy:            Meteor.userId(),
      createdAt:            new Date(),
      wardUnitNo:           Meteor.user().wardUnitNo,
      meetingDate:          $('#meetingDate').val(),
      fastAndTestimony:     $('#fastAndTestimony').prop("checked"),
      presiding:            Session.get("selectedPresiding"),
      conducting:           Session.get("selectedConducting"),
      attendance:           Session.get("selectedAttendance"),
      organist:             Session.get("selectedOrganist"),
      chorister:            Session.get("selectedChorister"),
      openingHymn:          Session.get("selectedOpeningHymn"),
      sacramentHymn:        Session.get("selectedSacramentHymn"),
      intermediateHymn:     Session.get("selectedIntermediateHymn"),
      musicalNumber:        $('#musicalNumber').val(),
      closingHymn:          Session.get("selectedClosingHymn"),
      invocation:           Session.get("selectedInvocation"),
      benediction:          Session.get("selectedBenediction"),
      recognition1Type:     $('#recognition1Type').val(),
      recognition1Person1:  $('#recognition1Person1').val(),
      recognition1Person2:  $('#recognition1Person2').val(),
      recognition1Person3:  $('#recognition1Person3').val(),
      recognition2Type:     $('#recognition2Type').val(),
      recognition2Person1:  $('#recognition2Person1').val(),
      recognition2Person2:  $('#recognition2Person2').val(),
      recognition2Person3:  $('#recognition2Person3').val(),
      recognition3Type:     $('#recognition3Type').val(),
      recognition3Person1:  $('#recognition3Person1').val(),
      recognition3Person2:  $('#recognition3Person2').val(),
      recognition3Person3:  $('#recognition3Person3').val()
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
