app = {}
app.messages = [
	'You Rock!',
	'Great Job!',
	'Super Spelling!',
	'Fantastic Stuff!',
	'Amazing!',
	'Stellar!',
	"That's Right!",
	'Star Speller!']
app.pageIndex = 0
app.totalPageIndex = 4
app.finishedWords = 0
app.correctWords = []
app.peekedWords = []
app.skippedWords = []
app.totalWords = 20

$(function(){
	app.wordContainer = $('.word-container')
        setData()
	$('#submit').on('click', function () {
		if($(this).text() == "Send to Mrs. Howard"){
                        sendEmail()
			alert("We've let Mrs. Howard know! Refresh the page to practice again :)")
                        $('.name').fadeOut()
                        $('#submit').off('click')
                        $('#submit').fadeOut()
			return;
		}
		if(_.every($('.word-container .word input'), function (input) { return $(input).hasClass('alert-success') || $(input).hasClass('alert-warning') })){
			app.wordContainer.slideUp(function(){
				app.pageIndex++
				app.wordContainer.empty()
				if(app.totalPageIndex == app.pageIndex){
					app.wordContainer.html('<h1>Congratulations!</h1><p>You finished all of the words. Put your name in below to make sure Mrs. Howard knows that you got through all of the words.</p><div class="center"><input class="name" type="text" /></div>')
					$('.page-holder').animate('min-height', '0px')
					var input = app.wordContainer.find('input')
					$('#submit').text("Send to Mrs. Howard")
				} else {
					buildWordSet()
				}
				app.wordContainer.slideDown()
			})
		} else {
			alert("You must complete all of these words before moving on!")
		}
	})
	buildWordSet()
})

function changeProgressBar() {
	var progressBar = $('.progress-bar')
	var progress = (app.finishedWords/app.totalWords) * 100
	progressBar.attr('aria-valuenow', progress).css({'width': progress + '%'})
}

function buildWordSet () {
	_.each(app.sets[app.pageIndex], function (word) {
		var container = $('<div class="word"></div>')
                var row = $('<div class="row"></div>')
		var audio = $('<audio controls="controls" tabindex="-1"><source src="/spelling-quiz/words/mp3/' + word.word + '.mp3" type="audio/mpeg"><source src="/spelling-quiz/words/wav/' + word.word + '.wav" type="audio/wav"></audio>')
		var input = $('<input type="text"></input>')
                var define = $('<button type="button" class="btn-info">Define</button>')
                var skip = $('<button type="button" class="btn-warning">Skip</button>')
                var peek = $('<button type="button" class="btn-warning">Peek</button>')
		var alert = $('<div class="alert"></div>')
                var peeking = false
                skip.on('click', function (evt) {
                    input.val(word.word)
                    app.finishedWords++
                    app.skippedWords.push(word.word)
                    input.attr('readonly', true)
                    input.removeClass('alert-danger alert-success').addClass('alert-warning')
                    skip.fadeOut()
                    peek.fadeOut()
                    changeProgressBar();
                })
                
                peek.on('click', function (evt) {
                    if(peeking == true){
                        return
                    }
                    peeking = true
                    var span = $('<span class="peek"></span>').text(word.word).hide()
                    row.append(span)
                    app.peekedWords.push(word.word)
                    span.fadeIn(function(){
                        setTimeout(function () {
                            span.fadeOut(function(){
                                peeking = false
                                span.remove()
                            })
                            peek.fadeOut()
                        }, 200)
                    })
                })
                
                define.on('click', function (evt) {
                    if(!container.find('.definition').length){
                        var definition = $('<div class="alert alert-info definition"></div>').hide().text('Definition: ' + word.definition)
                        container.append(definition)
                        definition.slideDown()
                    }
                })
                row.append(audio).append(input).append(define).append(skip).append(peek).append(alert)
		app.wordContainer.append(container.append(row))
		input.on('keyup', function (evt) {
			if(input.attr('readonly') == 'readonly'){
				return;
			}
			var string = $(this).val()
			var correct = true;
			if(string.toLowerCase() == word.word){
                                peek.fadeOut()
                                skip.fadeOut(function(){
                                    alert.hide().html(returnRandomFromArray(app.messages)).addClass('alert-success').fadeIn()
                                })
				input.attr('readonly', true)
				app.finishedWords++;
                                app.correctWords.push(word.word)
				changeProgressBar();
				return;
			}
			for(var i = 0; i < string.length; i++){
				if(string[i].toLowerCase() != word.word[i]){
					correct = false
				}
			}
			if(correct){
				input.removeClass('alert-danger')
				input.addClass('alert-success')
			} else {
				input.removeClass('alert-success')
				input.addClass('alert-danger')
			}
		})
	})
}


function sendEmail () {
    $.ajax({
        url:'mail.php',
        type: 'POST',
        data: {
            subject: $('.name').val() + "'s Spelling Quiz Results",
            body: "<b>Correct:</b> " + app.correctWords.length + "/" + app.totalWords + " - " + app.correctWords.join(', ') + "<br /><br /><b>Skipped:</b> " + app.skippedWords.length + "/" + app.totalWords + " - " + app.skippedWords.join(', ') + "<br /><br /><b>Peeked:</b> " + app.peekedWords.length + "/" + app.totalWords + " - "+ app.peekedWords.join(', ')
        },
        success: function (data) {
          console.log(data)  
        },
        error: function (x) {
            console.log('error...')
        }
    })
}

function returnRandomFromArray(array){
    return array[Math.floor(Math.random() * array.length)];
}

function setData () {
    app.currentWeek = _.shuffle(app.currentWeek)
    app.sets = []
    while(app.currentWeek.length > 0){
        app.sets.push(app.currentWeek.splice(0,5))
    }
}

