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

      //var householdListUrl="https://www.lds.org/directory/services/ludrs/mem/member-list/" + inWardUnitNo;
      var householdListUrl = "https://www.lds.org/mobiledirectory/services/v2/ldstools/member-detaillist-with-callings/" + inWardUnitNo;
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

      parsedResult = JSON.parse(result.content);

      callingList = parsedResult.callings;

      //remove all positions in the ward
      callingCollection.remove({wardUnitNo: inWardUnitNo});
      callingGroupCollection.remove({wardUnitNo: inWardUnitNo});

      var children;
      //for each group of positions
      for(var callingIndex in callingList) {
        callingGroupCollection.insert(
          _.extend(
            callingList[callingIndex],
            {
              wardUnitNo: inWardUnitNo,
              stakeUnitNo: inStakeUnitNo
            }
          )
        );

        children = callingList.children;

        for (var childrenIndex in children) {

          callingCollection.insert(
            _.extend(
              children[childrenIndex],
              {
                wardUnitNo: inWardUnitNo,
                stakeUnitNo: inStakeUnitNo
              }
            )
          );
          /*
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
          */
        }
      }

      //remove all households and members currently in the ward
      memberCollection.remove({wardUnitNo: inWardUnitNo});
      householdCollection.remove({wardUnitNo: inWardUnitNo});

      householdList = parsedResult.households;

      var switchedPreferredName;

      //add all households in ward
      for(var householdListIndex in householdList) {
        householdCollection.insert(
          _.extend(
            householdList[householdListIndex],
            {
              wardUnitNo: inWardUnitNo,
              stakeUnitNo: inStakeUnitNo
            }
          )
        );

        //insert head of household, spouse, and children, and append on the ward unit number
        if (householdList[householdListIndex].headOfHouse) {
          if (householdList[householdListIndex].headOfHouse.preferredName) {
            switchedPreferredName = switchName(householdList[householdListIndex].headOfHouse.preferredName)
          }
          memberCollection.insert(
            _.extend(
              householdList[householdListIndex].headOfHouse,
              {
                wardUnitNo: inWardUnitNo,
                stakeUnitNo: inStakeUnitNo,
                switchedPreferredName: switchedPreferredName
              }
            )
          );
        }
        if (householdList[householdListIndex].spouse) {
          if (householdList[householdListIndex].spouse.preferredName) {
            switchedPreferredName = switchName(householdList[householdListIndex].spouse.preferredName)
          }
          memberCollection.insert(
            _.extend(
              householdList[householdListIndex].spouse,
              {
                wardUnitNo: inWardUnitNo,
                stakeUnitNo: inStakeUnitNo,
                switchedPreferredName: switchedPreferredName
              }
            )
          );
        }
        for(var childrenIndex in householdList[householdListIndex].children) {
          if (householdList[householdListIndex].children[childrenIndex]) {
            if (householdList[householdListIndex].children[childrenIndex].preferredName) {
              switchedPreferredName = switchName(householdList[householdListIndex].children[childrenIndex].preferredName)
            }
            memberCollection.insert(
              _.extend(
                householdList[householdListIndex].children[childrenIndex],
                {
                  wardUnitNo: inWardUnitNo,
                  stakeUnitNo: inStakeUnitNo,
                  switchedPreferredName: switchedPreferredName
                }
              )
            );
          }
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

      var organizationList = organizationCollection.find().fetch();

      for(var organizationListIndex in organizationList) {

        var organization;

        var organizationUrl="https://www.lds.org/directory/services/ludrs/1.1/unit/roster/" + inWardUnitNo + "/" + organizationList[organizationListIndex].key;
        result = Meteor.http.call("GET", organizationUrl, {
          params: {
            timeout: 30000
          },
          headers: {
            "cookie": Meteor.user().ldsAccount.cookieValue,
            "content-type": "application/json",
            "Accept": "application/json"
          },
        });

        organization = JSON.parse(result.content);

        //for each group of positions
        for(var organizationIndex in organization) {
          memberCollection.update(
            {
              individualId: organization[organizationIndex].individualId
            },
            {
              $addToSet:
                {
                  "organizations": organizationList[organizationListIndex]
                }
            }
          );

          memberCollection.update(
            {
              individualId: organization[organizationIndex].individualId
            },
            {
              $set:
                {
                  birthdate:        organization[organizationIndex].birthdate,
                  email:            organization[organizationIndex].email,
                  formattedName:    organization[organizationIndex].formattedName,
                  givenName1:       organization[organizationIndex].givenName1,
                  memberId:         organization[organizationIndex].memberId,
                  phone:            organization[organizationIndex].phone,
                  photoUrl:         organization[organizationIndex].photoUrl
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
  },
  syncMyInfo: function () {
    Meteor.call("getUnits");
    Meteor.call("getUserCallingInfo");
  },
  syncWard: function () {
    Meteor.call("getUnits");
    Meteor.call("getWardMembers", Meteor.user().wardUnitNo, Meteor.user().stakeUnitNo);
    //Meteor.call("getWardCallings", Meteor.user().wardUnitNo, Meteor.user().stakeUnitNo);
    //Meteor.call("getWardOrganizations", Meteor.user().wardUnitNo, Meteor.user().stakeUnitNo);
    //Meteor.call("getUserCallingInfo");
  },
  syncStake: function () {
    Meteor.call("getUnits");
    Meteor.call("getStakeMembers", Meteor.user().stakeUnitNo);
    Meteor.call("getStakeCallings", Meteor.user().stakeUnitNo);
    Meteor.call("getStakeOrganizations", Meteor.user().stakeUnitNo);
    Meteor.call("getUserCallingInfo");
  }
});
