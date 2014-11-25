angular.module('nestedAccordion', [
    
])
.controller('MainCtrl', function(){
    
})
.directive('dirMultiAccordion', function($timeout){
    return {
        scope: {
            acc_levels:"@accLevels"
        },
        restrict: 'A',
        replace: false,
        link: function(scope, elem, attrs) {

            //firing timeout so that directive executes after dom is ready
            $timeout(function() {
                
            if( parseInt(scope.acc_levels) < 2 )
                return;

            var setupAccordion = function(accObj, level) {
                
                var acc_obj = angular.element(accObj);
                var acc_dropdown_temp = acc_obj.children();
                var acc_dropdown = new Array();
                var arrowUpClass = acc_obj.attr('acc-arrow-up');
                var arrowDownClass = acc_obj.attr('acc-arrow-down');

                //for( prop in acc_dropdown_temp )
                for ( var i=0; i<acc_dropdown_temp.length; i++ ) {
                    if( angular.element(acc_dropdown_temp[i]).hasClass('acc-exclude') ) {
                        continue;
                    }
                    //this plugin assumes that the each accordion element will have 2 children, one containing the heading and the other the content.
                    acc_dropdown.push( angular.element(acc_dropdown_temp[i]).children()[0] );
                    acc_dropdown.push( angular.element(acc_dropdown_temp[i]).children()[1] );
                }

                var move_unit = 15,
                    move_timeout = 20;

                var init_accordion = function(){

                    for( var i=1; i<acc_dropdown.length; i+=2 ) {
                        angular.element(acc_dropdown[i]).css('padding', '0px');
                        angular.element(acc_dropdown[i]).css('margin', '0px');
                        angular.element(acc_dropdown[i]).css('overflow', 'hidden');
                        angular.element(acc_dropdown[i]).attr('a_height', acc_dropdown[i].offsetHeight);
                        if( i > 1 ) {
                            angular.element(acc_dropdown[i]).css('height', '0px');
                            angular.element(acc_dropdown[i]).removeClass('acc-active');
                            angular.element(acc_dropdown[i]).attr('acc-level', level);
                            if( !!scope.activeHeadClass )
                                angular.element(acc_dropdown[i-1]).removeClass(scope.activeHeadClass);

                            if( !!arrowUpClass && !!arrowDownClass )
                                angular.element(acc_dropdown[i-1].getElementsByClassName('acc-arrow')[0]).removeClass(arrowUpClass).addClass(arrowDownClass);
                        }
                        else {
                            angular.element(acc_dropdown[i]).addClass('acc-active');
                            angular.element(acc_dropdown[i]).attr('acc-level', level);
                            if( !!scope.activeHeadClass )
                                angular.element(acc_dropdown[i-1]).addClass(scope.activeHeadClass);

                            if( !!arrowUpClass && !!arrowDownClass )
                                angular.element(acc_dropdown[i-1].getElementsByClassName('acc-arrow')[0]).removeClass(arrowDownClass).addClass(arrowUpClass);
                        }
                    }
                }();

                var animateDown = function(elemObj, fromHeight, toHeight){
                    if( fromHeight === toHeight ) {
                        elemObj.style.height = fromHeight+'px';
                        return false;
                    }
                    else {
                        var unit = ( (toHeight - fromHeight) < move_unit ) ? (toHeight - fromHeight) : move_unit;
                        elemObj.style.height = fromHeight+'px';
                        setTimeout(function(){
                            animateDown( elemObj, fromHeight + unit, toHeight );
                        }, move_timeout);
                    }

                    return true;
                };

                var animateUp = function(elemObj, height, limit){
                    if( height === 0 ) {
                        elemObj.style.height = height+'px';
                        return false;
                    }
                    else if( limit !== null && height === limit ) {
                        elemObj.style.height = height+'px';
                        return false;
                    }
                    else {
                        var unit = ( height < move_unit ) ? height : move_unit;
                        elemObj.style.height = height+'px';
                        setTimeout(function(){
                            animateUp( elemObj, height - unit, limit );
                        }, move_timeout);
                    }

                    return true;
                };

                var showElement = function(newElem, oldElem){
                    var new_elem_height = parseInt(angular.element(newElem).attr('a_height'));
                    animateDown(newElem, newElem.offsetHeight, new_elem_height);
                    animateUp(oldElem, oldElem.offsetHeight, null);

                    var curr_level = angular.element(newElem).attr('acc-level');

                    for( var i=1;i<curr_level;i++ ) {
                        var new_parent_elem = angular.element(newElem).parent().parent();
                        new_parent_elem.css('height','auto');
                    }

                    angular.element(oldElem).attr('a_height', oldElem.offsetHeight);
                };

                acc_obj.children().on('click', function(){

                    if( angular.element(this).hasClass('acc-exclude') )
                        return;

                    var new_elem = angular.element(this).children()[1],
                        new_elem_head = angular.element(this).children()[0];
                        
                    var old_elem = angular.element(this).parent()[0].getElementsByClassName('acc-active');
                        
                    //find active element inside the same level accordion
                    for( var i=0;i<old_elem.length;i++ ) {
                        if( angular.element(old_elem[i]).attr('acc-level') == level ) {
                            old_elem = old_elem[i];
                            break;
                        }
                    }
                    
                    var old_elem_head = angular.element(old_elem).parent().children()[0];

                    if( angular.element(new_elem).hasClass('acc-active') ) {
                        return;
                    }

                    if( !!scope.activeHeadClass ) {
                        angular.element(old_elem_head).removeClass(scope.activeHeadClass);
                        angular.element(new_elem_head).addClass(scope.activeHeadClass);
                    }

                    if( !!arrowUpClass && !!arrowDownClass ) {
                        angular.element(old_elem_head.getElementsByClassName('acc-arrow')[0]).removeClass(arrowUpClass).addClass(arrowDownClass);
                        angular.element(new_elem_head.getElementsByClassName('acc-arrow')[0]).removeClass(arrowDownClass).addClass(arrowUpClass);
                    }

                    angular.element(new_elem).addClass('acc-active');
                    angular.element(old_elem).removeClass('acc-active');

                    showElement(new_elem, old_elem);
                });
                
            };
            
            var levels = parseInt(scope.acc_levels);
            var acc_arr = new Array();
            
            for( i=0;i<levels;i++ ) {
                if( i === levels-1 ) {
                    var temp_acc = new Array(elem[0]);
                }
                else {
                    var temp_acc = elem[0].querySelectorAll('[multi-acc-level="'+(levels - i)+'"]');
                }
                acc_arr.push( temp_acc );
                
                for( var j=0;j<temp_acc.length;j++ ) {
                    setupAccordion(temp_acc[j], (levels - i));
                }
            }
            
          }, 100);
        }
    };
})

;

