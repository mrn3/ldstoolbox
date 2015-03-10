Template.meetingEdit.events({
  'click #addAnnouncementButton': function(e, instance) {
    announcementCollection.insert({meetingId: this._id, text: "" });
  },
  'click .removeAnnouncementButton': function(e, instance) {
    announcementCollection.remove({_id: this._id});
  },
  'change .announcementInput': function(e, instance) {
    announcementValue = document.getElementById(this._id).value;
    var updateObject = {};
    updateObject.$set = {text: announcementValue};
    announcementCollection.update(this._id, updateObject);
  },
  'click #addSpeakerButton': function(e, instance) {
    speakerCollection.insert({meetingId: this._id});
  },
  'click .removeSpeakerButton': function(e, instance) {
    speakerCollection.remove({_id: this._id});
  },
  'click .speakerItem': function(e, instance) {
    Session.set("memberSelectType", "speaker");
    Session.set("memberSelectId", this._id);
  },
  'click #addRecognitionButton': function(e, instance) {
    recognitionCollection.insert({meetingId: this._id});
  },
  'click .removeRecognitionButton': function(e, instance) {
    recognitionCollection.remove({_id: this._id});
  },
  'click .speakerItem': function(e, instance) {
    Session.set("memberSelectType", "recognition");
    Session.set("memberSelectId", this._id);
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
        meetingCollection.remove(meeting._id);
        Router.go("meetingList");
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
      meetingDate:          $('#meetingDate').val(),
      presiding:            Session.get("selectedPresiding"),
      conducting:           Session.get("selectedConducting"),
      visitingAuthority:    Session.get("selectedVisitingAuthority"),
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
        if(error) {
          console.log(error);
        }else{
          Router.go("meetingList");
        }
      });
    }
  }
});
