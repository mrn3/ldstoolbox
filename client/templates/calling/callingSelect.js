var options = {
  keepHistory: 1000 * 60 * 5,
  localSearch: true
};
var fields = ["callingName", "displayName"];

callingSearch = new SearchSource('callings', fields, options);

Template.callingSelect.helpers({
  callingData: function(){
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

function doUpdate (updateObject) {
  Session.set('selectedCallingChangeCalling', updateObject);
  history.back();
}

Template.callingSelect.events({
  "click #cancelButton": function(e, instance) {
    history.back();
  },
  "keyup #searchInput": _.throttle(function(e) {
    var text = $(e.target).val().trim();
    callingSearch.search(text);
  }, 200),
  "click #goButton": function() {
    var callingObject = {
      "callingName": $('#other').val()
    }
    doUpdate(callingObject);
  },
  "click #callingRadioButton": function() {
    //strip out html tags
    this.callingName = jQuery('<p>' + this.callingName + '</p>').text();
    this.displayName = jQuery('<p>' + this.displayName + '</p>').text();
    doUpdate(this);
  }
});

/*
Template.callingSelect.rendered = function() {
  $('#searchInput').focus();
};
*/
