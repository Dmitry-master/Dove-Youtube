$(function() {
    var doveChannel = 'UCxOWCBe-OpWGVbpea9Yqyzw',
        ratio = 0.59,
        $playlistTabs = $('.playlist_tabs_wrap'),
        $playlistVideos = $('.playlist_videos_wrap'),
        $videoWrap = $('#video_wrap'),
        youtube;

    function onReize() {
        $videoWrap.height( $videoWrap.width() * ratio );
    }

    $(window).resize(onReize);
    onReize();

    youtube = new Youtube({
        channelId: doveChannel,
        playlistsConteiner: $playlistTabs,
        videosConteiner: $playlistVideos,
        videoConteiner: $videoWrap,
        googleApiKey: 'AIzaSyD7ls_UCYsiKHwjPFFjvrATd0LLXxUubLI'
    });
});