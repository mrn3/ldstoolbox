var options = {
  keepHistory: 1000 * 60 * 5,
  localSearch: true
};
var fields = ["name", "numberText"];

hymnSearch = new SearchSource('hymns', fields, options);

Template.hymnSelect.helpers({
  hymnData: function(){
    return hymnSearch.getData({
      transform: function(matchText, regExp) {
        return matchText.replace(regExp, "<strong>$&</strong>")
      },
      sort: {isoScore: -1}
    });
  },
  isLoading: function() {
    return hymnSearch.getStatus().loading;
  }
});

Template.hymnSelect.events({
  "click #cancelButton": function(e, instance) {
    history.back();
  },
  "keyup #searchInput": _.throttle(function(e) {
    var text = $(e.target).val().trim();
    hymnSearch.search(text);
  }, 200),
  "click #goButton": function() {
    var hymnObject = {
      "name": $('#other').val()
    }
    if (Session.get("hymnSelectType") == "openingHymn") {
      Session.set('selectedOpeningHymn', hymnObject);
    }
    else if (Session.get("hymnSelectType") == "sacramentHymn") {
      Session.set('selectedSacramentHymn', hymnObject);
    }
    else if (Session.get("hymnSelectType") == "closingHymn") {
      Session.set('selectedClosingHymn', hymnObject);
    }
    else if (Session.get("hymnSelectType") == "intermediateHymn") {
      var updateObject = {};
      updateObject.$set = {hymn: hymnObject, wardUnitNo: Meteor.user().wardUnitNo};
      intermediateHymnCollection.update(Session.get("intermediateHymnId"), updateObject);
    }
    else if (Session.get("hymnSelectType") == "musicalNumberHymn") {
      var updateObject = {};
      updateObject.$set = {hymn: hymnObject, wardUnitNo: Meteor.user().wardUnitNo};
      musicalNumberCollection.update(Session.get("musicalNumberId"), updateObject);
    }
    history.back();
  },
  "click #hymnRadioButton": function(e, instance) {
    //strip out html tags
    if (this.name) {
      this.name = jQuery('<p>' + this.name + '</p>').text();
    }
    if (this.number) {
      this.numberText = jQuery('<p>' + this.number + '</p>').text();
    }

    if (Session.get("hymnSelectType") == "openingHymn") {
      Session.set('selectedOpeningHymn', this);
    }
    else if (Session.get("hymnSelectType") == "sacramentHymn") {
      Session.set('selectedSacramentHymn', this);
    }
    else if (Session.get("hymnSelectType") == "closingHymn") {
      Session.set('selectedClosingHymn', this);
    }
    else if (Session.get("hymnSelectType") == "intermediateHymn") {
      var updateObject = {};
      updateObject.$set = {hymn: this, wardUnitNo: Meteor.user().wardUnitNo};
      intermediateHymnCollection.update(Session.get("intermediateHymnId"), updateObject);
    }
    else if (Session.get("hymnSelectType") == "musicalNumberHymn") {
      var updateObject = {};
      updateObject.$set = {hymn: this, wardUnitNo: Meteor.user().wardUnitNo};
      musicalNumberCollection.update(Session.get("musicalNumberId"), updateObject);
    }
    history.back();
  },
});

/*
Template.callingSelect.rendered = function() {
  $('#searchInput').focus();
};
*/
