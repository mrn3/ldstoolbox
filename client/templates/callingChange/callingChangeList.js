Template.callingChangeList.helpers({
  isCall: function (type) {
    if (type == "Call") {
      return true;
    } else {
      return false;
    }
  }
});

Template.callingChangeList.rendered = function() {
  Session.set("selectedMember", "");
  Session.set("selectedCalling", "");
};
