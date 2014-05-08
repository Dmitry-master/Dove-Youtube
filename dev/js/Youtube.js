function Youtube(options) {
    this.channelId = options.channelId;
    this.playlistsConteiner = options.playlistsConteiner;
    this.videosConteiner = options.videosConteiner;
    this.videoConteiner = options.videoConteiner;
    this.googleApiKey = options.googleApiKey;
    this.activePlaylist = null;
    this.activeVideo = null;

    this.vent = $({});

    this.init();
}

Youtube.prototype.init = function () {
    var self = this,
        playlists = self.getPlaylists();

    self.vent.on('activePlaylist:change', $.proxy(self.renderVideos, self) );
    self.vent.on('activeVideo:change', $.proxy(self.renderVideo, self) );

    self.playlistsConteiner.on('click', 'li', function (event) {
        var playlistId = $(event.currentTarget).data('playlist-id');

        self.setActivePlaylist(playlistId);
    });
    self.videosConteiner.on('click', 'li', function (event) {
        var videoId = $(event.currentTarget).data('video-id'),
            video;

        
        for (var i = self.activePlaylist.items.length - 1; i >= 0; i--) {
            if(self.activePlaylist.items[i].id === videoId) {
                video = self.activePlaylist.items[i];
                break;
            }
        };

        self.setActiveVideo(video);
        
    });

    playlists.then(function(data) {
        if(!data.items.length) return;

        self.renderPlaylists(data.items);

        var firstPlaylistId = data.items[0].id;
        self.setActivePlaylist(firstPlaylistId);
    });
};

Youtube.prototype.getPlaylists = function() {
    var deferred = new $.Deferred();

    $.ajax({
        url: 'https://www.googleapis.com/youtube/v3/playlists',
        type: 'GET',
        data: {
            part: 'snippet',
            channelId: this.channelId,
            key: this.googleApiKey
        },
        success: function (data) {
            deferred.resolve(data);
        }
    });

    return deferred.promise();
};

Youtube.prototype.getVideos = function(playlistId) {
    var deferred = new $.Deferred();

    $.ajax({
        url: 'https://www.googleapis.com/youtube/v3/playlistItems',
        type: 'GET',
        data: {
            part: 'snippet',
            playlistId: playlistId,
            key: this.googleApiKey
        },
        success: function (data) {
            deferred.resolve(data);
        }
    });

    return deferred.promise();
};

Youtube.prototype.setActivePlaylist = function(playlistId) {
    var self = this,
        playlist = self.getVideos(playlistId);

    playlist.then(function(data) {
        self.activePlaylist = data;
        self.vent.trigger('activePlaylist:change');

        var firstVideo = data.items[0];
        self.setActiveVideo(firstVideo);
    });
};

Youtube.prototype.setActiveVideo = function(video) {
    this.activeVideo = video;
    this.vent.trigger('activeVideo:change');
};


Youtube.prototype.renderPlaylists = function(playlists) {
    var self = this,
        content = $('<ul class="playlist_tabs"></ul>');
    
    for (var i = 0; i < playlists.length; i++) {
        content.append( templates.playlistItem(playlists[i]) );
    };

    this.playlistsConteiner.empty().append(content);

    setTimeout(function() {
        self.playlistsConteiner.slider({
            visibleItems: 4
        });
    }, 0);
};


Youtube.prototype.renderVideos = function() {
    var self = this,
        content = $('<ul class="playlist_videos"></ul>');

    for (var i = 0; i < this.activePlaylist.items.length; i++) {
        content.append( templates.videoItem(this.activePlaylist.items[i]) );
    };

    this.videosConteiner.empty().append(content);

    setTimeout(function() {
        self.videosConteiner.slider({
            visibleItems: 3
        });
    }, 0);
};


Youtube.prototype.renderVideo = function() {
    this.videoConteiner
        .empty()
        .append( templates.video({url: this.activeVideo.snippet.resourceId.videoId}) );
};

