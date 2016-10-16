'use strict';
/**
 * Load Google Publisher Tag scripts
 */
var googletag = googletag || {};
googletag.cmd = googletag.cmd || [];
(function() {
  var gads = document.createElement('script');
  gads.async = true;
  gads.type = 'text/javascript';
  var useSSL = 'https:' == document.location.protocol;
  gads.src = (useSSL ? 'https:' : 'http:') +
    '//www.googletagservices.com/tag/js/gpt.js';
  var node = document.getElementsByTagName('script')[0];
  node.parentNode.insertBefore(gads, node);
})();

(function($) {
  // // Espacios de GPT
  googletag.cmd.push(function() {
    /**
     * Set dfp_ads object and assign an account_id
     */
    var dfp_ads = dfp_ads || {};
    dfp_ads.account_id = '/INSERT-DFP-ID/';

    dfp_ads.mappings = {
      interstitial: googletag.sizeMapping().
      addSize([0, 0], [320, 480]). // Mobile y Tablet
      addSize([800, 430], [760, 430]). // Tablet y Desktop
      build(),
    };

    defineSizeMapping(dfp_ads.mappings.responsive).
    addService(googletag.pubads());

    // googletag.pubads().enableSingleRequest();
    googletag.pubads().collapseEmptyDivs();
    // Start ad fetching
    googletag.enableServices();

    /**
     * Init Interstitial Ad if in Home page
     */
    (function initInterstitial() {
      if ($('body').hasClass('home')) { // This 'if' is optional

        // console.log("$('body').hasClass('home')");

        dfp_ads.interstitial = {};
        var interstitial = dfp_ads.interstitial;
        interstitial = {};
        interstitial = {
          ad_name: 'Interstitial_320x480-760x430',
          position_tag: 'Interstitial_320x480-760x430',
          lifespan: 7000,
          markup: '',
          overlayMarkup: '<div class="interstitialAd-overlay fadeIn"></div>',
          'show': function() {},
          'close': function() {},
        };
        interstitial.googletag = googletag.defineSlot(dfp_ads.account_id + interstitial.ad_name, [
          [760, 430],
          [320, 480]
        ], interstitial.ad_name).defineSizeMapping(dfp_ads.mappings.interstitial).addService(googletag.pubads());

        interstitial.markup = '<div id="' + interstitial.ad_name + '" class="interstitialAd-modal">';
        interstitial.markup += '<div class="close-interstitial">Cerrar</div>';
        interstitial.markup += '<script type="text/javascript">';
        interstitial.markup += 'googletag.cmd.push(function() {';
        interstitial.markup += 'googletag.display(\'' + interstitial.ad_name + '\');';
        interstitial.markup += '});';
        interstitial.markup += '<\/script>';
        interstitial.markup += '<\/div>';


        interstitial.show = function() {
          $('html').add('body').css({ overflow: 'hidden' });
          $('.interstitialAd-modal').addClass('interstitialAd-modal-show');
        };

        interstitial.close = function() {
          $('html').add('body').css({ overflow: 'auto' });
          $('.interstitialAd-overlay').addClass('interstitialAd-hide');
          $('.interstitialAd-modal').removeClass('interstitialAd-modal-show').addClass('interstitialAd-hide');;
        };

        interstitial.init = function(event) {

          $('.close-interstitial').on('click', function() {
            interstitial.close();
          });

          $('body').prepend(interstitial.overlayMarkup);

          if (!event.isEmpty && (event.slot.getAdUnitPath() === (dfp_ads.account_id + interstitial.ad_name))) {
            interstitial.show();
            setTimeout(function() {
              interstitial.close();
            }, interstitial.lifespan);
          }

        };
        interstitial.prepare = (function() {
          // console.log('interstitial.prepare');
          // console.log('interstitial.ad_name = ' + interstitial.ad_name);
          $('body').prepend(interstitial.markup);

          dfp_ads.interstitial = interstitial;
        })();

      }
    })();

    googletag.pubads().addEventListener('impressionViewable', function(event) {
      if (typeof dfp_ads.interstitial !== 'undefined') {
        dfp_ads.interstitial.init(event);
      }
    });

  });

})(jQuery);
