Router.configure({
  layoutTemplate: "layout",
  //waitOn: function () {
    //return [
      //Meteor.subscribe("userPublication")
    //]
  //}
});

Meteor.startup(function () {
  if (Meteor.isClient) {
    var location = Iron.Location.get();
    if (location.queryObject.platformOverride) {
      Session.set("platformOverride", location.queryObject.platformOverride);
    }
  }
});

var requireLogin = function() {
	if (! Meteor.user()) {
	 // If user is not logged in render landingpage
		this.render('userAccounts');
	} else {
	 //if user is logged in render whatever route was requested
		this.next();
	}
}

var hideLoading = function () {
  if (this.ready()) {
    this.render();
    IonLoading.hide();
  }
}

Router.map(function() {
  this.route("home", {
    path: "/"
  });
  this.route("/about/", {
    name: "about"
  });
  this.route("/loading/", {
    name: "loading"
  });
  this.route("/householdList/", {
    name: "householdList",
    onBeforeAction: requireLogin,
    waitOn: function () {
      return [
        Meteor.subscribe("userPublication")
      ]
    },
    fastRender: true
  });
  this.route("/memberList/", {
    name: "memberList",
    onBeforeAction: requireLogin,
    waitOn: function () {
      return [
        Meteor.subscribe("userPublication")
      ]
    },
    fastRender: true
  });
  this.route("/memberSelect/", {
    name: "memberSelect",
    onBeforeAction: requireLogin,
    waitOn: function () {
      return [
        Meteor.subscribe("likelyOptionsMemberPublication"),
        Meteor.subscribe("userPublication")
      ]
    },
    data: function() {
      return {
        userData: Meteor.user()
      };
    },
    fastRender: true
  });
  this.route("/member/:individualId", {
    name: "member",
    onBeforeAction: requireLogin,
    waitOn: function () {
      return [
        Meteor.subscribe("singleMemberPublication", parseInt(this.params.individualId)),
        Meteor.subscribe("singleHouseholdByIndividualIdPublication", parseInt(this.params.individualId)),
        Meteor.subscribe("singleSpeakerByIndividualIdPublication", parseInt(this.params.individualId)),
        Meteor.subscribe("meetingPublication", parseInt(this.params.individualId))
      ]
    },
    data: function() {
      var householdSelector =
        {$or:
          [
            {"headOfHouse.individualId": parseInt(this.params.individualId)},
            {"spouse.individualId": parseInt(this.params.individualId)},
            {"children.individualId": parseInt(this.params.individualId)}
          ]
        };
      var prayerSelector =
          {$or:
            [
              {"invocation.individualId": parseInt(this.params.individualId)},
              {"benediction.individualId": parseInt(this.params.individualId)}
            ]
          };
      return {
        memberData: memberCollection.findOne({individualId: parseInt(this.params.individualId)}),
        householdData: householdCollection.findOne(householdSelector),
        speakerData: speakerCollection.find({"speaker.individualId": parseInt(this.params.individualId)}),
        prayerData: meetingCollection.find(prayerSelector)
      };
    },
    fastRender: true
  });
  this.route("/householdMap/:_id", {
    name: "householdMap",
    onBeforeAction: function() {
      GoogleMaps.load();
      this.next();
    },
    waitOn: function () {
      return [
        Meteor.subscribe("singleHouseholdByIdPublication", this.params._id)
      ]
    },
    data: function() {
      return {
        householdData: householdCollection.findOne({_id: this.params._id})
      };
    },
    fastRender: true
  });
  this.route("/callingSelect/", {
    name: "callingSelect",
    onBeforeAction: requireLogin,
    waitOn: function () {
      return [
        Meteor.subscribe("userPublication"),
        Meteor.subscribe("unitPublication")
      ]
    },
    data: function() {
      return {
        userData: Meteor.user(),
        unitData: unitCollection.find({})
      };
    },
    fastRender: true
  });
  this.route("/callingGroupList/", {
    name: "callingGroupList",
    onBeforeAction: requireLogin,
    waitOn: function () {
      return [
        Meteor.subscribe("callingGroupPublication"),
        Meteor.subscribe("userPublication")
      ]
    },
    data: function() {
      return {
        callingGroupData: callingGroupCollection.find({}, {sort: {displayOrder: 1}})
      };
    },
    fastRender: true
  });
  this.route("/callingGroup/:_id", {
    name: "callingGroup",
    onBeforeAction: requireLogin,
    waitOn: function () {
      return [
        Meteor.subscribe("callingGroupPublication"),
        Meteor.subscribe("memberAllPublication", "ward")
      ]
    },
    data: function() {
      return {
        callingData: callingGroupCollection.findOne({_id: this.params._id})
      };
    },
    fastRender: true
  });
  this.route("/organizationList/", {
    name: "organizationList",
    onBeforeAction: requireLogin,
    waitOn: function () {
      return [
        Meteor.subscribe("organizationPublication"),
        Meteor.subscribe("userPublication")
      ]
    },
    data: function() {
      return {
        organizationData: organizationCollection.find({}, {sort: {order: 1}})
      };
    },
    fastRender: true
  });
  this.route("/organization/:_id", {
    name: "organization",
    onBeforeAction: requireLogin,
    waitOn: function () {
      return [
        Meteor.subscribe("memberOrganizationPublication"),
        Meteor.subscribe("organizationPublication"),
        Meteor.subscribe("wardAllHouseholdPublication")
      ]
    },
    data: function() {
      return {
        memberData: memberCollection.find({"organizations._id": this.params._id}, {sort: {preferredName: 1}}),
        organizationData: organizationCollection.findOne({_id: this.params._id})
      };
    },
    fastRender: true
  });
  this.route("/organizationMap/:_id", {
    name: "organizationMap",
    onBeforeAction: function() {
      GoogleMaps.load();
      this.next();
    },
    fastRender: true
  });
  this.route("/callingChangeList/", {
    name: "callingChangeList",
    onBeforeAction: requireLogin,
    waitOn: function () {
      return [
        Meteor.subscribe("callingChangePublication"),
        Meteor.subscribe("userPublication")
      ]
    },
    fastRender: true
  });
  this.route("/callingChangeHelp/", {
    name: "callingChangeHelp",
    fastRender: true
  });
  this.route("/callingChangeEdit/:_id", {
    name: "callingChangeEdit",
    onBeforeAction: requireLogin,
    waitOn: function () {
      return [
        Meteor.subscribe("callingChangePublication"),
        Meteor.subscribe("meetingPublication"),
        Meteor.subscribe("userPublication")
      ]
    },
    data: function() {
      return {
        callingChangeData: callingChangeCollection.findOne(this.params._id)
      };
    },
    fastRender: true
  });
  this.route("/callingChangeHistory/:_id", {
    name: "callingChangeHistory",
    onBeforeAction: requireLogin,
    waitOn: function () {
      return [
        Meteor.subscribe("callingChangePublication"),
        Meteor.subscribe("userPublication"),
        Meteor.subscribe("memberAllPublication", "stake")
      ]
    },
    data: function() {
      return {
        callingChangeData: callingChangeCollection.findOne(this.params._id)
      };
    },
    fastRender: true
  });
  this.route("/callingChangeTypeSelect/", {
    name: "callingChangeTypeSelect",
    onBeforeAction: requireLogin,
    fastRender: true
  });
  this.route("/meetingList/", {
    name: "meetingList",
    onBeforeAction: requireLogin,
    waitOn: function () {
      return [
        Meteor.subscribe("meetingPublication"),
        Meteor.subscribe("userPublication")
      ]
    },
    data: function() {
      return {
        meetingData: meetingCollection.find({}, {sort: {meetingDate: -1}})
      };
    },
    fastRender: true
  });
  this.route("/imageUpload/", {
    name: "imageUpload",
    onBeforeAction: requireLogin,
    waitOn: function () {
      return Meteor.subscribe('images')
    },
    fastRender: true
  });
  this.route("/meetingEdit/:_id", {
    name: "meetingEdit",
    onBeforeAction: requireLogin,
    waitOn: function () {
      return [
        Meteor.subscribe("userPublication"),
        Meteor.subscribe("meetingPublication"),
        Meteor.subscribe("musicalNumberPublication"),
        Meteor.subscribe("intermediateHymnPublication"),
        Meteor.subscribe("visitorPublication"),
        Meteor.subscribe("announcementPublication"),
        Meteor.subscribe("speakerPublication"),
        Meteor.subscribe("recognitionPublication"),
        Meteor.subscribe("callingChangePublication"),
      ]
    },
    data: function() {
      return {
        meetingData: meetingCollection.findOne(this.params._id),
        musicalNumberData: musicalNumberCollection.find({meetingId: this.params._id}),
        intermediateHymnData: intermediateHymnCollection.find({meetingId: this.params._id}),
        visitorData: visitorCollection.find({meetingId: this.params._id}),
        announcementData: announcementCollection.find({meetingId: this.params._id}),
        speakerData: speakerCollection.find({meetingId: this.params._id}, {sort: {order: 1}}),
        recognitionData: recognitionCollection.find({meetingId: this.params._id}),
        callingChangeData: callingChangeCollection.find({"meeting._id": this.params._id}, {sort: {type: -1}})
      };
    },
    fastRender: true
  });
  this.route("/meetingHistory/:_id", {
    name: "meetingHistory",
    onBeforeAction: requireLogin,
    waitOn: function () {
      return [
        Meteor.subscribe("meetingPublication"),
        Meteor.subscribe("userPublication"),
        Meteor.subscribe("memberAllPublication", "ward")
      ]
    },
    data: function() {
      return {
        meetingData: meetingCollection.findOne(this.params._id)
      };
    },
    fastRender: true
  });
  this.route("/meetingSelect/", {
    name: "meetingSelect",
    onBeforeAction: requireLogin,
    waitOn: function () {
      return Meteor.subscribe("meetingPublication")
    },
    data: function() {
      return {
        meetingData: meetingCollection.find({}, {sort: {meetingDate: -1}})
      };
    },
    fastRender: true
  });
  this.route("/signupList/", {
    name: "signupList",
    onBeforeAction: requireLogin,
    waitOn: function () {
      return [
        Meteor.subscribe("signupPublication"),
        Meteor.subscribe("userPublication")
      ]
    },
    data: function() {
      return {
        signupData: signupCollection.find({}, {sort: {signupDate: -1}})
      };
    },
    fastRender: true
  });
  this.route("/signupEdit/:_id", {
    name: "signupEdit",
    onBeforeAction: requireLogin,
    waitOn: function () {
      return [
        Meteor.subscribe("signupPublication"),
        Meteor.subscribe("volunteerPublication"),
        Meteor.subscribe("userPublication")
      ]
    },
    data: function() {
      return {
        signupData: signupCollection.findOne(this.params._id),
        volunteerData: volunteerCollection.find({signupId: this.params._id}, {sort: {order: 1}})
      };
    },
    fastRender: true
  });
  this.route("/hymnSelect/", {
    name: "hymnSelect",
    waitOn: function () {
      return Meteor.subscribe("userPublication")
    },
    onBeforeAction: requireLogin,
    fastRender: true
  });
  this.route("/attendanceSelect/", {
    name: "attendanceSelect",
    onBeforeAction: requireLogin,
    fastRender: true
  });
  this.route("/recognitionTypeSelect/", {
    name: "recognitionTypeSelect",
    onBeforeAction: requireLogin,
    waitOn: function () {
      return Meteor.subscribe("recognitionTypePublication")
    },
    data: function() {
      return {
        recognitionTypeData: recognitionTypeCollection.find({})
      };
    },
    fastRender: true
  });
  this.route("/sync/", {
    name: "sync",
    waitOn: function () {
      return [
        Meteor.subscribe("userPublication")
      ]
    },
    onBeforeAction: requireLogin,
    fastRender: true
  });
  this.route("/reportList/", {
    name: "reportList",
    onBeforeAction: requireLogin,
    fastRender: true
  });
  this.route("/countReport/", {
    name: "countReport",
    onBeforeAction: requireLogin,
    waitOn: function () {
      return [
        Meteor.subscribe("userPublication"),
        Meteor.subscribe("memberAllPublication", "stake"),
        Meteor.subscribe("stakeAllHouseholdPublication"),
        Meteor.subscribe("stakeCallingPublication"),
        Meteor.subscribe("reportPublication"),
        Meteor.subscribe("unitPublication")
      ]
    },
    fastRender: true
  });
  this.route("/userAccounts/", {
    name: "userAccounts",
    onBeforeAction: requireLogin,
    fastRender: true
  });
  this.route("/meetingProgramPrint/:_id", function() {
    this.name = "meetingProgramPrint";

    meeting = meetingCollection.findOne(this.params._id);
    intermediateHymnArray = intermediateHymnCollection.find({meetingId : this.params._id}).fetch();
    musicalNumberArray = musicalNumberCollection.find({meetingId : this.params._id}).fetch();
    announcementArray = announcementCollection.find({meetingId : this.params._id}).fetch();
    speakerArray = speakerCollection.find({meetingId : this.params._id}, {sort: {order: 1}}).fetch();
    recognitionArray = recognitionCollection.find({meetingId : this.params._id}).fetch();

    var doc = new PDFDocument({size: "A4", margin: 50, layout: 'landscape'});

    var pageWidth = 800;
    var halfPageWidth = pageWidth / 2 - 40;
    var quarterPageWidth = halfPageWidth / 2;
    var labelColumnWidth = 70;
    var distanceFromTop = 40;
    var distanceFromLeft1 = 40;
    var distanceFromLeft2 = 80;
    var distanceFromLeft4 = 2*distanceFromLeft1 + halfPageWidth;
    var distanceFromLeft5 = distanceFromLeft4 + 25;
    var verticalPositionIncrement = 14;

    doc.fontSize(16);
    doc.text("Ward Leadership", distanceFromLeft1, distanceFromTop, {align: "center", width: halfPageWidth});
    distanceFromTop += verticalPositionIncrement+10;

    doc.fontSize(12);
    if (meeting && meeting.presiding && meeting.presiding.preferredName) {
      distanceFromTop += verticalPositionIncrement;
      doc.text("Presiding", distanceFromLeft1, distanceFromTop, {align: "left", width: halfPageWidth});
      doc.text(meeting.presiding.preferredName, distanceFromLeft1, distanceFromTop, {align: "right", width: halfPageWidth});
    }

    distanceFromTop += verticalPositionIncrement;
    distanceFromTop += verticalPositionIncrement;
    doc.fontSize(16);
    doc.text("Family History Consultants", distanceFromLeft1, distanceFromTop, {align: "center", width: halfPageWidth});
    distanceFromTop += verticalPositionIncrement+10;

    distanceFromTop = 40;

    doc.fontSize(12);
    doc.text("THE CHURCH OF", distanceFromLeft4, distanceFromTop, {align: "center", width: halfPageWidth});
    distanceFromTop += verticalPositionIncrement+5;
    doc.fontSize(24);
    doc.text("JESUS CHRIST", distanceFromLeft4, distanceFromTop, {align: "center", width: halfPageWidth});
    distanceFromTop += verticalPositionIncrement;
    distanceFromTop += verticalPositionIncrement;
    doc.fontSize(12);
    doc.text("OF LATTER-DAY SAINTS", distanceFromLeft4, distanceFromTop, {align: "center", width: halfPageWidth});
    distanceFromTop += verticalPositionIncrement+10;

    var imageFilePath = process.env.PWD + '/public/images/program/john_the_baptist.png';
    doc.image(imageFilePath, distanceFromLeft5, distanceFromTop, {width: halfPageWidth-50});
    distanceFromTop += 390;

    doc.fontSize(12);
    distanceFromTop += verticalPositionIncrement;
    doc.text("Founders Park 2nd Ward", distanceFromLeft4, distanceFromTop, {align: "center", width: halfPageWidth});

    doc.addPage();

    distanceFromTop = 40;

    doc.fontSize(16);
    doc.text("Sacrament Meeting Program", distanceFromLeft1, distanceFromTop, {align: "center", width: halfPageWidth});
    distanceFromTop += verticalPositionIncrement+10;

    doc.fontSize(12);
    doc.text(moment(meeting.meetingDate).format("dddd, MMMM Do YYYY"), distanceFromLeft1, distanceFromTop, {align: "center", width: halfPageWidth});
    distanceFromTop += verticalPositionIncrement;

    if (meeting && meeting.presiding && meeting.presiding.preferredName) {
      distanceFromTop += verticalPositionIncrement;
      doc.text("Presiding", distanceFromLeft1, distanceFromTop, {align: "left", width: halfPageWidth});
      doc.text(meeting.presiding.preferredName, distanceFromLeft1, distanceFromTop, {align: "right", width: halfPageWidth});
    }
    if (meeting && meeting.conducting && meeting.conducting.preferredName) {
      distanceFromTop += verticalPositionIncrement;
      doc.text("Conducting", distanceFromLeft1, distanceFromTop, {align: "left", width: halfPageWidth});
      doc.text(meeting.conducting.preferredName, distanceFromLeft1, distanceFromTop, {align: "right", width: halfPageWidth});
    }
    if (meeting && meeting.chorister && meeting.chorister.preferredName) {
      distanceFromTop += verticalPositionIncrement;
      doc.text("Chorister", distanceFromLeft1, distanceFromTop, {align: "left", width: halfPageWidth});
      doc.text(meeting.chorister.preferredName, distanceFromLeft1, distanceFromTop, {align: "right", width: halfPageWidth});
    }
    if (meeting && meeting.organist && meeting.organist.preferredName) {
      distanceFromTop += verticalPositionIncrement;
      doc.text("Organist", distanceFromLeft1, distanceFromTop, {align: "left", width: halfPageWidth});
      doc.text(meeting.organist.preferredName, distanceFromLeft1, distanceFromTop, {align: "right", width: halfPageWidth});
    }

    if (meeting && meeting.openingHymn && meeting.openingHymn.name) {
      distanceFromTop += verticalPositionIncrement;
      distanceFromTop += verticalPositionIncrement;
      doc.text("Opening  Hymn", distanceFromLeft1, distanceFromTop, {align: "left", width: halfPageWidth});
      doc.text("#" + meeting.openingHymn.number + " - " + meeting.openingHymn.name, distanceFromLeft1, distanceFromTop, {align: "right", width: halfPageWidth});
    }

    distanceFromTop += verticalPositionIncrement;
    distanceFromTop += verticalPositionIncrement;
    doc.text("Invocation", distanceFromLeft1, distanceFromTop, {align: "left", width: halfPageWidth});
    if (meeting && meeting.invocation && meeting.invocation.preferredName) {
      doc.text(meeting.invocation.preferredName, distanceFromLeft1, distanceFromTop, {align: "right", width: halfPageWidth});
    } else {
      doc.text("By Invitation", distanceFromLeft1, distanceFromTop, {align: "right", width: halfPageWidth});
    }

    distanceFromTop += verticalPositionIncrement;
    distanceFromTop += verticalPositionIncrement;
    doc.text("WARD AND STAKE BUSINESS", distanceFromLeft1, distanceFromTop, {align: "center", width: halfPageWidth});

    if (meeting && meeting.sacramentHymn && meeting.sacramentHymn.name) {
      distanceFromTop += verticalPositionIncrement;
      distanceFromTop += verticalPositionIncrement;
      doc.text("Sacrament  Hymn", distanceFromLeft1, distanceFromTop, {align: "left", width: halfPageWidth});
      doc.text("#" + meeting.sacramentHymn.number + " - " + meeting.openingHymn.name, distanceFromLeft1, distanceFromTop, {align: "right", width: halfPageWidth});
    }

    distanceFromTop += verticalPositionIncrement;
    distanceFromTop += verticalPositionIncrement;
    doc.text("ADMINISTRATION OF THE SACRAMENT", distanceFromLeft1, distanceFromTop, {align: "center", width: halfPageWidth});

    if (typeof speakerArray != "undefined") {
      for(var speakerIndex in speakerArray) {
        if (speakerArray[speakerIndex] && speakerArray[speakerIndex].speaker && speakerArray[speakerIndex].speaker.preferredName) {
          distanceFromTop += verticalPositionIncrement;
          distanceFromTop += verticalPositionIncrement;
          doc.text("Speaker", distanceFromLeft1, distanceFromTop, {align: "left", width: halfPageWidth});
          doc.text(speakerArray[speakerIndex].speaker.preferredName, distanceFromLeft1, distanceFromTop, {align: "right", width: halfPageWidth});
        }

        for(var intermediateHymnIndex in intermediateHymnArray) {
          if ((intermediateHymnArray[intermediateHymnIndex].afterSpeaker - 1) == speakerIndex) {
            distanceFromTop += verticalPositionIncrement;
            distanceFromTop += verticalPositionIncrement;
            doc.text("Intermediate Hymn", distanceFromLeft1, distanceFromTop, {align: "left", width: halfPageWidth});
            if (intermediateHymnArray[intermediateHymnIndex].hymn.number) {
              doc.text("#" + intermediateHymnArray[intermediateHymnIndex].hymn.number + " - " + intermediateHymnArray[intermediateHymnIndex].hymn.name, distanceFromLeft1, distanceFromTop, {align: "right", width: halfPageWidth});
            } else {
              doc.text(intermediateHymnArray[intermediateHymnIndex].hymn.name, distanceFromLeft1, distanceFromTop, {align: "right", width: halfPageWidth});
            }
          }
        }
        for(var musicalNumberIndex in musicalNumberArray) {
          if ((musicalNumberArray[musicalNumberIndex].afterSpeaker - 1) == speakerIndex) {
            distanceFromTop += verticalPositionIncrement;
            distanceFromTop += verticalPositionIncrement;
            doc.text("Musical Number", distanceFromLeft1, distanceFromTop, {align: "left", width: halfPageWidth});
            if (musicalNumberArray[musicalNumberIndex].hymn.number) {
              doc.text("#" + musicalNumberArray[musicalNumberIndex].hymn.number + " - " + musicalNumberArray[musicalNumberIndex].hymn.name, distanceFromLeft1, distanceFromTop, {align: "right", width: halfPageWidth});
            } else {
              doc.text(musicalNumberArray[musicalNumberIndex].hymn.name, distanceFromLeft1, distanceFromTop, {align: "right", width: halfPageWidth});
            }
            if (musicalNumberArray[musicalNumberIndex] && musicalNumberArray[musicalNumberIndex].performer && musicalNumberArray[musicalNumberIndex].performer.preferredName) {
              distanceFromTop += verticalPositionIncrement;
              doc.text("Performer", distanceFromLeft1, distanceFromTop, {align: "left", width: halfPageWidth});
              doc.text(musicalNumberArray[musicalNumberIndex].performer.preferredName, distanceFromLeft1, distanceFromTop, {align: "right", width: halfPageWidth});
            }
            if (musicalNumberArray[musicalNumberIndex] && musicalNumberArray[musicalNumberIndex].conductor && musicalNumberArray[musicalNumberIndex].conductor.preferredName) {
              distanceFromTop += verticalPositionIncrement;
              doc.text("Conductor", distanceFromLeft1, distanceFromTop, {align: "left", width: halfPageWidth});
              doc.text(musicalNumberArray[musicalNumberIndex].conductor.preferredName, distanceFromLeft1, distanceFromTop, {align: "right", width: halfPageWidth});
            }
            if (musicalNumberArray[musicalNumberIndex] && musicalNumberArray[musicalNumberIndex].accompanist && musicalNumberArray[musicalNumberIndex].accompanist.preferredName) {
              distanceFromTop += verticalPositionIncrement;
              doc.text("Accompanist", distanceFromLeft1, distanceFromTop, {align: "left", width: halfPageWidth});
              doc.text(musicalNumberArray[musicalNumberIndex].accompanist.preferredName, distanceFromLeft1, distanceFromTop, {align: "right", width: halfPageWidth});
            }
          }
        }
      }
    }

    if (meeting && meeting.closingHymn && meeting.closingHymn.name) {
      distanceFromTop += verticalPositionIncrement;
      distanceFromTop += verticalPositionIncrement;
      doc.text("Closing  Hymn", distanceFromLeft1, distanceFromTop, {align: "left", width: halfPageWidth});
      doc.text("#" + meeting.closingHymn.number + " - " + meeting.openingHymn.name, distanceFromLeft1, distanceFromTop, {align: "right", width: halfPageWidth});
    }

    distanceFromTop += verticalPositionIncrement;
    distanceFromTop += verticalPositionIncrement;
    doc.text("Benediction", distanceFromLeft1, distanceFromTop, {align: "left", width: halfPageWidth});
    if (meeting && meeting.benediction && meeting.benediction.preferredName) {
      doc.text(meeting.benediction.preferredName, distanceFromLeft1, distanceFromTop, {align: "right", width: halfPageWidth});
    } else {
      doc.text("By Invitation", distanceFromLeft1, distanceFromTop, {align: "right", width: halfPageWidth});
    }

    this.response.writeHead(200, {
      "Content-type": "application/pdf"
    });
    this.response.end( doc.outputSync() );
  }, {where: "server"}
  );
  this.route("/meetingAgendaPrint/:_id", function() {
    this.name = "meetingAgendaPrint";

    meeting = meetingCollection.findOne(this.params._id);

    //meetingDateFormatted = moment(meeting.title).tz("Etc/GMT").format("YYYY-MM-DD");
    meetingDateFormatted = meeting.meetingDate;
    releaseResultArray = callingChangeCollection.find({"meeting._id" : this.params._id, type: "Release"}).fetch();
    callingResultArray = callingChangeCollection.find({"meeting._id" : this.params._id, type: "Call"}).fetch();
    intermediateHymnArray = intermediateHymnCollection.find({meetingId : this.params._id}).fetch();
    visitorArray = visitorCollection.find({meetingId : this.params._id}).fetch();
    musicalNumberArray = musicalNumberCollection.find({meetingId : this.params._id}).fetch();
    announcementArray = announcementCollection.find({meetingId : this.params._id}).fetch();
    speakerArray = speakerCollection.find({meetingId : this.params._id}, {sort: {order: 1}}).fetch();
    recognitionArray = recognitionCollection.find({meetingId : this.params._id}).fetch();

    var doc = new PDFDocument({size: "A4", margin: 50});

    var pageWidth = 520;
    var halfPageWidth = pageWidth / 2;
    var labelColumnWidth = 70;
    var distanceFromTop = 40;
    var distanceFromLeft1 = 40;
    var distanceFromLeft2 = distanceFromLeft1 + labelColumnWidth;
    var distanceFromLeft3 = distanceFromLeft2 + 40;
    var distanceFromLeft4 = distanceFromLeft1 + halfPageWidth;
    var distanceFromLeft5 = distanceFromLeft4 + labelColumnWidth;
    var verticalPositionIncrement = 14;

    doc.fontSize(16);
    doc.text("Sacrament Meeting Agenda", distanceFromLeft1, distanceFromTop, {align: "center", width: pageWidth});
    distanceFromTop += verticalPositionIncrement+10;

    doc.fontSize(12);
    doc.text(moment(meeting.meetingDate).format("dddd, MMMM Do YYYY"), distanceFromLeft1, distanceFromTop, {align: "center", width: pageWidth});
    distanceFromTop += verticalPositionIncrement+10;

    doc.text("Conducting: ___________________________", distanceFromLeft1, distanceFromTop, {align: "left", width: halfPageWidth});
    if (meeting && meeting.conducting && meeting.conducting.preferredName) {
      doc.text(meeting.conducting.preferredName, distanceFromLeft2, distanceFromTop, {align: "left", width: halfPageWidth});
    }
    doc.text("Presiding: _____________________________", distanceFromLeft4, distanceFromTop, {align: "left", width: halfPageWidth});
    if (meeting && meeting.presiding && meeting.presiding.preferredName) {
      doc.text(meeting.presiding.preferredName, distanceFromLeft5, distanceFromTop, {align: "left", width: halfPageWidth});
    }
    distanceFromTop += verticalPositionIncrement;

    doc.text("Chorister: _____________________________", distanceFromLeft1, distanceFromTop, {align: "left", width: halfPageWidth});
    if (meeting && meeting.chorister && meeting.chorister.preferredName) {
      doc.text(meeting.chorister.preferredName, distanceFromLeft2, distanceFromTop, {align: "left", width: halfPageWidth});
    }
    doc.text("Organist: ______________________________", distanceFromLeft4, distanceFromTop, {align: "left", width: halfPageWidth});
    if (meeting && meeting.organist && meeting.organist.preferredName) {
      doc.text(meeting.organist.preferredName, distanceFromLeft5, distanceFromTop, {align: "left", width: halfPageWidth});
    }
    distanceFromTop += verticalPositionIncrement;

    doc.text("Welcome Visitors", distanceFromLeft1, distanceFromTop, {align: "left", width: pageWidth});
    distanceFromTop += verticalPositionIncrement;

    if (visitorArray.length > 0) {
      for(var visitorIndex in visitorArray) {
        doc.text("Visitor: _______________________________________________________________________", distanceFromLeft1, distanceFromTop, {align: "left", width: pageWidth});
        if (visitorArray[visitorIndex] && visitorArray[visitorIndex].visitor && visitorArray[visitorIndex].visitor.callings) {
          var callingList = visitorArray[visitorIndex].visitor.callings.reduce(function(acquiredCallingList, newCalling) {
            return acquiredCallingList + ", " + newCalling.positionName; // return previous acquiredCallingList plus current newCalling
          }, "");
          if (visitorArray[visitorIndex] && visitorArray[visitorIndex].visitor && visitorArray[visitorIndex].visitor.preferredName) {
            doc.text(visitorArray[visitorIndex].visitor.preferredName + callingList, distanceFromLeft3, distanceFromTop, {align: "left", width: pageWidth});
          }
        }
        distanceFromTop += verticalPositionIncrement;
      }
    }

    if (announcementArray) {
      for(var announcementIndex in announcementArray) {
        doc.text("Announcement: ________________________________________________________________", distanceFromLeft1, distanceFromTop, {align: "left", width: pageWidth});
        doc.text(announcementArray[announcementIndex].text, distanceFromLeft3, distanceFromTop, {align: "left", width: pageWidth});
        distanceFromTop += verticalPositionIncrement;
      }
    }

    doc.text("Opening Hymn: ________________________________________________________________", distanceFromLeft1, distanceFromTop, {align: "left", width: pageWidth});
    if (meeting && meeting.openingHymn && meeting.openingHymn.name) {
      doc.text(meeting.openingHymn.number + " - " + meeting.openingHymn.name, distanceFromLeft3, distanceFromTop, {align: "left", width: pageWidth});
    }
    distanceFromTop += verticalPositionIncrement;

    doc.text("Invocation: ____________________________________________________________________", distanceFromLeft1, distanceFromTop, {align: "left", width: pageWidth});
    if (meeting && meeting.invocation && meeting.invocation.preferredName) {
      doc.text(meeting.invocation.preferredName, distanceFromLeft3, distanceFromTop, {align: "left", width: pageWidth});
    }
    distanceFromTop += verticalPositionIncrement;

    doc.fontSize(14);
    distanceFromTop += 5;
    doc.text("Ward and Stake Business", distanceFromLeft1, distanceFromTop, {align: "left", width: pageWidth});
    distanceFromTop += verticalPositionIncrement+5;
    doc.fontSize(12);

    if (releaseResultArray.length > 0) {
      doc.text('Releases: "We have released the following individuals."', distanceFromLeft1, distanceFromTop, {align: "left", width: pageWidth});
      distanceFromTop += verticalPositionIncrement;

      for(var releaseResultIndex in releaseResultArray) {
        doc.text("_____________________________________________________________________________", distanceFromLeft1, distanceFromTop, {align: "left", width: pageWidth});
        doc.text(releaseResultArray[releaseResultIndex].member.preferredName, distanceFromLeft1, distanceFromTop, {align: "left", width: pageWidth});
        doc.text(releaseResultArray[releaseResultIndex].calling.positionName, distanceFromLeft4, distanceFromTop, {align: "left", width: pageWidth});
        distanceFromTop += verticalPositionIncrement;
      }

      doc.text('"We propose that they be given a vote of thanks for their service. Those who wish to express appreciation may manifest it by the uplifted hand."', distanceFromLeft1, distanceFromTop, {align: "left", width: pageWidth});
      distanceFromTop += verticalPositionIncrement;
      distanceFromTop += verticalPositionIncrement;
    }

    if (callingResultArray.length > 0) {
      doc.text('Sustainings: "The following people have been called and we propose that they be sustained."', distanceFromLeft1, distanceFromTop, {align: "left", width: pageWidth});
      distanceFromTop += verticalPositionIncrement;

      for(var callingResultIndex in callingResultArray) {
        doc.text("____________________________________________________________________________", distanceFromLeft1, distanceFromTop, {align: "left", width: pageWidth});
        if (callingResultArray[callingResultIndex] && callingResultArray[callingResultIndex].member && callingResultArray[callingResultIndex].member.preferredName) {
          doc.text(callingResultArray[callingResultIndex].member.preferredName, distanceFromLeft1, distanceFromTop, {align: "left", width: pageWidth});
        }
        doc.text(callingResultArray[callingResultIndex].calling.positionName, distanceFromLeft4, distanceFromTop, {align: "left", width: pageWidth});
        distanceFromTop += verticalPositionIncrement;
      }

      doc.text('"Those in favor may manifest it by the uplifted hand.  Those opposed, if any, may manifest it.  We invite those sustained to come to the Bishop’s office immediately after the block to be set apart."', distanceFromLeft1, distanceFromTop, {align: "left", width: pageWidth});
      distanceFromTop += verticalPositionIncrement;
      distanceFromTop += verticalPositionIncrement;
    }

    if (recognitionArray.length > 0) {
      doc.text("Ordinances and Recognitions", distanceFromLeft1, distanceFromTop, {align: "left", width: pageWidth});
      distanceFromTop += verticalPositionIncrement;

      if (recognitionArray) {
        for(var recognitionIndex in recognitionArray) {
          doc.text(recognitionArray[recognitionIndex].recognitionType.typeName, distanceFromLeft1, distanceFromTop, {align: "left", width: pageWidth});
          doc.text("_____________________________________________________________________________", distanceFromLeft1, distanceFromTop, {align: "left", width: pageWidth});
          distanceFromTop += verticalPositionIncrement;
          for(var recognitionMemberIndex in recognitionArray[recognitionIndex].members) {
            if (recognitionArray[recognitionIndex] && recognitionArray[recognitionIndex].members[recognitionMemberIndex] && recognitionArray[recognitionIndex].members[recognitionMemberIndex].preferredName) {
              doc.text(recognitionArray[recognitionIndex].members[recognitionMemberIndex].preferredName, distanceFromLeft3, distanceFromTop, {align: "left", width: pageWidth});
            }
            doc.text("_____________________________________________________________________________", distanceFromLeft1, distanceFromTop, {align: "left", width: pageWidth});
            distanceFromTop += verticalPositionIncrement;
          }
        }
      }
    }

    doc.fontSize(14);
    distanceFromTop += 5;
    doc.text("Sacrament", distanceFromLeft1, distanceFromTop, {align: "left", width: pageWidth});
    distanceFromTop += verticalPositionIncrement+5;
    doc.fontSize(12);

    doc.text("Sacrament Hymn: ______________________________________________________________", distanceFromLeft1, distanceFromTop, {align: "left", width: pageWidth});
    if (meeting && meeting.sacramentHymn && meeting.sacramentHymn.name) {
      doc.text(meeting.sacramentHymn.number + " - " + meeting.sacramentHymn.name, distanceFromLeft3, distanceFromTop, {align: "left", width: pageWidth});
    }
    distanceFromTop += verticalPositionIncrement;

    doc.text("Administration of the Sacrament", distanceFromLeft1, distanceFromTop, {align: "left", width: pageWidth});
    distanceFromTop += verticalPositionIncrement;

    doc.text('"We thank you for your reverence during the sacrament, and we thank the Priesthood for administering it."', distanceFromLeft1, distanceFromTop, {align: "left", width: pageWidth});
    distanceFromTop += verticalPositionIncrement;
    distanceFromTop += verticalPositionIncrement;

    doc.fontSize(14);
    distanceFromTop += 5;
    doc.text("Gospel Messages, Testimonies, and Music", distanceFromLeft1, distanceFromTop, {align: "left", width: pageWidth});
    distanceFromTop += verticalPositionIncrement+5;
    doc.fontSize(12);

    if (meeting.fastAndTestimony) {
      doc.text("Bear own testimony then turn time over to members of congregation to bear testimonies.", distanceFromLeft1, distanceFromTop, {align: "left", width: pageWidth});
      distanceFromTop += verticalPositionIncrement;
      doc.text('"We will end at X minutes after the hour."', distanceFromLeft1, distanceFromTop, {align: "left", width: pageWidth});
      distanceFromTop += verticalPositionIncrement;
    }

    if (typeof speakerArray != "undefined") {
      for(var speakerIndex in speakerArray) {
        if (speakerArray[speakerIndex] && speakerArray[speakerIndex].speaker && speakerArray[speakerIndex].speaker.preferredName) {
          doc.text(speakerArray[speakerIndex].speaker.preferredName, distanceFromLeft3, distanceFromTop, {align: "left", width: pageWidth});
        }
        doc.text("Speaker: _____________________________________________________________________", distanceFromLeft1, distanceFromTop, {align: "left", width: pageWidth});
        distanceFromTop += verticalPositionIncrement;

        for(var intermediateHymnIndex in intermediateHymnArray) {
          if ((intermediateHymnArray[intermediateHymnIndex].afterSpeaker - 1) == speakerIndex) {
            doc.text("Intermediate Hymn: _____________________________________________________________", distanceFromLeft1, distanceFromTop, {align: "left", width: pageWidth});
            if (intermediateHymnArray[intermediateHymnIndex].hymn.number) {
              doc.text(intermediateHymnArray[intermediateHymnIndex].hymn.number + " - " + intermediateHymnArray[intermediateHymnIndex].hymn.name, distanceFromLeft3, distanceFromTop, {align: "left", width: pageWidth});
            } else {
              doc.text(intermediateHymnArray[intermediateHymnIndex].hymn.name, distanceFromLeft3, distanceFromTop, {align: "left", width: pageWidth});
            }
            distanceFromTop += verticalPositionIncrement;
          }
        }
        for(var musicalNumberIndex in musicalNumberArray) {
          if ((musicalNumberArray[musicalNumberIndex].afterSpeaker - 1) == speakerIndex) {
            doc.text("Musical Number", distanceFromLeft1, distanceFromTop, {align: "left", width: pageWidth});
            distanceFromTop += verticalPositionIncrement;
            doc.text("Song: ________________________________________________________________________", distanceFromLeft1, distanceFromTop, {align: "left", width: pageWidth});
            if (musicalNumberArray[musicalNumberIndex].hymn.number) {
              doc.text(musicalNumberArray[musicalNumberIndex].hymn.number + " - " + musicalNumberArray[musicalNumberIndex].hymn.name, distanceFromLeft3, distanceFromTop, {align: "left", width: pageWidth});
            } else {
              doc.text(musicalNumberArray[musicalNumberIndex].hymn.name, distanceFromLeft3, distanceFromTop, {align: "left", width: pageWidth});
            }
            distanceFromTop += verticalPositionIncrement;
            if (musicalNumberArray[musicalNumberIndex] && musicalNumberArray[musicalNumberIndex].performer && musicalNumberArray[musicalNumberIndex].performer.preferredName) {
              doc.text(musicalNumberArray[musicalNumberIndex].performer.preferredName, distanceFromLeft3, distanceFromTop, {align: "left", width: pageWidth});
              doc.text("Performer: ____________________________________________________________________", distanceFromLeft1, distanceFromTop, {align: "left", width: pageWidth});
              distanceFromTop += verticalPositionIncrement;
            }
            if (musicalNumberArray[musicalNumberIndex] && musicalNumberArray[musicalNumberIndex].conductor && musicalNumberArray[musicalNumberIndex].conductor.preferredName) {
              doc.text(musicalNumberArray[musicalNumberIndex].conductor.preferredName, distanceFromLeft3, distanceFromTop, {align: "left", width: pageWidth});
              doc.text("Conductor: __________________________________________________________________", distanceFromLeft1, distanceFromTop, {align: "left", width: pageWidth});
              distanceFromTop += verticalPositionIncrement;
            }
            if (musicalNumberArray[musicalNumberIndex] && musicalNumberArray[musicalNumberIndex].accompanist && musicalNumberArray[musicalNumberIndex].accompanist.preferredName) {
              doc.text(musicalNumberArray[musicalNumberIndex].accompanist.preferredName, distanceFromLeft3, distanceFromTop, {align: "left", width: pageWidth});
              doc.text("Accompanist: __________________________________________________________________", distanceFromLeft1, distanceFromTop, {align: "left", width: pageWidth});
              distanceFromTop += verticalPositionIncrement;
            }
          }
        }
      }
    }

    doc.text("Closing Hymn: _________________________________________________________________", distanceFromLeft1, distanceFromTop, {align: "left", width: pageWidth});
    if (meeting && meeting.closingHymn && meeting.closingHymn.name) {
      doc.text(meeting.closingHymn.number + " - " + meeting.closingHymn.name, distanceFromLeft3, distanceFromTop, {align: "left", width: pageWidth});
    }
    distanceFromTop += verticalPositionIncrement;

    doc.text("Benediction: ___________________________________________________________________", distanceFromLeft1, distanceFromTop, {align: "left", width: pageWidth});
    if (meeting && meeting.benediction && meeting.benediction.preferredName) {
      doc.text(meeting.benediction.preferredName, distanceFromLeft3, distanceFromTop, {align: "left", width: pageWidth});
    }
    distanceFromTop += verticalPositionIncrement;

    /*
    Conducting
    My name is...and (presiding authority) has asked me to conduct this meeting.

    Presiding
    This meeting is presided by...

    Welcome and Announcements
    Visiting Authorities
    We would also like to to recognize...from the stake, who is visiting today. We would also like to welcome any other visitors with us today.

    Organist
    We would like to thank our organist...

    Chorister
    We would like to thank our chorister...who will be leading the music

    Announcements

    Opening Hymn
    We will open our services by singing hymn number...

    Invocation
    We will then have the invocation offered by...

    Ward and Stake Business
    Releases
    The following individuals have been released from positions and we proposed that they be given a vote of thanks for their service...those who wish to express their appreciation may manifest it by the uplifted hand.

    Callings
    It is proposed that we sustain the following to positions in the ward and ask that they stand. ....All those in favor manifest it...Those opposed may manifest it...Thank you to these members who have faithfully accepted calls to serve and thank you for supporting them. We would invite those who have been sustained to go to the Bishop’s office immediately after the block to be set apart

    New Members to Ward
    It is proposed that we welcome the following new members to the ward. Please stand to be recognized, and remain standing while your names are presented...All those who accept this/these members in full fellowship in the ward, please signify by the uplifted hand.

    Naming and Blessing of a Child
    Brother and Sister...will be blessing their child... We would like to invite those who will be participating to come forward.

    Child of Record Baptism
    We would like to recognize...who was baptised and confirmed. We welcome him/her as the newest member of our ward.

    Confirmation
    We would like to invite newly baptised member...to come forward together with those who will participate in the confirmation. Confirm and bestow gift of the Holy Ghost on new members (then present as new ward members)

    Aaronic Priesthood Advancement
    We propose that...receive the Aaronic priesthood and be ordained a... Would you please stand? Those in favor may manifest it by the uplifted hand. Those opposed, if any, may manifest it.

    Other Recgonitions
    Young Men, Young Women, Primary Advancement, Achievement Days

    Stake Business
    We now turn the time over to...from...to conduct some stake business.

    Sacrament Services
    Sacrament Hymn
    We will now prepare for the sacrament by singing hymn number...Following the hymn, the sacrament will be administered to the congregation by the Priesthood.

    Gospel Messages, Testimonies, and Music
    We thank you for your reverence during the sacrament and we would like to thank the Aaronic priesthood for the reverent manner in which they prepared, administered, and passed the sacrament and invite them to return and sit with their families.

    If testimony meeting, bear own testimony then turn time over to members of congregation to bear heartfelt testimonies and relate faith-promoting experiences. Please keep testimonies brief so more people may have the opportunity to participate.  We will end at 5 after the hour.
    Youth Speaker
    We will first hear from...then...

    Speaker 1

    Speaker 2

    Intermediate Hymn
    Our intermediate hymn will be number

    Musical Number
    We will have a musical number...

    Speaker 3
    Following the music, we shall hear from...

    Speaker 4

    Closing
    We would like to thank all of those who have participated in our sacrament service.  We would like to thank...and...for their talks today.
    Closing Hymn
    We will close our meeting by singing hymn number...

    Benediction
    We will then have the benediction offered by...

    Administrative
    Attendance
    */

    this.response.writeHead(200, {
      "Content-type": "application/pdf"
    });
    this.response.end( doc.outputSync() );
  }, {where: "server"});


});
