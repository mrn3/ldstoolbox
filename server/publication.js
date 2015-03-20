Meteor.publish('memberPublication', function() {
  if (this.userId) {
    var user = Meteor.users.findOne(this.userId);
    return memberCollection.find({stakeUnitNo: user.stakeUnitNo});
  }
});

Meteor.publish('householdPublication', function() {
  if (this.userId) {
    var user = Meteor.users.findOne(this.userId);
    return householdCollection.find({wardUnitNo: user.wardUnitNo});
  }
});

Meteor.publish('callingPublication', function() {
  if (this.userId) {
    var user = Meteor.users.findOne(this.userId);
    var selector = {$or: [
      {"wardUnitNo": user.wardUnitNo},
      {"wardUnitNo": -1}
    ]};
    return callingCollection.find(selector);
  }
});

Meteor.publish('stakeCallingPublication', function() {
  if (this.userId) {
    var user = Meteor.users.findOne(this.userId);
    var selector = {$or: [
      {"stakeUnitNo": user.stakeUnitNo}
    ]};
    return callingCollection.find(selector);
  }
});

Meteor.publish('reportPublication', function() {
  if (this.userId) {
    var user = Meteor.users.findOne(this.userId);
    return memberCollection.group({
        "key": {
            "wardUnitNo": true,
            "stakeUnitNo": true
        },
        "initial": {
            "countstar": 0
        },
        "reduce": function(obj, prev) {
            if (true != null) if (true instanceof Array) prev.countstar += true.length;
            else prev.countstar++;
        },
        "cond": {
            "stakeUnitNo": user.stakeUnitNo
        }
    });
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
  return recognitionTypeCollection.find({});
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
    return unitCollection.find({stakeUnitNo: user.stakeUnitNo});
  }
});

Meteor.publish('hymnPublication', function() {
  return hymnCollection.find({});
});

Meteor.publish("userPublication", function () {
  if (this.userId) {
    return Meteor.users.find({_id: this.userId},
                             {fields: {wardUnitNo: 1,
                                        stakeUnitNo: 1,
                                        individualId: 1,
                                        callings: 1,
                                        ldsAccount: 1}});
  }
});
