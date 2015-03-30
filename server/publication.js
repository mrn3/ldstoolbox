Meteor.publish('likelyOptionsMemberPublication', function() {
  if (this.userId) {
    var user = Meteor.users.findOne(this.userId);
    var selector = {$or: [
      //bishopric, chorister, or organist
      {"callings.positionId": {$in: [4, 54, 55, 234, 1585]}, "wardUnitNo": user.wardUnitNo},
      //stake presidency or high council
      {"callings.positionId": {$in: [1, 2, 3, 94]}, "stakeUnitNo": user.stakeUnitNo}
    ]};
    return memberCollection.find(selector);
  } else {
    return [];
  }
});

Meteor.publish('wardMemberPublication', function() {
  if (this.userId) {
    var user = Meteor.users.findOne(this.userId);
    return memberCollection.find({wardUnitNo: user.wardUnitNo});
  } else {
    return [];
  }
});

Meteor.publish('stakeMemberPublication', function() {
  if (this.userId) {
    var user = Meteor.users.findOne(this.userId);
    return memberCollection.find({stakeUnitNo: user.stakeUnitNo});
  } else {
    return [];
  }
});

Meteor.publish("reportPublication", function () {
  if (this.userId) {
    var sub = this;
    var user = Meteor.users.findOne(this.userId);
    //console.log(sub);
    // This works for Meteor 0.6.5
    var db = MongoInternals.defaultRemoteCollectionDriver().mongo.db;

    // Your arguments to Mongo's aggregation. Make these however you want.
    var pipeline = [
      {
        $match: { stakeUnitNo: user.stakeUnitNo }
      },
      {
        $group : {
          _id : "$wardUnitNo",
          count: { $sum: 1 }
        }
      }
    ];

    //console.log(pipeline);
    //console.log(db.collection("memberCollection"));
    db.collection("member").aggregate(
      pipeline,
      // Need to wrap the callback so it gets called in a Fiber.
      Meteor.bindEnvironment(
        function(err, result) {
          // Add each of the results to the subscription.
          //console.log(result);
          _.each(result, function(e) {
            // Generate a random disposable id for aggregated documents
            sub.added("memberClient", Random.id(), {
              wardUnitNo: e._id,
              count: e.count
            });
            //console.log(e);
          });
          sub.ready();
        },
        function(error) {
          Meteor._debug( "Error doing aggregation: " + error);
        }
      )
    );
  } else {
    return [];
  }
});

Meteor.publish('householdPublication', function() {
  if (this.userId) {
    var user = Meteor.users.findOne(this.userId);
    return householdCollection.find({wardUnitNo: user.wardUnitNo});
  } else {
    return [];
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
  } else {
    return [];
  }
});

Meteor.publish('stakeCallingPublication', function() {
  if (this.userId) {
    var user = Meteor.users.findOne(this.userId);
    var selector = {$or: [
      {"stakeUnitNo": user.stakeUnitNo}
    ]};
    return callingCollection.find(selector);
  } else {
    return [];
  }
});

Meteor.publish('callingGroupPublication', function() {
  if (this.userId) {
    var user = Meteor.users.findOne(this.userId);
    return callingGroupCollection.find({wardUnitNo: user.wardUnitNo});
  } else {
    return [];
  }
});

Meteor.publish('organizationPublication', function() {
  if (this.userId) {
    var user = Meteor.users.findOne(this.userId);
    return organizationCollection.find({});
  } else {
    return [];
  }
});

Meteor.publish('callingChangePublication', function() {
  if (this.userId) {
    var user = Meteor.users.findOne(this.userId);
    return callingChangeCollection.find({wardUnitNo: user.wardUnitNo});
  } else {
    return [];
  }
});

Meteor.publish('meetingPublication', function() {
  if (this.userId) {
    var user = Meteor.users.findOne(this.userId);
    return meetingCollection.find({wardUnitNo: user.wardUnitNo});
  } else {
    return [];
  }
});

Meteor.publish('speakerPublication', function() {
  if (this.userId) {
    var user = Meteor.users.findOne(this.userId);
    return speakerCollection.find({wardUnitNo: user.wardUnitNo});
  } else {
    return [];
  }
});

Meteor.publish('recognitionPublication', function() {
  if (this.userId) {
    var user = Meteor.users.findOne(this.userId);
    return recognitionCollection.find({wardUnitNo: user.wardUnitNo});
  } else {
    return [];
  }
});

Meteor.publish('recognitionTypePublication', function() {
  return recognitionTypeCollection.find({});
});

Meteor.publish('announcementPublication', function() {
  if (this.userId) {
    var user = Meteor.users.findOne(this.userId);
    return announcementCollection.find({wardUnitNo: user.wardUnitNo});
  } else {
    return [];
  }
});

Meteor.publish('musicalNumberPublication', function() {
  if (this.userId) {
    var user = Meteor.users.findOne(this.userId);
    return musicalNumberCollection.find({wardUnitNo: user.wardUnitNo});
  } else {
    return [];
  }
});

Meteor.publish('intermediateHymnPublication', function() {
  if (this.userId) {
    var user = Meteor.users.findOne(this.userId);
    return intermediateHymnCollection.find({wardUnitNo: user.wardUnitNo});
  } else {
    return [];
  }
});

Meteor.publish('visitorPublication', function() {
  if (this.userId) {
    var user = Meteor.users.findOne(this.userId);
    return visitorCollection.find({wardUnitNo: user.wardUnitNo});
  } else {
    return [];
  }
});

Meteor.publish('unitPublication', function() {
  if (this.userId) {
    var user = Meteor.users.findOne(this.userId);
    return unitCollection.find({stakeUnitNo: user.stakeUnitNo});
  } else {
    return [];
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
  } else {
    return [];
  }
});
