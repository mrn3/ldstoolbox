callingCollection = new Meteor.Collection("calling");
callingGroupCollection = new Meteor.Collection("callingGroup");
callingChangeCollection = new Meteor.Collection("callingChange");
Meteor.methods({
  insertCallingChange: function(callingChange){
    callingChange._id = callingChangeCollection.insert(callingChange);
    return callingChange;
  }
});
meetingCollection = new Meteor.Collection("meeting");
Meteor.methods({
  insertMeeting: function(meeting){
    meeting._id = meetingCollection.insert(meeting);
    return meeting;
  }
});
announcementCollection = new Meteor.Collection("announcement");
householdCollection = new Meteor.Collection("household");
memberCollection = new Meteor.Collection("member");
unitCollection = new Meteor.Collection("unit");

hymnCollection = new Meteor.Collection("hymn");
recognitionTypeCollection = new Meteor.Collection("recognitionType");
