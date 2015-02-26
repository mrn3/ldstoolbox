Router.configure({
  layoutTemplate: 'layout'
});

Meteor.startup(function () {
  if (Meteor.isClient) {
    var location = Iron.Location.get();
    if (location.queryObject.platformOverride) {
      Session.set('platformOverride', location.queryObject.platformOverride);
    }
  }
});

Router.map(function() {
  this.route('sideMenu', {path: '/'});
  this.route('/memberList/', {
    name: 'memberList',
    data: function() {
      return {
        householdData: householdCollection.find({})
      };
    },
    fastRender: true
  });
  this.route('/member/:individualId', {
    name: 'member',
    data: function() {
      //console.log(memberCollection.findOne({individualId: this.params.individualId}));
      return {
        memberData: memberCollection.findOne({individualId: this.params.individualId})
      };
    },
    fastRender: true
  });
  this.route('/household/:_id', {
    name: 'household',
    data: function() {
      return {
        householdData: householdCollection.findOne(this.params._id)
      };
    },
    fastRender: true
  });
  this.route('/callingGroupList/', {
    name: 'callingGroupList',
    data: function() {
      return {
        callingData: callingCollection.find({})
      };
    },
    fastRender: true
  });
  this.route('/callingGroup/:_id', {
    name: 'callingGroup',
    data: function() {
      return {
        callingData: callingCollection.findOne(this.params._id)
      };
    },
    fastRender: true
  });
  this.route('callingChangeList');
  this.route('sync');
  this.route('actionSheet');
  this.route('backdrop');
  this.route('forms', {
    data: function () {
      return {
        post: Posts.find().fetch()[0]
      };
    }
  });
  this.route('headersFooters');
  this.route('lists');
  this.route('loading');
  this.route('modal');
  this.route('navigation');
  this.route('navigation.one', {path: '/navigation/one'});
  this.route('navigation.two', {path: '/navigation/two'});
  this.route('navigation.three', {path: '/navigation/three'});
  this.route('popover');
  this.route('popup');
  this.route('index');
  this.route('slideBox');
  this.route('tabs.one', {path: '/tabs/one', layoutTemplate: 'tabsLayout'});
  this.route('tabs.two', {path: '/tabs/two', layoutTemplate: 'tabsLayout'});
  this.route('tabs.three', {path: '/tabs/three', layoutTemplate: 'tabsLayout'});
  this.route('tabs.four', {path: '/tabs/four', layoutTemplate: 'tabsLayout'});
  this.route('userAccounts');
});
