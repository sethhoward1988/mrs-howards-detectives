
Map = function () {

  var hash = {
      
    regions: {
        northeast: ['maine', 'new hampshire', 'vermont', 'massachusetts', 'rhode island', 'connecticut', 'new york', 'pennsylvania', 'new jersey'],
        midwest: ['wisconsin', 'michigan', 'illinois', 'indiana', 'ohio', 'missouri', 'north dakota', 'south dakota', 'nebraska', 'kansas', 'minnesota', 'iowa'],
        south: ['delaware', 'maryland', 'district of columbia', 'virginia', 'west virginia', 'north carolina', 'south carolina', 'georgia', 'florida', 'kentucky', 'tennessee', 'mississippi', 'alabama', 'oklahoma', 'texas', 'arkansas', 'louisiana'],
        west: ['idaho', 'montana', 'wyoming', 'nevada', 'utah', 'colorado', 'arizona', 'new mexico', 'alaska', 'washington', 'oregon', 'california', 'hawaii']
    },
    
    transitionDuration: 1500,
    
    answerBoxHTML: '<div class="answer-box">' +
                '<h3>Your Answer...</h3>' +
                '<input type="text"></input><br />' +
                '<button type="button" class="peek">Peek</button>' +
                '<button type="button" class="skip">Skip</button>' +
               '</div>',
    
    activeState: 0,

    initialize: function (options) {
        
        this.setData();
        this.setup();
      
    },
    
    setData: function () {
        // Grabs all the topography data
        var that = this;
        d3.json("/js/usa.json", function(error, usa) {
            that.unparsedData = usa
            that.originalData = _.filter(topojson.feature(usa, usa.objects.subunits).features, function(state){
                if(state.properties.name.toLowerCase() == "alaska" || state.properties.name.toLowerCase() == "hawaii"){
                    return false
                } else {
                    return true
                }
            })
            that.data = that.originalData
            that.boundaryData = topojson.mesh(usa, usa.objects.subunits, function(a, b) { return a !== b && a.id !== "IRL"; })
            that.boundary = that.boundaries.append("path")
                .datum(that.boundaryData)
            that.render()
        })
    },
    
    filterData: function (region) {
        var that = this
        this.setProjectionDetails(region)
        _.each(this.data, function(state){
            if(_.indexOf(that.regions[region], state.properties.name.toLowerCase()) == -1){
                state.properties.irrelevant = true
            } else {
                state.properties.irrelevant = false
            }
            if(region == 'all'){
                state.properties.irrelevant = false
            }
        })
    },
    
    setProjectionDetails: function (region) {
        if(region == 'all'){
            this.projection = d3.geo.mercator()
                .scale(900)
                .center([-50, 54.8])
                .rotate([54.4, 0])
                .translate([350,-130]);
        } else if (region == 'northeast') {
            this.projection = d3.geo.mercator()
                .scale(2200)
                .center([-20, 50])
                .rotate([54.4, 0])
                .translate([350,-130]);
        } else if (region == 'midwest') {
            this.projection = d3.geo.mercator()
                .scale(1550)
                .center([-40, 52.4])
                .rotate([54.4, 0])
                .translate([350,-130]);
        } else if (region == 'south') {
            this.projection = d3.geo.mercator()
                .scale(1550)
                .center([-40, 44.0])
                .rotate([54.4, 0])
                .translate([350,-130]);
        } else if (region == 'west') {
            this.projection = d3.geo.mercator()
                .scale(1150)
                .center([-65, 53.5])
                .rotate([54.4, 0])
                .translate([350,-130]);
        }
        
        this.path = d3.geo.path()
            .projection(this.projection);
    },

    setup: function () {
        var that = this
        this.width = 960,
        this.height = 500;
        
        this.setProjectionDetails("all")
        
        this.svg = d3.select(".map").append("svg")
            .attr("width", this.width)
            .attr("height", this.height)
            
        this.stateVis = this.svg.append('g')
        this.boundaries = this.svg.append('g')
        
        $('.regions button.btn-primary').on('click', function (evt) {
            var region = $(this).text().toLowerCase()
            that.filterData(region)
            that.render()
        })
        
        $('.regions button.btn-danger').on('click', function (evt){
            that.setRelevantStates()
            console.log(that.relevantStates)
            that.startGame()
            
        })
        this.onInputKeyup = _.bind(this.onInputKeyup, this)
        this.onPeekClick = _.bind(this.onPeekClick, this)
        this.onSkipClick = _.bind(this.onSkipClick, this)
    },
    
    setRelevantStates: function () {
        this.relevantStates = _.filter(this.data, function (state) {
            return !state.properties.irrelevant
        })
    },

    render: function () {
        this.map = this.stateVis.selectAll(".subunit")
            .data(this.data, function (d) { return d.properties.name })
          
        this.map.enter().append("path")
            .style('opacity',0)
            .attr("class", function(d) { return "subunit " + d.properties.name.toLowerCase().replace(/ /g, '_') })
            .attr("d", this.path)
            .each(function (d) {
                d.path = this
            })
        
        this.map.transition().duration(this.transitionDuration)
            .each(function (d) {
                var className = $(this).attr('class')
                className = className.replace(/irrelevant/g, '')
                if(d.properties.irrelevant){
                    $(this).attr('class', className + ' irrelevant')
                } else {
                    $(this).attr('class', className)
                }
            })
            .style('opacity', 1)
            .attr("d", this.path);
        
        this.map.exit().transition().duration(this.transitionDuration)
            .style('opacity', 0)
            .remove()

        
            
        this.boundary.transition().duration(this.transitionDuration - 50)
            .attr("d", this.path)
            .attr("class", "subunit-boundary");
    },
    
    startGame: function () {
        var that = this
        this.correctStates = 0;
        $('.regions').addClass('disabled')
        _.each(this.relevantStates, function (state) {
            $(state.path).attr('class', $(state.path).attr('class') + ' active')
            $(state.path).on('click', function (evt) {
                that.onStateClick(state)
            })
        })
    },
    
    onStateClick: function (state) {
        if(this.activeState){
            $(this.activeState.path).attr('class', $(this.activeState.path).attr('class').replace(/clicked/g, ''))
        }
        
        if($(state.path).attr('class').indexOf('completed') > -1 || $(state.path).attr('class').indexOf('skipped') > -1){
            //already done
            this.hideAnswerBox()
            return
        }
        
        this.activeState = state;
        $(state.path).attr('class', $(state.path).attr('class') + ' clicked')
        this.showAnswerBox()
        this.answerBox.find('input').focus()
        
    },
    
    showAnswerBox: function () {
        if(!this.answerBox){
            this.answerBox = $(this.answerBoxHTML).appendTo('body')
            var input = this.answerBox.find('input')
            var peek = this.answerBox.find('.peek')
            var skip = this.answerBox.find('.skip')
            input.on('keyup', this.onInputKeyup)
            peek.on('click', this.onPeekClick)
            skip.on('click', this.onSkipClick)
        }
        this.answerBox.animate({
            left: '1000px',
            opacity: 1
        })
        
    },
    
    hideAnswerBox: function () {
        var that = this;
        this.answerBox.animate({
            left: '1300px',
            opacity: 0
        }, function () {
            that.answerBox.find('input').val('')
        })
    },
    
    onInputKeyup: function () {
        console.log('keying up...')
        var value = this.answerBox.find('input').val()
        if(this.activeState){
            if(value.toLowerCase() == this.activeState.properties.name.toLowerCase()){
                this.onCorrectState()
            }
        }
    },
    
    onCorrectState: function (type) {
        var className = $(this.activeState.path).attr('class')
        if(type == 'skipped'){
            $(this.activeState.path).attr('class', className.replace(/active/g,'').replace(/clicked/g,'') + ' skipped')
        } else {
            $(this.activeState.path).attr('class', className.replace(/active/g,'').replace(/clicked/g,'') + ' completed')
        }
      
        this.correctStates++;
        if(this.correctStates == this.relevantStates.length){
            this.completedGame()
        }
        this.activeState = 0
        this.hideAnswerBox()
      
    },

    onPeekClick: function () {
        console.log('peeking')
    },
    
    onSkipClick: function () {
        this.onCorrectState('skipped')
    },
    
    completedGame: function () {
        alert("you've finished them all!")
        _.each(this.relevantStates, function (state){
            $(state.path).attr('class', $(state.path).attr('class').replace(/completed/g, '').replace(/active/g, '').replace(/skipped/g, ''))
        })
        this.filterData('all')
        this.render()
        $('.regions').removeClass('disabled')
    }
    
  }

  var Map = function (options) {
    this.initialize.apply(this, arguments)
  }

  for(prop in hash){
    Map.prototype[prop] = hash[prop]
  }

  return Map

}()