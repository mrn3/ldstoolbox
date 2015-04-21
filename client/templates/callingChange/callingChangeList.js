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
    var selector = {};
    var regExp;

    var options = {sort: {interviewDate: 1, interviewTime: 1}};

    if (Session.get("callingChangeSearchInput")) {
      regExp = buildRegExp(Session.get("callingChangeSearchInput"));

      if ((Session.get("statusSelector") == "Complete")) {
        selector =
          {
            $and:
              [
                {
                  $or: [
                    {"member.switchedPreferredName": regExp},
                    {"calling.callingName": regExp}
                  ]
                },
                {
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
                }
              ]
          };
      } else if ((Session.get("statusSelector") == "Incomplete")) {
        selector =
          {
            $and:
              [
                {
                  $or: [
                    {"member.switchedPreferredName": regExp},
                    {"calling.callingName": regExp}
                  ]
                },
                {
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
                }
              ]
          };
      } else {
        selector =
          {
            $or: [
              {"member.switchedPreferredName": regExp},
              {"calling.callingName": regExp}
            ]
          };
      }
    } else {
      if ((Session.get("statusSelector") == "Complete")) {
        selector =
          {
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
        } else if ((Session.get("statusSelector") == "Incomplete")) {
          selector =
            {
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
        }
    }

    if ((Session.get("statusSelector") == "Complete")
      || (Session.get("statusSelector") == "Incomplete")
      || (Session.get("statusSelector") == "All")) {
      if (Session.get("typeSelector") != "All") {
        selector.type = Session.get("typeSelector");
      }
    } else {
      selector.status = Session.get("statusSelector");
      if (Session.get("typeSelector") != "All") {
        selector.type = Session.get("typeSelector");
      }
    }
    return callingChangeCollection.find(selector, options);
  },
  userCanViewCallingChangeList: function () {
    if (Meteor.user() && Meteor.user().callings) {

      //bishop, counselors, executive secretary, ward clerk, membership clerk
      var allowedCallingList = [4, 54, 55, 56, 57, 787];
      var userCallingList = Meteor.user().callings.reduce(
        function(total, calling){
          return total.concat(calling.positionId);
        },
      []);

      var callingIntersection =
        userCallingList.filter(function(n) {
          return allowedCallingList.indexOf(n) != -1
        });

      return (callingIntersection.length > 0);
    }
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
    //hide searchbar on scroll down, show on scroll up
    if (event.target.scrollTop < Session.get("previousScrollTop")) {
      $(".mainContentArea").addClass("has-subheader")
      $("#searchBarSubHeader").slideDown();
    } else {
      $(".mainContentArea").removeClass("has-subheader")
      $("#searchBarSubHeader").slideUp();
    }
    Session.set("previousScrollTop", event.target.scrollTop);
  },
  "click [data-action=showCallingChangeActionSheet]": function (event, template) {
    IonActionSheet.show({
      buttons: [
        { text: "Copy Approved Calling Changes"}
      ],
      cancelText: "Cancel",
      cancel: function() {},
      buttonClicked: function(index) {
        if (index === 0) {
          callingChangeArray = callingChangeCollection.find({status: "Approved"}).fetch();
          var memberNameString = "";
          for (callingChangeArrayIndex in callingChangeArray) {
            memberNameString += callingChangeArray[callingChangeArrayIndex]["member"].switchedPreferredName + "\n";
          }
          IonPopup.alert({
            title: 'Press Ctrl-C (or Command-C) to copy',
            template: "<textarea rows='10' onClick='this.setSelectionRange(0, this.value.length)'>" + memberNameString + "</textarea>",
            okText: 'Okay',
          });
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
  if (typeof Session.get("previousScrollTop") == "undefined") {
    Session.set("previousScrollTop", 0);
  }
};
