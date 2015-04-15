Template.layout.helpers({
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
  },
  searchInputValue: function() {
    return Session.get("searchInput");
  }
});

Template.layout.events({
  "change #statusSelector": function(e, instance){
    Session.set("statusSelector", $("#statusSelector").val());
  },
  "change #typeSelector": function(e, instance){
    Session.set("typeSelector", $("#typeSelector").val());
  },
  "keyup #searchInput": function(e, instance){
    Session.set("searchInput", $("#searchInput").val());
  }
});

Template.layout.rendered = function() {
  if (typeof Session.get("typeSelector") == "undefined") {
    Session.set("typeSelector", "All");
  }
  if (typeof Session.get("statusSelector") == "undefined") {
    Session.set("statusSelector", "Incomplete");
  }
};
