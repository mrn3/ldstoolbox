var options = {
  //keepHistory: 1000 * 60 * 5,
  //localSearch: true
};
var fields = ["positionName", "displayName"];

callingSearch = new SearchSource('callings', fields, options);

Template.callingSelect.helpers({
  callingData: function() {
    return callingSearch.getData({
      transform: function(matchText, regExp) {
        return matchText.replace(regExp, "<strong>$&</strong>")
      },
      sort: {isoScore: -1}
    });
  },
  isLoading: function() {
    return callingSearch.getStatus().loading;
  }
});

function doUpdate (inUpdateObject) {
  Session.set('selectedCallingChangeCalling', inUpdateObject);
  history.back();
}

Template.callingSelect.events({
  "keyup #callingSearchInput": _.throttle(function(e) {
    var text = $(e.target).val().trim();
    callingSearch.search(text);
  }, 200),
  "click #goButton": function() {
    var callingObject = {
      "positionName": $('#other').val()
    }
    doUpdate(callingObject);
  },
  "click #callingRadioButton": function() {
    //strip out html tags
    this.positionName = jQuery('<p>' + this.positionName + '</p>').text();
    this.displayName = jQuery('<p>' + this.displayName + '</p>').text();
    doUpdate(this);
  },
});
