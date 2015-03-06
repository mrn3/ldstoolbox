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
  },
  invocationSession: function() {
    if (typeof Session.get("selectedInvocation") == "undefined") {
      return "";
    } else {
      return Session.get("selectedInvocation").switchedPreferredName;
    }
  },
  benedictionSession: function() {
    if (typeof Session.get("selectedBenediction") == "undefined") {
      return "";
    } else {
      return Session.get("selectedBenediction").switchedPreferredName;
    }
  }
});

Template.meetingFields.events({
  'click #organistItem': function(e, instance) {
    Session.set("memberSelectType", "organist");
  },
  'click #choristerItem': function(e, instance) {
    Session.set("memberSelectType", "chorister");
  },
  'click #invocationItem': function(e, instance) {
    Session.set("memberSelectType", "invocation");
  },
  'click #benedictionItem': function(e, instance) {
    Session.set("memberSelectType", "benediction");
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
  if ((this.data) && (typeof this.data.invocation != "undefined")) {
    if ((typeof Session.get("selectedInvocation") == "undefined") || (Session.get("selectedInvocation") == "")) {
      Session.set("selectedInvocation", this.data.invocation);
    }
  }
  if ((this.data) && (typeof this.data.benediction != "undefined")) {
    if ((typeof Session.get("selectedBenediction") == "undefined") || (Session.get("selectedBenediction") == "")) {
      Session.set("selectedBenediction", this.data.benediction);
    }
  }
};
