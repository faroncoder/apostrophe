var async = require('async');
var _ = require('lodash');
var argv = require('optimist').argv;

// Re-index all content for search

module.exports = function(self, callback) {
  return async.series({
    indexPages: function(callback) {
      console.log('Indexing all pages for search');
      return self.forEachPage({}, { load: true },
        function(page, callback) {
          return self.indexPage({}, page, callback);
        },
        callback);
    },
    indexFiles: function(callback) {
      console.log('Indexing all files for search');
      return self.forEachFile({}, function(file, callback) {
        file.searchText = self.fileSearchText(file);
        self.files.update({ _id: file._id }, file, callback);
      }, callback);
    },
    indexVideos: function(callback) {
      console.log('Indexing all videos for search');
      return self.forEachVideo({}, function(video, callback) {
        video.searchText = self.sortify(video.title);
        self.videos.update({ _id: video._id }, video, callback);
      }, callback);
    }
  }, callback);
};
