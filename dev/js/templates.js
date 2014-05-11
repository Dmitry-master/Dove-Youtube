var templates = {
    playlistItem: function(data) {
        return '<li class="playlist_tabs_item" data-playlist-id="' + data.id + '">' +
                '<figure>' +
                    '<img src="' + data.snippet.thumbnails.medium.url + '" alt="' + data.snippet.title + '" class="playlist_image">' +
                    '<figcaption>' +
                        '<span class="playlist_title">' + data.snippet.title + '</span>' +
                        '<br><span class="playlist_descr">' + data.snippet.description + '</span>' +
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