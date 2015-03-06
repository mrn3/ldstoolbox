Template.meetingFields.helpers({
  organistSession: function() {
    if (typeof Session.get("selectedOrganist") == "undefined") {
      return "";
    } else {
      return Session.get("selectedOrganist").switchedPreferredName;
    }
  },
  choristerSession: function() {
    if (typeof Session.get("selectedChorister") == "undefined") {
      return "";
    } else {
      return Session.get("selectedChorister").switchedPreferredName;
    }
  },
  openingHymnSession: function() {
    if (typeof Session.get("selectedOpeningHymn") == "undefined") {
      return "";
    } else {
      return Session.get("selectedOpeningHymn").numberText + " - " + Session.get("selectedOpeningHymn").name;
    }
  },
  sacramentHymnSession: function() {
    if (typeof Session.get("selectedSacramentHymn") == "undefined") {
      return "";
    } else {
      return Session.get("selectedSacramentHymn").numberText + " - " + Session.get("selectedSacramentHymn").name;
    }
  },
  intermediateHymnSession: function() {
    if (typeof Session.get("selectedIntermediateHymn") == "undefined") {
      return "";
    } else {
      return Session.get("selectedIntermediateHymn").numberText + " - " + Session.get("selectedIntermediateHymn").name;
    }
  },
  closingHymnSession: function() {
    if (typeof Session.get("selectedClosingHymn") == "undefined") {
      return "";
    } else {
      return Session.get("selectedClosingHymn").numberText + " - " + Session.get("selectedClosingHymn").name  ;
    }
  },
  invocationSession: function() {
    if (typeof Session.get("selectedInvocation") == "undefined") {
      return "";
    } else {
      return Session.get("selectedInvocation").switchedPreferredName;
    }
  },
  benedictionSession: function() {
    if (typeof Session.get("selectedBenediction") == "undefined") {
      return "";
    } else {
      return Session.get("selectedBenediction").switchedPreferredName;
    }
  }
});

Template.meetingFields.events({
  'click #organistItem': function(e, instance) {
    Session.set("memberSelectType", "organist");
  },
  'click #choristerItem': function(e, instance) {
    Session.set("memberSelectType", "chorister");
  },
  'click #openingHymnItem': function(e, instance) {
    Session.set("hymnSelectType", "openingHymn");
  },
  'click #sacramentHymnItem': function(e, instance) {
    Session.set("hymnSelectType", "sacramentHymn");
  },
  'click #intermediateHymnItem': function(e, instance) {
    Session.set("hymnSelectType", "intermediateHymn");
  },
  'click #closingHymnItem': function(e, instance) {
    Session.set("hymnSelectType", "closingHymn");
  },
  'click #invocationItem': function(e, instance) {
    Session.set("memberSelectType", "invocation");
  },
  'click #benedictionItem': function(e, instance) {
    Session.set("memberSelectType", "benediction");
  }
});

Template.meetingFields.rendered = function() {
  if ((this.data) && (typeof this.data.organist != "undefined")) {
    if ((typeof Session.get("selectedOrganist") == "undefined") || (Session.get("selectedOrganist") == "")) {
      Session.set("selectedOrganist", this.data.organist);
    }
  }
  if ((this.data) && (typeof this.data.chorister != "undefined")) {
    if ((typeof Session.get("selectedChorister") == "undefined") || (Session.get("selectedChorister") == "")) {
      Session.set("selectedChorister", this.data.chorister);
    }
  }
  if ((this.data) && (typeof this.data.openingHymn != "undefined")) {
    if ((typeof Session.get("selectedOpeningHymn") == "undefined") || (Session.get("selectedOpeningHymn") == "")) {
      Session.set("selectedOpeningHymn", this.data.openingHymn);
    }
  }
  if ((this.data) && (typeof this.data.sacramentHymn != "undefined")) {
    if ((typeof Session.get("selectedSacramentHymn") == "undefined") || (Session.get("selectedSacramentHymn") == "")) {
      Session.set("selectedSacramentHymn", this.data.sacramentHymn);
    }
  }
  if ((this.data) && (typeof this.data.intermediateHymn != "undefined")) {
    if ((typeof Session.get("selectedIntermediateHymn") == "undefined") || (Session.get("selectedIntermediateHymn") == "")) {
      Session.set("selectedIntermediateHymn", this.data.intermediateHymn);
    }
  }
  if ((this.data) && (typeof this.data.closingHymn != "undefined")) {
    if ((typeof Session.get("selectedClosingHymn") == "undefined") || (Session.get("selectedClosingHymn") == "")) {
      Session.set("selectedClosingHymn", this.data.closingHymn);
    }
  }
  if ((this.data) && (typeof this.data.invocation != "undefined")) {
    if ((typeof Session.get("selectedInvocation") == "undefined") || (Session.get("selectedInvocation") == "")) {
      Session.set("selectedInvocation", this.data.invocation);
    }
  }
  if ((this.data) && (typeof this.data.benediction != "undefined")) {
    if ((typeof Session.get("selectedBenediction") == "undefined") || (Session.get("selectedBenediction") == "")) {
      Session.set("selectedBenediction", this.data.benediction);
    }
  }
};
