/**
 * Autoplay para vídeos de background — compatível com iOS Safari
 * iOS exige: muted, playsInline e muitas vezes play() via JS quando o vídeo entra na tela
 */
(function () {
    'use strict';

    var selector = '.hero-video, .split-block-video, .strip-section-video';
    var videos = document.querySelectorAll(selector);
    if (!videos.length) return;

    function forceAutoplayAttrs(video) {
        video.muted = true;
        video.setAttribute('muted', '');
        video.playsInline = true;
        video.setAttribute('playsinline', '');
        video.setAttribute('webkit-playsinline', '');
        if (!video.getAttribute('preload')) video.setAttribute('preload', 'auto');
    }

    function playVideo(video) {
        if (!video || video.readyState < 2) return;
        var p = video.play();
        if (p && typeof p.then === 'function') {
            p.catch(function () {});
        }
    }

    function pauseVideo(video) {
        try {
            video.pause();
        } catch (e) {}
    }

    function tryPlayWhenReady(video) {
        if (video.readyState >= 2) {
            playVideo(video);
            return;
        }
        video.addEventListener('loadeddata', function onLoaded() {
            video.removeEventListener('loadeddata', onLoaded);
            playVideo(video);
        }, { once: true });
        video.addEventListener('canplay', function onCanPlay() {
            video.removeEventListener('canplay', onCanPlay);
            playVideo(video);
        }, { once: true });
    }

    for (var i = 0; i < videos.length; i++) {
        forceAutoplayAttrs(videos[i]);
    }

    var observer = new IntersectionObserver(
        function (entries) {
            entries.forEach(function (entry) {
                var video = entry.target;
                if (entry.isIntersecting) {
                    tryPlayWhenReady(video);
                } else {
                    pauseVideo(video);
                }
            });
        },
        { root: null, rootMargin: '10% 0px', threshold: 0 }
    );

    videos.forEach(function (video) {
        observer.observe(video);
        if (video.readyState >= 2) playVideo(video);
        else tryPlayWhenReady(video);
    });

    document.addEventListener('visibilitychange', function () {
        if (document.hidden) {
            videos.forEach(pauseVideo);
        } else {
            videos.forEach(function (video) {
                var rect = video.getBoundingClientRect();
                if (rect.top < window.innerHeight && rect.bottom > 0) {
                    tryPlayWhenReady(video);
                }
            });
        }
    });
})();
