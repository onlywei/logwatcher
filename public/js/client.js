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

  function clearLogs() {
    $('.logarea .log-content').empty();
  }

  fixHeight();
  $(window).resize(fixHeight);

  $('.header button#scrolllock').on('click', function (e) {
    scrollLock = !scrollLock;
    $(e.target).toggleClass('checked', scrollLock);
  });

  $('.header button#clearbutton').on('click', clearLogs);
  
  $('.header .button-container').on('click', 'button', function (e) {
    var $button = $(e.target),
      name = $button.html();

    clearLogs();
    $('.logarea .startmessage').text('Now watching ' + name);
    
    if (openSocket) {
      openSocket.close();
    }

    $('.header .button-container button').removeClass('selected');
    $button.addClass('selected');

    name = name.replace(' ', '', 'g');
    openSocket = new WebSocket('ws://' + host + ':4000/logs/' + name);

    openSocket.onmessage = function (e) {
      var $line = $(document.createElement('div')),
        $logarea = $('.logarea');

      $line.addClass('log-line').text(e.data);
      $('.logarea .log-content').append($line);

      if (!scrollLock) {
        $logarea.scrollTop($logarea.prop('scrollHeight'));
      }
    };
  });
});
