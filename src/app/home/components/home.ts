import 'rxjs/add/operator/do';
import 'rxjs/add/operator/pluck';

import { Component, AfterContentInit, ViewChild, OnInit } from '@angular/core';
import { Router, NavigationEnd, RoutesRecognized } from '@angular/router';
import { AuthService } from '../../auth/services/auth-service';
import { SwiperConfigInterface, SwiperComponent } from 'ngx-swiper-wrapper';
import { AppService } from '../../services/app-service';
import { SearchService } from '../../shared-module/services/search-service';
import { ISearchQuery, SearchQuery } from '../../search/models/search-query';
import { AngularFireDatabase } from 'angularfire2/database/database';
import { FirebaseListObservable } from 'angularfire2/database/firebase_list_observable';

declare var jQuery: any;
declare var OtriggerSlides: any;

@Component({
    templateUrl: './home.html',
    styleUrls: [
        './home.scss'
    ]
})

export class HomeComponent implements AfterContentInit, OnInit {

    midNav = 1;
    searchString = '';
    location = '';
    date = 'all';
    searchResults: any[] = [];
    showNoResults = false;
    defaultQuery: ISearchQuery = new SearchQuery();
    featuredEvents$: FirebaseListObservable<any>;
    featuredEvents: any[] = [];
    getOcode = false;

    constructor(private auth: AuthService,
        private router: Router,
        private af: AngularFireDatabase,
        private searchService: SearchService,
        private appService: AppService) {
        jQuery('body').css('background-color', '#fff');
        router.events.subscribe((val) => {
            if (val instanceof RoutesRecognized) {
                jQuery('body').css('background-color', '#f7f7f7');
            }
        });

        OtriggerSlides();

        this.featuredEvents$ = this.af.list(`/featured`);

    }

    search() {
        let route = `/search?q=${this.searchString}&location=${this.location}&range=40mi`;
        if (this.date !== 'all') {
            route += `&date=${this.date}`;
        }
        this.router.navigateByUrl(route);
    }

    private postSignIn(): void {
        this.router.navigate(['/account']);
    }

    // tslint:disable-next-line:member-ordering
    public config: SwiperConfigInterface = {
        scrollbar: null,
        direction: 'horizontal',
        slidesPerView: 3,
        spaceBetween: 5,
        scrollbarHide: false,
        keyboardControl: true,
        mousewheelControl: true,
        scrollbarDraggable: true,
        scrollbarSnapOnRelease: true,
        pagination: '.swiper-pagination',
        paginationClickable: true,
        nextButton: '.swiper-button-next',
        prevButton: '.swiper-button-prev'
    };

    // tslint:disable-next-line:member-ordering
    @ViewChild(SwiperComponent) swiperView: SwiperComponent;

    ngOnInit() {
        this.runQuery();
        this.featuredEvents$.subscribe((data) => {
            this.featuredEvents = data;
        });
    }

    parseResults(data) {

        console.log(data.$exists());

        if (data.$exists()) {
            console.log(data);

            let cleanData: any;



            // TODO DROP THIS IF WHEN EVERYTHING IS THE SAME (RIGHT NOW THE NODE ONE AND C# ONE RETURN DIFFERENT TYPES)
            if (typeof data.$value === 'string') {
                cleanData = (JSON.parse(data.$value));
            } else {
                cleanData = data;
            }


            if (cleanData.data && cleanData.data.total > 0) {
                this.showNoResults = false;
                this.searchResults = cleanData.data.hits;
            } else {
                this.searchResults = [];
                this.showNoResults = true;
            }

        }

        this.appService.stopLoadingBar();
    }

    runQuery() {

        const $this = this;

        this.searchService.getCurrentLocation().then((location) => {

            this.defaultQuery.locationSet = true;
            this.defaultQuery.location = location;
            console.log(this.defaultQuery);

            this.searchService.buildQuery(this.defaultQuery, 15, 0, true).then(function (data) {

                $this.appService.stopLoadingBar();
                // send over key of passed results
                $this.getResults();

            }, function (err) {
                $this.appService.stopLoadingBar();
                console.log(err);
            });
        });

    }

    getResults(): void {
        this.searchService.updateResults().then((data$) => {
            data$.subscribe((data) => {
                // console.log(data);
                this.parseResults(data);
            });
        }, (err) => {
            console.log(err);
        });
    }

    ngAfterContentInit() {
        jQuery(document).ready(function ($) {
            const slidesWrapper = $('.cd-hero-slider');

            // check if a .cd-hero-slider exists in the DOM
            if (slidesWrapper.length > 0) {
                const primaryNav = $('.cd-primary-nav'),
                    sliderNav = $('.cd-hero .prev, .cd-hero .next'),
                    navigationMarker = $('.cd-marker'),
                    slidesNumber = slidesWrapper.children('li').length,
                    visibleSlidePosition = 0,
                    autoPlayId,
                    autoPlayDelay = 7000;

                // upload videos (if not on mobile devices)
                uploadVideo(slidesWrapper);

                // autoplay slider
                setAutoplay(slidesWrapper, slidesNumber, autoPlayDelay);

                // on mobile - open/close primary navigation clicking/tapping the menu icon
                primaryNav.on('click', function (event) {
                    // tslint:disable-next-line:curly
                    if ($(event.target).is('.cd-primary-nav')) $(this).children('ul').toggleClass('is-visible');
                });

                // change visible slide - Shane Loveland customized to wrk with left and right arrows
                sliderNav.on('click', function (event) {
                    event.preventDefault();
                    const selectedItem = $(this);

                    const prev = selectedItem.hasClass('prev');
                    const prevTarget, nextTarget, setPrev;
                    const length = slidesWrapper.find('>li').length;
                    const current = slidesWrapper.find('.selected').index() + 1;

                    if (prev) {
                        if (current === 1) {
                            this.prevTarget = length - 1;
                        } else {
                            this.prevTarget = current - 2;
                        }
                    } else {
                        if (current === length) {
                            this.prevTarget = 0;
                            this.setPrev = true;
                        } else {
                            this.nextTarget = current;
                        }
                    }

                    if (selectedItem.hasClass('prev') || setPrev) {
                        prevSlide(slidesWrapper.find('.selected'), slidesWrapper, sliderNav, prevTarget);
                        setAutoplay(slidesWrapper, slidesNumber, autoPlayDelay);
                        this.setPrev = false;
                    } else {
                        nextSlide(slidesWrapper.find('.selected'), slidesWrapper, sliderNav, nextTarget);
                        setAutoplay(slidesWrapper, slidesNumber, autoPlayDelay);
                        this.setPrev = false;
                    }

                });


            }

            function nextSlide(visibleSlide, container, pagination, n) {
                visibleSlide.removeClass('selected from-left from-right').addClass('is-moving')
                    .one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function () {
                    visibleSlide.removeClass('is-moving');
                });

                container.children('li').eq(n).addClass('selected from-right').prevAll().addClass('move-left');
                checkVideo(visibleSlide, container, n);
            }

            function prevSlide(visibleSlide, container, pagination, n) {
                visibleSlide.removeClass('selected from-left from-right').addClass('is-moving')
                    .one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function () {
                    visibleSlide.removeClass('is-moving');
                });

                container.children('li').eq(n).addClass('selected from-left').removeClass('move-left').nextAll().removeClass('move-left');
                checkVideo(visibleSlide, container, n);
            }

            function updateSliderNavigation(pagination, n) {
                const navigationDot = pagination.find('.selected');
                navigationDot.removeClass('selected');
                pagination.find('li').eq(n).addClass('selected');
            }

            function setAutoplay(wrapper, length, delay) {
                if (wrapper.hasClass('autoplay')) {
                    const autoplay;
                    clearInterval(this.autoPlayId);
                    this.autoPlayId = window.setInterval(function () { autoplaySlider(length); }, delay);
                }
            }

            function autoplaySlider(length) {
                const visibleSlidePosition, sliderNav;
                if (visibleSlidePosition < length - 1) {
                    nextSlide(slidesWrapper.find('.selected'), slidesWrapper, sliderNav, visibleSlidePosition + 1);
                    this.visibleSlidePosition += 1;
                } else {
                    prevSlide(slidesWrapper.find('.selected'), slidesWrapper, sliderNav, 0);
                    this.visibleSlidePosition = 0;
                }
                updateNavigationMarker(this.navigationMarker, visibleSlidePosition + 1);
                updateSliderNavigation(sliderNav, visibleSlidePosition);
            }

            function uploadVideo(container) {
                container.find('.cd-bg-video-wrapper').each(function () {
                    const videoWrapper = $(this);
                    if (videoWrapper.is(':visible')) {
                        // if visible - we are not on a mobile device
                        const videoUrl = videoWrapper.data('video'),
                            video = $('<video loop><source src='' + videoUrl + '.mp4' type='video/mp4' /><source src='' + videoUrl + '.webm' type='video/webm' /></video>');
                        video.appendTo(videoWrapper);
                        // play video if first slide
                        // tslint:disable-next-line:curly
                        if (videoWrapper.parent('.cd-bg-video.selected').length > 0) video.get(0).play();
                    }
                });
            }

            function checkVideo(hiddenSlide, container, n) {
                // check if a video outside the viewport is playing - if yes, pause it
                const hiddenVideo = hiddenSlide.find('video');
                // tslint:disable-next-line:curly
                if (hiddenVideo.length > 0) hiddenVideo.get(0).pause();

                // check if the select slide contains a video element - if yes, play the video
                const visibleVideo = container.children('li').eq(n).find('video');
                // tslint:disable-next-line:curly
                if (visibleVideo.length > 0) visibleVideo.get(0).play();
            }

            function updateNavigationMarker(marker, n) {
                marker.removeClassPrefix('item').addClass('item-' + n);
            }

            $.fn.removeClassPrefix = function (prefix) {
                // remove all classes starting with 'prefix'
                this.each(function (i, el) {
                    const classes = el.className.split(' ').filter(function (c) {
                        return c.lastIndexOf(prefix, 0) !== 0;
                    });
                    el.className = $.trim(classes.join(' '));
                });
                return this;
            };
        }); /**
         * Created by sloveland on 6/16/16.
         */

    }

}
