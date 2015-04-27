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
          householdArray[0].latitude,
          householdArray[0].longitude
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
      var latlng = new google.maps.LatLng(householdArray[householdIndex].latitude, householdArray[householdIndex].longitude);

      contentString = "<h4>Household Members</h4>";
      if (householdArray[householdIndex].headOfHouse && householdArray[householdIndex].headOfHouse.preferredName) {
        if (individualIdArray.indexOf(householdArray[householdIndex].headOfHouse.individualId) > -1) {
          contentString += "<strong>" + householdArray[householdIndex].headOfHouse.preferredName + "</strong>" + "<br />";
        } else {
          contentString += householdArray[householdIndex].headOfHouse.preferredName + "<br />";
        }
      }
      if (householdArray[householdIndex].spouse && householdArray[householdIndex].spouse.preferredName) {
        if (individualIdArray.indexOf(householdArray[householdIndex].spouse.individualId) > -1) {
          contentString += "<strong>" + householdArray[householdIndex].spouse.preferredName + "</strong>" + "<br />";
        } else {
          contentString += householdArray[householdIndex].spouse.preferredName + "<br />";
        }
      }
      for (childrenIndex in householdArray[householdIndex].children) {
        if (householdArray[householdIndex].children[childrenIndex].preferredName) {
          if (individualIdArray.indexOf(householdArray[householdIndex].children[childrenIndex].individualId) > -1) {
            contentString += "<strong>" + householdArray[householdIndex].children[childrenIndex].preferredName + "</strong>" + "<br />";
          } else {
            contentString += householdArray[householdIndex].children[childrenIndex].preferredName + "<br />";
          }
        }
      }

      if (householdArray[householdIndex] && householdArray[householdIndex].desc1) {
        contentString += "<h4>Address</h4>";
        if (householdArray[householdIndex].desc1) {
          contentString += householdArray[householdIndex].desc1 + "<br />";
        }
        if (householdArray[householdIndex].desc2) {
          contentString += householdArray[householdIndex].desc2 + "<br />";
        }
        if (householdArray[householdIndex].desc3) {
          contentString += householdArray[householdIndex].desc3 + "<br />";
        }
        if (householdArray[householdIndex].desc4) {
          contentString += householdArray[householdIndex].desc4 + "<br />";
        }
        if (householdArray[householdIndex].desc5) {
          contentString += householdArray[householdIndex].desc5 + "<br />";
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
          "&daddr=" + householdArray[householdIndex].desc1 + "," +
                      householdArray[householdIndex].desc2 + "," +
                      householdArray[householdIndex].desc3 + "," +
                      householdArray[householdIndex].desc4 +
          "&center=" + householdArray[householdIndex].latitude + "," +
                      householdArray[householdIndex].longitude +
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

      infoWindowArray[householdArray[householdIndex].headOfHouse.preferredName] = new google.maps.InfoWindow({
        content: contentString
      });

      /*
      var image = {
        url: "https://chart.googleapis.com/chart?chst=d_bubble_text_small&chld=bb|" + householdArray[householdIndex].headOfHouse.preferredName + "|FFFFFF|000000",
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
        title: householdArray[householdIndex].headOfHouse.preferredName
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
