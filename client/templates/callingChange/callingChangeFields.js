Template.callingChangeFields.helpers({
  membersList: function(){
    return Members.find().fetch().map(function(member){
      if (typeof(member.callings) != "undefined") {
        returnString = member.switchedPreferredName;
        /*
        returnString += " - ";
        for (i = 0; i < member.callings.length; i++) {
          if (i != 0) {
            returnString += ", ";
          }
          returnString += member.callings[i].callingName;
        }
        */
        return returnString;
      } else {
        return member.switchedPreferredName;
      }
    });
  },
  callingsList: function(){
    Meteor.call("getCallings", function(error, data) {
      if (error) {
        console.log(error);
        throwError(error.reason);
      }
      Session.set('callingsListSession', data);
    });
    if (typeof (Session.get('callingsListSession')) !== "undefined") {
      return Session.get('callingsListSession')['0'].res;
    } else {
      return false;
    }
  },
  dateDiscussed: function() {
    if (typeof this.dateDiscussed == "undefined") {
      return "";
    } else {
      return moment(this.dateDiscussed).tz('Etc/GMT').format('YYYY-MM-DD');
    }
  },
  dateApproved: function() {
    if (typeof this.dateApproved == "undefined") {
      return "";
    } else {
      return moment(this.dateApproved).tz('Etc/GMT').format('YYYY-MM-DD');
    }
  },
  dateInterviewed: function() {
    if (typeof this.dateInterviewed == "undefined") {
      return "";
    } else {
      return moment(this.dateInterviewed).tz('Etc/GMT').format('YYYY-MM-DD');
    }
  },
  datePresented: function() {
    if (typeof this.datePresented == "undefined") {
      return "";
    } else {
      return moment(this.datePresented).tz('Etc/GMT').format('YYYY-MM-DD');
    }
  },
  dateRecorded: function() {
    if (typeof this.dateRecorded == "undefined") {
      return "";
    } else {
      return moment(this.dateRecorded).tz('Etc/GMT').format('YYYY-MM-DD');
    }
  },
  dateSetApart: function() {
    if (typeof this.dateSetApart == "undefined") {
      return "";
    } else {
      return moment(this.dateSetApart).tz('Etc/GMT').format('YYYY-MM-DD');
    }
  },
  dateSetApartRecorded: function() {
    if (typeof this.dateSetApartRecorded == "undefined") {
      return "";
    } else {
      return moment(this.dateSetApartRecorded).tz('Etc/GMT').format('YYYY-MM-DD');
    }
  },
  dateCancelled: function() {
    if (typeof this.dateCancelled == "undefined") {
      return "";
    } else {
      return moment(this.dateCancelled).tz('Etc/GMT').format('YYYY-MM-DD');
    }
  }
});

Template.callingChangeFields.rendered = function(){
  $('#dateDiscussed').datepicker({
    format: "yyyy-mm-dd",
    todayBtn: "linked",
    clearBtn: true,
    autoclose: true,
    todayHighlight: true
  });
  $('#dateApproved').datepicker({
    format: "yyyy-mm-dd",
    todayBtn: "linked",
    clearBtn: true,
    autoclose: true,
    todayHighlight: true
  });
  $('#dateInterviewed').datepicker({
    format: "yyyy-mm-dd",
    todayBtn: "linked",
    clearBtn: true,
    autoclose: true,
    todayHighlight: true
  });
  $('#datePresented').datepicker({
    format: "yyyy-mm-dd",
    todayBtn: "linked",
    clearBtn: true,
    daysOfWeekDisabled: "1,2,3,4,5,6",
    autoclose: true,
    todayHighlight: true
  });
  $('#dateRecorded').datepicker({
    format: "yyyy-mm-dd",
    todayBtn: "linked",
    clearBtn: true,
    autoclose: true,
    todayHighlight: true
  });
  $('#dateSetApart').datepicker({
    format: "yyyy-mm-dd",
    todayBtn: "linked",
    clearBtn: true,
    autoclose: true,
    todayHighlight: true
  });
  $('#dateSetApartRecorded').datepicker({
    format: "yyyy-mm-dd",
    todayBtn: "linked",
    clearBtn: true,
    autoclose: true,
    todayHighlight: true
  });
  $('#dateCancelled').datepicker({
    format: "yyyy-mm-dd",
    todayBtn: "linked",
    clearBtn: true,
    autoclose: true,
    todayHighlight: true
  });
  Meteor.typeahead.inject();

  if ($('#dateDiscussed').val() == "") {
    $('#dateApprovedDiv').hide();
  }
  if ($('#dateApproved').val() == "") {
    $('#dateInterviewedDiv').hide();
  }
  if ($('#dateInterviewed').val() == "") {
    $('#datePresentedDiv').hide();
  }
  if ($('#datePresented').val() == "") {
    $('#dateRecordedDiv').hide();
  }
  if ($('#dateRecorded').val() == "") {
    $('#dateSetApartDiv').hide();
  }
  if ($('#dateSetApart').val() == "") {
    $('#dateSetApartRecordedDiv').hide();
  }
  if ($('#dateCancelled').val() == "") {
    $('#dateCancelledDiv').hide();
  }

  if ($('#status').val() == "") {
    $('#status').val("New");
  }
};

Template.callingChangeFields.events({
  "change #dateDiscussed": function(e, instance){
    if ($('#dateDiscussed').val() != "") {
      $('#status').val("Discussed");
      $('#dateApprovedDiv').show();
    } else {
      $('#status').val("New");
    }
  },
  "change #dateApproved": function(e, instance){
    if ($('#dateApproved').val() != "") {
      $('#status').val("Approved");
      $('#dateInterviewedDiv').show();
    }
  },
  "change #dateInterviewed": function(e, instance){
    if ($('#dateInterviewed').val() != "") {
      $('#status').val("Interviewed");
      $('#datePresentedDiv').show();
    }
    if ($('#datePresented').val() == "") {
      calculatedDatePresented = moment($('#dateInterviewed').val()).day(7);
      $('#datePresented').val(moment(calculatedDatePresented).format("YYYY-MM-DD"));
    }
  },
  "change #datePresented": function(e, instance){
    if ($('#datePresented').val() != "") {
      $('#dateRecordedDiv').show();
      if (moment().isAfter($('#datePresented'))) {
        $('#status').val("Presented");
      }
    }
  },
  "change #dateRecorded": function(e, instance){
    if ($('#dateRecorded').val() != "") {
      if ($('#type').val() == "Release") {
        $('#status').val("Complete");
      } else {
        $('#status').val("Recorded");
      }
      $('#dateSetApartDiv').show();
    }
  },
  "change #dateSetApart": function(e, instance){
    if ($('#dateSetApart').val() != "") {
      $('#status').val("Set Apart");
      $('#dateSetApartRecordedDiv').show();
    }
  },
  "change #dateSetApartRecorded": function(e, instance){
    if ($('#dateSetApartRecorded').val() != "") {
      $('#status').val("Complete");
    }
  },
  "change #dateCancelled": function(e, instance){
    if ($('#dateCancelled').val() != "") {
      $('#status').val("Cancelled");
    }
  }
});
