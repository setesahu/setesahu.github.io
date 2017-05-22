var CATEGORIES = {
    'real-estate': ['house', 'floor', 'BHK', 'rent', 'land'],
    'electronics': ['systems', 'electronics'],
    'pets': ['cat', 'dog', 'hampster', 'spitz', 'bulldog'],
    'clothing': ['kurtha', 'salwar', 'shirt', 'bag', 'shoes']
}

window_width = null;
hipster_cards = {
    misc:{
        navbar_menu_visible: 0
    },
    
    fitBackgroundForCards: function(){
        $('[data-background="image"]').each(function(){
            $this = $(this);
                        
            background_src = $this.data("src");                                
            
            if(background_src != "undefined"){                
                new_css = {
                    "background-image": "url('" + background_src + "')",
                    "background-position": "center center",
                    "background-size": "cover"
                };
                
                $this.css(new_css);                
            }              
        });
        
        $('.card .header img').each(function(){
            $card = $(this).parent().parent();
            $header = $(this).parent();
                        
            background_src = $(this).attr("src");                                
            
            if(background_src != "undefined"){                
                new_css = {
                    "background-image": "url('" + background_src + "')",
                    "background-position": "center center",
                    "background-size": "cover"
                };
                
                $header.css(new_css);                
            }              
        });
        
    },   
    init: function(){
        window_width = $(window).width();
        // Make the images from the card fill the hole space
        hipster_cards.fitBackgroundForCards();
    }
}

function categorize(){
    var counts = {

    };
    $.each(CATEGORIES, function(cat, values){
        counts[cat] = 0;
    });

    $(".card-box h4.title").each(function(index, item){
        $.each(CATEGORIES, function(cat, cat_values){
            $.each(cat_values, function(i, v){
                var text = $(item).text().trim().toLowerCase();
                var is_match = text.match(new RegExp('(^|\\s)' + v + '(\\s|$)'));
                if(is_match){
                    $(item).parent().parent().parent().addClass("cat-" + cat);
                    counts[cat] += 1;
                }
            });
        });
    });

    $("#categories-nav-container a[data-category]").each(function(index, item){
        var cat_name = $(this).data("category").toLowerCase();
        $(this).append(" <small>("+counts[cat_name]+")</small>");
    });
}

$().ready(function(){

    window_width = $(window).width();
    var card_template = $.templates("#card-news-simple");

    $.get('feed.json', function(data){
        if(data.data){
            $.each(data.data, function(index,item){
                if(item.message){
                    var msg_pcs = item.message.split('\n', 4);
                    var dom = card_template.render({
                        img: item.full_picture ? item.full_picture : "",
                        title: msg_pcs[0],
                        desc: msg_pcs[3],
                        button: 'See Details',
                        url: item.permalink_url,
                        tag: msg_pcs[1] ? msg_pcs[1].replace('₹', 'NRs '): ''
                    });

                    $(".masonry-container").append(dom);
                }
            });
            window.setTimeout(function(){
                hipster_cards.init();
                categorize();
            }, 100);
        }
    });

    var cat_template = $.templates("#categories-nav");
    $.each(CATEGORIES, function(index, item){
        $("#categories-nav-container").append(cat_template.render(
            {
                'category': index.toUpperCase()
            }
        ));
    });

    var $container = $('.masonry-container');

    doc_width = $(document).width();
    
    if (doc_width >= 768){
        $container.masonry({
            itemSelector        : '.card-box',
            columnWidth         : '.card-box',
            transitionDuration  : 1000
        });   
    } else {
        $('.mas-container').removeClass('mas-container').addClass('row');
    }    ;


    $("#categories-nav-container").on("click", "a", function(){
        $(".card-box").fadeOut('fast');
        var cat = $(this).data("category");
        $(".card-box.cat-" + cat.toLowerCase()).fadeIn('fast');
    });
});
