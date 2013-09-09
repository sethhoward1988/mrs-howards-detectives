
$(function(){
    $('.build-button').on('click', function () {
        var size = parseInt($('.grid-size').val())
        if(size > 0 && size < 25){
            var table = createTimesTable(size)
            var timesTable = $('.times-table')
            timesTable.slideUp(function(){
                timesTable.empty().append(table).slideDown()
            })
        } else {
            alert("The grid is either too small or too large!")
        }
    })
})

function createTimesTable (size) {
    var table = $('<table><thead></thead><tbody></tbody></table>')
    var head = table.find('thead')
    var body = table.find('tbody')
    var answers = [];
    for(var i=0;i <= size; i++){
        head.append(createTH().text(i==0 ? '' : i).addClass('header'))
        var currentRow = createRow()
        body.append(currentRow)
        for(var z=0; z <= size; z++){
            if(i==size){
                continue
            }
            if(z == 0){
                currentRow.append(createTD().addClass('header').text(i+1))
            } else {
                var input = createInput().data({
                    answer: (i+1)*z,
                    x: z,
                    y: i+1
                })
                answers.push({
                    xy:'x:' + z + 'y:' + (i+1),
                    input:input})
                currentRow.append(createTD().append(input))
                input.on('keyup', function () {
                    onInputKeyup(this, answers)
                })
                input.on('blur', function () {
                    onInputBlur(this, head, body)
                })
                input.on('focus', function () {
                    onInputFocus(this, head, body)
                })
            }
        }
    }
    return table
}

function createRow () {
    return $('<tr></tr>')
}

function createTH () {
    return $('<th></th>')
}

function createTD () {
    return $('<td></td>')
}

function createInput () {
    return $('<input type="text" class="times-table-answer"></input>')
}

function onInputKeyup (input, answers) {
    var input = $(input)
    var data = input.data()
    var value = input.val().replace(/[^0-9]/g, '');
    if(value == input.data().answer){
        input.attr('readonly', true)
        answers = _.filter(answers, function (answer) {
            return answer.input.attr('readonly') != 'readonly'
        })
        input.removeClass('alert-warning').addClass('alert-success')
        input.blur()
        if(answers.length >= 1){
            $(returnRandomFromArray(answers).input).focus()
        } else {
            onTimesTableFinish()
        }
        
    }
    input.val(value)
}

function onInputFocus (input, head, body) {
    if($(input).attr('readonly') == 'readonly'){
        return
    }
    var data = $(input).data()
    var rows = $(body).find('tr')
    $(head.find('th')[data.x]).addClass('active')
    var ths = $(body.find('tr')[data.y - 1]).children()
    for(var i = 0; i < data.x; i++){
        $(ths[i]).addClass('active')
    }
    for(var i = 0;i <data.y; i++){
        $($(rows[i]).children()[data.x]).addClass('active')
    }
    $(input).addClass('alert-warning')
}

function onInputBlur (input, head, body) {
    var input = $(input)
    input.removeClass('alert-warning')
    if(!input.hasClass('alert-success')){
        input.val('')
    }
    $(head).find('th').removeClass('active')
    $(body).find('td').removeClass('active')
}

function onTimesTableFinish() {
    alert("you finished it all!")
}

function returnRandomFromArray(array){
    return array[Math.floor(Math.random() * array.length)];
}