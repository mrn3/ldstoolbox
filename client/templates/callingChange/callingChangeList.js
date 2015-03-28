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
  },
  userCanViewCallingChangeList: function () {
    if (Meteor.user().callings) {

      //bishop, counselors, executive secretary, ward clerk, membership clerk
      var allowedCallingList = [4, 54, 55, 56, 57, 787];
      var userCallingList = Meteor.user().callings.reduce(
        function(total, calling){
          return total.concat(calling.positionId);
        },
      []);

      var callingIntersection =
        userCallingList.filter(function(n) {
          return allowedCallingList.indexOf(n) != -1
        });

      return (callingIntersection.length > 0);
    }
  }
});

Template.callingChangeList.events({
  'click #createCallingChangeButton': function(e, instance) {
    e.preventDefault();

    var callingChange = this;
    var insertObject = {};

    if(!Meteor.user()){
      console.log('You must be logged in.');
      return false;
    }

    var properties = {
      createdBy:            Meteor.userId(),
      createdAt:            new Date(),
      wardUnitNo:           Meteor.user().wardUnitNo,
      stakeUnitNo:          Meteor.user().stakeUnitNo,
      dateDiscussed:        new Date(),
      status:               "Discussed"
    };

    if (properties) {
      Meteor.call('insertCallingChange', properties, function(error, callingChange) {
        if (error) {
          console.log(error.reason);
        } else {
          Router.go("/callingChangeEdit/" + callingChange._id);
        }
      });
    }
  }
});

Template.callingChangeList.rendered = function() {
  Session.set("memberSelectType", "");
  Session.set("selectedCallingChangeMember", "");
  Session.set("selectedCallingChangeCalling", "");
  Session.set("selectedCallingChangeType", "");
};
