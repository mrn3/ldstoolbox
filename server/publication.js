Meteor.publish('memberPublication', function() {
  if (this.userId) {
    var user = Meteor.users.findOne(this.userId);
    return memberCollection.find({wardUnitNo: user.wardUnitNo});
  }
});

Meteor.publish('householdPublication', function() {
  console.log(this.userId);
  if (this.userId) {
    var user = Meteor.users.findOne(this.userId);
    return householdCollection.find({wardUnitNo: user.wardUnitNo});
  }
});

Meteor.publish('callingPublication', function() {
  if (this.userId) {
    var user = Meteor.users.findOne(this.userId);
    return callingCollection.find({wardUnitNo: user.wardUnitNo});
  }
});

Meteor.publish('callingGroupPublication', function() {
  if (this.userId) {
    var user = Meteor.users.findOne(this.userId);
    return callingGroupCollection.find({wardUnitNo: user.wardUnitNo});
  }
});

Meteor.publish('callingChangePublication', function() {
  if (this.userId) {
    var user = Meteor.users.findOne(this.userId);
    return callingChangeCollection.find({wardUnitNo: user.wardUnitNo});
  }
});

Meteor.publish('meetingPublication', function() {
  if (this.userId) {
    var user = Meteor.users.findOne(this.userId);
    return meetingCollection.find({wardUnitNo: user.wardUnitNo});
  }
});

Meteor.publish('speakerPublication', function() {
  if (this.userId) {
    var user = Meteor.users.findOne(this.userId);
    return speakerCollection.find({wardUnitNo: user.wardUnitNo});
  }
});

Meteor.publish('recognitionPublication', function() {
  if (this.userId) {
    var user = Meteor.users.findOne(this.userId);
    return recognitionCollection.find({wardUnitNo: user.wardUnitNo});
  }
});

Meteor.publish('recognitionTypePublication', function() {
  return recognitionTypeCollection.find({wardUnitNo: user.wardUnitNo});
});

Meteor.publish('announcementPublication', function() {
  if (this.userId) {
    var user = Meteor.users.findOne(this.userId);
    return announcementCollection.find({wardUnitNo: user.wardUnitNo});
  }
});

Meteor.publish('unitPublication', function() {
  if (this.userId) {
    var user = Meteor.users.findOne(this.userId);
    return unitCollection.find({wardUnitNo: user.wardUnitNo});
  }
});

Meteor.publish('hymnPublication', function() {
  return hymnCollection.find({wardUnitNo: user.wardUnitNo});
});
