Meteor.methods({
  getCallings: function() {
    this.unblock();
    try {
      var pipeline = [
        {$project:{a:'$positions.positionName'}},
        {$unwind:'$a'},
        {$group:{_id:'a',res:{$addToSet:'$a'}}}
      ];
      var result = callingCollection.aggregate(pipeline);
      //console.log(result);
      return result;
    } catch (e) {
      // Got a network error, time-out or HTTP error in the 400 or 500 range.
      console.log(e);
      return false;
    }
  }
});
