Template.householdMap.helpers({
  householdMapOptions: function() {
    // Make sure the maps API has loaded
    if (GoogleMaps.loaded()) {
      // Map initialization options
      if (this.householdData
        && this.householdData.latitude
        && this.householdData.longitude) {
          return {
            center: new google.maps.LatLng(
              this.householdData.latitude,
              this.householdData.longitude
            ),
            zoom: 17
          };
      } else {
        return {};
      }
    }
  }
});

Template.householdMap.onCreated(function() {
  // We can use the `ready` callback to interact with the map API once the map is ready.
  GoogleMaps.ready("householdMap", function(map) {
    // Add a marker to the map once it's ready
    var marker = new google.maps.Marker({
      position: map.options.center,
      map: map.instance
    });
  });
});
