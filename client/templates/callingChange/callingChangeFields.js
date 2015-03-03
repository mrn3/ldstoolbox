Template.callingChangeFields.helpers({
  memberNameSession: function() {
    return Session.get('selectedMember');
  }
});

Template.callingChangeFields.rendered = function() {
  //console.log(this.data.memberName);
  if (Session.get('selectedMember') == "") {
    Session.set("selectedMember", this.data.memberName);
  }
};
