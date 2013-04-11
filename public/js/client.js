$('doc').ready(function () {
  var host = window.document.location.host.replace(/:.*/, ''),
    scrollLock = false,
    openSocket = null;

  function fixHeight() {
    var $logarea = $('.logarea'),
      windowHeight = $(window).height(),
      headerHeight = $('.header').outerHeight();

    $logarea.css('height', windowHeight - headerHeight - 20 + 'px');
  }

  fixHeight();
  $(window).resize(fixHeight);

  $('.header .lock-container button').on('click', function (e) {
    scrollLock = !scrollLock;
    $(e.target).toggleClass('checked', scrollLock);
  });
  
  $('.header .button-container').on('click', 'button', function (e) {
    var $button = $(e.target),
      name = $button.html().replace(' ', '', 'g');

    $('.logarea').empty();
    
    if (openSocket) {
      openSocket.close();
    }

    $('.header .button-container button').removeClass('selected');
    $button.addClass('selected');

    openSocket = new WebSocket('ws://' + host + ':4000/logs/' + name);

    openSocket.onmessage = function (e) {
      var $line = $(document.createElement('div')),
        $logarea = $('.logarea');

      $line.addClass('log-line').text(e.data);
      $logarea.append($line);

      if (!scrollLock) {
        $logarea.scrollTop($logarea.prop('scrollHeight'));
      }
    };
  });
});
