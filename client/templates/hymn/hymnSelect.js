var options = {
  //keepHistory: 1000 * 60 * 5,
  //localSearch: true
};
var fields = ["name", "numberText"];

hymnSearch = new SearchSource("hymns", fields, options);

Template.hymnSelect.helpers({
  includePrimarySongs: function() {
    if (Session.get("includePrimarySongs")) {
      return "checked";
    }
  },
  hymnData: function(){
    return hymnSearch.getData({
      transform: function(matchText, regExp) {
        return matchText.replace(regExp, "<strong>$&</strong>")
      }
    });
  },
  isLoading: function() {
    return hymnSearch.getStatus().loading;
  }
});

function doUpdate (inUpdateObject) {
  if (Session.get("hymnSelectType") == "openingHymn") {
    Session.set('selectedOpeningHymn', inUpdateObject);
  }
  else if (Session.get("hymnSelectType") == "sacramentHymn") {
    Session.set('selectedSacramentHymn', inUpdateObject);
  }
  else if (Session.get("hymnSelectType") == "closingHymn") {
    Session.set('selectedClosingHymn', inUpdateObject);
  }
  else if (Session.get("hymnSelectType") == "intermediateHymn") {
    var updateObject = {};
    updateObject.$set = {hymn: inUpdateObject, wardUnitNo: Meteor.user().wardUnitNo};
    intermediateHymnCollection.update(Session.get("intermediateHymnId"), updateObject);
  }
  else if (Session.get("hymnSelectType") == "musicalNumberHymn") {
    var updateObject = {};
    updateObject.$set = {hymn: inUpdateObject, wardUnitNo: Meteor.user().wardUnitNo};
    musicalNumberCollection.update(Session.get("musicalNumberId"), updateObject);
  }
  history.back();
}

Template.hymnSelect.events({
  "keyup #searchInput": _.throttle(function(e) {
    var text = $(e.target).val().trim();
    hymnSearch.search(text);
  }, 200),
  "click #goButton": function() {
    var hymnObject = {
      "name": $('#other').val()
    }
    doUpdate(hymnObject);
  },
  "click #hymnRadioButton": function(e, instance) {
    //strip out html tags
    if (this.name) {
      this.name = jQuery('<p>' + this.name + '</p>').text();
    }
    if (this.number) {
      this.numberText = jQuery('<p>' + this.number + '</p>').text();
    }
    doUpdate(this);
  },
  "change #includePrimarySongs": function(e, instance) {
    Session.set("includePrimarySongs", e.target.checked);
    Meteor.call("setIncludePrimarySongs", e.target.checked);
    var text = $("#searchInput").val().trim();
    hymnSearch.search(text);
  }
});


Template.hymnSelect.rendered = function() {
  //$('#searchInput').focus();
  if (!Session.get("includePrimarySongs")) {
    Session.set("includePrimarySongs", Meteor.user().includePrimarySongs);
  }
};
