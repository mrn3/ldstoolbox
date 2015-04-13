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
  },
  isSelectedUnit: function(inWardUnitNo) {
    if (Session.get("selectedWardUnitNo") == inWardUnitNo) {
      return "selected";
    } else {
      return "";
    }
  },
});

function doUpdate (inUpdateObject) {
  Session.set('selectedCallingChangeCalling', inUpdateObject);
  history.back();
}

Template.callingSelect.events({
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
  },
  "change #unitSelect": function(e, instance) {
    Session.set("selectedWardUnitNo", $("#unitSelect").val());
    Meteor.call("setUserSelectedWardUnitNo", parseInt($("#unitSelect").val()));
    var text = $("#searchInput").val().trim();
    callingSearch.search(text);
  },
});

Template.callingSelect.rendered = function() {
  var user = Meteor.users.findOne(Meteor.user()._id);
  Session.set("selectedWardUnitNo", user.selectedWardUnitNo);
};
