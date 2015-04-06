Template.organizationMap.helpers({
  organizationMapOptions: function() {
    // Make sure the maps API has loaded
    if (GoogleMaps.loaded()) {
      // Map initialization options
      if (this.organizationData
        && this.organizationData.organizationInfo
        && this.organizationData.organizationInfo.address
        && this.organizationData.organizationInfo.address.latitude
        && this.organizationData.organizationInfo.address.longitude) {
          return {
            center: new google.maps.LatLng(
              this.organizationData.organizationInfo.address.latitude,
              this.organizationData.organizationInfo.address.longitude
            ),
            zoom: 17
          };
      } else {
        return {};
      }
    }
  }
});

Template.organizationMap.onCreated(function() {
  // We can use the `ready` callback to interact with the map API once the map is ready.
  GoogleMaps.ready("organizationMap", function(map) {
    // Add a marker to the map once it's ready
    var marker = new google.maps.Marker({
      position: map.options.center,
      map: map.instance
    });
  });
});
