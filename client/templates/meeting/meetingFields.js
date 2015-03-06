Template.meetingFields.helpers({
  organistSession: function() {
    if (typeof Session.get("selectedOrganist") == "undefined") {
      return "";
    } else {
      return Session.get("selectedOrganist").switchedPreferredName;
    }
  },
  choristerSession: function() {
    if (typeof Session.get("selectedChorister") == "undefined") {
      return "";
    } else {
      return Session.get("selectedChorister").switchedPreferredName;
    }
  }
});

Template.meetingFields.events({
  'click #organistItem': function(e, instance) {
    Session.set("memberSelectType", "organist");
  },
  'click #choristerItem': function(e, instance) {
    Session.set("memberSelectType", "chorister");
  }
});

Template.meetingFields.rendered = function() {
  if ((this.data) && (typeof this.data.organist != "undefined")) {
    if ((typeof Session.get("selectedOrganist") == "undefined") || (Session.get("selectedOrganist") == "")) {
      Session.set("selectedOrganist", this.data.organist);
    }
  }
  if ((this.data) && (typeof this.data.chorister != "undefined")) {
    if ((typeof Session.get("selectedChorister") == "undefined") || (Session.get("selectedChorister") == "")) {
      Session.set("selectedChorister", this.data.chorister);
    }
  }
};
