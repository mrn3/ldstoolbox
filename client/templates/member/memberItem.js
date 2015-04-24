Template.memberItem.helpers({
  callingList: function(inCallingArray) {
    if (inCallingArray) {
      return inCallingArray.map(function(calling, index) {
        calling.index = index;
        return calling;
      });
    }
  }
});
