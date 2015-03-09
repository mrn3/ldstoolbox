Meteor.publish('memberPublication', function() {
  return memberCollection.find({});
});

Meteor.publish('householdPublication', function() {
  return householdCollection.find({});
});

Meteor.publish('callingPublication', function() {
  return callingCollection.find({});
});

Meteor.publish('callingGroupPublication', function() {
  return callingGroupCollection.find({});
});

Meteor.publish('callingChangePublication', function() {
  return callingChangeCollection.find({});
});

Meteor.publish('meetingPublication', function() {
  return meetingCollection.find({});
});

Meteor.publish('speakerPublication', function() {
  return speakerCollection.find({});
});

Meteor.publish('announcementPublication', function() {
  return announcementCollection.find({});
});

Meteor.publish('unitPublication', function() {
  return unitCollection.find({});
});

Meteor.publish('hymnPublication', function() {
  return hymnCollection.find({});
});

Meteor.publish('recognitionTypePublication', function() {
  return recognitionTypeCollection.find({});
});
