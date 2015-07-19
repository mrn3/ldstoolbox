function buildRegExp(searchText) {
  // this is a dumb implementation
  var parts = searchText.trim().split(/[ \-\:]+/);
  return new RegExp("(" + parts.join('|') + ")", "ig");
}

Template.callingChangeList.helpers({
  callingChangeSearchInputValue: function() {
    return Session.get("callingChangeSearchInput");
  },
  isSelected: function(inStatus) {
    return (Session.get("statusSelector") == inStatus);
  },
  formattedDateTime: function() {
    if (this.interviewDate && this.interviewTime) {
      return moment(this.interviewDate + " " + this.interviewTime).format("dddd, MMMM D, YYYY, h:mm A");
    } else {
      return "Missing Interview Date/Time"
    }
  },
  callingChangeData: function(){
    var regExp;

    //default selector makes sure they are in the stake
    var selector = {
      $and:
        [
          {
            stakeUnitNo: Meteor.user().stakeUnitNo
          }
        ]
      };

    function searchClause(inRegExp) {
      return {
        $or: [
          {"member.preferredName": inRegExp},
          {"calling.positionName": inRegExp}
        ]
      };
    }

    function isBishopric(inOrgArray) {
      for (inOrgArrayIndex in inOrgArray) {
        if (inOrgArray[inOrgArrayIndex] == "Bishopric") {
          return true;
        }
      }
      return false;
    }

    var userCallingOrgArray = _.pluck(Meteor.user().callings, "name");

    callingOrgClause = {
      "calling.name": {
        $in: userCallingOrgArray
      }
    }

    var completeClause = {
      $or:
        [
          {
            $and:
              [
                {
                  type: "Call"
                },
                {
                  status: "Set Apart Recorded"
                }
              ]
          },
          {
            $and:
              [
                {
                  type: "Release"
                },
                {
                  status: "Recorded"
                }
              ]
          },
          {
            status: "Canceled"
          }
        ]
    };

    var incompleteClause = {
      $or:
        [
          {
            $and:
              [
                {
                  type: "Call"
                },
                {
                  $and:
                    [
                      {
                        status:
                          {
                            $not: "Set Apart Recorded"
                          }
                      },
                      {
                        status:
                          {
                            $not: "Canceled"
                          }
                      }
                    ]
                }
              ]
          },
          {
            $and:
              [
                {
                  type: "Release"
                },
                {
                  $and:
                    [
                      {
                        status:
                          {
                            $not: "Recorded"
                          }
                      },
                      {
                        status:
                          {
                            $not: "Canceled"
                          }
                      }
                    ]
                }
              ]
          }
        ]
    };

    var typeClause = {
      type: Session.get("typeSelector")
    }

    var statusClause = {
      status: Session.get("statusSelector")
    }

    var options;
    if (Session.get("statusSelector") == "Interview Scheduled") {
      options = {sort: {interviewDate: 1, interviewTime: 1}};
    } else if (Session.get("sortSelector") == "Calling Name") {
      options = {sort: {"calling.name": 1}};
    } else {
      options = {sort: {"member.preferredName": 1}};
    }

    //if search filter
    if (Session.get("callingChangeSearchInput")) {
      regExp = buildRegExp(Session.get("callingChangeSearchInput"));
      selector['$and'].push(searchClause(regExp));
    }

    //status - either picked complete, incomplete, or not all
    if ((Session.get("statusSelector") == "Complete")) {
      selector['$and'].push(completeClause);
    } else if ((Session.get("statusSelector") == "Incomplete")) {
      selector['$and'].push(incompleteClause);
    } else if (Session.get("statusSelector") != "All") {
      selector['$and'].push(statusClause);
    }

    //filter on type
    if (Session.get("typeSelector") != "All") {
      selector['$and'].push(typeClause);
    }

    //if not in bishopric, limit to organization
    if (!isBishopric(userCallingOrgArray)) {
      selector['$and'].push(callingOrgClause);
    }

    return callingChangeCollection.find(selector, options);
  }
});

Template.callingChangeList.events({
  'click #createCallingChangeButton': function(e, instance) {
    e.preventDefault();

    var callingChange = this;
    var insertObject = {};

    if(!Meteor.user()){
      console.log('You must be logged in.');
      return false;
    }

    var properties = {
      createdBy:            Meteor.userId(),
      createdAt:            new Date(),
      wardUnitNo:           Meteor.user().wardUnitNo,
      stakeUnitNo:          Meteor.user().stakeUnitNo,
      status:               "New"
    };

    if (properties) {
      Meteor.call('insertCallingChange', properties, function(error, callingChange) {
        if (error) {
          console.log(error.reason);
        } else {
          Router.go("/callingChangeEdit/" + callingChange._id);
        }
      });
    }
  },
  "keyup #callingChangeSearchInput": function(e, instance){
    Session.set("callingChangeSearchInput", $("#callingChangeSearchInput").val());
  },
  "scroll .mainContentArea": function (event, template) {
    //make sure it has been scrolled two times to prevent bouncing
    if ((Session.get("previousScrollTop") < Session.get("previous2ScrollTop"))
      && (event.target.scrollTop < Session.get("previousScrollTop"))) {
      //scrolling up - show searchbar
      $(".mainContentArea").addClass("has-subheader")
      $("#searchBarSubHeader").slideDown();
    } else if ((Session.get("previousScrollTop") > Session.get("previous2ScrollTop"))
      && (event.target.scrollTop > Session.get("previousScrollTop"))) {
      //scrolling down - hide searchbar
      $(".mainContentArea").removeClass("has-subheader")
      $("#searchBarSubHeader").slideUp();
    }
    Session.set("previous2ScrollTop", Session.get("previousScrollTop"));
    Session.set("previousScrollTop", event.target.scrollTop);
  },
  "click [data-action=showCallingChangeActionSheet]": function (event, template) {
    IonActionSheet.show({
      buttons: [
        {text: "Copy Approved Calling Changes"},
        {text: "Calling Change Help"}
      ],
      cancelText: "Cancel",
      cancel: function() {},
      buttonClicked: function(index) {
        if (index === 0) {
          //get approved names and remove duplicates
          callingChangeArray = callingChangeCollection.find({status: "Approved"}).fetch();
          var memberNameString = "";
          var callingChangeArrayStripped = callingChangeArray.map(function(obj) { return obj["member"].preferredName });
          callingChangeArrayStripped = callingChangeArrayStripped.filter(function(v,i) { return callingChangeArrayStripped.indexOf(v) == i; });
          for (callingChangeArrayStrippedIndex in callingChangeArrayStripped) {
            memberNameString += callingChangeArrayStripped[callingChangeArrayStrippedIndex] + "\n";
          }
          IonPopup.alert({
            title: 'Press Ctrl-C (or Command-C) to copy',
            template: "<textarea rows='10' onClick='this.setSelectionRange(0, this.value.length)'>" + memberNameString + "</textarea>",
            okText: 'Okay',
          });
        }
        else if (index === 1) {
          Router.go("/callingChangeHelp");
        }
        return true;
      }
    });
  }
});

Template.callingChangeList.rendered = function() {
  Session.set("memberSelectType", "");
  Session.set("selectedCallingChangeMember", "");
  Session.set("selectedCallingChangeCalling", "");
  Session.set("selectedCallingChangeType", "");

  //defaults
  if (typeof Session.get("typeSelector") == "undefined") {
    Session.set("typeSelector", "All");
  }
  if (typeof Session.get("statusSelector") == "undefined") {
    Session.set("statusSelector", "Incomplete");
  }
  if (typeof Session.get("callingChangeSearchInput") == "undefined") {
    Session.set("callingChangeSearchInput", "");
  }
  Session.set("previousScrollTop", 0);
  Session.set("previous2ScrollTop", 0);
};
