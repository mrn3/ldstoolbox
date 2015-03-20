Template.callingChangeList.helpers({
  callingChangeData: function(){

    if (typeof Session.get("typeSelector") == "undefined") {
      Session.set("typeSelector", "All");
    }
    if (typeof Session.get("statusSelector") == "undefined") {
      Session.set("statusSelector", "Incomplete");
    }

    if ((Session.get("statusSelector") == "Incomplete")) {
      if (Session.get("typeSelector") == "All") {
        return callingChangeCollection.find({status: { $not : "Complete"}});
      } else {
        return callingChangeCollection.find({status: { $not : "Complete"}, type: Session.get("typeSelector")});
      }
    } else if (Session.get("statusSelector") == "All") {
      if (Session.get("typeSelector") == "All") {
        return callingChangeCollection.find({});
      } else {
        return callingChangeCollection.find({type: Session.get("typeSelector")});
      }
    } else {
      if (Session.get("typeSelector") == "All") {
        return callingChangeCollection.find({status: Session.get("statusSelector")});
      } else {
        return callingChangeCollection.find({status: Session.get("statusSelector"), type: Session.get("typeSelector")});
      }
    }
  }
});

Template.callingChangeList.rendered = function() {
  Session.set("memberSelectType", "");
  Session.set("selectedCallingChangeMember", "");
  Session.set("selectedCallingChangeCalling", "");
  Session.set("selectedCallingChangeType", "");
};
