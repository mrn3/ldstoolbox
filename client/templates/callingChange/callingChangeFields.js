Template.callingChangeFields.helpers({
  callingChangeTypeSession: function() {
    if (typeof Session.get("selectedCallingChangeType") == "undefined") {
      return "";
    } else {
      return Session.get("selectedCallingChangeType");
    }
  },
  callingChangeMemberSession: function() {
    if (typeof Session.get("selectedCallingChangeMember").switchedPreferredName == "undefined") {
      return "";
    } else {
      return Session.get("selectedCallingChangeMember").switchedPreferredName;
    }
  },
  callingChangeCallingSession: function() {
    if (typeof Session.get("selectedCallingChangeCalling").callingName == "undefined") {
      return "";
    } else {
      return Session.get("selectedCallingChangeCalling").callingName;
    }
  }
});

Template.callingChangeFields.rendered = function() {
  if ((this.data) && (typeof this.data.member != "undefined")) {
    if ((typeof Session.get("selectedCallingChangeMember") == "undefined") || (Session.get("selectedCallingChangeMember") == "")) {
      Session.set("selectedCallingChangeMember", this.data.member);
    }
  }
  if ((this.data) && (typeof this.data.calling != "undefined")) {
    if ((typeof Session.get("selectedCallingChangeCalling") == "undefined") || (Session.get("selectedCallingChangeCalling") == "")) {
      Session.set("selectedCallingChangeCalling", this.data.calling);
    }
  }
  if ((this.data) && (typeof this.data.calling != "undefined")) {
    if ((typeof Session.get("selectedCallingChangeType") == "undefined") || (Session.get("selectedCallingChangeType") == "")) {
      Session.set("selectedCallingChangeType", this.data.type);
    }
  }
};

Template.callingChangeFields.events({
  'click #callingChangeMemberItem': function(e, instance) {
    Session.set("memberSelectType", "callingChangeMember");
  }
});
