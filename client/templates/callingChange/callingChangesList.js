Template.callingChangesList.events({
  "change #statusSelector": function(e, instance){
    Session.set("statusSelector", $('#statusSelector').val());
  },
  "change #typeSelector": function(e, instance){
    Session.set("typeSelector", $('#typeSelector').val());
  }
});

Template.callingChangesList.helpers({
  callingChangesList: function(){
    if (typeof Session.get("typeSelector") == "undefined") {
      Session.set("typeSelector", "All");
    }
    if (typeof Session.get("statusSelector") == "undefined") {
      Session.set("statusSelector", "Incomplete");
    }

    if ((Session.get("statusSelector") == "Incomplete")) {
      if (Session.get("typeSelector") == "All") {
        return callingChangesCollection.find({status: { $not : "Complete"}});
      } else {
        return callingChangesCollection.find({status: { $not : "Complete"}, type: Session.get("typeSelector")});
      }
    } else if (Session.get("statusSelector") == "All") {
      if (Session.get("typeSelector") == "All") {
        return callingChangesCollection.find({});
      } else {
        return callingChangesCollection.find({type: Session.get("typeSelector")});
      }
    } else {
      if (Session.get("typeSelector") == "All") {
        return callingChangesCollection.find({status: Session.get("statusSelector")});
      } else {
        return callingChangesCollection.find({status: Session.get("statusSelector"), type: Session.get("typeSelector")});
      }
    }
  },
  selectedTypeOption: function(value){
    if (Session.get("typeSelector") == value) {
      return {selected: "selected"};
    } else {
      return "";
    }
  },
  selectedStatusOption: function(value){
    if (Session.get("statusSelector") == value) {
      return {selected: "selected"};
    } else {
      return "";
    }
  }
});


Template.callingChangesList.rendered = function(){
  if (typeof Session.get("typeSelector") == "undefined") {
    Session.set("typeSelector", "All");
  }
  if (typeof Session.get("statusSelector") == "undefined") {
    Session.set("statusSelector", "Incomplete");
  }
};
