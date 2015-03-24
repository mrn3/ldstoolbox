Template.meetingFields.helpers({
  isChecked: function(inFastAndTestimony) {
    if (inFastAndTestimony) {
      return "checked";
    }
  },
  organistSession: function() {
    if ((Session.get("selectedOrganist")) && (Session.get("selectedOrganist").switchedPreferredName)) {
      return Session.get("selectedOrganist").switchedPreferredName;
    } else {
      return "";
    }
  },
  choristerSession: function() {
    if ((Session.get("selectedChorister")) && (Session.get("selectedChorister").switchedPreferredName)) {
      return Session.get("selectedChorister").switchedPreferredName;
    } else {
      return "";
    }
  },
  openingHymnSession: function() {
    if (Session.get("selectedOpeningHymn").numberText) {
      return Session.get("selectedOpeningHymn").numberText + " - " + Session.get("selectedOpeningHymn").name;
    } else if (Session.get("selectedOpeningHymn").name) {
      return Session.get("selectedOpeningHymn").name;
    } else {
      return "";
    }
  },
  sacramentHymnSession: function() {
    if (Session.get("selectedSacramentHymn").numberText) {
      return Session.get("selectedSacramentHymn").numberText + " - " + Session.get("selectedSacramentHymn").name;
    } else if (Session.get("selectedSacramentHymn").name) {
      return Session.get("selectedSacramentHymn").name;
    } else {
      return "";
    }
  },
  intermediateHymnSession: function() {
    if (Session.get("selectedIntermediateHymn").numberText) {
      return Session.get("selectedIntermediateHymn").numberText + " - " + Session.get("selectedIntermediateHymn").name;
    } else if (Session.get("selectedIntermediateHymn").name) {
      return Session.get("selectedIntermediateHymn").name;
    } else {
      return "";
    }
  },
  closingHymnSession: function() {
    if (Session.get("selectedClosingHymn").numberText) {
      return Session.get("selectedClosingHymn").numberText + " - " + Session.get("selectedClosingHymn").name;
    } else if (Session.get("selectedClosingHymn").name) {
      return Session.get("selectedClosingHymn").name;
    } else {
      return "";
    }
  },
  invocationSession: function() {
    if ((Session.get("selectedInvocation")) && (Session.get("selectedInvocation").switchedPreferredName)) {
      return Session.get("selectedInvocation").switchedPreferredName;
    } else {
      return "";
    }
  },
  benedictionSession: function() {
    if ((Session.get("selectedBenediction")) && (Session.get("selectedBenediction").switchedPreferredName)) {
      return Session.get("selectedBenediction").switchedPreferredName;
    } else {
      return "";
    }
  },
  presidingSession: function() {
    if ((Session.get("selectedPresiding")) && (Session.get("selectedPresiding").switchedPreferredName)) {
      return Session.get("selectedPresiding").switchedPreferredName;
    } else {
      return "";
    }
  },
  conductingSession: function() {
    if ((Session.get("selectedConducting")) && (Session.get("selectedConducting").switchedPreferredName)) {
      return Session.get("selectedConducting").switchedPreferredName;
    } else {
      return "";
    }
  },
  visitingAuthoritySession: function() {
    if ((Session.get("selectedVisitingAuthority")) && (Session.get("selectedVisitingAuthority").switchedPreferredName)) {
      return Session.get("selectedVisitingAuthority").switchedPreferredName;
    } else {
      return "";
    }
  },
  attendanceSession: function() {
    if (Session.get("selectedAttendance")) {
      return Session.get("selectedAttendance");
    } else {
      return "";
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
  },
  'click #presidingItem': function(e, instance) {
    Session.set("memberSelectType", "presiding");
  },
  'click #conductingItem': function(e, instance) {
    Session.set("memberSelectType", "conducting");
  },
  'click #visitingAuthorityItem': function(e, instance) {
    Session.set("memberSelectType", "visitingAuthority");
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
  if ((this.data) && (typeof this.data.presiding != "undefined")) {
    if ((typeof Session.get("selectedPresiding") == "undefined") || (Session.get("selectedPresiding") == "")) {
      Session.set("selectedPresiding", this.data.presiding);
    }
  }
  if ((this.data) && (typeof this.data.conducting != "undefined")) {
    if ((typeof Session.get("selectedConducting") == "undefined") || (Session.get("selectedConducting") == "")) {
      Session.set("selectedConducting", this.data.conducting);
    }
  }
  if ((this.data) && (typeof this.data.visitingAuthority != "undefined")) {
    if ((typeof Session.get("selectedVisitingAuthority") == "undefined") || (Session.get("selectedVisitingAuthority") == "")) {
      Session.set("selectedVisitingAuthority", this.data.visitingAuthority);
    }
  }
  if ((this.data) && (typeof this.data.attendance != "undefined")) {
    if ((typeof Session.get("selectedAttendance") == "undefined") || (Session.get("selectedAttendance") == "")) {
      Session.set("selectedAttendance", this.data.attendance);
    }
  }
};
