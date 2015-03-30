function switchName(inName) {
  commaPosition = inName.indexOf(",");
  lastName = inName.substr(0, commaPosition);
  otherNames = inName.substr(commaPosition+2, inName.length);
  return otherNames + " " + lastName;
}

Meteor.methods({
  signInLdsAccountUser: function(inUsername, inPassword) {
    this.unblock();
    try {
      var authUrl="https://signin.lds.org/login.html";

      var result = HTTP.post(authUrl, {params: {username: inUsername, password: inPassword}});

      var ldsAccountCookieValue = result['headers']['set-cookie'];

      for (var c in ldsAccountCookieValue) {
        if (ldsAccountCookieValue[c].indexOf("Expires") !== -1) {
          ldsAccountCookieValue[c] = "";
        }
      }

      var properties = {
        ldsAccount: {
          statusCode:       result.statusCode,
          username:         inUsername,
          cookieValue:      ldsAccountCookieValue,
          updatedAt:        new Date()
        }
      };

      Meteor.users.update(Meteor.user()._id, {
        $set: properties
      }, function(error) {
        if (error) {
          console.log(error.reason);
        }
      });

      //if successful, get the user info needed
      if (result.statusCode == 200) {
        Meteor.call("getUserIndividualId");
        Meteor.call("getUserUnitInfo");
      }

    } catch (e) {
      // Got a network error, time-out or HTTP error in the 400 or 500 range.
      console.log(e);
      return e;
    }
  },
  signOutLdsAccountUser: function() {
    this.unblock();
    try {
      var properties = {
        ldsAccount: {
          updatedAt:  new Date()
        }
      };

      Meteor.users.update(Meteor.user()._id, {
        $set: properties
      }, function(error) {
        if (error) {
          console.log(error.reason);
        }
      });

    } catch (e) {
      // Got a network error, time-out or HTTP error in the 400 or 500 range.
      console.log(e);
      return e;
    }
  },
  getUserUnitInfo: function() {
    this.unblock();
    try {
      //get current user's unit information
      var unit;
      var currentUserUnitUrl="https://www.lds.org/directory/services/ludrs/unit/current-user-ward-stake/";
      result = Meteor.http.call("GET", currentUserUnitUrl, {
        params: {
          timeout: 30000
        },
        headers: {
          "cookie": Meteor.user().ldsAccount.cookieValue,
          "content-type": "application/json",
          "Accept": "application/json"
        },
      });

      unit = JSON.parse(result.content);

      //update the user to have additional fields to link
      var properties = {
        wardUnitNo:   unit.wardUnitNo,
        wardName:     unit.wardName,
        stakeUnitNo:  unit.stakeUnitNo,
        stakeName:    unit.stakeName,
        areaUnitNo:   unit.areaUnitNo,
      };

      Meteor.users.update(Meteor.user()._id, {
        $set: properties
      }, function(error) {
        if (error) {
          console.log(error.reason);
        }
      });

      return true;
    } catch (e) {
      // Got a network error, time-out or HTTP error in the 400 or 500 range.
      console.log(e);
      return e;
    }
  },
  getUserIndividualId: function() {
    this.unblock();
    try {
      //get current user's invidual id
      var currentUser;
      var currentUserInfoUrl="https://www.lds.org/directory/services/ludrs/mem/current-user-info/";
      result = Meteor.http.call("GET", currentUserInfoUrl, {
        params: {
          timeout: 30000
        },
        headers: {
          "cookie": Meteor.user().ldsAccount.cookieValue,
          "content-type": "application/json",
          "Accept": "application/json"
        },
      });
      currentUser = JSON.parse(result.content);

      //update the user to have additional fields to link
      var properties = {
        individualId: currentUser.individualId
      };

      Meteor.users.update(Meteor.user()._id, {
        $set: properties
      }, function(error) {
        if (error) {
          console.log(error.reason);
        }
      });

      return true;
    } catch (e) {
      // Got a network error, time-out or HTTP error in the 400 or 500 range.
      console.log(e);
      return e;
    }
  },
  getUserCallingInfo: function() {
    this.unblock();
    try {
      var member = memberCollection.findOne({individualId : Meteor.user().individualId});

      //update the user to have additional fields to link
      var properties = {
        callings:     member.callings
      };

      Meteor.users.update(Meteor.user()._id, {
        $set: properties
      }, function(error) {
        if (error) {
          console.log(error.reason);
        }
      });

      return true;
    } catch (e) {
      // Got a network error, time-out or HTTP error in the 400 or 500 range.
      console.log(e);
      return e;
    }
  },
  getUnits: function() {
    this.unblock();
    try {
      //get units in stake
      var unitList;

      var unitListUrl="https://www.lds.org/directory/services/ludrs/unit/current-user-units/";
      result = Meteor.http.call("GET", unitListUrl, {
        params: {
          timeout: 30000
        },
        headers: {
          "cookie": Meteor.user().ldsAccount.cookieValue,
          "content-type": "application/json",
          "Accept": "application/json"
        },
      });

      unitList = JSON.parse(result.content);

      //remove all wards in stake
      unitCollection.remove({stakeUnitNo: unitList[0].stakeUnitNo});

      //for each unit, insert into units collection
      for(var unitIndex in unitList[0].wards) {
        unitCollection.insert(unitList[0].wards[unitIndex]);
      }
    } catch (e) {
      // Got a network error, time-out or HTTP error in the 400 or 500 range.
      console.log(e);
      return e;
    }
  },
  getWardMembers: function(inWardUnitNo, inStakeUnitNo) {
    this.unblock();
    try {
      var householdList;

      var householdListUrl="https://www.lds.org/directory/services/ludrs/mem/member-list/" + inWardUnitNo;
      result = Meteor.http.call("GET", householdListUrl, {
        params: {
          timeout: 30000
        },
        headers: {
          "cookie": Meteor.user().ldsAccount.cookieValue,
          "content-type": "application/json",
          "Accept": "application/json"
        },
      });

      householdList = JSON.parse(result.content);

      //remove all households and members currently in the ward
      householdCollection.remove({wardUnitNo: inWardUnitNo});
      memberCollection.remove({wardUnitNo: inWardUnitNo});

      //add all households in ward
      for(var householdIndex in householdList) {
        householdCollection.insert(_.extend(householdList[householdIndex], {wardUnitNo: inWardUnitNo, stakeUnitNo: inStakeUnitNo}));

        //insert head of household, spouse, and children, and append on the ward unit number
        memberCollection.insert(_.extend(householdList[householdIndex].headOfHouse, {wardUnitNo: inWardUnitNo, stakeUnitNo: inStakeUnitNo, switchedPreferredName: switchName(householdList[householdIndex].headOfHouse.preferredName)}));
        memberCollection.insert(_.extend(householdList[householdIndex].spouse, {wardUnitNo: inWardUnitNo, stakeUnitNo: inStakeUnitNo, switchedPreferredName: switchName(householdList[householdIndex].spouse.preferredName)}));
        for(var childrenIndex in householdList[householdIndex].children) {
          memberCollection.insert(_.extend(householdList[householdIndex].children[childrenIndex], {wardUnitNo: inWardUnitNo, stakeUnitNo: inStakeUnitNo, switchedPreferredName: switchName(householdList[householdIndex].children[childrenIndex].preferredName)}));
        }
      }
      //remove all the junk records
      memberCollection.remove({preferredName: "", wardUnitNo: inWardUnitNo});

    } catch (e) {
      // Got a network error, time-out or HTTP error in the 400 or 500 range.
      console.log(e);
      return e;
    }
  },
  getStakeMembers: function(inStakeUnitNo) {
    var unitList = unitCollection.find({stakeUnitNo: inStakeUnitNo}).fetch();
    for (var unitIndex in unitList) {
      Meteor.call("getWardMembers", unitList[unitIndex].wardUnitNo, inStakeUnitNo, function(error) {
        if (error) {
          console.log(error);
        }
      });
    }
  },
  getWardCallings: function(inWardUnitNo, inStakeUnitNo) {
    this.unblock();
    try {
      var callingList;

      var callingListUrl="https://www.lds.org/directory/services/ludrs/1.1/unit/ward-leadership-positions/" + inWardUnitNo + "/true";
      result = Meteor.http.call("GET", callingListUrl, {
        params: {
          timeout: 30000
        },
        headers: {
          "cookie": Meteor.user().ldsAccount.cookieValue,
          "content-type": "application/json",
          "Accept": "application/json"
        },
      });

      callingList = JSON.parse(result.content);

      //remove all positions in the ward
      callingCollection.remove({wardUnitNo: inWardUnitNo});
      callingGroupCollection.remove({wardUnitNo: inWardUnitNo});

      //for each group of positions
      for(var callingIndex in callingList.unitLeadership) {

        var groupList;

        var groupListUrl="https://www.lds.org/directory/services/ludrs/1.1/unit/stake-leadership-group-detail/" + inWardUnitNo + "/" + callingList.unitLeadership[callingIndex].groupKey + "/" + callingList.unitLeadership[callingIndex].instance;
        groupResult = Meteor.http.call("GET", groupListUrl, {
          params: {
            timeout: 30000
          },
          headers: {
            "cookie": Meteor.user().ldsAccount.cookieValue,
            "content-type": "application/json",
            "Accept": "application/json"
          },
        });

        groupList = JSON.parse(groupResult.content);

        callingGroupCollection.insert(_.extend(callingList.unitLeadership[callingIndex], {leaders: groupList.leaders, wardUnitNo: inWardUnitNo, stakeUnitNo: inStakeUnitNo}));

        for(var leaderIndex in groupList.leaders) {
          memberCollection.update({
            individualId: groupList.leaders[leaderIndex].individualId},
            {
              $addToSet:
                {
                  "callings":
                    {
                      "callingName": groupList.leaders[leaderIndex].callingName,
                      "positionId": groupList.leaders[leaderIndex].positionId,
                      "groupKey": callingList.unitLeadership[callingIndex].groupKey,
                      "groupName": callingList.unitLeadership[callingIndex].groupName
                    }
                }
            }
          );
          callingCollection.insert(
            {
              "callingName": groupList.leaders[leaderIndex].callingName,
              "positionId": groupList.leaders[leaderIndex].positionId,
              "displayName": groupList.leaders[leaderIndex].displayName,
              wardUnitNo: inWardUnitNo,
              stakeUnitNo: inStakeUnitNo
            }
          );
        }
      }
    } catch (e) {
      // Got a network error, time-out or HTTP error in the 400 or 500 range.
      console.log(e);
      return e;
    }
  },
  getStakeCallings: function(inStakeUnitNo) {
    var unitList = unitCollection.find({stakeUnitNo: inStakeUnitNo}).fetch();
    for (var unitIndex in unitList) {
      Meteor.call("getWardCallings", unitList[unitIndex].wardUnitNo, inStakeUnitNo, function(error) {
        if (error) {
          console.log(error);
        }
      });
    }
    //get stake callings too
    Meteor.call("getWardCallings", inStakeUnitNo, inStakeUnitNo, function(error) {
      if (error) {
        console.log(error);
      }
    });
  },
  getWardOrganizations: function(inWardUnitNo, inStakeUnitNo) {
    this.unblock();
    try {

      //remove all positions in the ward
      organizationCollection.remove({wardUnitNo: inWardUnitNo});

      var organizationTypeList = organizationTypeCollection.find().fetch();

      for(var organizationTypeIndex in organizationTypeList) {
        //console.log(organizationTypeList[organizationTypeIndex].typeKey);
        var organizationList;

        var organizationListUrl="https://www.lds.org/directory/services/ludrs/1.1/unit/roster/" + inWardUnitNo + "/" + organizationTypeList[organizationTypeIndex].typeKey;
        result = Meteor.http.call("GET", organizationListUrl, {
          params: {
            timeout: 30000
          },
          headers: {
            "cookie": Meteor.user().ldsAccount.cookieValue,
            "content-type": "application/json",
            "Accept": "application/json"
          },
        });

        organizationList = JSON.parse(result.content);

        //for each group of positions
        for(var organizationIndex in organizationList) {
          //console.log(organizationList[organizationIndex]);
          organizationCollection.insert(_.extend(organizationList[organizationIndex], {organizationType: organizationTypeList[organizationTypeIndex], wardUnitNo: inWardUnitNo, stakeUnitNo: inStakeUnitNo}));
          memberCollection.update(
            {
              individualId: organizationList[organizationIndex].individualId
            },
            {
              $addToSet:
                {
                  "organizationTypes": organizationTypeList[organizationTypeIndex]
                }
            }
          );
        }
      }
    } catch (e) {
      // Got a network error, time-out or HTTP error in the 400 or 500 range.
      console.log(e);
      return e;
    }
  },
  getStakeOrganizations: function(inStakeUnitNo) {
    var unitList = unitCollection.find({stakeUnitNo: inStakeUnitNo}).fetch();
    for (var unitIndex in unitList) {
      Meteor.call("getWardOrganizations", unitList[unitIndex].wardUnitNo, inStakeUnitNo, function(error) {
        if (error) {
          console.log(error);
        }
      });
    }
    //get stake organizations too
    Meteor.call("getWardOrganizations", inStakeUnitNo, inStakeUnitNo, function(error) {
      if (error) {
        console.log(error);
      }
    });
  },
  syncWard: function () {
    Meteor.call("getUnits");
    Meteor.call("getWardMembers", Meteor.user().wardUnitNo, Meteor.user().stakeUnitNo);
    Meteor.call("getWardCallings", Meteor.user().wardUnitNo, Meteor.user().stakeUnitNo);
    Meteor.call("getWardOrganizations", Meteor.user().wardUnitNo, Meteor.user().stakeUnitNo);
    Meteor.call("getUserCallingInfo");
  },
  syncStake: function () {
    Meteor.call("getUnits");
    Meteor.call("getStakeMembers", Meteor.user().stakeUnitNo);
    Meteor.call("getStakeCallings", Meteor.user().stakeUnitNo);
    Meteor.call("getStakeOrganizations", Meteor.user().stakeUnitNo);
    Meteor.call("getUserCallingInfo");
  }
});
