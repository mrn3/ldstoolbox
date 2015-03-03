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

SearchSource.defineSource('callings', function(searchText, options) {
  var options = {sort: {"leaders.callingName": 1}, limit: 20};

  if(searchText) {
    var regExp = buildRegExp(searchText);
    var selector = {$or: [
      {"leaders.callingName": regExp}
    ]};

    /*
    var pipeline = [
      {$match:{ 'positions.positionName': searchText}},
      {$project:{a:'$positions.positionName'}},
      {$unwind:'$a'},
      {$group:{_id:'a',res:{$addToSet:'$a'}}}
    ];
    */

    //console.log(pipeline);
    //console.log(callingCollection);
    //console.log(callingCollection.aggregate(pipeline));

    //return callingCollection.aggregate(pipeline);
    //console.log(selector);
    //console.log(callingCollection.find(selector, options).fetch());

    return callingCollection.find(selector, options).fetch();
  } else {
    return callingCollection.find({}, options).fetch();
  }
});

function buildRegExp(searchText) {
  // this is a dumb implementation
  var parts = searchText.trim().split(/[ \-\:]+/);
  return new RegExp("(" + parts.join('|') + ")", "ig");
}
