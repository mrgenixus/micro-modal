$(function(){
	//Create our overlay object
	var overlay = $("<div id='modal-overlay'></div>");
	var setModalContent = function(content){
		modalWindow.html(content);
	}
	
	var modalActivate = function(e){
		var modal_uri = $(this).data('load-uri'); 
		if(modal_uri) resolve_content(modal_uri,function(data){
			setModalContent(data);
			_modalActivate.call(this,e);
		});
		else _modalActivate.call(this,e);
	}

	var _modalActivate = function(e) {
		//Append the overlay to the document body
		$("body").append(overlay.click(function() { 
		  modalHide(); 
		}))

		
		load_modal_content();

		if (typeof document.body.style.maxHeight === "undefined") { //if IE 6
		    $("body","html").css({height: "100%", width: "100%"});
		}

		//Set the css and fade in our overlay
		overlay.css("opacity", 0.8);
		overlay.fadeIn(150);

		//Prevent the anchor link from loading
		try {
			e.preventDefault();
			e.stopPropagation();	
		} catch(err){
			console.log(e,err,arguments);
		}
		

		//Activate a listener 
		$(document).keydown(handleEscape);		
	}

	//Our function for hiding the modalbox
	function modalHide() {

		$(document).unbind("keydown", handleEscape)
		var remove = function() { 
		  $(this).remove(); 
		}
		modalWindow.hide();
		overlay.fadeOut(remove);

	}

	//Our function that listens for escape key.
	function handleEscape(e) {

	  if (e.keyCode == 27) {

	      modalHide();
	  }
	}

	var modalWindow = $('#modal-window')
	modalWindow.on('contentChanged',modalActivate);

	var resolve_content = function(load_uri,callback){
		if($(load_uri).length > 0) callback($(load_uri).first().html());
		else {
			var uri = load_uri.split(' ').shift();
			$.get(uri,function(data){
				if(load_uri.split(' ').length > 1) data = data.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,'');
				var content = $('<div>').html(data).find(load_uri.split(' ').slice(1).join(' ')).html();
				callback(content); 
			});
		}
	}

	var load_modal_content = function () {
		if(modalWindow.length == 0) $('<div id="modal-window">').appendTo(document.body);
		modalWindow.show();
	    var windowWidth = modalWindow.width() / 2 ;
	    var windowHeight = modalWindow.height() / 2;
	    modalWindow.hide();
	    modalWindow.css({
	        "margin-left": -windowWidth,
	        "margin-top": -windowHeight
	    });
	    modalWindow.fadeIn(150);
	    modalWindow.on('do-close',modalHide);
	}

	$.fn.extend({
		modalPanel: function() {
			return this.each(function() {
			  //Listen for clicks on objects passed to the plugin
			  $($(this).data('load-uri')).hide();
			  $(this).click(modalActivate).trigger('modal-initialized');
			});
		}
	});

})
