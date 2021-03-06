var INCR = 16; // Number of messages per page
var SENT_URL = '//www.linkedin.com/inbox/invitations/sent?startRow=';
var loMessageLinks = []; // Main array for all contacts

var fetchMessages = function(i, cb) {
    
    console.log('Fetching message page #' + (i+1));
    $.get(SENT_URL + (i*INCR), function(data){
        var $dom = $(data);
        
        var items = []
        $dom.find('.inbox-item .detail-link').each(function(i){
            items.push($(this).attr('href'));
        });

        if (items.length > 0) {
            console.log(' > Found ' + items.length + ' messages on page #' + (i+1) + ', ' + (loMessageLinks.length+items.length) + ' in total.');
            $.merge(loMessageLinks, items);
            cb();
        } else {
            console.log(' > No messages found.')
            cb(new Error);
        }
    })
}


var followMessageLink = function(link, cb){
    $.get(link, function(data){
        var $dom = $(data);
        var $el = undefined;
        var actionURL = undefined;
        
        $el = $dom.find(".btn-quaternary:contains('Withdraw')");
        if ($el.length > 0) {
            console.log(' > Withdraw');
            $.get($el.attr('href'), function(data){
                cb();
            });
        } else {
            $el = $dom.find(".btn-quaternary:contains('Archive')");
            console.log(' > Archive');
            $.get($el.attr('href'), function(data){
                cb();   
            });
        }
    });
    
}


iRun = 0;
var iMessage = 0;
var z = undefined;
var fetchMessageCallback = function(err) {
        if (err) {
            console.log('Finished message collecting. One moment please..');
            
            
            z = setInterval(function(){
                console.log('Processing message #' + (iMessage+1) + '/' + loMessageLinks.length);
                
                followMessageLink(loMessageLinks[iMessage], function(){ });
                iMessage = iMessage + 1;
                if (iMessage >= loMessageLinks.length) {
                    console.log('ALL DONE');
                    clearInterval(z);
                }
                
            }, 5000);
            
  
            
            
        } else {
            iRun = iRun+1;
            fetchMessages(iRun, fetchMessageCallback);
        }    
}


fetchMessages(0, fetchMessageCallback);    
