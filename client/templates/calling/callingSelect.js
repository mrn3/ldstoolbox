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

Template.callingSelect.events({
  "click #cancelButton": function(e, instance) {
    history.back();
  },
  "keyup #searchInput": _.throttle(function(e) {
    var text = $(e.target).val().trim();
    callingSearch.search(text);
  }, 200),
  "click #callingRadioButton": function(e, instance) {
    //strip out html tags
    this.callingName = jQuery('<p>' + this.callingName + '</p>').text();
    this.displayName = jQuery('<p>' + this.displayName + '</p>').text();

    Session.set('selectedCalling', this);
    history.back();
  },
});

/*
Template.callingSelect.rendered = function() {
  $('#searchInput').focus();
};
*/
