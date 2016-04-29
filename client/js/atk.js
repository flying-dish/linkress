
/**
 * atk_btn click
 */
$(document).on('click', '.atk_btn', function() {
	var id = getId(this, '.enemy_pop');
	$('.enemy_pop' + id + ' .command').load(
		'./client/html/atk.html', null, function() {
		atkBtnStatus(id);
	});
});

atkBtnStatus = function(id) {
	var atkBtndisabled = function(kind) {
		if(parseInt($('#user_' + kind + ' .point').text()) <= 0) {
			$('.enemy_pop' + id + ' .' + kind + '_btn').prop("disabled", true);
		}
	};
	atkBtndisabled('sunny');
	atkBtndisabled('cloudy');
	atkBtndisabled('rainy');
	atkBtndisabled('snow');
	atkBtndisabled('thunder');
	atkBtndisabled('satelite');
}

$(document).on('click', '.sunny_btn', function() {
	var id = getId(this, '.enemy_pop');
	// console.log(enemyMarker[id]);
	// a = parseInt($(".meter > span").css('width'));
	// b = parseInt($(".meter").css('width')) + 20;
	// $(".meter > span").animate({width: '85%'}, 1200);
	// var offset = $(enemyMarker[id]._icon).offset(),
	// 	sunnyPoint = parseInt($('#user_sunny p').text()) * -1;
	// $('#dog').show();
	// $('#dog').css({'left':offset.left + 100, 'top': offset.top});
	// $("#dog").animate({left: offset.left}, 1000, function(){
	// 	$(this).hide();
	// 	if(checkPortalPointZero(id, sunnyPoint)) {
	// 		console.log('zero');
	// 	}
	// 	changePoint('.enemy_pop' + id + ' .portal_point', sunnyPoint, function() {
	// 		enemyMarker[id].closePopup();
	// 	});
	// 	changePoint('#user_sunny p', sunnyPoint);
	// });
	atk(getId(this, '.enemy_pop'), 'sunny');
});

$(document).on('click', '.cloudy_btn', function() {
	// $(".meter > span").animate({width: '55%'}, 1200);
	atk(getId(this, '.enemy_pop'), 'cloudy');
});

$(document).on('click', '.rainy_btn', function() {
	atk(getId(this, '.enemy_pop'), 'rainy');
});

$(document).on('click', '.snow_btn', function() {
	atk(getId(this, '.enemy_pop'), 'snow');
});

$(document).on('click', '.thunder_btn', function() {
	atk(getId(this, '.enemy_pop'), 'thunder');
});

$(document).on('click', '.satelite_btn', function() {
	atk(getId(this, '.enemy_pop'), 'satelite');
});

atk = function(id, kind) {
	var offset = $(enemyMarker[id]._icon).offset(),
		weatherPoint = parseInt($('#user_' + kind + ' p').text()),
		atkPoint = global.atkPoint < weatherPoint ? global.atkPoint : weatherPoint, 
		atkPoint = atkPoint * -1,
		$effect = $('#' + kind + '_effect');
		$effect = $('#effect');
		
	
	$effect.show();
	var left = 20, top = 20, timeout = 1000;
	if(kind == 'satelite') {
		left = 100;
		top = 160;
		timeout = 2000;
		atkPoint = -1 * weatherPoint;
	}
	$score = $('#score').text(atkPoint);
	$score.show();
	$score.css({'color': 'red', 'left':offset.left + 20, 'top': offset.top + 100});
	$score.hide(timeout * 2);
	$effect.css({'left':offset.left - left, 'top': offset.top - top});
	$effect.attr({'src': './client/img/' + kind + '.gif'});
	// $effect.animate({left: offset.left}, 1000, function(){
	$effect.animate({left: offset.left - 60}, timeout, function(){
		$(this).hide();
		$(this).attr({'src': './client/img/null.gif'});
		var callback = null;
		if(checkPortalPointZero(id, atkPoint)) {
			var portalCount = parseInt($('#portal_count I').text());
			$('#portal_count I').text(portalCount + 1);
			callback = function() {
				enemyMarker[id].closePopup();
				$("#ally_status_bar .meter > span")
						.animate({width: '75%'}, 1200);
				$("#enemy_status_bar .meter > span")
						.animate({width: '25%'}, 1200);
			};
		}
		var portalPoint = parseInt($('.enemy_pop' + id + ' .portal_point').text());
		changePoint('.enemy_pop' + id + ' .portal_point', atkPoint, function() {
			// enemyMarker[id].closePopup();
			if(callback) {
				callback();
			}
			update(id, atkPoint, enemyData);
		});
		// var toPoint = atkPoint + weatherPoint;
		// console.log(toPoint);
		// toPoint = toPoint > 0 ? toPoint * -1 : toPoint;
		changePoint('#user_' + kind + ' p', atkPoint, function() {
			atkBtnStatus(id);
		});
	});
};

update = function(id, point, data) {
	for(var i = 0; i < data.length; i++) {
		if(data[i].id == id) {
			var toPoint = data[i].point + (point);
			if(toPoint <= 0) {
				enemyMarker[id].closePopup();
				enemyMarker[id].setIcon(greenIcon);
			} else {
				data[i].point = toPoint;
				bindEnemyPop(data[i], enemyMarker[id]);
			}
			
		}
	}
};

checkPortalPointZero = function(id, atk) {
	var portal = parseInt($('.enemy_pop' + id + ' .portal_point').text());
	return portal <= (atk < 0 ? -1 * atk : atk);
};