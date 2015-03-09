Template.meetingFields.helpers({
  organistSession: function() {
    if (typeof Session.get("selectedOrganist").switchedPreferredName == "undefined") {
      return "";
    } else {
      return Session.get("selectedOrganist").switchedPreferredName;
    }
  },
  choristerSession: function() {
    if (typeof Session.get("selectedChorister").switchedPreferredName == "undefined") {
      return "";
    } else {
      return Session.get("selectedChorister").switchedPreferredName;
    }
  },
  openingHymnSession: function() {
    if (typeof Session.get("selectedOpeningHymn").numberText == "undefined") {
      return "";
    } else {
      return Session.get("selectedOpeningHymn").numberText + " - " + Session.get("selectedOpeningHymn").name;
    }
  },
  sacramentHymnSession: function() {
    if (typeof Session.get("selectedSacramentHymn").numberText == "undefined") {
      return "";
    } else {
      return Session.get("selectedSacramentHymn").numberText + " - " + Session.get("selectedSacramentHymn").name;
    }
  },
  intermediateHymnSession: function() {
    if (typeof Session.get("selectedIntermediateHymn").numberText == "undefined") {
      return "";
    } else {
      return Session.get("selectedIntermediateHymn").numberText + " - " + Session.get("selectedIntermediateHymn").name;
    }
  },
  closingHymnSession: function() {
    if (typeof Session.get("selectedClosingHymn").numberText == "undefined") {
      return "";
    } else {
      return Session.get("selectedClosingHymn").numberText + " - " + Session.get("selectedClosingHymn").name  ;
    }
  },
  invocationSession: function() {
    if (typeof Session.get("selectedInvocation").switchedPreferredName == "undefined") {
      return "";
    } else {
      return Session.get("selectedInvocation").switchedPreferredName;
    }
  },
  benedictionSession: function() {
    if (typeof Session.get("selectedBenediction").switchedPreferredName == "undefined") {
      return "";
    } else {
      return Session.get("selectedBenediction").switchedPreferredName;
    }
  },
  presidingSession: function() {
    if (typeof Session.get("selectedPresiding").switchedPreferredName == "undefined") {
      return "";
    } else {
      return Session.get("selectedPresiding").switchedPreferredName;
    }
  },
  conductingSession: function() {
    if (typeof Session.get("selectedConducting").switchedPreferredName == "undefined") {
      return "";
    } else {
      return Session.get("selectedConducting").switchedPreferredName;
    }
  },
  visitingAuthoritySession: function() {
    if (typeof Session.get("selectedVisitingAuthority").switchedPreferredName == "undefined") {
      return "";
    } else {
      return Session.get("selectedVisitingAuthority").switchedPreferredName;
    }
  },
  attendanceSession: function() {
    if (typeof Session.get("selectedAttendance") == "undefined") {
      return "";
    } else {
      return Session.get("selectedAttendance");
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
  /*
  if ((this.data) && (typeof this.data.announcementArray != "undefined")) {
    for(var announcementIndex in this.data.announcementArray) {
      $("#announcementList").append($("#announcementList div.list:eq(0)").clone(true));
      $("#announcementList div.list").eq(-1).find("input").val(this.data.announcementArray[announcementIndex]);
      $("#announcementList div.list").eq(-1).find("button").attr("id", "removeAnnouncementButton" + announcementIndex);
      $("#announcementList div.list").eq(-1).find("button").attr("onclick", "console.log(this);");
    }
  }
  */

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
