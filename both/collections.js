Posts = new Mongo.Collection('posts');

Posts.attachSchema(new SimpleSchema({
  title: {
    type: String,
    max: 200,
    autoform: {
      'label-type': 'stacked'
    }
  },
  body: {
    type: String,
    autoform: {
      rows: 10,
      'label-type': 'stacked'
    }
  },
  published: {
    type: Boolean,
    defaultValue: true,
    autoform: {
      type: 'toggle'
    }
  }
}));

callingCollection = new Meteor.Collection("calling");
callingChangeCollection = new Meteor.Collection("callingChange");
Meteor.methods({
  insertCallingChange: function(callingChange){
    console.log(callingChange);
    callingChange._id = callingChangeCollection.insert(callingChange);
    return callingChange;
  }
});

householdCollection = new Meteor.Collection("household");
memberCollection = new Meteor.Collection("member");
unitCollection = new Meteor.Collection("unit");
