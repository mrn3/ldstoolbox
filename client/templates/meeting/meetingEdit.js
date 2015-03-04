Template.meetingEdit.events({
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
  'click #editButton': function(e, instance){
    var meeting = this;
    var updateObject = {};
    var properties = {
      createdBy:            Meteor.userId(),
      createdAt:            new Date(),
      meetingDate:          $('#meetingDate').val(),
      presiding:            $('#presiding').val(),
      conducting:           $('#conducting').val(),
      visitingAuthority:    $('#visitingAuthority').val(),
      organist:             $('#organist').val(),
      chorister:            $('#chorister').val(),
      announcements:        $('#announcements').val(),
      openingHymn:          $('#openingHymn').val(),
      sacramentHymn:        $('#sacramentHymn').val(),
      intermediateHymn:     $('#intermediateHymn').val(),
      musicalNumber:        $('#musicalNumber').val(),
      closingHymn:          $('#closingHymn').val(),
      invocation:           $('#invocation').val(),
      benediction:          $('#benediction').val(),
      speaker1:             $('#speaker1').val(),
      speaker2:             $('#speaker2').val(),
      speaker3:             $('#speaker3').val(),
      speaker4:             $('#speaker4').val(),
      speaker5:             $('#speaker5').val(),
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