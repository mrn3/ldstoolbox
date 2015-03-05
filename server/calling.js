Meteor.methods({
  getCallings: function() {
    this.unblock();
    try {
      var pipeline = [
        {$project:{a:'$leaders.callingName'}},
        {$unwind:'$a'},
        {$group:{_id:'a',res:{$addToSet:'$a'}}}
      ];
      var result = callingGroupCollection.aggregate(pipeline);
      //console.log(result);
      return result;
    } catch (e) {
      // Got a network error, time-out or HTTP error in the 400 or 500 range.
      console.log(e);
      return false;
    }
  }
});

SearchSource.defineSource('callings', function(searchText, options) {
  //var options = {sort: {"leaders.callingName": 1}, limit: 20};



  if(searchText) {
    var regExp = buildRegExp(searchText);
    //var selector = {$or: [
    //  {"leaders.callingName": regExp}
    //]};

    var options = {"leaders.callingName": regExp};
    var selector = {"leaders.callingName": regExp};


    var pipeline = [

      {$project:{thePositionName:'$positions.positionName', thePositionId:'$positions.positionId'} },
      {$unwind:'$thePositionId'},
      {$match:{ thePositionName: "Bishop"}}

    ];

    //{$group:{_id:'a',res:{$addToSet:'$a'}}},
    //{$match: { "positions" : { "$elemMatch" : {"positionName": "Bishop"}}}}
    //db.calling.find( { positions: { $elemMatch: { positionName: "Bishop" } } } )

    //console.log(callingGroupCollection.find({"leaders.callingName": "Bishop"}, {fields: {leaders: {$elemMatch: {callingName: "/(bish)/gi"}}}}).fetch());

    //return callingGroupCollection.find({"leaders.callingName": "Bishop"}, {fields: {leaders: {$elemMatch: {callingName: "/(bish)/gi"}}}}).fetch();

    //{fields: {"leaders.callingName": "/(bish)/gi"}
    //console.log(callingGroupCollection.find({"leaders.callingName": regExp}, {fields: {leaders: {$elemMatch: {"callingName": regExp}}}}).fetch());

    //return callingGroupCollection.find({"leaders.callingName": regExp}, {fields: {leaders: {$elemMatch: {"callingName": regExp}}}}).fetch();

    //console.log(pipeline);
    //console.log(callingGroupCollection);
    console.log(callingGroupCollection.aggregate(pipeline));

    return callingGroupCollection.aggregate(pipeline);
    //console.log(selector);
    //console.log(callingGroupCollection.find(selector, options).fetch());

    //console.log(options);
    //console.log(selector);

    //console.log(callingGroupCollection.find(selector, options).fetch());
    //return callingGroupCollection.find(selector, options).fetch();
  } else {
    return callingGroupCollection.find({}, options).fetch();
  }
});

function buildRegExp(searchText) {
  // this is a dumb implementation
  var parts = searchText.trim().split(/[ \-\:]+/);
  return new RegExp("(" + parts.join('|') + ")", "ig");
}
