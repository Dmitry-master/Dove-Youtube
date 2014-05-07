var templates = {
        playlistItem: function(data) {
            return '<li class="playlist_tabs_item" data-playlist-id="' + data.id + '">' +
                    '<figure>' +
                        '<img src="' + data.snippet.thumbnails.medium.url + '" alt="' + data.snippet.title + '" class="playlist_image">' +
                        '<figcaption>' +
                            '<span class="playlist_title">' + data.snippet.title + '</span>' +
                            '<!--<br><span class="playlist_descr">Selfie</span>-->' +
                        '</figcaption>' +
                    '</figure>' +
                '</li>';
        },
        videoItem: function(data) {
            return '<li class="playlist_videos_item" data-video-id="' + data.id + '">' +
                    '<figure>' +
                        '<img src="' + data.snippet.thumbnails.medium.url + '" alt="' + data.snippet.title + '" class="video_sample">' +
                        '<figcaption class="video_title">' + data.snippet.title + '</figcaption>' +
                    '</figure>' +
                '</li>';
        },
        video: function (data) {
            return '<object width="100%" height="100%">' +
                    '<param name="movie" value="https://www.youtube.com/v/' + data.url + '&fs=1"></param>' +
                    '<param name="allowFullScreen" value="true"></param>' +
                    '<embed src="https://www.youtube.com/v/' + data.url + '&fs=1"' +
                           'type="application/x-shockwave-flash"' +
                           'width="100%" height="100%"' +
                           'allowfullscreen="true"></embed>' +
                '</object>';
        }
    };

function Youtube(options) {
    this.channelId = options.channelId;
    this.playlistsConteiner = options.playlistsConteiner;
    this.videosConteiner = options.videosConteiner;
    this.videoConteiner = options.videoConteiner;
    this.activePlaylist = null;
    this.activeVideo = null;

    this.vent = $({});

    this.init();
}

Youtube.prototype.init = function () {
    var self = this,
        playlists = self.getPlaylists();

    this.vent.on('activePlaylist:change', $.proxy(this.renderVideos, this) );
    this.vent.on('activeVideo:change', $.proxy(this.renderVideo, this) );

    this.playlistsConteiner.on('click', 'li', function () {
        
    });
    this.videosConteiner.on('click', 'li', function () {
        
    });

    playlists.then(function(data) {
        console.log(data);
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
            key: 'AIzaSyD7ls_UCYsiKHwjPFFjvrATd0LLXxUubLI'
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
            key: 'AIzaSyD7ls_UCYsiKHwjPFFjvrATd0LLXxUubLI'
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
        console.log(data);
        self.activePlaylist = data;
        self.vent.trigger('activePlaylist:change');

        var firstVideo = data.items[0];
        self.setActiveVideo(firstVideo);
    });
};

Youtube.prototype.setActiveVideo = function(video) {
    console.log(video);
    this.activeVideo = video;
    this.vent.trigger('activeVideo:change');
};


Youtube.prototype.renderPlaylists = function(playlists) {
    this.playlistsConteiner.empty();

    for (var i = 0; i < 4/*playlists.length*/; i++) {
        this.playlistsConteiner.append( templates.playlistItem(playlists[i]) );
    };
};


Youtube.prototype.renderVideos = function() {
    this.videosConteiner.empty();

    for (var i = 0; i < 3/*this.activePlaylist.items.length*/; i++) {
        this.videosConteiner.append( templates.videoItem(this.activePlaylist.items[i]) );
    };
};


Youtube.prototype.renderVideo = function() {
    this.videoConteiner
        .empty()
        .append( templates.video({url: this.activeVideo.snippet.resourceId.videoId}) );
};

$(function() {
    var doveChannel = 'UCxOWCBe-OpWGVbpea9Yqyzw',
        ratio = 0.59,
        $playlistTabs = $('.playlist_tabs'),
        $playlistVideos = $('.playlist_videos'),
        $videoWrap = $('#video_wrap'),
        youtube = new Youtube({
            channelId: doveChannel,
            playlistsConteiner: $playlistTabs,
            videosConteiner: $playlistVideos,
            videoConteiner: $videoWrap
        });

    function onReize() {
        $videoWrap.height( $videoWrap.width() * ratio );
    }

    $(window).resize(onReize);
    onReize();
});