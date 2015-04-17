Template.organizationMap.helpers({
  organizationMapOptions: function() {
    // Make sure the maps API has loaded
    //console.log(this);
    if (GoogleMaps.loaded()) {
      // Map initialization options

      var householdArray = Session.get("householdArray");

      //just center on the first one in the list
      return {
        center: new google.maps.LatLng(
          householdArray[0].householdInfo.address.latitude,
          householdArray[0].householdInfo.address.longitude
        ),
        zoom: 17
      };
    }
  }
});

Template.organizationMap.onCreated(function() {
  // We can use the `ready` callback to interact with the map API once the map is ready.
  GoogleMaps.ready("organizationMap", function(map) {
    // Add markers to the map once it's ready
    var householdArray = Session.get("householdArray");
    var individualIdArray = Session.get("individualIdArray");

    var infoWindowArray = [];

    for (householdIndex in householdArray) {
      var latlng = new google.maps.LatLng(householdArray[householdIndex].householdInfo.address.latitude, householdArray[householdIndex].householdInfo.address.longitude);

      contentString = "<h4>Household Members</h4>";
      if (householdArray[householdIndex].headOfHousehold && householdArray[householdIndex].headOfHousehold.name) {
        if (individualIdArray.indexOf(householdArray[householdIndex].headOfHousehold.individualId) > -1) {
          contentString += "<strong>" + householdArray[householdIndex].headOfHousehold.name + "</strong>" + "<br />";
        } else {
          contentString += householdArray[householdIndex].headOfHousehold.name + "<br />";
        }
      }
      if (householdArray[householdIndex].spouse && householdArray[householdIndex].spouse.name) {
        if (individualIdArray.indexOf(householdArray[householdIndex].spouse.individualId) > -1) {
          contentString += "<strong>" + householdArray[householdIndex].spouse.name + "</strong>" + "<br />";
        } else {
          contentString += householdArray[householdIndex].spouse.name + "<br />";
        }
      }
      for (otherHouseholdMembersIndex in householdArray[householdIndex].otherHouseholdMembers) {
        if (householdArray[householdIndex].otherHouseholdMembers[otherHouseholdMembersIndex].name) {
          if (individualIdArray.indexOf(householdArray[householdIndex].otherHouseholdMembers[otherHouseholdMembersIndex].individualId) > -1) {
            contentString += "<strong>" + householdArray[householdIndex].otherHouseholdMembers[otherHouseholdMembersIndex].name + "</strong>" + "<br />";
          } else {
            contentString += householdArray[householdIndex].otherHouseholdMembers[otherHouseholdMembersIndex].name + "<br />";
          }
        }
      }

      if (householdArray[householdIndex].householdInfo && householdArray[householdIndex].householdInfo.address) {
        contentString += "<h4>Address</h4>";
        if (householdArray[householdIndex].householdInfo.address.addr1) {
          contentString += householdArray[householdIndex].householdInfo.address.addr1 + "<br />";
        }
        if (householdArray[householdIndex].householdInfo.address.addr2) {
          contentString += householdArray[householdIndex].householdInfo.address.addr2 + "<br />";
        }
        if (householdArray[householdIndex].householdInfo.address.addr3) {
          contentString += householdArray[householdIndex].householdInfo.address.addr3 + "<br />";
        }
        if (householdArray[householdIndex].householdInfo.address.addr4) {
          contentString += householdArray[householdIndex].householdInfo.address.addr4 + "<br />";
        }
        if (householdArray[householdIndex].householdInfo.address.addr5) {
          contentString += householdArray[householdIndex].householdInfo.address.addr5 + "<br />";
        }

        //create directions link
        var theLocation;
        var iOS = /(iPad|iPhone|iPod)/g.test( navigator.userAgent );
        if (iOS) {
          theLocation = "comgooglemaps-x-callback://?";
        } else {
          theLocation = "https://www.google.com/maps?";
        }
        theLocation +=
          "saddr=" +
          "&daddr=" + householdArray[householdIndex].householdInfo.address.addr1 + "," +
                      householdArray[householdIndex].householdInfo.address.addr2 + "," +
                      householdArray[householdIndex].householdInfo.address.addr3 + "," +
                      householdArray[householdIndex].householdInfo.address.addr4 +
          "&center=" + householdArray[householdIndex].householdInfo.address.latitude + "," +
                      householdArray[householdIndex].householdInfo.address.longitude +
          "&zoom=17" +
          "&views=traffic" +
          "&directionsmode=driving" +
          "&dirflg=d" +
          "&x-success=sourceapp://?resume=true" +
          "&x-source=LDS+Toolbox";
        if (iOS) {
          contentString += "<a class='button button-block button-positive' href='javascript: window.location = " + "\"" + theLocation + "\";'>Get Directions in Google Maps</a>";
        } else {
          contentString += "<a class='button button-block button-positive' href='javascript: window.open(\"" + theLocation + "\");'>Get Directions in Google Maps</a>";
        }
      }

      infoWindowArray[householdArray[householdIndex].headOfHousehold.name] = new google.maps.InfoWindow({
        content: contentString
      });

      /*
      var image = {
        url: "https://chart.googleapis.com/chart?chst=d_bubble_text_small&chld=bb|" + householdArray[householdIndex].headOfHousehold.name + "|FFFFFF|000000",
        // This marker is 20 pixels wide by 32 pixels tall.
        //size: new google.maps.Size(20, 32),
        // The origin for this image is 0,0.
        //origin: new google.maps.Point(0,0),
        // The anchor for this image is the base of the flagpole at 0,32.
        //anchor: new google.maps.Point(0, 32)
      };
      */

      marker = new google.maps.Marker({
        //icon: image,
        position: latlng,
        map: map.instance,
        title: householdArray[householdIndex].headOfHousehold.name
      });

      google.maps.event.addListener(marker, 'click', function() {
        for (infoWindowIndex in infoWindowArray) {
          infoWindowArray[infoWindowIndex].close();
        }
        infoWindowArray[this.getTitle()].open(map.instance, this);
      });
    }
  });
});
