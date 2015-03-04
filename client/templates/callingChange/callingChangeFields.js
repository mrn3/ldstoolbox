Template.callingChangeFields.helpers({
  memberNameSession: function() {
    if (typeof Session.get("selectedMember") == "undefined") {
      return "";
    } else {
      return Session.get("selectedMember").switchedPreferredName;
    }
  },
  callingNameSession: function() {
    if (typeof Session.get("selectedCalling") == "undefined") {
      return "";
    } else {
      return Session.get("selectedCalling").callingName;
    }
  },
  callingChangeTypeSession: function() {
    if (typeof Session.get("selectedCallingChangeType") == "undefined") {
      return "";
    } else {
      return Session.get("selectedCallingChangeType");
    }
  }
});

Template.callingChangeFields.rendered = function() {
  if ((this.data) && (typeof this.data.member != "undefined")) {
    if ((typeof Session.get("selectedMember") == "undefined") || (Session.get("selectedMember") == "")) {
      Session.set("selectedMember", this.data.member);
    }
  }
  if ((this.data) && (typeof this.data.calling != "undefined")) {
    if ((typeof Session.get("selectedCalling") == "undefined") || (Session.get("selectedCalling") == "")) {
      Session.set("selectedCalling", this.data.calling);
    }
  }
  if ((this.data) && (typeof this.data.calling != "undefined")) {
    if ((typeof Session.get("selectedCallingChangeType") == "undefined") || (Session.get("selectedCallingChangeType") == "")) {
      Session.set("selectedCallingChangeType", this.data.type);
    }
  }
};
