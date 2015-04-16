function buildRegExp(searchText) {
  // this is a dumb implementation
  var parts = searchText.trim().split(/[ \-\:]+/);
  return new RegExp("(" + parts.join('|') + ")", "ig");
}

Template.callingChangeList.helpers({
  callingChangeSearchInputValue: function() {
    return Session.get("callingChangeSearchInput");
  },
  callingChangeData: function(){
    var selector = {};
    var regExp;

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
                              status:
                                {
                                  $not: "Set Apart Recorded"
                                }
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
                              status:
                                {
                                  $not: "Recorded"
                                }
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
                          status:
                            {
                              $not: "Set Apart Recorded"
                            }
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
                          status:
                            {
                              $not: "Recorded"
                            }
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
    return callingChangeCollection.find(selector);
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
};
