var initGallery;

initGallery = function(images) {
  var $caption, $container, $gallery, i, image, len;
  $container = $('.biga-entries').empty();
  $gallery = $('<div class="fotorama" data-nav="thumbs" data-navposition="top" data-keyboard="true" data-trackpad="true" data-loop="true" data-auto="false"></div>').appendTo($container);
  $caption = $('<div id="gallery-caption"></div>').appendTo($container);
  images.sort(function(a, b) {
    return a[0] - b[0];
  });
  for (i = 0, len = images.length; i < len; i++) {
    image = images[i];
    $gallery.append("<img src='" + image[1] + "'>");
  }
  return $gallery.on('fotorama:show', function(e, fotorama) {
    return $caption.html(images[fotorama.activeFrame.i - 1][2]);
  }).fotorama();
};

$(function() {
  var images, maxPage, page, results, suffix, url;
  maxPage = parseInt($('.biga-control > span').get(0).innerText.match(/von\s+(\d+)/)[1]);
  page = 1;
  images = [];
  results = [];
  while (page <= maxPage) {
    suffix = page === 1 ? '' : "-" + page;
    url = window.location.href.replace(/(?:-\d{1,2})?\.html$/, suffix + ".html");
    $.get(url, function(data) {
      var $doc, $imageWrapper, fetchedPage, image, text;
      $doc = $($.parseHTML(data));
      fetchedPage = parseInt(this.url.match(/(?:-(\d{1,2}))?\.html$/)[1] || '1');
      $imageWrapper = $doc.find('.biga-image');
      image = $imageWrapper.find('img').attr('src');
      text = $imageWrapper.find('+ p').html();
      images.push([fetchedPage, image, text]);
      if (images.length === maxPage) {
        return initGallery(images);
      }
    });
    results.push(page++);
  }
  return results;
});