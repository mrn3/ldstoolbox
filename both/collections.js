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
announcementCollection = new Meteor.Collection("announcement");
musicalNumberCollection = new Meteor.Collection("musicalNumber");
intermediateHymnCollection = new Meteor.Collection("intermediateHymn");
visitorCollection = new Meteor.Collection("visitor");
speakerCollection = new Meteor.Collection("speaker");
recognitionCollection = new Meteor.Collection("recognition");
recognitionTypeCollection = new Meteor.Collection("recognitionType");
householdCollection = new Meteor.Collection("household");
Ground.Collection(householdCollection);
memberCollection = new Meteor.Collection("member");
unitCollection = new Meteor.Collection("unit");
hymnCollection = new Meteor.Collection("hymn");
memberClientCollection = new Meteor.Collection("memberClient");
organizationCollection = new Meteor.Collection("organization");
