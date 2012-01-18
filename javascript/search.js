// 
// This js is for SGD search pages
// Shuai Weng, October 2011
//
jQuery.noConflict();

SUGGEST_URL='http://www.yeastgenome.org/cgi-bin/search/searchSuggest.fpl'; 

SEARCH_URL='http://www.yeastgenome.org/cgi-bin/search/instantSearch.fpl?query='; 
        
var fields = ['gene_name',
	      'headline',
	      'name_description',
	      'paragraph',
	      'note',
	      'phenotype',
	      'go_process',
	      'go_function',
	      'go_component',
	      'biological_pathway',
	      'author_name',
	      'colleague',
	      'paper_title',
	      'external_id'];


jQuery(document).ready(function() {
    	
     jQuery('#txt_search').autocomplete({ source: SUGGEST_URL, 
		                     select: function(event, ui) { 
		                             jQuery(this).val(ui.item.value);
					     jQuery('#searchform').submit()
				     } 
     });

     jQuery('#big_txt_search').autocomplete({ source: SUGGEST_URL,
		                         select: function(event, ui) {
		                                 jQuery(this).val(ui.item.value);
		                                 jQuery('#big_searchform').submit()
			                 }

		    
     });   

	//    jQuery('#txt_search').autocomplete({ source: SUGGEST_URL });

        // jQuery('#big_txt_search').autocomplete({ source: SUGGEST_URL });

     jQuery('#big_txt_search').keyup(function() {
      
          // Get the current query in the search box
      
          var query = jQuery(this).val();

          // If there are more than 2 character, perform a suggest lookup
 
          if (query.length > 2) {
        
             jQuery.getJSON(SEARCH_URL + query, null, searchCallback);

	     jQuery('#full_result').hide();

          } 
          else {
        
	      jQuery('#full_result').hide();

          }

     });

     jQuery.each(fields, function(index, value) {

            jQuery('#'+value+'_gene_tbl').hide();

     });


});


function change_category_content (field, query, quote, start) {

    jQuery.each(fields, function(index, value) {    

	jQuery('#'+value).css("color", "black"); 

    });

    jQuery('#'+field).css("color", "#980D0D");

    jQuery('#txt_category').html('Please wait! It may take a while to retrieve a big chunk of data...');

    if (quote == 1) {

	query = '"' + query + '"';

    }

    if (start) {

	htmlobj=jQuery.ajax({url:SEARCH_URL + query + "&field=" + field + "&start=" + start + "&plain=1",async:false});

    }
    else {

	htmlobj=jQuery.ajax({url:SEARCH_URL + query + "&field=" + field + "&plain=1",async:false});
	
    }

    jQuery('#txt_category').html(htmlobj.responseText);

    jQuery('#'+field+'_gene_tbl').hide();

}

function show_hide (button, label, gene_table, category_table) {

     if (jQuery('#' + button).val().match('gene')) {

	 jQuery('#' + button).val(label + ' detail');

	 jQuery('#' + category_table).hide();

	 jQuery('#' + gene_table).show();

     }
     else {

	 jQuery('#' + button).val(label + ' as gene list');

	 jQuery('#' + gene_table).hide();

	 jQuery('#' + category_table).show();

     }
	    
}


function suggestCallback(data, textStatus) {

    // See if there are any suggestions

    var query = data[0];

    var ss = document.getElementById('txt_suggest');

	ss.innerHTML = '';

    if (data.length > 0) {

        // Show the data in the suggestions list

        var suggest = jQuery('#txt_suggest').empty().show(); 

        for (var i = 0; i < data.length; i++) { 

	     suggest += '<div onmouseover="javascript:suggestOver(this);" ';
	     suggest += 'onmouseout="javascript:suggestOut(this);" ';
	     suggest += 'onclick="javascript:setSearch(this.innerHTML);" ';
	     suggest += 'class="suggest_link">' + data[i] + '</div>';

             var thisSuggest = suggest.replace('[object Object]', '');

	     ss.innerHTML = thisSuggest;

        }
      
    } 
    else {

	jQuery('#txt_suggest').hide();

    }

//    // Search based on the top query
    
//    jQuery.getJSON(SEARCH_URL + query, null, searchCallback);


}

function searchCallback(data, textStatus) {

    if (data.length > 0) {

	jQuery('#txt_subtitle').html(data[0]);
	
	jQuery('#txt_list').html(data[1]);

	jQuery('#txt_category').html(data[2]);

	jQuery.each(fields, function(index, value) {

            jQuery('#'+value+'_gene_tbl').hide();
	   
	});

    }
    else {

	jQuery('#txt_subtitle').html('No Results');

	jQuery('#txt_list').html('No Results');

	jQuery('#txt_category').html('No Results');

    }

}

function searchCallback2(data, textStatus) {

    var results = jQuery('#txt_result').empty().show();

    if (data.length > 0) {

	html = "<center><h3>" + data[0] + "</h3></center>\n" +
	       "<table id='txt_summary'><tr><th>" + data[1] + "</h3>" + 
	       "<td id='txt_category'>" + data[2] + "</td></tr></table>";

	results.append(html);

    } 
    else {

	 jQuery('#txt_result').hide();		    
    
    }


}


function connect_to_external_site(externalUrl, parameters) {

    var divToBeWorkedOn = "#ajaxPlaceHolder";

    jQuery.ajax({ 

	    type: "POST",
	    url:  externalUrl,
	    data: parameters,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function(msg) {    
                jQuery(divToBeWorkedOn).html(msg.d);
            },
            error: function(e){
                jQuery(divToBeWorkedOn).html("Unavailable");              
            }

    });

}

//Mouse over function
function suggestOver(div_value) {

    div_value.className = 'suggest_link_over';

}

//Mouse out function
function suggestOut(div_value) {
	
    div_value.className = 'suggest_link';

}


//Click function
/*
function setSearch(value) {			  
	
    document.getElementById('txt_search').value = value;
	
    document.getElementById('txt_suggest').innerHTML = '';

}

*/











jQuery.fn.insertAtCaret = function (myValue) {

	return this.each(function(){
			//IE support
			if (document.selection) {
					this.focus();
					sel = document.selection.createRange();
					sel.text = myValue;
					this.focus();
			}
			//MOZILLA / NETSCAPE support
			else if (this.selectionStart || this.selectionStart == '0') {
					var startPos = this.selectionStart;
					var endPos = this.selectionEnd;
					var scrollTop = this.scrollTop;
					this.value = this.value.substring(0, startPos)+ myValue+ this.value.substring(endPos,this.value.length);
					this.focus();
					this.selectionStart = startPos + myValue.length;
					this.selectionEnd = startPos + myValue.length;
					this.scrollTop = scrollTop;
			} else {
					this.value += myValue;
					this.focus();
			}
	});
};


